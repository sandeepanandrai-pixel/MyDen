import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingStates';

const PortfolioAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [rebalancing, setRebalancing] = useState(null);
    const [riskTolerance, setRiskTolerance] = useState('moderate');

    useEffect(() => {
        fetchAnalysis();
    }, [riskTolerance]);

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/strategies/analyze',
                { riskTolerance },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAnalysis(response.data);

            // Also fetch rebalancing suggestions
            if (response.data.needsRebalancing) {
                const rebalanceResponse = await axios.post(
                    'http://localhost:5000/api/strategies/rebalance',
                    { riskTolerance },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRebalancing(rebalanceResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            3: 'bg-red-600 text-white',
            2: 'bg-orange-600 text-white',
            1: 'bg-yellow-600 text-white',
            0: 'bg-slate-600 text-slate-300'
        };
        const labels = {
            3: 'Critical',
            2: 'High',
            1: 'Medium',
            0: 'Low'
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[priority]}`}>
                {labels[priority]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <LoadingSpinner size="lg" />
                    <p className="text-center text-slate-400 mt-4">Analyzing your portfolio...</p>
                </div>
            </div>
        );
    }

    if (analysis?.isEmpty) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
                        <PieChart size={64} className="mx-auto text-slate-600 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Portfolio Yet</h2>
                        <p className="text-slate-400 mb-6">
                            Start investing to get AI-powered portfolio analysis and recommendations.
                        </p>
                        <a
                            href="/market"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Explore Market
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analysis</h1>
                        <p className="text-slate-400">AI-powered insights and recommendations</p>
                    </div>
                    <button
                        onClick={fetchAnalysis}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Health Score Card */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-slate-400 mb-1">Portfolio Health Score</h3>
                            <div className="flex items-baseline space-x-2">
                                <span className={`text-5xl font-bold ${getHealthColor(analysis.healthScore)}`}>
                                    {analysis.healthScore?.toFixed(0)}
                                </span>
                                <span className="text-2xl text-slate-500">/100</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 mb-1">Total Value</p>
                            <p className="text-3xl font-bold text-white">
                                ${analysis.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Current Allocation */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">Current Allocation</h3>
                        <div className="space-y-3">
                            {analysis.currentAllocation && Object.entries(analysis.currentAllocation).map(([asset, percent]) => (
                                <div key={asset} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-slate-300 capitalize font-semibold">{asset}</span>
                                            <span className="text-white font-semibold">{percent.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Target Allocation */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4">Recommended Allocation</h3>
                        <div className="space-y-3">
                            {analysis.targetStrategy && Object.entries(analysis.targetStrategy).map(([asset, percent]) => (
                                <div key={asset} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-slate-300 capitalize font-semibold">{asset}</span>
                                            <span className="text-white font-semibold">{percent}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Metrics */}
                <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Risk Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900 rounded-lg p-4">
                            <p className="text-slate-400 text-sm mb-1">Diversification</p>
                            <p className="text-2xl font-bold text-white">{analysis.riskMetrics?.diversificationScore}</p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4">
                            <p className="text-slate-400 text-sm mb-1">Risk Level</p>
                            <p className="text-2xl font-bold text-white capitalize">{analysis.riskMetrics?.riskLevel}</p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4">
                            <p className="text-slate-400 text-sm mb-1">Assets</p>
                            <p className="text-2xl font-bold text-white">{analysis.riskMetrics?.numAssets}</p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4">
                            <p className="text-slate-400 text-sm mb-1">Market</p>
                            <p className="text-2xl font-bold text-white capitalize">{analysis.marketCondition?.condition}</p>
                        </div>
                    </div>
                </div>

                {/* Rebalancing Suggestions */}
                {analysis.needsRebalancing && rebalancing && (
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <AlertTriangle className="text-yellow-500" size={24} />
                            <h3 className="text-xl font-bold text-white">Rebalancing Recommended</h3>
                        </div>
                        <p className="text-yellow-200 mb-4">
                            Your portfolio has drifted from the optimal allocation. Consider these trades:
                        </p>
                        <div className="space-y-3">
                            {rebalancing.trades.map((trade, idx) => (
                                <div key={idx} className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {getPriorityBadge(trade.priority)}
                                        <div>
                                            <p className="text-white font-semibold">
                                                <span className={trade.action === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                                    {trade.action.toUpperCase()}
                                                </span>
                                                {' '}{trade.quantity.toFixed(4)} {trade.asset}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                ~${trade.estimatedCost.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-slate-500" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <p className="text-slate-400">Total Rebalancing Cost</p>
                                <p className="text-2xl font-bold text-white">
                                    ${rebalancing.estimatedTotalCost?.toFixed(2)}
                                </p>
                            </div>
                            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                                Execute Rebalancing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioAnalysis;
