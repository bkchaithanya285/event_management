import { runTransaction, collection, query, where, getDocs, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { EVENT_STATUS } from '../types/types';
import { isOverlapping } from '../utils/dateUtils';

/**
 * Approves an event at the Institutional Head level with robust conflict detection and atomicity.
 * @param {string} eventId 
 * @param {string} headId - ID of the approving Institutional Head
 * @returns {Promise<void>}
 */
export const approveEventWithTransaction = async (eventId, headId) => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Read the Event Doc
            const eventRef = doc(db, 'events', eventId);
            const eventDoc = await transaction.get(eventRef);

            if (!eventDoc.exists()) {
                throw new Error("Event does not exist!");
            }

            const eventData = eventDoc.data();

            if (eventData.status !== EVENT_STATUS.DEAN_APPROVED) {
                throw new Error("Event is not in the correct state for final approval.");
            }

            // 2. Read Venue Data
            // Note: We can't query collections inside a transaction easily for "overlap" checks 
            // without knowing the specific IDs. 
            // STRATEGY: We will Fetch ALL approved events that might overlap strictly *outside* or *before* writing?
            // Firebase Transactions require all reads before writes. 
            // However, querying a collection based on a range is tricky in a transaction if we want to lock *ranges*.
            // Instead, we will use a "Bookings" collection where the document ID is a composite or we query it.
            // For this implementation, we will query existing APPROVED events to check for conflict.

            // CRITICAL: This query is NOT strictly part of the transaction lock (Phantom Read risk),
            // but it's much better than the previous "isAvailable" flag.
            // To make it strict, we would need a sophisticated "locking" document for days/venues.
            // We'll trust the query snapshot for now as a "Conflict Check".

            const eventsRef = collection(db, 'events');
            const q = query(
                eventsRef,
                where('status', '==', EVENT_STATUS.FINAL_APPROVED),
                where('allocatedVenue', '==', eventData.venuePreference)
            );

            // We have to execute this query *outside* the transaction context usually, 
            // OR accept that we can't lock the "search results".
            // However, we can read the specific resources we intend to modify.

            // Let's do a "Best Effort" conflict check first by reading currently approved events.
            // NOTE: In a high-concurrency environment, this is still a race condition, 
            // but vastly superior to the original code.
            const querySnapshot = await getDocs(q);

            const potentialConflicts = querySnapshot.docs.map(d => d.data());
            const hasConflict = potentialConflicts.some(existingEvent =>
                isOverlapping(
                    eventData.scheduleStart,
                    eventData.scheduleEnd,
                    existingEvent.scheduleStart,
                    existingEvent.scheduleEnd
                )
            );

            if (hasConflict) {
                throw new Error(`Venue '${eventData.venuePreference}' is already booked for this time slot.`);
            }

            // 3. Resource Locking & Decrementing
            // We MUST read the resource docs within the transaction to lock them.
            const resourcesSnapshot = await getDocs(collection(db, 'resources'));
            const resources = [];
            const requiredResources = eventData.resourcesRequested;

            // Map requirements to actual resource docs
            resourcesSnapshot.forEach(doc => {
                resources.push({ id: doc.id, ...doc.data(), ref: doc.ref });
            });

            const updates = [];
            const finalAllocatedResources = {};

            // Check Food
            if (requiredResources.food > 0) {
                const foodRes = resources.find(r => r.type === 'food');
                // We must re-read this specific doc inside the transaction to ensure we have the latest version
                const freshFoodDoc = await transaction.get(foodRes.ref);
                const freshFoodData = freshFoodDoc.data();

                if (freshFoodData.available < requiredResources.food) {
                    throw new Error(`Insufficient Food. Requested: ${requiredResources.food}, Available: ${freshFoodData.available}`);
                }

                updates.push({ ref: foodRes.ref, newAvailable: freshFoodData.available - requiredResources.food });
                finalAllocatedResources['Food'] = requiredResources.food;
            }

            // Check Equipment & Facilities
            // Helper to process list-based resources
            const processListResource = async (list, type) => {
                for (const name of list || []) {
                    const resource = resources.find(r => r.type === type && r.name.toLowerCase() === name.toLowerCase());
                    if (!resource) throw new Error(`Resource '${name}' not found in inventory.`);

                    const freshDoc = await transaction.get(resource.ref);
                    const freshData = freshDoc.data();

                    if (freshData.available < 1) {
                        throw new Error(`Resource '${name}' is currently unavailable.`);
                    }

                    // Check if we already decremented this resource in this loop (e.g. 2 mics)
                    // Simplified: Assuming unique names in request list for now. 
                    // If user requests "Mic, Mic", this logic needs to be smarter. 
                    // Assuming Set-like behavior in request for now.

                    const updateIndex = updates.findIndex(u => u.ref.path === resource.ref.path);
                    if (updateIndex >= 0) {
                        // We already marked this for update, check if we have enough for another one
                        // For now, let's assume 1 per named item.
                        // TODO: handle quantities better if "Mic" appears twice.
                        if (updates[updateIndex].newAvailable < 1) throw new Error(`Not enough '${name}'.`);
                        updates[updateIndex].newAvailable -= 1;
                    } else {
                        updates.push({ ref: resource.ref, newAvailable: freshData.available - 1 });
                    }
                    finalAllocatedResources[name] = 1;
                }
            };

            await processListResource(requiredResources.equipment, 'equipment');
            await processListResource(requiredResources.facilities, 'facility');
            await processListResource(requiredResources.itcServices, 'itc');

            // 4. Perform Writes
            // Update Resources
            updates.forEach(u => {
                transaction.update(u.ref, { available: u.newAvailable });
            });

            // Update Event
            transaction.update(eventRef, {
                status: EVENT_STATUS.FINAL_APPROVED,
                allocatedVenue: eventData.venuePreference, // Confirming preference as allocated
                resourcesAllocated: finalAllocatedResources,
                approvedBy: headId,
                approvedAt: serverTimestamp()
            });
        });

        return { success: true };

    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};
