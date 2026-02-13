import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { EVENT_STATUS } from '../../types/types';

const EventForm = ({ onEventCreated }) => {
    const { currentUser, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduleStart: '',
        scheduleEnd: '',
        participants: '',
        venuePreference: '',
        food: '',
        equipment: '',
        facilities: '',
        itcServices: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                scheduleStart: formData.scheduleStart,
                scheduleEnd: formData.scheduleEnd,
                participants: parseInt(formData.participants) || 0,
                venuePreference: formData.venuePreference,
                allocatedVenue: '',
                resourcesRequested: {
                    food: parseInt(formData.food) || 0,
                    equipment: formData.equipment.split(',').map(s => s.trim()).filter(Boolean),
                    facilities: formData.facilities.split(',').map(s => s.trim()).filter(Boolean),
                    itcServices: formData.itcServices.split(',').map(s => s.trim()).filter(Boolean)
                },
                resourcesAllocated: {},
                status: EVENT_STATUS.PENDING,
                currentLevel: 'HOD',
                coordinatorId: currentUser.uid,
                coordinatorName: userData.name,
                department: userData.department,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'events'), eventData);

            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                scheduleStart: '',
                scheduleEnd: '',
                participants: '',
                venuePreference: '',
                food: '',
                equipment: '',
                facilities: '',
                itcServices: ''
            });

            setTimeout(() => {
                if (onEventCreated) onEventCreated();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card max-w-4xl mx-auto p-8 animate-fade-in relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full opacity-50 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-display">New Event Proposal</h2>
                    <p className="text-gray-500 mt-1">Submit your event details for institutional approval.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-slide-down">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-slide-down">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Event request submitted successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event Details Section */}
                    <section className="space-y-5">
                        <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-brand-200"></span>
                            Basic Information
                        </h3>

                        <div className="grid gap-6">
                            <div>
                                <label className="input-label">Event Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Annual Technical Symposium 2024"
                                />
                            </div>

                            <div>
                                <label className="input-label">Description & Objectives</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="input-field resize-none"
                                    placeholder="Describe the event's purpose, expected outcomes, and key activities..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Schedule & Venue Section */}
                    <section className="space-y-5">
                        <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-brand-200"></span>
                            Logistics
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Start Date & Time</label>
                                <input
                                    name="scheduleStart"
                                    type="datetime-local"
                                    required
                                    value={formData.scheduleStart}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="input-label">End Date & Time</label>
                                <input
                                    name="scheduleEnd"
                                    type="datetime-local"
                                    required
                                    value={formData.scheduleEnd}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="input-label">Expected Participants</label>
                                <div className="relative">
                                    <input
                                        name="participants"
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.participants}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="0"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="input-label">Preferred Venue</label>
                                <input
                                    name="venuePreference"
                                    type="text"
                                    required
                                    value={formData.venuePreference}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Main Auditorium"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Resources Section */}
                    <section className="space-y-5">
                        <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-brand-200"></span>
                            Resource Requirements
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="input-label">Food Requests (Packets)</label>
                                <input
                                    name="food"
                                    type="number"
                                    min="0"
                                    value={formData.food}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="input-label">Equipment Needed</label>
                                <input
                                    name="equipment"
                                    type="text"
                                    value={formData.equipment}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Projector, Mic, Speakers"
                                />
                            </div>

                            <div>
                                <label className="input-label">Facility Requirements</label>
                                <input
                                    name="facilities"
                                    type="text"
                                    value={formData.facilities}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. WiFi, Air Conditioning"
                                />
                            </div>

                            <div>
                                <label className="input-label">ITC Services</label>
                                <input
                                    name="itcServices"
                                    type="text"
                                    value={formData.itcServices}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. Live Streaming, Recording"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary px-8 py-3 text-sm shadow-brand-500/25 min-w-[200px]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : (
                                'Submit Proposal'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
