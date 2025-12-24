const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Portfolio = require('../models/Portfolio');
const InvestmentStrategy = require('../models/InvestmentStrategy');
const marketAnalyzer = require('../utils/MarketAnalyzer');
const portfolioOptimizer = require('../utils/PortfolioOptimizer');
const marketDataService = require('../services/marketData');

// Get all available strategies
router.get('/', async (req, res) => {
    try {
        const strategies = await InvestmentStrategy.find({ isActive: true });
        res.json(strategies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recommended strategy for user
router.get('/recommend', protect, async (req, res) => {
    try {
        const { riskTolerance = 'moderate' } = req.query;

        // Get current market condition
        const marketCondition = await marketAnalyzer.detectMarketCondition();

        // Get recommended allocation
        const recommendedAllocation = portfolioOptimizer.getRecommendedStrategy(
            marketCondition.condition,
            riskTolerance
        );

        res.json({
            marketCondition,
            recommendedAllocation,
            riskTolerance,
            explanation: this.getStrategyExplanation(marketCondition.condition, riskTolerance)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Analyze current portfolio
router.post('/analyze', protect, async (req, res) => {
    try {
        const { riskTolerance = 'moderate' } = req.body;

        // Get user's portfolio
        const portfolio = await Portfolio.find({ user: req.user._id });

        if (portfolio.length === 0) {
            return res.json({
                message: 'No portfolio found. Start investing to get analysis.',
                isEmpty: true
            });
        }

        // Get current market data
        const symbols = portfolio.map(p => p.symbol.toLowerCase());
        const marketData = await marketDataService.getMarketData();

        // Extract current prices
        const currentPrices = {};
        marketData.forEach(coin => {
            currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
        });

        // Calculate current allocation
        const currentAllocation = portfolioOptimizer.calculateCurrentAllocation(portfolio, currentPrices);

        // Get market condition
        const marketCondition = await marketAnalyzer.detectMarketCondition();

        // Get recommended strategy
        const targetStrategy = portfolioOptimizer.getRecommendedStrategy(
            marketCondition.condition,
            riskTolerance
        );

        // Compare with target
        const comparison = portfolioOptimizer.compareWithTarget(
            currentAllocation.allocation,
            targetStrategy
        );

        // Calculate risk metrics
        const riskMetrics = portfolioOptimizer.calculateRiskMetrics(portfolio, {});

        res.json({
            currentAllocation: currentAllocation.allocation,
            totalValue: currentAllocation.totalValue,
            targetStrategy,
            comparison,
            riskMetrics,
            marketCondition,
            needsRebalancing: comparison.needsRebalancing,
            healthScore: comparison.healthScore
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get rebalancing suggestions
router.post('/rebalance', protect, async (req, res) => {
    try {
        const { riskTolerance = 'moderate' } = req.body;

        // Get user's portfolio
        const portfolio = await Portfolio.find({ user: req.user._id });

        if (portfolio.length === 0) {
            return res.status(400).json({
                message: 'No portfolio found. Cannot generate rebalancing suggestions.'
            });
        }

        // Get current market data
        const marketData = await marketDataService.getMarketData();

        const currentPrices = {};
        marketData.forEach(coin => {
            currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
        });

        // Calculate current allocation
        const currentAllocation = portfolioOptimizer.calculateCurrentAllocation(portfolio, currentPrices);

        // Get market condition and recommended strategy
        const marketCondition = await marketAnalyzer.detectMarketCondition();
        const targetStrategy = portfolioOptimizer.getRecommendedStrategy(
            marketCondition.condition,
            riskTolerance
        );

        // Generate rebalancing trades
        const trades = portfolioOptimizer.generateRebalancingTrades(
            currentAllocation,
            targetStrategy,
            currentPrices
        );

        res.json({
            trades,
            currentAllocation: currentAllocation.allocation,
            targetStrategy,
            marketCondition: marketCondition.condition,
            estimatedTotalCost: trades.reduce((sum, t) => sum + t.estimatedCost, 0),
            numberOfTrades: trades.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function to explain strategies
function getStrategyExplanation(condition, risk) {
    const explanations = {
        bull: {
            conservative: 'In a bull market with conservative risk, we recommend moderate exposure to growth assets while maintaining significant stable reserves.',
            moderate: 'Bull market detected. Balanced allocation to capture growth while managing risk.',
            aggressive: 'Strong bull market - maximizing growth potential with higher allocation to performing assets.'
        },
        bear: {
            conservative: 'Bear market protection: Heavy allocation to stablecoins to preserve capital.',
            moderate: 'Bear market strategy: Balanced approach with focus on accumulating quality assets at lower prices.',
            aggressive: 'Bear market opportunity: Maintain exposure to accumulate assets at discount.'
        },
        sideways: {
            conservative: 'Range-bound market: Balanced allocation for stability and opportunities.',
            moderate: 'Sideways market: Well-diversified portfolio for steady growth.',
            aggressive: 'Consolidation phase: Positioned for breakout while maintaining growth exposure.'
        },
        volatile: {
            conservative: 'High volatility detected: Increased stablecoin allocation for safety.',
            moderate: 'Volatile market: Balanced portfolio with protective stablecoin buffer.',
            aggressive: 'Volatility presents opportunities: Diversified exposure with safety buffer.'
        }
    };

    return explanations[condition]?.[risk] || 'Balanced portfolio strategy recommended.';
}

module.exports = router;
