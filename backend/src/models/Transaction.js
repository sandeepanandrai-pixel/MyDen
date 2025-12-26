const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },

    // Additional Transaction Details
    fees: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    source: {
        type: String,
        enum: ['manual', 'api', 'auto-rebalance', 'quick-trade'],
        default: 'manual'
    },

    date: { type: Date, default: Date.now }
});

// Indexes for performance
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, symbol: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
