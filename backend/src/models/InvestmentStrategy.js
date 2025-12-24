const mongoose = require('mongoose');

const investmentStrategySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['conservative', 'moderate', 'aggressive'],
        required: true
    },
    allocation: {
        type: Map,
        of: Number,
        required: true
        // Example: { 'bitcoin': 40, 'ethereum': 30, 'stablecoins': 20, 'altcoins': 10 }
    },
    marketConditions: [{
        type: String,
        enum: ['bull', 'bear', 'sideways', 'volatile', 'all']
    }],
    targetReturn: {
        type: Number, // Expected annual return %
        default: 0
    },
    maxDrawdown: {
        type: Number, // Maximum expected loss %
        default: 0
    },
    rebalanceFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly'],
        default: 'monthly'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to validate allocation totals 100%
investmentStrategySchema.methods.validateAllocation = function () {
    let total = 0;
    for (let [key, value] of this.allocation) {
        total += value;
    }
    return Math.abs(total - 100) < 0.01; // Allow for floating point errors
};

module.exports = mongoose.model('InvestmentStrategy', investmentStrategySchema);
