import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { USER_ROLES } from '../types/types';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserRole(data.role);
                setUserData(data);
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserData(user.uid);
            } else {
                setUserRole(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Fetch role immediately to allow redirect
        const data = await fetchUserData(result.user.uid);
        return { user: result.user, role: data?.role };
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists, if not create with default role
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const newUser = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: USER_ROLES.EVENT_COORDINATOR,
                department: '', // Default empty, user might need to update later
                createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, newUser);
            setUserRole(newUser.role);
            setUserData(newUser);
            return { user, role: newUser.role };
        } else {
            const data = userDoc.data();
            setUserRole(data.role);
            setUserData(data);
            return { user, role: data.role };
        }
    };

    const register = async (email, password, name, department) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Create user document in Firestore with DEFAULT EventCoordinator role
        const newUser = {
            uid: user.uid,
            name,
            email,
            role: USER_ROLES.EVENT_COORDINATOR,
            department,
            createdAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', user.uid), newUser);
        setUserRole(newUser.role);
        setUserData(newUser);

        return { user, role: newUser.role };
    };

    const logout = async () => {
        await signOut(auth);
        setUserRole(null);
        setUserData(null);
    };

    const value = {
        currentUser,
        userRole,
        userData,
        login,
        loginWithGoogle,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

