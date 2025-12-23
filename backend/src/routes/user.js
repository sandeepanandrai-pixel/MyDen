const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user watchlist
// @route   GET /api/user/watchlist
router.get('/watchlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add to watchlist
// @route   POST /api/user/watchlist
router.post('/watchlist', protect, async (req, res) => {
    const { symbol } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user.watchlist.includes(symbol)) {
            user.watchlist.push(symbol);
            await user.save();
        }
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove from watchlist
// @route   DELETE /api/user/watchlist/:symbol
router.delete('/watchlist/:symbol', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchlist = user.watchlist.filter(s => s !== req.params.symbol);
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
