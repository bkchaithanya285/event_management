import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">IERMS</h1>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Institutional Management</p>
                        </div>
                    </div>
                    <Link to="/login" className="btn btn-primary">
                        Sign In / Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-40 lg:pt-48 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-brand-50/50 to-transparent rounded-bl-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-secondary-50/50 to-transparent rounded-tr-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in hover:shadow-md transition-shadow cursor-default">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                            Next-Gen Event Management
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] font-display animate-slide-up">
                            Streamline Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-600">
                                Institutional Events
                            </span>
                        </h1>

                        <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            A unified platform for seamless event approval workflows, intelligent resource allocation, and real-time venue management.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/login" className="btn btn-primary h-14 px-8 text-base shadow-xl shadow-brand-500/20 w-full sm:w-auto">
                                Get Started Now
                            </Link>
                            <a href="#features" className="btn btn-secondary h-14 px-8 text-base w-full sm:w-auto">
                                View Features
                            </a>
                        </div>
                    </div>

                    {/* Stats/Preview */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        {[
                            { label: 'Active Events', value: '150+', color: 'text-brand-600' },
                            { label: 'Venues Managed', value: '25', color: 'text-secondary-600' },
                            { label: 'Resources Tracked', value: '1000+', color: 'text-emerald-600' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">Powerful Capabilities</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Everything you need to manage institutional events with precision and ease.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple CTA */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-12 lg:p-20 text-center shadow-2xl shadow-slate-900/30">
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-display">Ready to modernize your workflow?</h2>
                            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">Join the institution's most advanced event management platform today.</p>
                            <Link to="/login" className="btn bg-white text-slate-900 hover:bg-brand-50 border-none h-14 px-10 text-base shadow-lg shadow-white/10">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-80">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">I</span>
                        </div>
                        <span className="font-bold text-slate-700">IERMS</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        &copy; 2026 Institutional Excellence. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: (
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        bg: 'bg-emerald-50',
        title: 'Multi-Level Approval',
        description: 'Hierarchical workflow streamlining approvals from HODs to the Institutional Head.',
    },
    {
        icon: (
            <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        bg: 'bg-brand-50',
        title: 'Smart Venue Mgmt',
        description: 'Real-time clash detection for venues with intelligent suggestion algorithms.',
    },
    {
        icon: (
            <svg className="w-7 h-7 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        bg: 'bg-secondary-50',
        title: 'Resource Allocation',
        description: 'Automated inventory tracking for equipment, facilities, and food supplies.',
    },
    {
        icon: (
            <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        bg: 'bg-orange-50',
        title: 'Role-Based Access',
        description: 'Granular permissions ensuring security and data privacy across all levels.',
    },
    {
        icon: (
            <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        bg: 'bg-cyan-50',
        title: 'Real-Time Insights',
        description: 'Live dashboards providing instant visibility into event status and resource usage.',
    },
    {
        icon: (
            <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        bg: 'bg-rose-50',
        title: 'Enterprise Security',
        description: 'Built on Firebase with robust authentication and encrypted data transmission.',
    },
];

export default LandingPage;
