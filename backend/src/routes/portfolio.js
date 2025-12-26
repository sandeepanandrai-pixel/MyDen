const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { transactionValidation } = require('../middleware/enhancedValidation');
const { transactionLimiter } = require('../middleware/rateLimiter');
const { sendTransactionEmail } = require('../utils/emailService');

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

// Execute transaction (Buy/Sell) with enhanced validation
router.post('/transaction', protect, transactionLimiter, transactionValidation, async (req, res) => {
    const { type, symbol, quantity, price } = req.body;
    const total = quantity * price;

    try {
        // For sell transactions, check if user has sufficient holdings
        if (type === 'sell') {
            const asset = await Portfolio.findOne({ user: req.user._id, symbol });
            if (!asset || asset.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient ${symbol} holdings. You have ${asset ? asset.quantity : 0}, trying to sell ${quantity}`
                });
            }
        }

        // Record the transaction
        const transaction = new Transaction({
            user: req.user._id,
            type,
            symbol,
            quantity,
            price,
            total,
            fees: req.body.fees || 0,
            notes: req.body.notes || '',
            source: 'manual'
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
            asset.quantity -= quantity;
            const soldValue = quantity * asset.averageBuyPrice;
            asset.totalInvested -= soldValue;

            if (asset.quantity === 0) {
                // Remove asset if quantity is 0
                await Portfolio.findByIdAndDelete(asset._id);
                asset = null;
            } else {
                await asset.save();
            }
        }

        // Send transaction confirmation email
        try {
            const user = await User.findById(req.user._id);
            if (user && user.isEmailVerified && user.notifications.email) {
                await sendTransactionEmail(
                    user.email,
                    user.firstName,
                    transaction.toObject()
                );
            }
        } catch (emailError) {
            console.error('Failed to send transaction email:', emailError);
            // Don't fail the transaction if email fails
        }

        res.status(201).json({
            success: true,
            message: `Successfully ${type === 'buy' ? 'purchased' : 'sold'} ${quantity} ${symbol}. Confirmation email sent!`,
            transaction,
            portfolio: asset
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
