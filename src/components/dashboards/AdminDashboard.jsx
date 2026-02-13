import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { RESOURCE_TYPES } from '../../types/types';

const AdminDashboard = () => {
    const { userData, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('venues');
    const [venues, setVenues] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Venue form state
    const [venueForm, setVenueForm] = useState({
        name: '',
        capacity: 0
    });
    const [editingVenueId, setEditingVenueId] = useState(null);

    // Resource form state
    const [resourceForm, setResourceForm] = useState({
        name: '',
        type: RESOURCE_TYPES.EQUIPMENT,
        total: 0,
        available: 0
    });
    const [editingResourceId, setEditingResourceId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const venuesSnapshot = await getDocs(collection(db, 'venues'));
            const venuesData = venuesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVenues(venuesData);

            const resourcesSnapshot = await getDocs(collection(db, 'resources'));
            const resourcesData = resourcesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setResources(resourcesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Venue handlers
    const handleVenueSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingVenueId) {
                await updateDoc(doc(db, 'venues', editingVenueId), venueForm);
                // alert('Venue updated successfully!');
                setEditingVenueId(null);
            } else {
                await addDoc(collection(db, 'venues'), {
                    ...venueForm,
                    createdAt: serverTimestamp()
                });
                // alert('Venue added successfully!');
            }
            setVenueForm({ name: '', capacity: 0 });
            fetchData();
        } catch (error) {
            console.error('Error saving venue:', error);
            alert('Failed to save venue');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditVenue = (venue) => {
        setVenueForm({
            name: venue.name,
            capacity: venue.capacity
        });
        setEditingVenueId(venue.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteVenue = async (venueId) => {
        if (!window.confirm('Are you sure you want to delete this venue?')) return;
        setActionLoading(true);
        try {
            await deleteDoc(doc(db, 'venues', venueId));
            fetchData();
        } catch (error) {
            console.error('Error deleting venue:', error);
            alert('Failed to delete venue');
        } finally {
            setActionLoading(false);
        }
    };

    // Resource handlers
    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingResourceId) {
                await updateDoc(doc(db, 'resources', editingResourceId), resourceForm);
                // alert('Resource updated successfully!');
                setEditingResourceId(null);
            } else {
                await addDoc(collection(db, 'resources'), {
                    ...resourceForm,
                    createdAt: serverTimestamp()
                });
                // alert('Resource added successfully!');
            }
            setResourceForm({ name: '', type: RESOURCE_TYPES.EQUIPMENT, total: 0, available: 0 });
            fetchData();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Failed to save resource');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditResource = (resource) => {
        setResourceForm({
            name: resource.name,
            type: resource.type,
            total: resource.total,
            available: resource.available
        });
        setEditingResourceId(resource.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        setActionLoading(true);
        try {
            await deleteDoc(doc(db, 'resources', resourceId));
            fetchData();
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-b-[3rem] shadow-2xl"></div>
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 pt-6 px-6 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-display tracking-tight">Admin Console</h1>
                            <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
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
                {/* Tabs */}
                <div className="flex p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-fit mb-8 shadow-lg">
                    <button
                        onClick={() => setActiveTab('venues')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'venues'
                                ? 'bg-white text-slate-900 shadow-sm scale-105'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Venues
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'resources'
                                ? 'bg-white text-slate-900 shadow-sm scale-105'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Resources
                    </button>
                </div>

                <div className="animate-slide-up">
                    {activeTab === 'venues' && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Add/Edit Venue Form */}
                            <div className="lg:col-span-1">
                                <div className="glass-card p-6 sticky top-8">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        {editingVenueId ? (
                                            <>
                                                <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
                                                Edit Venue
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
                                                Add New Venue
                                            </>
                                        )}
                                    </h2>
                                    <form onSubmit={handleVenueSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={venueForm.name}
                                                onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. Main Auditorium"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={venueForm.capacity}
                                                onChange={(e) => setVenueForm({ ...venueForm, capacity: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. 500"
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={actionLoading}
                                                className="flex-1 btn btn-primary py-3 justify-center shadow-lg shadow-brand-500/20"
                                            >
                                                {actionLoading ? 'Processing...' : (editingVenueId ? 'Update Venue' : 'Add Venue')}
                                            </button>
                                            {editingVenueId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingVenueId(null);
                                                        setVenueForm({ name: '', capacity: 0 });
                                                    }}
                                                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Venues List */}
                            <div className="lg:col-span-2">
                                <div className="glass-card p-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        Managed Venues
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{venues.length}</span>
                                    </h2>

                                    {loading ? (
                                        <div className="text-center py-12">Loading...</div>
                                    ) : venues.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">No venues added yet.</div>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {venues.map((venue, index) => (
                                                <div
                                                    key={venue.id}
                                                    className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => handleEditVenue(venue)}
                                                            className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVenue(venue.id)}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900">{venue.name}</h3>
                                                            <p className="text-xs text-slate-500">Last updated: {venue.updatedAt ? new Date(venue.updatedAt.toDate()).toLocaleDateString() : 'Just now'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        Capacity: <span className="font-bold text-slate-900">{venue.capacity}</span> persons
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Add/Edit Resource Form */}
                            <div className="lg:col-span-1">
                                <div className="glass-card p-6 sticky top-8">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        {editingResourceId ? (
                                            <>
                                                <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
                                                Edit Resource
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
                                                Add New Resource
                                            </>
                                        )}
                                    </h2>
                                    <form onSubmit={handleResourceSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resource Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={resourceForm.name}
                                                onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                                placeholder="e.g. Projector"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
                                            <select
                                                value={resourceForm.type}
                                                onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                            >
                                                <option value={RESOURCE_TYPES.FOOD}>Food</option>
                                                <option value={RESOURCE_TYPES.EQUIPMENT}>Equipment</option>
                                                <option value={RESOURCE_TYPES.FACILITY}>Facility</option>
                                                <option value={RESOURCE_TYPES.ITC}>ITC Service</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={resourceForm.total}
                                                    onChange={(e) => setResourceForm({ ...resourceForm, total: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={resourceForm.available}
                                                    onChange={(e) => setResourceForm({ ...resourceForm, available: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={actionLoading}
                                                className="flex-1 btn btn-primary py-3 justify-center shadow-lg shadow-brand-500/20"
                                            >
                                                {actionLoading ? 'Processing...' : (editingResourceId ? 'Update Resource' : 'Add Resource')}
                                            </button>
                                            {editingResourceId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingResourceId(null);
                                                        setResourceForm({ name: '', type: RESOURCE_TYPES.EQUIPMENT, total: 0, available: 0 });
                                                    }}
                                                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Resources List */}
                            <div className="lg:col-span-2">
                                <div className="glass-card p-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        Inventory
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{resources.length}</span>
                                    </h2>

                                    {loading ? (
                                        <div className="text-center py-12">Loading...</div>
                                    ) : resources.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">No resources added yet.</div>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {resources.map((resource, index) => (
                                                <div
                                                    key={resource.id}
                                                    className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={() => handleEditResource(resource)}
                                                            className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteResource(resource.id)}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resource.type === RESOURCE_TYPES.FOOD ? 'bg-orange-50 text-orange-600' :
                                                                resource.type === RESOURCE_TYPES.EQUIPMENT ? 'bg-blue-50 text-blue-600' :
                                                                    resource.type === RESOURCE_TYPES.FACILITY ? 'bg-purple-50 text-purple-600' :
                                                                        'bg-green-50 text-green-600'
                                                            }`}>
                                                            {/* Simple icon logic based on type */}
                                                            <span className="text-xs font-bold uppercase">{resource.type.substring(0, 2)}</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900">{resource.name}</h3>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider font-semibold">{resource.type}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                                        <div className="bg-slate-50 p-2 rounded-lg text-center">
                                                            <div className="text-xs text-slate-500 uppercase">Total</div>
                                                            <div className="font-bold text-slate-900">{resource.total}</div>
                                                        </div>
                                                        <div className="bg-slate-50 p-2 rounded-lg text-center">
                                                            <div className="text-xs text-slate-500 uppercase">Available</div>
                                                            <div className={`font-bold ${resource.available === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                {resource.available}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
