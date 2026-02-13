
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Config from environment or hardcoded for this script only (since it's a one-off)
// Ideally, run this in a context where import.meta.env is available or paste real config
// For simplicity in a script we might run via node, we need to handle env vars or paste them.
// HOWEVER, since we're in a browser context (React app), we can make a Component that runs this on click.

// Let's make a developer tool component instead of a node script to reuse the existing initialized app
import { auth, db } from './config/firebase';
import { USER_ROLES } from './types/types';

export const seedUsers = async () => {
    const users = [
        { email: 'admin@ierms.edu', password: 'password123', role: USER_ROLES.ADMIN_ITC, name: 'System Admin', department: 'ITC' },
        { email: 'head@ierms.edu', password: 'password123', role: USER_ROLES.INSTITUTIONAL_HEAD, name: 'Dr. Head', department: 'Management' },
        { email: 'dean@ierms.edu', password: 'password123', role: USER_ROLES.DEAN, name: 'Dr. Dean', department: 'Academics' },
        { email: 'hod.cse@ierms.edu', password: 'password123', role: USER_ROLES.HOD, name: 'Dr. HOD CSE', department: 'CSE' },
        { email: 'coordinator@ierms.edu', password: 'password123', role: USER_ROLES.EVENT_COORDINATOR, name: 'Prof. Coordinator', department: 'CSE' },
    ];

    console.log('Starting seed process...');

    // We need to sign out first to ensure clean slate
    await signOut(auth);

    const results = [];

    for (const user of users) {
        try {
            console.log(`Creating ${user.email}...`);
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'users', uid), {
                uid: uid,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                createdAt: serverTimestamp()
            });

            console.log(`Created ${user.role} successfully.`);
            results.push({ email: user.email, status: 'Success', role: user.role });

            // Sign out immediately so we can create the next one
            await signOut(auth);

        } catch (error) {
            console.error(`Failed to create ${user.email}:`, error);
            if (error.code === 'auth/email-already-in-use') {
                results.push({ email: user.email, status: 'Already Exists', role: user.role });
            } else {
                results.push({ email: user.email, status: 'Failed', error: error.message });
            }
        }
    }

    return results;
};
