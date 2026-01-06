import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    TrendingUp, Shield, BarChart3, Rocket, Zap,
    Settings, Play, Pause, DollarSign, Activity,
    CheckCircle, AlertCircle, Clock, Target
} from 'lucide-react';

const AutoTrading = () => {
    const { user } = useAuth();
    const [availableModels, setAvailableModels] = useState([]);
    const [userModel, setUserModel] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState(1000);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);
    const [positions, setPositions] = useState([]);
    const [stats, setStats] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    const modelIcons = {
        conservative: Shield,
        balanced: BarChart3,
        growth: TrendingUp,
        aggressive: Rocket,
        daytrader: Zap
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [modelsRes, userModelRes] = await Promise.all([
                api.get('/auto-trading/models'),
                api.get('/auto-trading/my-model')
            ]);

            setAvailableModels(modelsRes.data.models);

            if (userModelRes.data.hasModel) {
                setUserModel(userModelRes.data.model);
                if (userModelRes.data.model.isActive) {
                    fetchPositions();
                    fetchStats();
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPositions = async () => {
        try {
            const res = await api.get('/auto-trading/positions');
            setPositions(res.data.positions || []);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/auto-trading/stats');
            setStats(res.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleActivateModel = async () => {
        if (!selectedModel || investmentAmount < 100) {
            alert('Please select a model and enter minimum $100 investment');
            return;
        }

        try {
            setActivating(true);
            await api.post('/auto-trading/activate', {
                modelType: selectedModel.type,
                investmentAmount: investmentAmount
            });

            alert(`${selectedModel.name} activated successfully!`);
            fetchData();
            setSelectedModel(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to activate model');
        } finally {
            setActivating(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm('Are you sure you want to deactivate your trading model?')) {
            return;
        }

        try {
            await api.post('/auto-trading/deactivate');
            alert('Model deactivated successfully');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to deactivate model');
        }
    };

    const handleCloseAll = async () => {
        if (!window.confirm('Are you sure you want to close all positions immediately?')) {
            return;
        }

        try {
            await api.post('/auto-trading/close-all');
            alert('All positions closed successfully');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to close positions');
        }
    };

    const getRiskColor = (riskLevel) => {
        const colors = {
            'Low': 'text-green-500 bg-green-500/10',
            'Medium': 'text-blue-500 bg-blue-500/10',
            'Medium-High': 'text-purple-500 bg-purple-500/10',
            'High': 'text-orange-500 bg-orange-500/10',
            'Very High': 'text-red-500 bg-red-500/10'
        };
        return colors[riskLevel] || 'text-gray-500 bg-gray-500/10';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Activity className="text-blue-500" size={40} />
                        Automated Trading Models
                    </h1>
                    <p className="text-slate-400">
                        Choose a trading strategy and let our AI trade for you automatically
                    </p>
                </div>

                {/* Active Model Dashboard */}
                {userModel && userModel.isActive && (
                    <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{userModel.config.icon}</span>
                                    <h2 className="text-2xl font-bold">{userModel.config.name}</h2>
                                </div>
                                <p className="text-blue-100">{userModel.config.description}</p>
                            </div>
                            <button
                                onClick={handleDeactivate}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Pause size={18} />
                                Deactivate
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm text-blue-100 mb-1">Investment</div>
                                <div className="text-2xl font-bold">${userModel.investmentAmount.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm text-blue-100 mb-1">Current Value</div>
                                <div className="text-2xl font-bold">${userModel.currentValue?.toLocaleString() || '0'}</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm text-blue-100 mb-1">Today's P/L</div>
                                <div className={`text-2xl font-bold ${userModel.dailyStats?.profitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                    {userModel.dailyStats?.profitLoss >= 0 ? '+' : ''}${userModel.dailyStats?.profitLoss?.toFixed(2) || '0'}
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-sm text-blue-100 mb-1">Win Rate</div>
                                <div className="text-2xl font-bold">{userModel.totalStats?.winRate?.toFixed(1) || '0'}%</div>
                            </div>
                        </div>

                        {positions.length > 0 && (
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold">Current Positions ({positions.length})</h3>
                                    <button
                                        onClick={handleCloseAll}
                                        className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg text-sm transition-all"
                                    >
                                        Close All
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {positions.map((pos, idx) => (
                                        <div key={idx} className="bg-white/10 rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-semibold uppercase">{pos.symbol}</div>
                                                <div className={`text-sm ${pos.profitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                                    {pos.profitLoss >= 0 ? '+' : ''}{pos.profitLossPercentage?.toFixed(2)}%
                                                </div>
                                            </div>
                                            <div className="text-sm text-blue-100">
                                                <div>Qty: {pos.quantity?.toFixed(4)}</div>
                                                <div>Entry: ${pos.entryPrice?.toFixed(2)}</div>
                                                <div>Current: ${pos.currentPrice?.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Model Selection */}
                {(!userModel || !userModel.isActive) && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Choose Your Trading Model</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableModels.map((model) => {
                                const Icon = modelIcons[model.type];
                                const isSelected = selectedModel?.type === model.type;

                                return (
                                    <div
                                        key={model.type}
                                        onClick={() => setSelectedModel(model)}
                                        className={`bg-slate-800 rounded-2xl p-6 cursor-pointer transition-all border-2 ${isSelected
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="text-4xl">{model.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{model.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(model.riskLevel)}`}>
                                                    {model.riskLevel} Risk
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-4">{model.description}</p>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Target size={16} className="text-green-500" />
                                                <span>{model.expectedReturn}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Activity size={16} className="text-blue-500" />
                                                <span>{model.tradingStyle}</span>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="mt-4 pt-4 border-t border-slate-700">
                                                <div className="text-xs text-slate-400 mb-2">Allocation:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(model.allocation).map(([symbol, percent]) => (
                                                        <span key={symbol} className="text-xs bg-slate-700 px-2 py-1 rounded">
                                                            {symbol.toUpperCase()}: {percent}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Activation Panel */}
                        {selectedModel && (
                            <div className="mt-6 bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-4">Activate {selectedModel.name}</h3>

                                <div className="mb-4">
                                    <label className="block text-slate-400 mb-2">Investment Amount (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                                        <input
                                            type="number"
                                            min="100"
                                            step="100"
                                            value={investmentAmount}
                                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="1000"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Minimum: $100</p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                        <Clock className="text-blue-400 mt-0.5" size={18} />
                                        <div className="text-sm text-blue-300">
                                            <strong>Trading Schedule:</strong> Positions will be opened at market open (9:30 AM EST)
                                            and closed at market close (4:00 PM EST) daily.
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleActivateModel}
                                    disabled={activating || investmentAmount < 100}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Play size={20} />
                                    {activating ? 'Activating...' : 'Activate Model'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Statistics */}
                {stats && (
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">Performance Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Total Trades</div>
                                <div className="text-2xl font-bold text-white">{stats.totalStats.totalTrades}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Winning Trades</div>
                                <div className="text-2xl font-bold text-green-500">{stats.totalStats.winningTrades}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Losing Trades</div>
                                <div className="text-2xl font-bold text-red-500">{stats.totalStats.losingTrades}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm mb-1">Avg Return</div>
                                <div className="text-2xl font-bold text-white">${stats.totalStats.averageReturn?.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutoTrading;
