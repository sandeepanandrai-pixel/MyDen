const axios = require('axios');

class MarketAnalyzer {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 15 * 60 * 1000; // 15 minutes
    }

    /**
     * Detect current market condition
     * @returns {Promise<string>} 'bull' | 'bear' | 'sideways' | 'volatile'
     */
    async detectMarketCondition() {
        const cacheKey = 'market_condition';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Get Bitcoin price data (market leader)
            const priceData = await this.getBitcoinPriceHistory(30);

            // Calculate metrics
            const trend = this.calculateTrend(priceData);
            const volatility = this.calculateVolatility(priceData);
            const fearGreed = await this.getFearGreedIndex();

            // Determine condition
            let condition;
            if (volatility > 0.15) {
                condition = 'volatile'; // High volatility
            } else if (trend > 0.10) {
                condition = 'bull'; // Strong uptrend
            } else if (trend < -0.10) {
                condition = 'bear'; // Strong downtrend
            } else {
                condition = 'sideways'; // Range-bound
            }

            const result = {
                condition,
                trend: trend * 100, // Convert to percentage
                volatility: volatility * 100,
                fearGreed,
                timestamp: new Date()
            };

            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Market analysis error:', error.message);
            return {
                condition: 'unknown',
                trend: 0,
                volatility: 0,
                fearGreed: 50,
                timestamp: new Date()
            };
        }
    }

    /**
     * Get Bitcoin price history
     * @param {number} days - Number of days
     * @returns {Promise<Array>} Array of prices
     */
    async getBitcoinPriceHistory(days = 30) {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
                {
                    params: {
                        vs_currency: 'usd',
                        days: days,
                        interval: 'daily'
                    },
                    timeout: 10000
                }
            );

            return response.data.prices.map(p => p[1]); // Extract price values
        } catch (error) {
            console.error('Failed to fetch Bitcoin history:', error.message);
            return [];
        }
    }

    /**
     * Calculate trend (simple moving average slope)
     * @param {Array} prices - Array of prices
     * @returns {number} Trend coefficient
     */
    calculateTrend(prices) {
        if (prices.length < 2) return 0;

        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];

        return (lastPrice - firstPrice) / firstPrice;
    }

    /**
     * Calculate volatility (standard deviation of returns)
     * @param {Array} prices - Array of prices
     * @returns {number} Volatility coefficient
     */
    calculateVolatility(prices) {
        if (prices.length < 2) return 0;

        // Calculate daily returns
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }

        // Calculate standard deviation
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

        return Math.sqrt(variance);
    }

    /**
     * Get Fear & Greed Index
     * @returns {Promise<number>} Index value 0-100
     */
    async getFearGreedIndex() {
        try {
            const response = await axios.get('https://api.alternative.me/fng/', {
                timeout: 5000
            });

            if (response.data && response.data.data && response.data.data[0]) {
                return parseInt(response.data.data[0].value);
            }
            return 50; // Neutral if no data
        } catch (error) {
            console.error('Failed to fetch Fear & Greed:', error.message);
            return 50; // Neutral on error
        }
    }

    /**
     * Get market metrics for multiple coins
     * @param {Array<string>} symbols - Array of coin symbols
     * @returns {Promise<Object>} Market metrics
     */
    async getMarketMetrics(symbols = ['bitcoin', 'ethereum']) {
        const cacheKey = `metrics_${symbols.join('_')}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/coins/markets',
                {
                    params: {
                        vs_currency: 'usd',
                        ids: symbols.join(','),
                        order: 'market_cap_desc',
                        per_page: symbols.length,
                        page: 1,
                        sparkline: false,
                        price_change_percentage: '24h,7d,30d'
                    },
                    timeout: 10000
                }
            );

            const metrics = {};
            response.data.forEach(coin => {
                metrics[coin.id] = {
                    price: coin.current_price,
                    change24h: coin.price_change_percentage_24h,
                    change7d: coin.price_change_percentage_7d_in_currency,
                    change30d: coin.price_change_percentage_30d_in_currency,
                    marketCap: coin.market_cap,
                    volume: coin.total_volume
                };
            });

            this.setCache(cacheKey, metrics);
            return metrics;

        } catch (error) {
            console.error('Market metrics error:', error.message);
            return {};
        }
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
}

module.exports = new MarketAnalyzer();
