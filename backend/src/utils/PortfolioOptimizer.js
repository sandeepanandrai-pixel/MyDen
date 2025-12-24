class PortfolioOptimizer {
    /**
     * Calculate current portfolio allocation percentages
     * @param {Array} portfolio - User's portfolio holdings
     * @param {Object} currentPrices - Current market prices
     * @returns {Object} Allocation percentages
     */
    calculateCurrentAllocation(portfolio, currentPrices) {
        let totalValue = 0;
        const holdings = {};

        // Calculate total value
        portfolio.forEach(holding => {
            const price = currentPrices[holding.symbol.toLowerCase()] || holding.averageBuyPrice;
            const value = holding.quantity * price;
            totalValue += value;
            holdings[holding.symbol.toLowerCase()] = value;
        });

        // Calculate percentages
        const allocation = {};
        for (const [symbol, value] of Object.entries(holdings)) {
            allocation[symbol] = totalValue > 0 ? (value / totalValue) * 100 : 0;
        }

        return {
            allocation,
            totalValue,
            holdings
        };
    }

    /**
     * Compare current allocation with target strategy
     * @param {Object} currentAllocation - Current portfolio allocation
     * @param {Object} targetStrategy - Target strategy allocation
     * @returns {Object} Comparison results
     */
    compareWithTarget(currentAllocation, targetStrategy) {
        const deviations = {};
        let totalDeviation = 0;

        // Calculate deviations
        for (const [asset, targetPercent] of Object.entries(targetStrategy)) {
            const currentPercent = currentAllocation[asset] || 0;
            const deviation = currentPercent - targetPercent;
            deviations[asset] = deviation;
            totalDeviation += Math.abs(deviation);
        }

        // Check for assets in current but not in target
        for (const asset of Object.keys(currentAllocation)) {
            if (!targetStrategy[asset]) {
                const deviation = currentAllocation[asset];
                deviations[asset] = deviation;
                totalDeviation += Math.abs(deviation);
            }
        }

        const needsRebalancing = totalDeviation > 10; // More than 10% total deviation

        return {
            deviations,
            totalDeviation,
            needsRebalancing,
            healthScore: Math.max(0, 100 - totalDeviation)
        };
    }

    /**
     * Generate rebalancing suggestions
     * @param {Object} currentAllocation - Current allocation with total value
     * @param {Object} targetStrategy - Target strategy
     * @param {Object} currentPrices - Current market prices
     * @returns {Array} Array of suggested trades
     */
    generateRebalancingTrades(currentAllocation, targetStrategy, currentPrices) {
        const { allocation, totalValue, holdings } = currentAllocation;
        const trades = [];

        // Calculate target values
        const targetValues = {};
        for (const [asset, percent] of Object.entries(targetStrategy)) {
            targetValues[asset] = (percent / 100) * totalValue;
        }

        // Generate trades
        for (const [asset, targetValue] of Object.entries(targetValues)) {
            const currentValue = holdings[asset] || 0;
            const difference = targetValue - currentValue;

            if (Math.abs(difference) > totalValue * 0.01) { // Only if difference > 1% of portfolio
                const price = currentPrices[asset.toLowerCase()] || 0;
                if (price > 0) {
                    trades.push({
                        asset: asset.toUpperCase(),
                        action: difference > 0 ? 'buy' : 'sell',
                        currentValue,
                        targetValue,
                        difference,
                        quantity: Math.abs(difference) / price,
                        estimatedCost: Math.abs(difference),
                        priority: this.calculateTradePriority(difference, totalValue)
                    });
                }
            }
        }

        // Sort by priority
        trades.sort((a, b) => b.priority - a.priority);

        return trades;
    }

    /**
     * Calculate trade priority (larger deviations = higher priority)
     * @param {number} difference - Value difference
     * @param {number} totalValue - Total portfolio value
     * @returns {number} Priority score
     */
    calculateTradePriority(difference, totalValue) {
        const percentDiff = Math.abs(difference) / totalValue * 100;
        if (percentDiff > 20) return 3; // Critical
        if (percentDiff > 10) return 2; // High
        if (percentDiff > 5) return 1; // Medium
        return 0; // Low
    }

    /**
     * Calculate portfolio risk metrics
     * @param {Array} portfolio - User's portfolio
     * @param {Object} marketData - Market data with volatility
     * @returns {Object} Risk metrics
     */
    calculateRiskMetrics(portfolio, marketData) {
        // Diversification score (0-100)
        const numAssets = portfolio.length;
        const diversificationScore = Math.min(100, numAssets * 20); // Max at 5+ assets

        // Calculate weighted volatility
        let totalValue = 0;
        let weightedVolatility = 0;

        portfolio.forEach(holding => {
            const value = holding.quantity * holding.averageBuyPrice;
            totalValue += value;

            const assetVolatility = marketData[holding.symbol.toLowerCase()]?.volatility || 0.5;
            weightedVolatility += (value / totalValue) * assetVolatility;
        });

        // Risk level (low/medium/high)
        let riskLevel = 'low';
        if (weightedVolatility > 0.15) riskLevel = 'high';
        else if (weightedVolatility > 0.08) riskLevel = 'medium';

        return {
            diversificationScore,
            volatility: weightedVolatility * 100,
            numAssets,
            riskLevel,
            suggestedMinAssets: 5
        };
    }

    /**
     * Get recommended strategy based on market conditions and risk tolerance
     * @param {string} marketCondition - Current market condition
     * @param {string} riskTolerance - User's risk tolerance
     * @returns {Object} Recommended allocation
     */
    getRecommendedStrategy(marketCondition, riskTolerance = 'moderate') {
        const strategies = {
            conservative: {
                bull: { bitcoin: 40, ethereum: 25, stablecoins: 25, altcoins: 10 },
                bear: { bitcoin: 30, ethereum: 15, stablecoins: 50, altcoins: 5 },
                sideways: { bitcoin: 35, ethereum: 25, stablecoins: 30, altcoins: 10 },
                volatile: { bitcoin: 30, ethereum: 20, stablecoins: 45, altcoins: 5 }
            },
            moderate: {
                bull: { bitcoin: 40, ethereum: 30, stablecoins: 15, altcoins: 15 },
                bear: { bitcoin: 35, ethereum: 25, stablecoins: 30, altcoins: 10 },
                sideways: { bitcoin: 40, ethereum: 30, stablecoins: 20, altcoins: 10 },
                volatile: { bitcoin: 35, ethereum: 25, stablecoins: 30, altcoins: 10 }
            },
            aggressive: {
                bull: { bitcoin: 35, ethereum: 35, stablecoins: 5, altcoins: 25 },
                bear: { bitcoin: 40, ethereum: 30, stablecoins: 20, altcoins: 10 },
                sideways: { bitcoin: 40, ethereum: 30, stablecoins: 10, altcoins: 20 },
                volatile: { bitcoin: 40, ethereum: 30, stablecoins: 15, altcoins: 15 }
            }
        };

        const condition = marketCondition || 'sideways';
        return strategies[riskTolerance][condition] || strategies.moderate.sideways;
    }
}

module.exports = new PortfolioOptimizer();
