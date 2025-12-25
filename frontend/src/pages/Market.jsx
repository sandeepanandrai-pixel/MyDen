import React, { useEffect, useState } from 'react';
import AssetCard from '../components/AssetCard';
import TransactionModal from '../components/TransactionModal';
import { getMarketData } from '../services/marketData';
import { Search, TrendingUp, Filter, Zap } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingStates';

const Market = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, symbol: '', price: 0, type: 'buy' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('market_cap');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getMarketData();
            setCoins(data);
            setLoading(false);
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const openModal = (symbol, price, type = 'buy') => {
        setModalConfig({ isOpen: true, symbol: symbol.toUpperCase(), price, type });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-400 mt-4">Loading market data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-hero gradient-text">Market Overview</h1>
                            <p className="text-slate-400 mt-2">Top cryptocurrencies by market cap</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Zap className="text-yellow-500 animate-pulse" size={24} />
                            <span className="text-sm text-slate-400">Live prices</span>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="premium-card animate-slide-in-right">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search cryptocurrencies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        {/* Sort Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-10 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                            >
                                <option value="market_cap">Market Cap</option>
                                <option value="price">Price</option>
                                <option value="change">24h Change</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Market Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {filteredCoins.map((coin, index) => (
                        <div key={coin.id} className="premium-card hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        {coin.image ? (
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                                        ) : (
                                            <span className="text-white font-bold">{coin.symbol.slice(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{coin.name}</h3>
                                        <p className="text-slate-400 text-sm">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center space-x-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingUp className="rotate-180" size={16} />}
                                    <span className="font-bold">{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-slate-400 text-xs mb-1">Current Price</p>
                                    <p className="text-2xl font-bold text-white">${coin.current_price?.toLocaleString() || '0'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="glass rounded-lg p-2">
                                        <p className="text-slate-400 text-xs">Market Cap</p>
                                        <p className="text-white font-semibold text-sm">${coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) : '0'}B</p>
                                    </div>
                                    <div className="glass rounded-lg p-2">
                                        <p className="text-slate-400 text-xs">Volume</p>
                                        <p className="text-white font-semibold text-sm">${coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) : '0'}B</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2 pt-2">
                                    <button
                                        onClick={() => openModal(coin.symbol, coin.current_price, 'buy')}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 rounded-lg transition-all shadow-lg hover:shadow-green-600/20"
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => openModal(coin.symbol, coin.current_price, 'sell')}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-2 rounded-lg transition-all shadow-lg hover:shadow-red-600/20"
                                    >
                                        Sell
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCoins.length === 0 && (
                    <div className="text-center py-20">
                        <Search size={64} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                        <p className="text-slate-400">Try searching for a different cryptocurrency</p>
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                symbol={modalConfig.symbol}
                currentPrice={modalConfig.price}
                type={modalConfig.type}
            />
        </div>
    );
};

export default Market;
