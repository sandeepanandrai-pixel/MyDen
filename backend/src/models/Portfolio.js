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
    totalInvested: { type: Number, required: true }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
