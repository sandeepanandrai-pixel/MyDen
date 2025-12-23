import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement update logic later
        alert("Profile Update Feature Coming Soon!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
                        <p className="text-slate-400">{user?.role === 'admin' ? 'Administrator' : 'Standard Investor'}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button type="submit" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                            <Save size={20} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
