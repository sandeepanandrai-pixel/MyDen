const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { watchlistValidation } = require('../middleware/validation');

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
router.post('/watchlist', protect, watchlistValidation, async (req, res) => {
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

// @desc    Get user profile
// @route   GET /api/user/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;

        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
```
