const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    averageBuyPrice: { type: Number, required: true },
    totalInvested: { type: Number, required: true },

    // Current Market Data (cached)
    currentPrice: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 }, // quantity * currentPrice

    // Profit/Loss Metrics
    profitLoss: { type: Number, default: 0 }, // currentValue - totalInvested
    profitLossPercent: { type: Number, default: 0 },

    // Timestamps
    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
PortfolioSchema.index({ user: 1, symbol: 1 });
PortfolioSchema.index({ user: 1, currentValue: -1 });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
