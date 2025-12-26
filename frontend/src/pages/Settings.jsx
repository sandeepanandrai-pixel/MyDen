import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, Save, Check, AlertCircle, Globe,
    Bell, Shield, Palette, TrendingUp, Calendar, MapPin
} from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state with all new User fields
    const [formData, setFormData] = useState({
        // Basic info
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',

        // Profile info
        bio: user?.bio || '',
        profilePicture: user?.profilePicture || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        country: user?.country || '',
        timezone: user?.timezone || 'America/New_York',
        currency: user?.currency || 'USD',

        // Preferences
        preferences: {
            riskTolerance: user?.preferences?.riskTolerance || 'moderate',
            defaultChart: user?.preferences?.defaultChart || '7d',
            theme: user?.preferences?.theme || 'dark',
            language: user?.preferences?.language || 'en',
            dashboardLayout: user?.preferences?.dashboardLayout || 'default'
        },

        // Notifications
        notifications: {
            email: user?.notifications?.email !== undefined ? user.notifications.email : true,
            push: user?.notifications?.push !== undefined ? user.notifications.push : true,
            priceAlerts: user?.notifications?.priceAlerts !== undefined ? user.notifications.priceAlerts : true,
            portfolioUpdates: user?.notifications?.portfolioUpdates !== undefined ? user.notifications.portfolioUpdates : true,
            marketNews: user?.notifications?.marketNews !== undefined ? user.notifications.marketNews : false,
            weeklyReport: user?.notifications?.weeklyReport !== undefined ? user.notifications.weeklyReport : true
        },

        // Privacy
        privacy: {
            showPortfolio: user?.privacy?.showPortfolio !== undefined ? user.privacy.showPortfolio : false,
            showInLeaderboard: user?.privacy?.showInLeaderboard !== undefined ? user.privacy.showInLeaderboard : true,
            allowSocialSharing: user?.privacy?.allowSocialSharing !== undefined ? user.privacy.allowSocialSharing : false
        }
    });

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                profilePicture: user.profilePicture || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                country: user.country || '',
                timezone: user.timezone || 'America/New_York',
                currency: user.currency || 'USD',
                preferences: {
                    riskTolerance: user.preferences?.riskTolerance || 'moderate',
                    defaultChart: user.preferences?.defaultChart || '7d',
                    theme: user.preferences?.theme || 'dark',
                    language: user.preferences?.language || 'en',
                    dashboardLayout: user.preferences?.dashboardLayout || 'default'
                },
                notifications: {
                    email: user.notifications?.email !== undefined ? user.notifications.email : true,
                    push: user.notifications?.push !== undefined ? user.notifications.push : true,
                    priceAlerts: user.notifications?.priceAlerts !== undefined ? user.notifications.priceAlerts : true,
                    portfolioUpdates: user.notifications?.portfolioUpdates !== undefined ? user.notifications.portfolioUpdates : true,
                    marketNews: user.notifications?.marketNews !== undefined ? user.notifications.marketNews : false,
                    weeklyReport: user.notifications?.weeklyReport !== undefined ? user.notifications.weeklyReport : true
                },
                privacy: {
                    showPortfolio: user.privacy?.showPortfolio !== undefined ? user.privacy.showPortfolio : false,
                    showInLeaderboard: user.privacy?.showInLeaderboard !== undefined ? user.privacy.showInLeaderboard : true,
                    allowSocialSharing: user.privacy?.allowSocialSharing !== undefined ? user.privacy.allowSocialSharing : false
                }
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested objects (preferences, notifications, privacy)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        if (message.text) setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : null;
            const token = userData?.token;

            if (!token) {
                setMessage({ type: 'error', text: 'Please login again' });
                setLoading(false);
                return;
            }

            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const response = await axios.put(
                `${apiUrl}/api/user/profile`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update local storage and context with new user data
            const updatedUser = { ...userData, ...response.data.user, token };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            login(updatedUser);

            setMessage({
                type: 'success',
                text: 'Settings saved successfully!'
            });

            // Auto-dismiss success message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save settings. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

            {/* User Header */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {formData.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-slate-400">{user?.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                {user?.role === 'admin' ? 'Administrator' : 'Investor'}
                            </span>
                            {user?.isPremium && (
                                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-semibold">
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="flex border-b border-slate-700 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-900/50'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
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
                                            disabled
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="e.g., United States"
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Timezone</label>
                                    <div className="relative">
                                        <Globe size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                        <select
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Europe/Paris">Paris (CET)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="CNY">CNY (¥)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Risk Tolerance</label>
                                <div className="relative">
                                    <TrendingUp size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    <select
                                        name="preferences.riskTolerance"
                                        value={formData.preferences.riskTolerance}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="conservative">Conservative - Low risk, stable returns</option>
                                        <option value="moderate">Moderate - Balanced risk/reward</option>
                                        <option value="aggressive">Aggressive - High risk, high potential</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Theme</label>
                                <div className="relative">
                                    <Palette size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    <select
                                        name="preferences.theme"
                                        value={formData.preferences.theme}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="dark">Dark Mode</option>
                                        <option value="light">Light Mode</option>
                                        <option value="auto">Auto (System)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Default Chart Timeframe</label>
                                <select
                                    name="preferences.defaultChart"
                                    value={formData.preferences.defaultChart}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="1d">1 Day</option>
                                    <option value="7d">7 Days</option>
                                    <option value="30d">30 Days</option>
                                    <option value="90d">90 Days</option>
                                    <option value="1y">1 Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    <select
                                        name="preferences.language"
                                        value={formData.preferences.language}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                        <option value="zh">中文</option>
                                        <option value="ja">日本語</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm mb-6">Choose what notifications you want to receive</p>

                            {[
                                { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                                { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                                { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified when price targets are hit' },
                                { key: 'portfolioUpdates', label: 'Portfolio Updates', description: 'Daily portfolio performance summary' },
                                { key: 'marketNews', label: 'Market News', description: 'Breaking news and market updates' },
                                { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly portfolio performance report' }
                            ].map(notification => (
                                <label key={notification.key} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={`notifications.${notification.key}`}
                                        checked={formData.notifications[notification.key]}
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{notification.label}</div>
                                        <div className="text-slate-400 text-sm">{notification.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm mb-6">Control your privacy and data sharing preferences</p>

                            {[
                                { key: 'showPortfolio', label: 'Public Portfolio', description: 'Allow others to view your portfolio (anonymized)' },
                                { key: 'showInLeaderboard', label: 'Show in Leaderboard', description: 'Appear in performance leaderboards' },
                                { key: 'allowSocialSharing', label: 'Social Sharing', description: 'Enable sharing achievements on social media' }
                            ].map(privacy => (
                                <label key={privacy.key} className="flex items-start space-x-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={`privacy.${privacy.key}`}
                                        checked={formData.privacy[privacy.key]}
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{privacy.label}</div>
                                        <div className="text-slate-400 text-sm">{privacy.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Success/Error Message */}
                    {message.text && (
                        <div className={`p-4 rounded-lg flex items-center space-x-3 ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-600/30 text-green-300'
                            : 'bg-red-900/20 border border-red-600/30 text-red-300'
                            }`}>
                            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
