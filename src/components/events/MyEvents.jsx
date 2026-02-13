import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { EVENT_STATUS } from '../../types/types';

const MyEvents = () => {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'events'),
                where('coordinatorId', '==', currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by createdAt desc (if available) or loosely by date
            setEvents(eventsData.sort((a, b) =>
                (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            ));
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentUser]);

    const handleStartEvent = async (eventId) => {
        try {
            await updateDoc(doc(db, 'events', eventId), {
                status: EVENT_STATUS.RUNNING
            });
            fetchEvents();
        } catch (error) {
            console.error('Error starting event:', error);
            alert('Failed to start event');
        }
    };

    const handleCompleteEvent = async (eventId, resourcesAllocated, allocatedVenue) => {
        try {
            // Release resources back to available pool
            if (resourcesAllocated && Object.keys(resourcesAllocated).length > 0) {
                for (const [resourceName, quantity] of Object.entries(resourcesAllocated)) {
                    // Query to find resource by name
                    const resourceQuery = query(
                        collection(db, 'resources'),
                        where('name', '==', resourceName)
                    );
                    const resourceSnapshot = await getDocs(resourceQuery);

                    if (!resourceSnapshot.empty) {
                        const resourceDoc = resourceSnapshot.docs[0];
                        const currentAvailable = resourceDoc.data().available;
                        await updateDoc(doc(db, 'resources', resourceDoc.id), {
                            available: currentAvailable + quantity
                        });
                    }
                }
            }

            // Free up venue
            if (allocatedVenue) {
                const venueQuery = query(
                    collection(db, 'venues'),
                    where('name', '==', allocatedVenue)
                );
                const venueSnapshot = await getDocs(venueQuery);

                if (!venueSnapshot.empty) {
                    const venueDoc = venueSnapshot.docs[0];
                    await updateDoc(doc(db, 'venues', venueDoc.id), {
                        isAvailable: true
                    });
                }
            }

            // Update event status
            await updateDoc(doc(db, 'events', eventId), {
                status: EVENT_STATUS.COMPLETED
            });

            fetchEvents();
        } catch (error) {
            console.error('Error completing event:', error);
            alert('Failed to complete event');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            [EVENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            [EVENT_STATUS.HOD_APPROVED]: 'bg-blue-100 text-blue-700 border-blue-200',
            [EVENT_STATUS.DEAN_APPROVED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            [EVENT_STATUS.FINAL_APPROVED]: 'bg-green-100 text-green-700 border-green-200',
            [EVENT_STATUS.REJECTED]: 'bg-red-100 text-red-700 border-red-200',
            [EVENT_STATUS.RUNNING]: 'bg-purple-100 text-purple-700 border-purple-200',
            [EVENT_STATUS.COMPLETED]: 'bg-slate-100 text-slate-700 border-slate-200'
        };

        const labels = {
            [EVENT_STATUS.PENDING]: 'Pending Review',
            [EVENT_STATUS.HOD_APPROVED]: 'HOD Approved',
            [EVENT_STATUS.DEAN_APPROVED]: 'Dean Approved',
            [EVENT_STATUS.FINAL_APPROVED]: 'Approved',
            [EVENT_STATUS.REJECTED]: 'Rejected',
            [EVENT_STATUS.RUNNING]: 'In Progress',
            [EVENT_STATUS.COMPLETED]: 'Completed'
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 animate-fade-in">
            {events.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No events found</h3>
                    <p className="text-slate-500 mt-1 mb-6">Create your first event proposal to get started.</p>
                </div>
            ) : (
                events.map((event, index) => (
                    <div
                        key={event.id}
                        className="glass-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Status Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${event.status === EVENT_STATUS.REJECTED ? 'bg-red-500' :
                                event.status === EVENT_STATUS.FINAL_APPROVED ? 'bg-green-500' :
                                    event.status === EVENT_STATUS.RUNNING ? 'bg-purple-500' :
                                        'bg-brand-500'
                            }`}></div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Date Box */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        {new Date(event.scheduleStart).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-bold text-slate-800 font-display">
                                        {new Date(event.scheduleStart).getDate()}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 font-display mb-1 group-hover:text-brand-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {getStatusBadge(event.status)}
                                            {event.allocatedVenue && (
                                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs border border-slate-200 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {event.allocatedVenue}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {event.status === EVENT_STATUS.FINAL_APPROVED && (
                                            <button
                                                onClick={() => handleStartEvent(event.id)}
                                                className="btn btn-primary px-3 py-1.5 text-xs shadow-none"
                                            >
                                                Start
                                            </button>
                                        )}
                                        {event.status === EVENT_STATUS.RUNNING && (
                                            <button
                                                onClick={() => handleCompleteEvent(event.id, event.resourcesAllocated, event.allocatedVenue)}
                                                className="btn btn-secondary px-3 py-1.5 text-xs"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm line-clamp-2">{event.description}</p>

                                {/* Meta Details */}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(event.scheduleStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.scheduleEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {event.participants} Participants
                                    </div>
                                </div>

                                {event.rejectionReason && (
                                    <div className="bg-red-50 text-red-600 text-xs p-2 rounded-lg border border-red-100 flex items-start gap-2 mt-2">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Rejection Reason: {event.rejectionReason}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyEvents;
