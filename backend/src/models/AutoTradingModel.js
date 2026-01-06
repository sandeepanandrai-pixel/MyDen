const mongoose = require('mongoose');

const autoTradingModelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modelType: {
        type: String,
        enum: ['conservative', 'balanced', 'growth', 'aggressive', 'daytrader'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    investmentAmount: {
        type: Number,
        required: true,
        min: 0
    },
    currentPositions: [{
        symbol: String,
        quantity: Number,
        entryPrice: Number,
        entryTime: Date,
        currentValue: Number
    }],
    dailyStats: {
        tradesExecuted: { type: Number, default: 0 },
        profitLoss: { type: Number, default: 0 },
        profitLossPercentage: { type: Number, default: 0 },
        lastTradeDate: Date
    },
    totalStats: {
        totalTrades: { type: Number, default: 0 },
        winningTrades: { type: Number, default: 0 },
        losingTrades: { type: Number, default: 0 },
        totalProfit: { type: Number, default: 0 },
        totalLoss: { type: Number, default: 0 },
        winRate: { type: Number, default: 0 },
        averageReturn: { type: Number, default: 0 }
    },
    settings: {
        stopLoss: { type: Number, default: 5 }, // Percentage
        takeProfit: { type: Number, default: 10 }, // Percentage
        maxPositions: { type: Number, default: 5 },
        riskPerTrade: { type: Number, default: 20 } // Percentage of total investment
    },
    schedule: {
        marketOpenTime: { type: String, default: '09:30' }, // EST
        marketCloseTime: { type: String, default: '16:00' }, // EST
        timezone: { type: String, default: 'America/New_York' }
    },
    lastExecutionLog: {
        openTrade: {
            timestamp: Date,
            success: Boolean,
            message: String,
            positions: Array
        },
        closeTrade: {
            timestamp: Date,
            success: Boolean,
            message: String,
            profitLoss: Number
        }
    }
}, {
    timestamps: true
});

// Model configurations - Stock Market Focus
autoTradingModelSchema.statics.MODEL_CONFIGS = {
    conservative: {
        name: 'Blue Chip Dividend',
        description: 'Low-risk strategy focusing on stable dividend-paying blue-chip stocks and bonds',
        riskLevel: 'Low',
        expectedReturn: '6-12% annually',
        allocation: {
            'SPY': 30,      // S&P 500 ETF
            'AAPL': 15,     // Apple
            'MSFT': 15,     // Microsoft
            'JNJ': 10,      // Johnson & Johnson
            'PG': 10,       // Procter & Gamble
            'KO': 10,       // Coca-Cola
            'TLT': 10       // 20+ Year Treasury Bond ETF
        },
        tradingStyle: 'Buy quality stocks at market open, sell at close',
        icon: '🛡️',
        color: '#10b981',
        marketType: 'stocks'
    },
    balanced: {
        name: 'Balanced Growth & Income',
        description: 'Medium-risk strategy with mix of growth stocks, value stocks, and ETFs',
        riskLevel: 'Medium',
        expectedReturn: '12-18% annually',
        allocation: {
            'QQQ': 25,      // Nasdaq 100 ETF
            'SPY': 20,      // S&P 500 ETF
            'GOOGL': 15,    // Alphabet
            'AMZN': 15,     // Amazon
            'V': 10,        // Visa
            'JPM': 10,      // JPMorgan Chase
            'IWM': 5        // Russell 2000 Small Cap ETF
        },
        tradingStyle: 'Swing trading with trend following on major indices',
        icon: '⚖️',
        color: '#3b82f6',
        marketType: 'stocks'
    },
    growth: {
        name: 'Tech Growth Momentum',
        description: 'Higher-risk strategy targeting high-growth technology and innovation stocks',
        riskLevel: 'Medium-High',
        expectedReturn: '18-30% annually',
        allocation: {
            'NVDA': 20,     // NVIDIA
            'TSLA': 15,     // Tesla
            'META': 15,     // Meta
            'NFLX': 12,     // Netflix
            'AMD': 12,      // AMD
            'SHOP': 10,     // Shopify
            'SQ': 8,        // Block (Square)
            'ARKK': 8       // ARK Innovation ETF
        },
        tradingStyle: 'Active momentum trading on growth stocks',
        icon: '📈',
        color: '#8b5cf6',
        marketType: 'stocks'
    },
    aggressive: {
        name: 'High Volatility Trader',
        description: 'High-risk strategy focusing on volatile stocks with strong intraday movements',
        riskLevel: 'High',
        expectedReturn: '30-60% annually (high volatility)',
        allocation: {
            'TQQQ': 25,     // 3x Leveraged Nasdaq ETF
            'TSLA': 20,     // Tesla
            'NVDA': 15,     // NVIDIA
            'AMD': 12,      // AMD
            'COIN': 10,     // Coinbase
            'MSTR': 10,     // MicroStrategy
            'PLTR': 8       // Palantir
        },
        tradingStyle: 'Aggressive day trading on high-beta stocks',
        icon: '🚀',
        color: '#ef4444',
        marketType: 'stocks'
    },
    daytrader: {
        name: 'Professional Day Trader',
        description: 'Maximum risk strategy for experienced traders using leveraged ETFs and volatile stocks',
        riskLevel: 'Very High',
        expectedReturn: '50-100%+ annually (extreme volatility)',
        allocation: {
            'TQQQ': 20,     // 3x Leveraged Nasdaq
            'SQQQ': 15,     // 3x Inverse Nasdaq (for hedging)
            'TSLA': 15,     // Tesla
            'SPY': 12,      // S&P 500 (for stability)
            'NVDA': 12,     // NVIDIA
            'AMD': 10,      // AMD
            'AAPL': 8,      // Apple
            'AMZN': 8       // Amazon
        },
        tradingStyle: 'Pure day trading - all positions closed at market close',
        icon: '⚡',
        color: '#f59e0b',
        marketType: 'stocks'
    }
};

// Method to get model configuration
autoTradingModelSchema.methods.getConfig = function () {
    return this.constructor.MODEL_CONFIGS[this.modelType];
};

// Method to calculate current portfolio value
autoTradingModelSchema.methods.calculateCurrentValue = function (currentPrices) {
    let totalValue = 0;
    this.currentPositions.forEach(position => {
        const currentPrice = currentPrices[position.symbol.toLowerCase()];
        if (currentPrice) {
            totalValue += position.quantity * currentPrice;
        }
    });
    return totalValue;
};

// Method to update statistics
autoTradingModelSchema.methods.updateStats = function (profitLoss, isWin) {
    this.totalStats.totalTrades += 1;
    if (isWin) {
        this.totalStats.winningTrades += 1;
        this.totalStats.totalProfit += profitLoss;
    } else {
        this.totalStats.losingTrades += 1;
        this.totalStats.totalLoss += Math.abs(profitLoss);
    }
    this.totalStats.winRate = (this.totalStats.winningTrades / this.totalStats.totalTrades) * 100;
    this.totalStats.averageReturn = ((this.totalStats.totalProfit - this.totalStats.totalLoss) / this.totalStats.totalTrades);
};

module.exports = mongoose.model('AutoTradingModel', autoTradingModelSchema);
