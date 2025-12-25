import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertCircle, Check, Zap } from 'lucide-react';
import axios from 'axios';

const SmartAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAlert, setNewAlert] = useState({
        asset: '',
        type: 'price_above',
        value: '',
        enabled: true
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // For now, use mock data until backend is ready
            const mockAlerts = [
                {
                    id: 1,
                    asset: 'BTC',
                    type: 'price_above',
                    value: 50000,
                    currentPrice: 48500,
                    enabled: true,
                    triggered: false
                },
                {
                    id: 2,
                    asset: 'ETH',
                    type: 'price_below',
                    value: 3000,
                    currentPrice: 3200,
                    enabled: true,
                    triggered: false
                }
            ];

            setAlerts(mockAlerts);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        }
    };

    const createAlert = () => {
        if (!newAlert.asset || !newAlert.value) return;

        const alert = {
            id: Date.now(),
            ...newAlert,
            currentPrice: Math.random() * 50000,
            triggered: false
        };

        setAlerts([...alerts, alert]);
        setShowCreateModal(false);
        setNewAlert({ asset: '', type: 'price_above', value: '', enabled: true });
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const toggleAlert = (id) => {
        setAlerts(alerts.map(a =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
        ));
    };

    const alertTypes = [
        { value: 'price_above', label: 'Price Above', icon: TrendingUp, color: 'green' },
        { value: 'price_below', label: 'Price Below', icon: TrendingDown, color: 'red' },
        { value: 'unusual_volume', label: 'Unusual Volume', icon: Zap, color: 'yellow' },
        { value: 'price_change', label: 'Price Change %', icon: AlertCircle, color: 'blue' }
    ];

    const getAlertIcon = (type) => {
        const alert = alertTypes.find(a => a.value === type);
        return alert ? alert.icon : Bell;
    };

    const getAlertColor = (type) => {
        const alert = alertTypes.find(a => a.value === type);
        return alert ? alert.color : 'gray';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between animate-fade-in">
                    <div>
                        <h1 className="text-hero gradient-text mb-2">Smart Alerts</h1>
                        <p className="text-slate-400 text-lg">AI-powered notifications for your investments</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-premium flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>Create Alert</span>
                    </button>
                </div>

                {/* AI Suggestions Banner */}
                <div className="premium-card bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 animate-scale-in">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Zap className="text-purple-400" size={28} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">AI Recommendations</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-slate-300">
                                    <Check size={16} className="text-green-400" />
                                    <span>BTC showing strong upward momentum - Consider setting alert at $52,000</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-300">
                                    <Check size={16} className="text-green-400" />
                                    <span>ETH volume 40% above average - Set unusual activity alert</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-300">
                                    <Check size={16} className="text-green-400" />
                                    <span>Market volatility high - Recommended to set stop-loss alerts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="space-y-4 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-white">Active Alerts</h2>

                    {alerts.length === 0 ? (
                        <div className="premium-card text-center py-12">
                            <Bell size={64} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Alerts Yet</h3>
                            <p className="text-slate-400 mb-6">Create your first alert to stay informed about market movements</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-premium"
                            >
                                Create Your First Alert
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alerts.map((alert) => {
                                const Icon = getAlertIcon(alert.type);
                                const color = getAlertColor(alert.type);
                                const colorClasses = {
                                    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
                                    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
                                    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
                                    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
                                };

                                return (
                                    <div
                                        key={alert.id}
                                        className={`premium-card bg-gradient-to-br ${colorClasses[color]} ${!alert.enabled && 'opacity-50'}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                                                    <Icon size={20} className={`text-${color}-400`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{alert.asset}</h4>
                                                    <p className="text-sm text-slate-400">
                                                        {alertTypes.find(t => t.value === alert.type)?.label}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteAlert(alert.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} className="text-red-400" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Target Price</span>
                                                <span className="text-white font-bold">${alert.value.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400">Current Price</span>
                                                <span className="text-white font-bold">${alert.currentPrice?.toLocaleString()}</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                                                <span className="text-sm text-slate-400">Alert Status</span>
                                                <button
                                                    onClick={() => toggleAlert(alert.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${alert.enabled
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-slate-700 text-slate-400'
                                                        }`}
                                                >
                                                    {alert.enabled ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Create Alert Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="premium-card max-w-md w-full animate-scale-in">
                            <h3 className="text-2xl font-bold text-white mb-6">Create New Alert</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Asset</label>
                                    <input
                                        type="text"
                                        placeholder="BTC, ETH, etc."
                                        value={newAlert.asset}
                                        onChange={(e) => setNewAlert({ ...newAlert, asset: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Alert Type</label>
                                    <select
                                        value={newAlert.type}
                                        onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    >
                                        {alertTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Target Value</label>
                                    <input
                                        type="number"
                                        placeholder="Enter price or percentage"
                                        value={newAlert.value}
                                        onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createAlert}
                                    className="flex-1 btn-premium"
                                >
                                    Create Alert
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartAlerts;
