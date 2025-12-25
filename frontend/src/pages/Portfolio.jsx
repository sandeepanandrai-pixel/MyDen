import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingStates';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);
    const [totalInvested, setTotalInvested] = useState(0);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await api.get('/portfolio');
            setPortfolio(res.data);

            const invested = res.data.reduce((sum, asset) => sum + asset.totalInvested, 0);
            const value = res.data.reduce((sum, asset) => sum + (asset.quantity * asset.averageBuyPrice), 0);

            setTotalInvested(invested);
            setTotalValue(value);
        } catch (err) {
            console.error("Failed to fetch portfolio", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-400 mt-4">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    const profit = totalValue - totalInvested;
    const profitPercent = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="animate-fade-in">
                    <h1 className="text-hero gradient-text mb-2">Your Portfolio</h1>
                    <p className="text-slate-400">Manage and track your investments</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-right">
                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <DollarSign className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Value</p>
                                <p className="text-2xl font-bold text-white">${(totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-3 ${profit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl`}>
                                {profit >= 0 ? <TrendingUp className="text-green-400" size={24} /> : <TrendingDown className="text-red-400" size={24} />}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total P/L</p>
                                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {profit >= 0 ? '+' : ''}${(profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Target className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">ROI</p>
                                <p className={`text-2xl font-bold ${profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Holdings */}
                {portfolio.length === 0 ? (
                    <div className="premium-card text-center py-20 animate-scale-in">
                        <PieChart size={64} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-2xl font-bold gradient-text mb-2">No assets found</h3>
                        <p className="text-slate-400 mb-6">Start your investment journey today</p>
                        <a
                            href="/market"
                            className="inline-block btn-premium"
                        >
                            Explore Market
                        </a>
                    </div>
                ) : (
                    <div className="premium-card animate-fade-in-up">
                        <h2 className="text-2xl font-bold gradient-text mb-6">Holdings</h2>
                        <div className="space-y-4">
                            {portfolio.map((asset, index) => {
                                const value = asset.quantity * asset.averageBuyPrice;
                                const profitLoss = value - asset.totalInvested;
                                const profitPercent = (profitLoss / asset.totalInvested) * 100;
                                const allocationPercent = totalValue > 0 ? (value / totalValue) * 100 : 0;

                                return (
                                    <div key={asset._id} className="glass rounded-xl p-5 hover:bg-white/10 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">{asset.symbol.slice(0, 2)}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-white">{asset.symbol}</h4>
                                                    <p className="text-slate-400 text-sm">{asset.quantity.toFixed(4)} units</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                <p className={`text-sm font-semibold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {profitLoss >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                                            <div>
                                                <p className="text-slate-400 text-xs mb-1">Avg Price</p>
                                                <p className="text-white font-semibold">${asset.averageBuyPrice.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs mb-1">Invested</p>
                                                <p className="text-white font-semibold">${asset.totalInvested.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs mb-1">Allocation</p>
                                                <p className="text-white font-semibold">{allocationPercent.toFixed(1)}%</p>
                                            </div>
                                        </div>

                                        {/* Allocation Bar */}
                                        <div className="mt-3">
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${allocationPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
