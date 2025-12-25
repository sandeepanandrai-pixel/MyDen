import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, TrendingUp, Award, Activity, DollarSign, PieChart, Target, Crown, Star, Zap } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalInvested: 0,
        totalValue: 0,
        totalProfit: 0,
        totalTrades: 0,
        winRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            const [portfolioRes, historyRes] = await Promise.all([
                axios.get(`${apiUrl}/api/portfolio/holdings`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${apiUrl}/api/portfolio/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const portfolio = portfolioRes.data || [];
            const history = historyRes.data || [];

            const totalValue = portfolio.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
            const totalInvested = history.reduce((sum, tx) => sum + (tx.type === 'buy' ? tx.total : 0), 0);
            const totalProfit = totalValue - totalInvested;
            const winRate = history.length > 0 ? (history.filter(tx => tx.type === 'sell').length / history.length * 100) : 0;

            setStats({
                totalInvested,
                totalValue,
                totalProfit,
                totalTrades: history.length,
                winRate
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const achievements = [
        {
            id: 1,
            name: 'First Trade',
            description: 'Complete your first transaction',
            unlocked: stats.totalTrades > 0,
            icon: Target,
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 2,
            name: 'Portfolio Builder',
            description: 'Invest over $1,000',
            unlocked: stats.totalInvested >= 1000,
            icon: DollarSign,
            color: 'from-green-500 to-green-600'
        },
        {
            id: 3,
            name: 'Active Trader',
            description: 'Complete 10 trades',
            unlocked: stats.totalTrades >= 10,
            icon: Activity,
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 4,
            name: 'Profit Maker',
            description: 'Achieve positive returns',
            unlocked: stats.totalProfit > 0,
            icon: TrendingUp,
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            id: 5,
            name: 'Elite Investor',
            description: 'Portfolio value over $10,000',
            unlocked: stats.totalValue >= 10000,
            icon: Crown,
            color: 'from-pink-500 to-pink-600'
        },
        {
            id: 6,
            name: 'Speed Trader',
            description: 'Complete 50 trades',
            unlocked: stats.totalTrades >= 50,
            icon: Zap,
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Recently';

    const profitPercentage = stats.totalInvested > 0 ? ((stats.totalProfit / stats.totalInvested) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="animate-fade-in">
                    <h1 className="text-hero gradient-text mb-2">My Profile</h1>
                    <p className="text-slate-400 text-lg">Your investment journey at a glance</p>
                </div>

                {/* Profile Card */}
                <div className="premium-card animate-scale-in">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl font-black text-white shadow-2xl shadow-purple-500/50 transform hover:scale-105 transition-transform">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-full border-4 border-slate-900 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-black text-white mb-2">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300">
                                    <Mail size={18} className="text-purple-400" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-300">
                                    <Calendar size={18} className="text-purple-400" />
                                    <span>Joined {joinDate}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2">
                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-bold text-white shadow-lg">
                                        {user?.role === 'admin' ? '👑 Admin' : '💎 Investor'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-right">
                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <DollarSign className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Invested</p>
                                <p className="text-2xl font-bold text-white">${stats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <PieChart className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Portfolio Value</p>
                                <p className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-3 ${stats.totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl`}>
                                <TrendingUp className={stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total P/L</p>
                                <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className={`text-xs ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <Activity className="text-yellow-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Trades</p>
                                <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="premium-card animate-fade-in-up">
                    <div className="flex items-center space-x-3 mb-6">
                        <Award className="text-yellow-400" size={28} />
                        <h3 className="text-2xl font-bold text-white">Achievements</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-xl border-2 transition-all ${achievement.unlocked
                                        ? 'bg-gradient-to-br ' + achievement.color + ' border-transparent shadow-lg'
                                        : 'bg-slate-900/50 border-slate-700 opacity-50 grayscale'
                                    }`}
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <achievement.icon size={24} className={achievement.unlocked ? 'text-white' : 'text-slate-600'} />
                                    <h4 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                                        {achievement.name}
                                    </h4>
                                </div>
                                <p className={`text-sm ${achievement.unlocked ? 'text-white/80' : 'text-slate-600'}`}>
                                    {achievement.description}
                                </p>
                                {achievement.unlocked && (
                                    <div className="mt-2 flex items-center space-x-1">
                                        <Star size={14} className="text-yellow-300 fill-yellow-300" />
                                        <span className="text-xs text-white font-semibold">Unlocked!</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                    <a href="/market" className="premium-card hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <TrendingUp className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Explore Market</h4>
                                <p className="text-sm text-slate-400">Find new opportunities</p>
                            </div>
                        </div>
                    </a>

                    <a href="/portfolio" className="premium-card hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <PieChart className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">View Portfolio</h4>
                                <p className="text-sm text-slate-400">Track your holdings</p>
                            </div>
                        </div>
                    </a>

                    <a href="/settings" className="premium-card hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <User className="text-green-400" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Edit Profile</h4>
                                <p className="text-sm text-slate-400">Update your info</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Profile;
