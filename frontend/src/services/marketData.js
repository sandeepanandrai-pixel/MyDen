import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const getMarketData = async () => {
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: 'bitcoin,ethereum,solana,cardano,ripple,polkadot,dogecoin,avalanche-2,chainlink,matic-network',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching market data, using fallback:", error);
        // Fallback mock data
        return [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 65000, price_change_24h: 1200, price_change_percentage_24h: 1.8 },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3500, price_change_24h: -50, price_change_percentage_24h: -1.4 },
            { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 145, price_change_24h: 5, price_change_percentage_24h: 3.5 },
            { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, price_change_24h: 0.01, price_change_percentage_24h: 2.2 },
            { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.60, price_change_24h: -0.02, price_change_percentage_24h: -3.0 }
        ];
    }
};
