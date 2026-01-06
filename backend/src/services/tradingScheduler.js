const cron = require('node-cron');
const AutoTradingModel = require('../models/AutoTradingModel');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const marketDataService = require('./marketData');

class TradingScheduler {
    constructor() {
        this.jobs = new Map();
        this.isInitialized = false;
    }

    // Initialize scheduler
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️  Trading scheduler already initialized');
            return;
        }

        console.log('🤖 Initializing Auto Trading Scheduler...');

        // Schedule market open trades (9:30 AM EST)
        this.jobs.set('marketOpen', cron.schedule('30 9 * * 1-5', async () => {
            console.log('📈 Market Open - Executing buy orders...');
            await this.executeMarketOpenTrades();
        }, {
            timezone: 'America/New_York'
        }));

        // Schedule market close trades (4:00 PM EST)
        this.jobs.set('marketClose', cron.schedule('0 16 * * 1-5', async () => {
            console.log('📉 Market Close - Executing sell orders...');
            await this.executeMarketCloseTrades();
        }, {
            timezone: 'America/New_York'
        }));

        // Schedule mid-day check (12:00 PM EST) for stop-loss/take-profit
        this.jobs.set('midDayCheck', cron.schedule('0 12 * * 1-5', async () => {
            console.log('🔍 Mid-day check - Monitoring positions...');
            await this.checkStopLossAndTakeProfit();
        }, {
            timezone: 'America/New_York'
        }));

        this.isInitialized = true;
        console.log('✅ Trading scheduler initialized successfully');
    }

    // Execute trades at market open
    async executeMarketOpenTrades() {
        try {
            const activeModels = await AutoTradingModel.find({ isActive: true });
            console.log(`Found ${activeModels.length} active trading models`);

            for (const model of activeModels) {
                try {
                    await this.executeBuyOrders(model);
                } catch (error) {
                    console.error(`Error executing buy orders for model ${model._id}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in executeMarketOpenTrades:', error);
        }
    }

    // Execute trades at market close
    async executeMarketCloseTrades() {
        try {
            const activeModels = await AutoTradingModel.find({ isActive: true });
            console.log(`Found ${activeModels.length} active trading models`);

            for (const model of activeModels) {
                try {
                    await this.executeSellOrders(model);
                } catch (error) {
                    console.error(`Error executing sell orders for model ${model._id}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in executeMarketCloseTrades:', error);
        }
    }

    // Execute buy orders based on model allocation
    async executeBuyOrders(model) {
        try {
            const config = model.getConfig();
            const marketData = await marketDataService.getMarketData();

            // Create price map
            const currentPrices = {};
            marketData.forEach(coin => {
                currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
            });

            const positions = [];
            const allocation = config.allocation;

            // Calculate how much to invest in each asset
            for (const [symbol, percentage] of Object.entries(allocation)) {
                if (symbol === 'usdt' || symbol === 'usdc') {
                    // Skip stablecoins for buying
                    continue;
                }

                const investAmount = (model.investmentAmount * percentage) / 100;
                const currentPrice = currentPrices[symbol];

                if (!currentPrice) {
                    console.warn(`Price not found for ${symbol}`);
                    continue;
                }

                const quantity = investAmount / currentPrice;

                positions.push({
                    symbol: symbol,
                    quantity: quantity,
                    entryPrice: currentPrice,
                    entryTime: new Date(),
                    currentValue: investAmount
                });

                // Create transaction record
                await Transaction.create({
                    user: model.user,
                    type: 'buy',
                    symbol: symbol,
                    quantity: quantity,
                    price: currentPrice,
                    total: investAmount,
                    date: new Date(),
                    notes: `Auto-trade: ${config.name} model`
                });

                // Update portfolio
                await this.updatePortfolio(model.user, symbol, quantity, currentPrice, 'buy');
            }

            // Update model with positions
            model.currentPositions = positions;
            model.dailyStats.tradesExecuted += positions.length;
            model.dailyStats.lastTradeDate = new Date();
            model.lastExecutionLog.openTrade = {
                timestamp: new Date(),
                success: true,
                message: `Executed ${positions.length} buy orders`,
                positions: positions
            };

            await model.save();

            console.log(`✅ Executed ${positions.length} buy orders for ${config.name} model`);
        } catch (error) {
            console.error('Error in executeBuyOrders:', error);
            model.lastExecutionLog.openTrade = {
                timestamp: new Date(),
                success: false,
                message: error.message
            };
            await model.save();
        }
    }

    // Execute sell orders - close all positions
    async executeSellOrders(model) {
        try {
            if (model.currentPositions.length === 0) {
                console.log(`No positions to close for model ${model._id}`);
                return;
            }

            const marketData = await marketDataService.getMarketData();
            const currentPrices = {};
            marketData.forEach(coin => {
                currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
            });

            let totalProfitLoss = 0;
            let totalExitValue = 0;

            for (const position of model.currentPositions) {
                const currentPrice = currentPrices[position.symbol.toLowerCase()];

                if (!currentPrice) {
                    console.warn(`Price not found for ${position.symbol}`);
                    continue;
                }

                const exitValue = position.quantity * currentPrice;
                const profitLoss = exitValue - position.currentValue;
                totalProfitLoss += profitLoss;
                totalExitValue += exitValue;

                // Create sell transaction
                await Transaction.create({
                    user: model.user,
                    type: 'sell',
                    symbol: position.symbol,
                    quantity: position.quantity,
                    price: currentPrice,
                    total: exitValue,
                    date: new Date(),
                    notes: `Auto-trade close: P/L ${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}`
                });

                // Update portfolio
                await this.updatePortfolio(model.user, position.symbol, position.quantity, currentPrice, 'sell');
            }

            // Update statistics
            const profitLossPercentage = (totalProfitLoss / model.investmentAmount) * 100;
            model.updateStats(totalProfitLoss, totalProfitLoss > 0);

            model.dailyStats.profitLoss = totalProfitLoss;
            model.dailyStats.profitLossPercentage = profitLossPercentage;
            model.currentPositions = []; // Clear all positions
            model.lastExecutionLog.closeTrade = {
                timestamp: new Date(),
                success: true,
                message: `Closed ${model.currentPositions.length} positions`,
                profitLoss: totalProfitLoss
            };

            await model.save();

            console.log(`✅ Closed all positions for model ${model._id}. P/L: ${totalProfitLoss.toFixed(2)} (${profitLossPercentage.toFixed(2)}%)`);
        } catch (error) {
            console.error('Error in executeSellOrders:', error);
            model.lastExecutionLog.closeTrade = {
                timestamp: new Date(),
                success: false,
                message: error.message
            };
            await model.save();
        }
    }

    // Check stop-loss and take-profit levels
    async checkStopLossAndTakeProfit() {
        try {
            const activeModels = await AutoTradingModel.find({
                isActive: true,
                'currentPositions.0': { $exists: true } // Has positions
            });

            const marketData = await marketDataService.getMarketData();
            const currentPrices = {};
            marketData.forEach(coin => {
                currentPrices[coin.symbol.toLowerCase()] = coin.current_price;
            });

            for (const model of activeModels) {
                for (const position of model.currentPositions) {
                    const currentPrice = currentPrices[position.symbol.toLowerCase()];
                    if (!currentPrice) continue;

                    const priceChange = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

                    // Check stop-loss
                    if (priceChange <= -model.settings.stopLoss) {
                        console.log(`🛑 Stop-loss triggered for ${position.symbol} at ${priceChange.toFixed(2)}%`);
                        await this.closePosition(model, position, currentPrice, 'stop-loss');
                    }

                    // Check take-profit
                    if (priceChange >= model.settings.takeProfit) {
                        console.log(`🎯 Take-profit triggered for ${position.symbol} at ${priceChange.toFixed(2)}%`);
                        await this.closePosition(model, position, currentPrice, 'take-profit');
                    }
                }
            }
        } catch (error) {
            console.error('Error in checkStopLossAndTakeProfit:', error);
        }
    }

    // Close individual position
    async closePosition(model, position, currentPrice, reason) {
        try {
            const exitValue = position.quantity * currentPrice;
            const profitLoss = exitValue - position.currentValue;

            // Create sell transaction
            await Transaction.create({
                user: model.user,
                type: 'sell',
                symbol: position.symbol,
                quantity: position.quantity,
                price: currentPrice,
                total: exitValue,
                date: new Date(),
                notes: `Auto-trade ${reason}: P/L ${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}`
            });

            // Update portfolio
            await this.updatePortfolio(model.user, position.symbol, position.quantity, currentPrice, 'sell');

            // Remove position from model
            model.currentPositions = model.currentPositions.filter(p => p.symbol !== position.symbol);
            model.dailyStats.profitLoss += profitLoss;

            await model.save();

            console.log(`✅ Closed position ${position.symbol} due to ${reason}. P/L: ${profitLoss.toFixed(2)}`);
        } catch (error) {
            console.error('Error closing position:', error);
        }
    }

    // Update user's portfolio
    async updatePortfolio(userId, symbol, quantity, price, type) {
        try {
            let portfolio = await Portfolio.findOne({ user: userId, symbol: symbol.toUpperCase() });

            if (type === 'buy') {
                if (portfolio) {
                    portfolio.quantity += quantity;
                    portfolio.averagePrice = ((portfolio.averagePrice * (portfolio.quantity - quantity)) + (price * quantity)) / portfolio.quantity;
                } else {
                    portfolio = new Portfolio({
                        user: userId,
                        symbol: symbol.toUpperCase(),
                        quantity: quantity,
                        averagePrice: price
                    });
                }
                await portfolio.save();
            } else if (type === 'sell') {
                if (portfolio) {
                    portfolio.quantity -= quantity;
                    if (portfolio.quantity <= 0.00001) {
                        await Portfolio.deleteOne({ _id: portfolio._id });
                    } else {
                        await portfolio.save();
                    }
                }
            }
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    }

    // Stop all scheduled jobs
    stop() {
        this.jobs.forEach((job, name) => {
            job.stop();
            console.log(`Stopped job: ${name}`);
        });
        this.isInitialized = false;
    }

    // Get scheduler status
    getStatus() {
        return {
            initialized: this.isInitialized,
            activeJobs: Array.from(this.jobs.keys())
        };
    }
}

// Export singleton instance
module.exports = new TradingScheduler();
