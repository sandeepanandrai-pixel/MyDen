import React, { useEffect, useState } from 'react';
import AssetCard from '../components/AssetCard';
import TransactionModal from '../components/TransactionModal';
import { getMarketData } from '../services/marketData';
import { Loader } from 'lucide-react';

const Market = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, symbol: '', price: 0, type: 'buy' });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getMarketData();
            setCoins(data);
            setLoading(false);
        };
        fetchData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const openModal = (symbol, price, type = 'buy') => {
        setModalConfig({ isOpen: true, symbol: symbol.toUpperCase(), price, type });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                <Loader className="animate-spin mr-2" /> Loading Market Data...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Market Overview</h1>
            <p className="text-slate-400">Top 10 Cryptocurrencies by Market Cap</p>

            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                symbol={modalConfig.symbol}
                currentPrice={modalConfig.price}
                type={modalConfig.type}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coins.map(coin => (
                    <div key={coin.id} className="cursor-pointer" onClick={() => openModal(coin.symbol, coin.current_price, 'buy')}>
                        <AssetCard
                            symbol={coin.symbol.toUpperCase()}
                            name={coin.name}
                            price={coin.current_price}
                            change={coin.price_change_24h}
                            changePercent={coin.price_change_percentage_24h}
                            isPositive={coin.price_change_percentage_24h >= 0}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Market;
