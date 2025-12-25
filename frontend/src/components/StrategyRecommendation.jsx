import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Shield, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const StrategyRecommendation = () => {
    const [loading, setLoading] = useState(true);
    const [marketData, setMarketData] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [riskTolerance, setRiskTolerance] = useState('moderate');

    useEffect(() => {
        fetchRecommendation();
    }, [riskTolerance]);

    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.get(
                `${apiUrl}/api/strategies/recommend?riskTolerance=${riskTolerance}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecommendation(response.data);
            setMarketData(response.data.marketCondition);
        } catch (error) {
            console.error('Failed to fetch recommendation:', error);
            // Set default data if API is unavailable
            setMarketData(null);
            setRecommendation(null);
        } finally {
            setLoading(false);
        }
    };

    const getMarketIcon = (condition) => {
        switch (condition) {
            case 'bull': return <TrendingUp className="text-green-500" />;
            case 'bear': return <TrendingUp className="text-red-500 rotate-180" />;
            case 'volatile': return <Zap className="text-yellow-500" />;
            default: return <AlertCircle className="text-blue-500" />;
        }
    };

    const getMarketColor = (condition) => {
        switch (condition) {
            case 'bull': return 'bg-green-900/20 border-green-600/30';
            case 'bear': return 'bg-red-900/20 border-red-600/30';
            case 'volatile': return 'bg-yellow-900/20 border-yellow-600/30';
            default: return 'bg-blue-900/20 border-blue-600/30';
        }
    };

    const getFearGreedColor = (value) => {
        if (value < 25) return 'text-red-500';
        if (value < 45) return 'text-orange-500';
        if (value < 55) return 'text-yellow-500';
        if (value < 75) return 'text-green-400';
        return 'text-green-500';
    };

    if (loading) {
        return (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-48 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                        {getMarketIcon(marketData?.condition)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">AI Strategy Advisor</h3>
                        <p className="text-sm text-slate-400">Personalized investment recommendations</p>
                    </div>
                </div>
                <button
                    onClick={fetchRecommendation}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={18} className="text-slate-300" />
                </button>
            </div>

            {/* Market Condition */}
            <div className={`${getMarketColor(marketData?.condition)} border rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Market Condition</span>
                    <span className="text-white text-lg font-bold capitalize">{marketData?.condition}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-slate-400">Trend</p>
                        <p className={`font-semibold ${marketData?.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {marketData?.trend > 0 ? '+' : ''}{marketData?.trend?.toFixed(2)}%
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400">Volatility</p>
                        <p className="text-white font-semibold">{marketData?.volatility?.toFixed(2)}%</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Fear & Greed</p>
                        <p className={`font-semibold ${getFearGreedColor(marketData?.fearGreed)}`}>
                            {marketData?.fearGreed}
                        </p>
                    </div>
                </div>
            </div>

            {/* Risk Tolerance Selector */}
            <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-2">
                    {['conservative', 'moderate', 'aggressive'].map((risk) => (
                        <button
                            key={risk}
                            onClick={() => setRiskTolerance(risk)}
                            className={`py-2 px-4 rounded-lg font-semibold transition-all ${riskTolerance === risk
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {risk === 'conservative' && <Shield size={16} className="inline mr-1" />}
                            {risk === 'moderate' && <CheckCircle size={16} className="inline mr-1" />}
                            {risk === 'aggressive' && <Zap size={16} className="inline mr-1" />}
                            {risk.charAt(0).toUpperCase() + risk.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recommended Allocation */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-3">Recommended Allocation</h4>
                <div className="space-y-2">
                    {recommendation && Object.entries(recommendation.recommendedAllocation).map(([asset, percent]) => (
                        <div key={asset} className="flex items-center">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-slate-300 capitalize">{asset}</span>
                                    <span className="text-white font-semibold">{percent}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3">
                <p className="text-sm text-blue-200">
                    {recommendation?.explanation}
                </p>
            </div>
        </div>
    );
};

export default StrategyRecommendation;
