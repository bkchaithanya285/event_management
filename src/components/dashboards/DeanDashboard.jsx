import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { EVENT_STATUS } from '../../types/types';

const DeanDashboard = () => {
    const { userData, logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'events'),
                where('status', '==', EVENT_STATUS.HOD_APPROVED)
            );
            const querySnapshot = await getDocs(q);
            const eventsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
    }, []);

    const handleApprove = async (eventId) => {
        setActionLoading(eventId);
        try {
            await updateDoc(doc(db, 'events', eventId), {
                status: EVENT_STATUS.DEAN_APPROVED,
                currentLevel: 'InstitutionalHead',
                deanApprovalDate: serverTimestamp()
            });
            fetchEvents();
        } catch (error) {
            console.error('Error approving event:', error);
            alert('Failed to approve event');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (eventId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        setActionLoading(eventId);
        try {
            await updateDoc(doc(db, 'events', eventId), {
                status: EVENT_STATUS.REJECTED,
                rejectionReason: reason,
                rejectedBy: 'Dean',
                rejectionDate: serverTimestamp()
            });
            fetchEvents();
        } catch (error) {
            console.error('Error rejecting event:', error);
            alert('Failed to reject event');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-b-[3rem] shadow-2xl"></div>
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 pt-6 px-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-display tracking-tight">Dean Dashboard</h1>
                            <p className="text-indigo-200 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                {userData?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/10 transition-all text-sm font-medium flex items-center gap-2 group"
                    >
                        <span>Sign Out</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Pending Dean Approvals
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{events.length}</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="glass-card p-12 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No Pending Approvals</h3>
                        <p className="text-slate-500 mt-1">There are no HOD-approved events waiting for your review.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 animate-slide-up">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="glass-card p-6 md:p-8 hover:shadow-xl transition-all relative overflow-hidden group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors"></div>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Event Info */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        {event.venuePreference}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                        {event.department}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">{event.title}</h3>
                                                <p className="text-slate-600 leading-relaxed">{event.description}</p>
                                            </div>

                                            <div className="hidden lg:block text-right">
                                                <div className="text-sm font-bold text-slate-900">{event.coordinatorName}</div>
                                                <div className="text-xs text-slate-500">Coordinator</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Start Time</div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {new Date(event.scheduleStart).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">End Time</div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {new Date(event.scheduleEnd).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Participants</div>
                                                <div className="text-sm font-medium text-slate-900">{event.participants}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Resources</div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {[
                                                        event.resourcesRequested?.food ? 'Food' : null,
                                                        event.resourcesRequested?.equipment?.length ? 'Equip' : null,
                                                        event.resourcesRequested?.facilities?.length ? 'Facil' : null
                                                    ].filter(Boolean).join(', ') || 'None'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 min-w-[200px]">
                                        <button
                                            onClick={() => handleApprove(event.id)}
                                            disabled={actionLoading === event.id}
                                            className="w-full btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 group shadow-indigo-500/25"
                                        >
                                            {actionLoading === event.id ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleReject(event.id)}
                                            disabled={actionLoading === event.id}
                                            className="w-full px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeanDashboard;
