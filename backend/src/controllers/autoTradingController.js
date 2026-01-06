const AutoTradingModel = require('../models/AutoTradingModel');
const marketDataService = require('../services/marketData');

// @desc    Get all available trading models
// @route   GET /api/auto-trading/models
// @access  Public
exports.getAvailableModels = async (req, res) => {
    try {
        const models = AutoTradingModel.MODEL_CONFIGS;
        const modelsArray = Object.keys(models).map(key => ({
            type: key,
            ...models[key]
        }));

        res.json({
            success: true,
            models: modelsArray
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's active trading model
// @route   GET /api/auto-trading/my-model
// @access  Private
exports.getUserModel = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.json({
                success: true,
                hasModel: false,
                message: 'No active trading model found'
            });
        }

        const config = model.getConfig();

        // Get current market prices if there are positions
        let currentValue = model.investmentAmount;
        if (model.currentPositions.length > 0) {
            const marketData = await marketDataService.getMarketData();
            const currentPrices = {};
            marketData.forEach(coin => {
                currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
            });
            currentValue = model.calculateCurrentValue(currentPrices);
        }

        res.json({
            success: true,
            hasModel: true,
            model: {
                ...model.toObject(),
                config: config,
                currentValue: currentValue,
                unrealizedPL: currentValue - model.investmentAmount,
                unrealizedPLPercentage: ((currentValue - model.investmentAmount) / model.investmentAmount) * 100
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or update trading model
// @route   POST /api/auto-trading/activate
// @access  Private
exports.activateModel = async (req, res) => {
    try {
        const { modelType, investmentAmount, settings } = req.body;

        // Validate model type
        if (!AutoTradingModel.MODEL_CONFIGS[modelType]) {
            return res.status(400).json({ message: 'Invalid model type' });
        }

        // Validate investment amount
        if (!investmentAmount || investmentAmount < 100) {
            return res.status(400).json({ message: 'Minimum investment amount is $100' });
        }

        // Check if user already has a model
        let model = await AutoTradingModel.findOne({ user: req.user._id });

        if (model) {
            // Deactivate existing model first if it's active
            if (model.isActive && model.currentPositions.length > 0) {
                return res.status(400).json({
                    message: 'Please deactivate your current model and close all positions before switching models'
                });
            }

            // Update existing model
            model.modelType = modelType;
            model.investmentAmount = investmentAmount;
            model.isActive = true;
            if (settings) {
                model.settings = { ...model.settings, ...settings };
            }
        } else {
            // Create new model
            model = new AutoTradingModel({
                user: req.user._id,
                modelType: modelType,
                investmentAmount: investmentAmount,
                isActive: true,
                settings: settings || {}
            });
        }

        await model.save();

        const config = model.getConfig();

        res.json({
            success: true,
            message: `${config.name} model activated successfully!`,
            model: {
                ...model.toObject(),
                config: config
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Deactivate trading model
// @route   POST /api/auto-trading/deactivate
// @access  Private
exports.deactivateModel = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.status(404).json({ message: 'No trading model found' });
        }

        if (model.currentPositions.length > 0) {
            return res.status(400).json({
                message: 'Cannot deactivate model with open positions. Please wait for market close or manually close positions.'
            });
        }

        model.isActive = false;
        await model.save();

        res.json({
            success: true,
            message: 'Trading model deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get model performance statistics
// @route   GET /api/auto-trading/stats
// @access  Private
exports.getModelStats = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.status(404).json({ message: 'No trading model found' });
        }

        const config = model.getConfig();

        res.json({
            success: true,
            stats: {
                modelName: config.name,
                modelType: model.modelType,
                isActive: model.isActive,
                investmentAmount: model.investmentAmount,
                dailyStats: model.dailyStats,
                totalStats: model.totalStats,
                currentPositions: model.currentPositions.length,
                settings: model.settings
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update model settings
// @route   PUT /api/auto-trading/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.status(404).json({ message: 'No trading model found' });
        }

        const { stopLoss, takeProfit, maxPositions, riskPerTrade } = req.body;

        if (stopLoss !== undefined) model.settings.stopLoss = stopLoss;
        if (takeProfit !== undefined) model.settings.takeProfit = takeProfit;
        if (maxPositions !== undefined) model.settings.maxPositions = maxPositions;
        if (riskPerTrade !== undefined) model.settings.riskPerTrade = riskPerTrade;

        await model.save();

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings: model.settings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current positions
// @route   GET /api/auto-trading/positions
// @access  Private
exports.getCurrentPositions = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.status(404).json({ message: 'No trading model found' });
        }

        // Get current market prices
        const marketData = await marketDataService.getMarketData();
        const currentPrices = {};
        marketData.forEach(coin => {
            currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
        });

        // Enrich positions with current data
        const enrichedPositions = model.currentPositions.map(position => {
            const currentPrice = currentPrices[position.symbol.toLowerCase()] || position.entryPrice;
            const currentValue = position.quantity * currentPrice;
            const profitLoss = currentValue - position.currentValue;
            const profitLossPercentage = (profitLoss / position.currentValue) * 100;

            return {
                ...position.toObject(),
                currentPrice: currentPrice,
                currentValue: currentValue,
                profitLoss: profitLoss,
                profitLossPercentage: profitLossPercentage
            };
        });

        const totalCurrentValue = enrichedPositions.reduce((sum, p) => sum + p.currentValue, 0);
        const totalProfitLoss = totalCurrentValue - model.investmentAmount;

        res.json({
            success: true,
            positions: enrichedPositions,
            summary: {
                totalPositions: enrichedPositions.length,
                investmentAmount: model.investmentAmount,
                currentValue: totalCurrentValue,
                totalProfitLoss: totalProfitLoss,
                totalProfitLossPercentage: (totalProfitLoss / model.investmentAmount) * 100
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manual close all positions (emergency)
// @route   POST /api/auto-trading/close-all
// @access  Private
exports.closeAllPositions = async (req, res) => {
    try {
        const model = await AutoTradingModel.findOne({ user: req.user._id });

        if (!model) {
            return res.status(404).json({ message: 'No trading model found' });
        }

        if (model.currentPositions.length === 0) {
            return res.json({
                success: true,
                message: 'No open positions to close'
            });
        }

        // This would trigger the trading scheduler to close positions
        // For now, we'll just clear the positions
        const tradingScheduler = require('../services/tradingScheduler');
        await tradingScheduler.executeSellOrders(model);

        res.json({
            success: true,
            message: 'All positions closed successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;
