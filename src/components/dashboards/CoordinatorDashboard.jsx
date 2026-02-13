import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EventForm from '../events/EventForm';
import MyEvents from '../events/MyEvents';

const CoordinatorDashboard = () => {
    const { userData, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('my-events');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEventCreated = () => {
        setActiveTab('my-events');
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-brand-900 via-brand-800 to-secondary-900 rounded-b-[3rem] shadow-2xl"></div>
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 pt-6 px-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-display tracking-tight">Coordinator Dashboard</h1>
                            <p className="text-blue-200 text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                {userData?.name} • {userData?.department}
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
                {/* Tabs */}
                <div className="flex p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-fit mb-8 shadow-lg mx-auto lg:mx-0">
                    <button
                        onClick={() => setActiveTab('my-events')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'my-events'
                            ? 'bg-white text-brand-900 shadow-md transform scale-105'
                            : 'text-blue-100 hover:bg-white/10'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Events
                    </button>
                    <button
                        onClick={() => setActiveTab('create-event')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'create-event'
                            ? 'bg-white text-brand-900 shadow-md transform scale-105'
                            : 'text-blue-100 hover:bg-white/10'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Event Request
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-slide-up">
                    {activeTab === 'my-events' && <MyEvents key={refreshKey} />}
                    {activeTab === 'create-event' && <EventForm onEventCreated={handleEventCreated} />}
                </div>
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
