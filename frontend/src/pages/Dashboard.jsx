import React, { useState, useEffect } from 'react';
import MarketChart from '../components/MarketChart';
import AssetCard from '../components/AssetCard';
import NewsFeed from '../components/NewsFeed';
import TransactionModal from '../components/TransactionModal';
import StrategyRecommendation from '../components/StrategyRecommendation';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import { getMarketData } from '../services/marketData';

const Dashboard = () => {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, symbol: '', price: 0, type: 'buy' });
    const [portfolio, setPortfolio] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [prices, setPrices] = useState({});
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            await fetchPortfolio();
            await fetchWatchlist();
        };
        loadData();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const res = await api.get('/user/watchlist');
            setWatchlist(res.data || []);
        } catch (err) {
            console.error("Failed to fetch watchlist", err);
        }
    };

    const fetchPortfolio = async () => {
        try {
            // 1. Fetch User Portfolio
            const res = await api.get('/portfolio');
            const myPortfolio = res.data;
            setPortfolio(myPortfolio);

            // 2. Fetch Live Market Prices
            const marketData = await getMarketData();

            // Map symbols to current prices
            const priceMap = {};
            marketData.forEach(coin => {
                priceMap[coin.symbol.toUpperCase()] = coin.current_price;
            });
            setPrices(priceMap);

            // 3. Calculate Total Value
            let total = 0;
            myPortfolio.forEach(item => {
                const currentPrice = priceMap[item.symbol] || item.averageBuyPrice;
                total += item.quantity * currentPrice;
            });
            setTotalValue(total);

        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    };

    const toggleWatchlist = async (symbol) => {
        try {
            if (watchlist.includes(symbol)) {
                await api.delete(`/user/watchlist/${symbol}`);
                setWatchlist(prev => prev.filter(s => s !== symbol));
            } else {
                await api.post('/user/watchlist', { symbol });
                setWatchlist(prev => [...prev, symbol]);
            }
        } catch (err) {
            console.error("Failed to toggle watchlist", err);
        }
    };

    const openModal = (symbol, price, type = 'buy') => {
        setModalConfig({ isOpen: true, symbol, price, type });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="space-y-6">
            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                symbol={modalConfig.symbol}
                currentPrice={modalConfig.price}
                type={modalConfig.type}
            />

            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Welcome back, Trader</h1>
                    <p className="text-slate-400 mt-1">Here is what's happening in the market today.</p>
                </div>
                <button onClick={() => openModal('USDC', 1, 'buy')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20">
                    <Plus size={18} />
                    <span>Deposit Funds</span>
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Chart + Stats + News) */}
                <div className="lg:col-span-2 space-y-6">
                    <MarketChart />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm font-medium">Total Portfolio Value</p>
                            <p className="text-3xl font-bold text-white mt-2">${totalValue.toLocaleString()}</p>
                            <div className="mt-4 flex items-center text-green-400 text-sm">
                                <span className="bg-green-400/10 px-2 py-1 rounded">+12.5%</span>
                                <span className="ml-2 text-slate-400">vs invested capital</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm font-medium">Your Holdings</p>
                            <div className="mt-2 space-y-2">
                                {portfolio.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No assets owned yet.</p>
                                ) : (
                                    portfolio.map(asset => (
                                        <div key={asset._id} className="flex justify-between text-sm">
                                            <span className="text-white font-medium">{asset.symbol}</span>
                                            <span className="text-slate-400">{asset.quantity} units</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <NewsFeed />

                    {/* AI Strategy Recommendation */}
                    <StrategyRecommendation />
                </div>

                {/* Right Column (Watchlist/Assets) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">Market Watch</h3>
                        <button className="text-blue-500 text-sm font-medium hover:text-blue-400 transition-colors">View All</button>
                    </div>


                    {/* Top Market Assets (Live) */}
                    <div className="space-y-4">
                        {Object.keys(prices).slice(0, 5).map(symbol => (
                            <div key={symbol} onClick={() => openModal(symbol, prices[symbol], 'buy')}>
                                <AssetCard
                                    symbol={symbol}
                                    name={symbol}
                                    price={prices[symbol]}
                                    change={0}
                                    changePercent={0}
                                    isPositive={true}
                                    isWatchlisted={watchlist.includes(symbol)}
                                    onToggleWatchlist={toggleWatchlist}
                                />
                            </div>
                        ))}
                        {Object.keys(prices).length === 0 && (
                            <p className="text-slate-500 text-sm">Loading market data...</p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 mb-2">QUICK ACTIONS</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(prices).slice(0, 4).map(symbol => (
                                <button key={symbol} onClick={() => openModal(symbol, prices[symbol], 'buy')} className="bg-slate-800 text-slate-300 py-2 rounded hover:bg-slate-700 text-sm">
                                    Buy {symbol}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
