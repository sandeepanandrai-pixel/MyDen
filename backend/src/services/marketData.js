const axios = require('axios');

/**
 * Market Data Service
 * Provides real-time and historical market data for stocks and cryptocurrencies
 */
class MarketDataService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes cache
    }

    /**
     * Get market data for multiple assets
     * Supports both stocks and cryptocurrencies
     * @returns {Promise<Array>} Array of market data
     */
    async getMarketData() {
        const cacheKey = 'market_data_all';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // For now, return mock data for stocks
            // In production, integrate with Alpha Vantage, IEX Cloud, or Polygon.io
            const mockData = this.getMockStockData();

            this.setCache(cacheKey, mockData);
            return mockData;
        } catch (error) {
            console.error('Error fetching market data:', error);
            return this.getMockStockData(); // Fallback to mock data
        }
    }

    /**
     * Get current price for a specific symbol
     * @param {string} symbol - Stock or crypto symbol
     * @returns {Promise<number>} Current price
     */
    async getCurrentPrice(symbol) {
        const cacheKey = `price_${symbol}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Mock implementation - replace with real API
            const marketData = await this.getMarketData();
            const asset = marketData.find(item =>
                item.symbol.toLowerCase() === symbol.toLowerCase()
            );

            const price = asset ? asset.current_price : this.getRandomPrice(symbol);
            this.setCache(cacheKey, price);
            return price;
        } catch (error) {
            console.error(`Error fetching price for ${symbol}:`, error);
            return this.getRandomPrice(symbol);
        }
    }

    /**
     * Get mock stock market data
     * TODO: Replace with real API integration (Alpha Vantage, IEX Cloud, Polygon.io)
     * @returns {Array} Mock stock data
     */
    getMockStockData() {
        return [
            // ETFs
            { symbol: 'SPY', name: 'S&P 500 ETF', current_price: 475.50, change_24h: 0.8 },
            { symbol: 'QQQ', name: 'Nasdaq 100 ETF', current_price: 395.20, change_24h: 1.2 },
            { symbol: 'IWM', name: 'Russell 2000 ETF', current_price: 198.75, change_24h: -0.3 },
            { symbol: 'TLT', name: 'Treasury Bond ETF', current_price: 92.30, change_24h: -0.1 },
            { symbol: 'TQQQ', name: '3x Nasdaq Bull ETF', current_price: 58.40, change_24h: 3.5 },
            { symbol: 'SQQQ', name: '3x Nasdaq Bear ETF', current_price: 12.80, change_24h: -3.2 },
            { symbol: 'ARKK', name: 'ARK Innovation ETF', current_price: 48.90, change_24h: 2.1 },

            // Tech Giants
            { symbol: 'AAPL', name: 'Apple Inc.', current_price: 185.25, change_24h: 1.5 },
            { symbol: 'MSFT', name: 'Microsoft Corp.', current_price: 378.90, change_24h: 0.9 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', current_price: 142.50, change_24h: 1.1 },
            { symbol: 'AMZN', name: 'Amazon.com Inc.', current_price: 155.80, change_24h: 0.7 },
            { symbol: 'META', name: 'Meta Platforms', current_price: 358.20, change_24h: 2.3 },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', current_price: 495.75, change_24h: 3.2 },
            { symbol: 'TSLA', name: 'Tesla Inc.', current_price: 248.50, change_24h: 4.1 },

            // Other Tech
            { symbol: 'AMD', name: 'Advanced Micro Devices', current_price: 148.30, change_24h: 2.8 },
            { symbol: 'NFLX', name: 'Netflix Inc.', current_price: 485.60, change_24h: 1.4 },
            { symbol: 'SHOP', name: 'Shopify Inc.', current_price: 78.90, change_24h: 1.9 },
            { symbol: 'SQ', name: 'Block Inc.', current_price: 68.40, change_24h: 2.5 },
            { symbol: 'COIN', name: 'Coinbase Global', current_price: 145.20, change_24h: 5.2 },
            { symbol: 'MSTR', name: 'MicroStrategy', current_price: 385.50, change_24h: 6.8 },
            { symbol: 'PLTR', name: 'Palantir Technologies', current_price: 22.75, change_24h: 3.1 },

            // Blue Chips
            { symbol: 'JNJ', name: 'Johnson & Johnson', current_price: 158.40, change_24h: 0.3 },
            { symbol: 'PG', name: 'Procter & Gamble', current_price: 152.80, change_24h: 0.2 },
            { symbol: 'KO', name: 'Coca-Cola Co.', current_price: 59.30, change_24h: 0.4 },
            { symbol: 'V', name: 'Visa Inc.', current_price: 265.90, change_24h: 0.8 },
            { symbol: 'JPM', name: 'JPMorgan Chase', current_price: 168.50, change_24h: 0.6 }
        ];
    }

    /**
     * Generate random price for testing
     * @param {string} symbol - Stock symbol
     * @returns {number} Random price
     */
    getRandomPrice(symbol) {
        const basePrices = {
            'SPY': 475, 'QQQ': 395, 'AAPL': 185, 'MSFT': 378,
            'GOOGL': 142, 'AMZN': 155, 'NVDA': 495, 'TSLA': 248,
            'META': 358, 'AMD': 148, 'NFLX': 485, 'JNJ': 158,
            'PG': 152, 'KO': 59, 'V': 265, 'JPM': 168,
            'SHOP': 78, 'SQ': 68, 'COIN': 145, 'MSTR': 385,
            'PLTR': 22, 'IWM': 198, 'TLT': 92, 'TQQQ': 58,
            'SQQQ': 12, 'ARKK': 48
        };

        const basePrice = basePrices[symbol.toUpperCase()] || 100;
        // Add random variation of +/- 2%
        const variation = (Math.random() - 0.5) * 0.04;
        return basePrice * (1 + variation);
    }

    /**
     * Get historical price data
     * @param {string} symbol - Stock symbol
     * @param {number} days - Number of days
     * @returns {Promise<Array>} Historical prices
     */
    async getHistoricalData(symbol, days = 30) {
        // Mock implementation - generate random historical data
        const currentPrice = await this.getCurrentPrice(symbol);
        const historicalPrices = [];

        for (let i = days; i >= 0; i--) {
            const variation = (Math.random() - 0.5) * 0.1; // +/- 5% variation
            const price = currentPrice * (1 + variation);
            historicalPrices.push({
                date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                price: price
            });
        }

        return historicalPrices;
    }

    /**
     * Check if market is open (US Stock Market hours)
     * @returns {boolean} True if market is open
     */
    isMarketOpen() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday

        // Market closed on weekends
        if (day === 0 || day === 6) return false;

        // Convert to EST
        const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const hours = estTime.getHours();
        const minutes = estTime.getMinutes();
        const currentTime = hours * 60 + minutes;

        // Market hours: 9:30 AM - 4:00 PM EST
        const marketOpen = 9 * 60 + 30; // 9:30 AM
        const marketClose = 16 * 60; // 4:00 PM

        return currentTime >= marketOpen && currentTime < marketClose;
    }

    /**
     * Get next market open time
     * @returns {Date} Next market open time
     */
    getNextMarketOpen() {
        const now = new Date();
        const estNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

        // Set to next 9:30 AM EST
        let nextOpen = new Date(estNow);
        nextOpen.setHours(9, 30, 0, 0);

        // If already past 9:30 AM today, move to tomorrow
        if (estNow.getHours() >= 9 && estNow.getMinutes() >= 30) {
            nextOpen.setDate(nextOpen.getDate() + 1);
        }

        // Skip weekends
        while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
            nextOpen.setDate(nextOpen.getDate() + 1);
        }

        return nextOpen;
    }

    // Cache helpers
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export singleton instance
module.exports = new MarketDataService();
