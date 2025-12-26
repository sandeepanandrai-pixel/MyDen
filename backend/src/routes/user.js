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
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Basic Information
        if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
        if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
        if (req.body.phone !== undefined) user.phone = req.body.phone;

        // Profile Information
        if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;
        if (req.body.bio !== undefined) user.bio = req.body.bio;
        if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
        if (req.body.country !== undefined) user.country = req.body.country;
        if (req.body.timezone !== undefined) user.timezone = req.body.timezone;
        if (req.body.currency !== undefined) user.currency = req.body.currency;

        // Preferences (nested object)
        if (req.body.preferences) {
            if (req.body.preferences.riskTolerance !== undefined) {
                user.preferences.riskTolerance = req.body.preferences.riskTolerance;
            }
            if (req.body.preferences.defaultChart !== undefined) {
                user.preferences.defaultChart = req.body.preferences.defaultChart;
            }
            if (req.body.preferences.theme !== undefined) {
                user.preferences.theme = req.body.preferences.theme;
            }
            if (req.body.preferences.language !== undefined) {
                user.preferences.language = req.body.preferences.language;
            }
            if (req.body.preferences.dashboardLayout !== undefined) {
                user.preferences.dashboardLayout = req.body.preferences.dashboardLayout;
            }
        }

        // Notification Settings (nested object)
        if (req.body.notifications) {
            if (req.body.notifications.email !== undefined) {
                user.notifications.email = req.body.notifications.email;
            }
            if (req.body.notifications.push !== undefined) {
                user.notifications.push = req.body.notifications.push;
            }
            if (req.body.notifications.priceAlerts !== undefined) {
                user.notifications.priceAlerts = req.body.notifications.priceAlerts;
            }
            if (req.body.notifications.portfolioUpdates !== undefined) {
                user.notifications.portfolioUpdates = req.body.notifications.portfolioUpdates;
            }
            if (req.body.notifications.marketNews !== undefined) {
                user.notifications.marketNews = req.body.notifications.marketNews;
            }
            if (req.body.notifications.weeklyReport !== undefined) {
                user.notifications.weeklyReport = req.body.notifications.weeklyReport;
            }
        }

        // Privacy Settings (nested object)
        if (req.body.privacy) {
            if (req.body.privacy.showPortfolio !== undefined) {
                user.privacy.showPortfolio = req.body.privacy.showPortfolio;
            }
            if (req.body.privacy.showInLeaderboard !== undefined) {
                user.privacy.showInLeaderboard = req.body.privacy.showInLeaderboard;
            }
            if (req.body.privacy.allowSocialSharing !== undefined) {
                user.privacy.allowSocialSharing = req.body.privacy.allowSocialSharing;
            }
        }

        // Update timestamp
        user.updatedAt = Date.now();

        const updatedUser = await user.save();

        // Return sanitized user data (exclude sensitive fields)
        const userResponse = {
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            bio: updatedUser.bio,
            dateOfBirth: updatedUser.dateOfBirth,
            country: updatedUser.country,
            timezone: updatedUser.timezone,
            currency: updatedUser.currency,
            preferences: updatedUser.preferences,
            notifications: updatedUser.notifications,
            privacy: updatedUser.privacy,
            watchlist: updatedUser.watchlist,
            isPremium: updatedUser.isPremium,
            premiumExpiresAt: updatedUser.premiumExpiresAt,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.json({
            message: 'Profile updated successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
