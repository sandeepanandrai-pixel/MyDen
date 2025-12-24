import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Zap, Eye, EyeOff } from 'lucide-react';
import PortfolioPerformanceChart from '../components/PortfolioPerformanceChart';
import StrategyRecommendation from '../components/StrategyRecommendation';
import MarketChart from '../components/MarketChart';
import AssetCard from '../components/AssetCard';
import NewsFeed from '../components/NewsFeed';
import TransactionModal from '../components/TransactionModal';
import api from '../utils/api';
import { getMarketData } from '../services/marketData';

const Dashboard = () => {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, symbol: '', price: 0, type: 'buy' });
    const [portfolio, setPortfolio] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [prices, setPrices] = useState({});
    const [watchlist, setWatchlist] = useState([]);
    const [hideBalance, setHideBalance] = useState(false);
    const [stats, setStats] = useState({
        totalProfit: 0,
        profitPercent: 0,
        todayChange: 0,
        todayPercent: 0
    });

    useEffect(() => {
        const loadData = async () => {
            await fetchPortfolio();
            await fetchWatchlist();
            await fetchPrices();
        };
        loadData();

        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchPortfolio = async () => {
        try {
            const response = await api.get('/portfolio');
            setPortfolio(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolio:', error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await api.get('/user/watchlist');
            setWatchlist(response.data.watchlist || []);
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
        }
    };

    const fetchPrices = async () => {
        try {
            const marketData = await getMarketData();
            const priceMap = {};
            let total = 0;

            marketData.forEach(coin => {
                priceMap[coin.symbol.toLowerCase()] = coin.current_price;
            });

            portfolio.forEach(holding => {
                const price = priceMap[holding.symbol.toLowerCase()] || holding.averageBuyPrice;
                total += holding.quantity * price;
            });

            setPrices(priceMap);
            setTotalValue(total);

            // Calculate stats (mock data - you can calculate from real transactions)
            const invested = portfolio.reduce((sum, h) => sum + h.totalInvested, 0);
            const profit = total - invested;
            const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;

            setStats({
                totalProfit: profit,
                profitPercent,
                todayChange: profit * 0.05, // Mock: 5% of total profit
                todayPercent: profitPercent * 0.05
            });
        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    };

    const handleWatchlistToggle = async (symbol) => {
        try {
            const isWatchlisted = watchlist.includes(symbol);
            if (isWatchlisted) {
                await api.delete(`/user/watchlist/${symbol}`);
                setWatchlist(watchlist.filter(s => s !== symbol));
            } else {
                await api.post('/user/watchlist', { symbol });
                setWatchlist([...watchlist, symbol]);
            }
        } catch (error) {
            console.error('Failed to toggle watchlist:', error);
        }
    };

    const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 2 }) => {
        const [displayValue, setDisplayValue] = useState(0);

        useEffect(() => {
            const duration = 1000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current += increment;
                if (step >= steps) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(current);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [value]);

        return (
            <span className="animate-number">
                {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Hero Section - Portfolio Value */}
                <div className="hero-gradient rounded-3xl p-1 animate-fade-in">
                    <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
                        {/* Floating Orbs Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl float"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-blue-200 text-sm font-medium mb-2">Total Portfolio Value</p>
                                    <div className="flex items-center space-x-3">
                                        <h1 className="text-hero text-white font-bold">
                                            {hideBalance ? '••••••' : (
                                                <>$<AnimatedNumber value={totalValue} decimals={2} /></>
                                            )}
                                        </h1>
                                        <button
                                            onClick={() => setHideBalance(!hideBalance)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            {hideBalance ? <EyeOff className="text-white" size={20} /> : <Eye className="text-white" size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-200 text-sm font-medium mb-2">24h Change</p>
                                    <div className={`flex items-center space-x-2 ${stats.todayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {stats.todayChange >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                                        <span className="text-3xl font-bold">
                                            {stats.todayChange >= 0 ? '+' : ''}
                                            <AnimatedNumber value={stats.todayPercent} decimals={2} suffix="%" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="glass rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-green-500/20 rounded-xl">
                                            <TrendingUp className="text-green-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs">Total Profit</p>
                                            <p className={`text-xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ${hideBalance ? '••••' : <AnimatedNumber value={Math.abs(stats.totalProfit)} />}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <Activity className="text-purple-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs">Assets</p>
                                            <p className="text-xl font-bold text-white">{portfolio.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Target className="text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-blue-200 text-xs">ROI</p>
                                            <p className={`text-xl font-bold ${stats.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {stats.profitPercent >= 0 ? '+' : ''}<AnimatedNumber value={stats.profitPercent} />%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts & AI */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Performance Chart */}
                        <div className="animate-slide-in-right">
                            <PortfolioPerformanceChart />
                        </div>

                        {/* Portfolio Holdings */}
                        <div className="premium-card animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold gradient-text">Your Holdings</h2>
                                <span className="text-sm text-slate-400">{portfolio.length} assets</span>
                            </div>

                            <div className="space-y-3">
                                {portfolio.length === 0 ? (
                                    <div className="text-center py-12">
                                        <DollarSign size={48} className="mx-auto text-slate-600 mb-3" />
                                        <p className="text-slate-400 mb-2">No holdings yet</p>
                                        <p className="text-sm text-slate-500">Start investing to see your portfolio here</p>
                                    </div>
                                ) : (
                                    portfolio.map(asset => {
                                        const currentPrice = prices[asset.symbol.toLowerCase()] || asset.averageBuyPrice;
                                        const value = asset.quantity * currentPrice;
                                        const profitLoss = value - asset.totalInvested;
                                        const profitPercent = (profitLoss / asset.totalInvested) * 100;

                                        return (
                                            <div key={asset._id} className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-bold">{asset.symbol.slice(0, 2)}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold">{asset.symbol}</h4>
                                                            <p className="text-slate-400 text-sm">{asset.quantity.toFixed(4)} units</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white font-bold">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                        <p className={`text-sm ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {profitLoss >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* AI Strategy */}
                        <div className="animate-scale-in">
                            <StrategyRecommendation />
                        </div>
                    </div>

                    {/* Right Column - Market & News */}
                    <div className="space-y-6">
                        {/* Market Watch */}
                        <div className="premium-card animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold gradient-text">Market Watch</h3>
                                <Zap className="text-yellow-500" size={20} />
                            </div>
                            <MarketChart />
                        </div>

                        {/* News Feed */}
                        <NewsFeed />
                    </div>
                </div>
            </div>

            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                {...modalConfig}
                onSuccess={fetchPortfolio}
            />
        </div>
    );
};

export default Dashboard;
