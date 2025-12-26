const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Basic Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Profile Information
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    dateOfBirth: { type: Date },
    country: { type: String, default: '' },
    timezone: { type: String, default: 'America/New_York' },
    currency: { type: String, default: 'USD' },

    // User Preferences
    preferences: {
        riskTolerance: {
            type: String,
            enum: ['conservative', 'moderate', 'aggressive'],
            default: 'moderate'
        },
        defaultChart: { type: String, default: '7d' },
        theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'dark' },
        language: { type: String, default: 'en' },
        dashboardLayout: { type: String, default: 'default' }
    },

    // Notification Settings
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        priceAlerts: { type: Boolean, default: true },
        portfolioUpdates: { type: Boolean, default: true },
        marketNews: { type: Boolean, default: false },
        weeklyReport: { type: Boolean, default: true }
    },

    // Privacy Settings
    privacy: {
        showPortfolio: { type: Boolean, default: false },
        showInLeaderboard: { type: Boolean, default: true },
        allowSocialSharing: { type: Boolean, default: false }
    },

    // Security & Verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // App Features
    watchlist: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },

    // Activity Tracking
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isPremium: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
