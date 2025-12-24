import React, { useState } from 'react';
import { Trophy, Target, TrendingUp, Wallet, Star, Award, Zap, Shield } from 'lucide-react';

const achievements = [
    {
        id: 'first_trade',
        title: 'First Trade',
        description: 'Complete your first buy or sell transaction',
        icon: Target,
        rarity: 'common',
        progress: 100,
        unlocked: true
    },
    {
        id: 'portfolio_1k',
        title: 'Rising Star',
        description: 'Reach a portfolio value of $1,000',
        icon: Star,
        rarity: 'uncommon',
        progress: 75,
        unlocked: false
    },
    {
        id: 'diversified',
        title: 'Diversification Master',
        description: 'Hold 5 or more different cryptocurrencies',
        icon: Shield,
        rarity: 'rare',
        progress: 60,
        unlocked: false
    },
    {
        id: 'diamond_hands',
        title: 'Diamond Hands',
        description: 'Hold an asset for 30+ days without selling',
        icon: Award,
        rarity: 'epic',
        progress: 80,
        unlocked: false
    },
    {
        id: 'profit_10percent',
        title: 'Profit Taker',
        description: 'Achieve 10% portfolio gain',
        icon: TrendingUp,
        rarity: 'uncommon',
        progress: 45,
        unlocked: false
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Make 5 trades before 9 AM',
        icon: Zap,
        rarity: 'rare',
        progress: 20,
        unlocked: false
    },
    {
        id: 'portfolio_10k',
        title: 'Whale',
        description: 'Reach a portfolio value of $10,000',
        icon: Trophy,
        rarity: 'legendary',
        progress: 10,
        unlocked: false
    },
    {
        id: 'consistent_trader',
        title: 'Consistency King',
        description: 'Trade for 30 consecutive days',
        icon: Wallet,
        rarity: 'epic',
        progress: 90,
        unlocked: false
    }
];

const Achievements = () => {
    const [filter, setFilter] = useState('all'); // all, unlocked, locked

    const getRarityColor = (rarity) => {
        const colors = {
            common: 'text-slate-400 bg-slate-600/20 border-slate-600/30',
            uncommon: 'text-green-400 bg-green-600/20 border-green-600/30',
            rare: 'text-blue-400 bg-blue-600/20 border-blue-600/30',
            epic: 'text-purple-400 bg-purple-600/20 border-purple-600/30',
            legendary: 'text-yellow-400 bg-yellow-600/20 border-yellow-600/30'
        };
        return colors[rarity] || colors.common;
    };

    const filteredAchievements = achievements.filter(achievement => {
        if (filter === 'unlocked') return achievement.unlocked;
        if (filter === 'locked') return !achievement.unlocked;
        return true;
    });

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalPoints = unlockedCount * 100; // 100 points per achievement

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Achievements</h3>
                    <p className="text-slate-400">
                        {unlockedCount} of {achievements.length} unlocked • {totalPoints} points
                    </p>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-1">
                    {['all', 'unlocked', 'locked'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Overall Progress</span>
                    <span className="text-sm font-semibold text-white">
                        {Math.round((unlockedCount / achievements.length) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                        <div
                            key={achievement.id}
                            className={`border rounded-xl p-4 transition-all duration-300 ${achievement.unlocked
                                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-blue-600/50 shadow-lg shadow-blue-600/10'
                                    : 'bg-slate-900/50 border-slate-700 opacity-70'
                                }`}
                        >
                            <div className="flex items-start space-x-4">
                                {/* Icon */}
                                <div className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}>
                                    <Icon size={24} className={achievement.unlocked ? '' : 'opacity-50'} />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-white">{achievement.title}</h4>
                                        {achievement.unlocked && (
                                            <Trophy className="text-yellow-500" size={16} />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>

                                    {/* Rarity Badge */}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${getRarityColor(achievement.rarity)}`}>
                                            {achievement.rarity}
                                        </span>

                                        {/* Progress */}
                                        {!achievement.unlocked && (
                                            <span className="text-xs text-slate-500">
                                                {achievement.progress}% complete
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress Bar for locked achievements */}
                                    {!achievement.unlocked && (
                                        <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                                style={{ width: `${achievement.progress}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Share Button */}
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg">
                    Share Achievements
                </button>
            </div>
        </div>
    );
};

export default Achievements;
