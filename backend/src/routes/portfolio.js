const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');
const { transactionValidation } = require('../middleware/validation');
const { transactionLimiter } = require('../middleware/rateLimiter');

// Get current portfolio
router.get('/', protect, async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user._id }).sort({ symbol: 1 });
        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get transaction history
router.get('/history', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Execute transaction (Buy/Sell)
router.post('/transaction', protect, transactionLimiter, transactionValidation, async (req, res) => {
    const { type, symbol, quantity, price } = req.body;
    const total = quantity * price;

    try {
        // Record the transaction
        const transaction = new Transaction({
            user: req.user._id,
            type,
            symbol,
            quantity,
            price,
            total
        });
        await transaction.save();

        // Update Portfolio
        let asset = await Portfolio.findOne({ user: req.user._id, symbol });

        if (type === 'buy') {
            if (asset) {
                // Calculate new average price
                const totalCost = (asset.averageBuyPrice * asset.quantity) + total;
                const newQuantity = asset.quantity + quantity;
                asset.averageBuyPrice = totalCost / newQuantity;
                asset.quantity = newQuantity;
                asset.totalInvested += total;
            } else {
                asset = new Portfolio({
                    user: req.user._id,
                    symbol,
                    quantity,
                    averageBuyPrice: price,
                    totalInvested: total
                });
            }
            await asset.save();
        } else if (type === 'sell') {
            if (!asset || asset.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient holdings' });
            }
            asset.quantity -= quantity;
            if (asset.quantity === 0) {
                asset.totalInvested = 0;
                // We could remove the doc, but keeping it with 0 qty is fine too.
                // For cleanliness, let's remove if 0 to clean up DB? 
                // Actually keeping it is better to avoid "not found" logic errors later.
            }
            await asset.save();
        }

        res.status(201).json({ transaction, portfolio: asset });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
