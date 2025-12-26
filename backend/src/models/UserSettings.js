const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Trading Settings
    trading: {
        defaultOrderType: {
            type: String,
            enum: ['market', 'limit'],
            default: 'market'
        },
        confirmBeforeTrade: { type: Boolean, default: true },
        defaultSlippage: { type: Number, default: 0.5 }, // percentage
        autoRebalance: { type: Boolean, default: false },
        rebalanceThreshold: { type: Number, default: 10 }, // percentage deviation
        rebalanceFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'manual'],
            default: 'manual'
        }
    },

    // Display Settings
    display: {
        currency: { type: String, default: 'USD' },
        numberFormat: {
            type: String,
            enum: ['1,234.56', '1.234,56', '1 234.56'],
            default: '1,234.56'
        },
        dateFormat: {
            type: String,
            enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
            default: 'MM/DD/YYYY'
        },
        timeFormat: {
            type: String,
            enum: ['12h', '24h'],
            default: '12h'
        },
        chartType: {
            type: String,
            enum: ['candlestick', 'line', 'area'],
            default: 'candlestick'
        },
        showPortfolioValue: { type: Boolean, default: true },
        showProfitLoss: { type: Boolean, default: true },
        compactMode: { type: Boolean, default: false }
    },

    // Alert Preferences (specific alert configurations)
    alertPreferences: {
        priceAlerts: {
            enabled: { type: Boolean, default: true },
            soundEnabled: { type: Boolean, default: true },
            vibrationEnabled: { type: Boolean, default: true }
        },
        portfolioAlerts: {
            dailyThreshold: { type: Number, default: 5 }, // % change
            weeklyThreshold: { type: Number, default: 10 }
        },
        newsAlerts: {
            keywords: [{ type: String }],
            sources: [{ type: String }]
        }
    },

    // API Keys (encrypted)
    apiKeys: [{
        exchange: {
            type: String,
            enum: ['coinbase', 'binance', 'kraken', 'gemini', 'other']
        },
        label: { type: String },
        apiKey: { type: String }, // Should be encrypted in production
        apiSecret: { type: String }, // Should be encrypted in production
        isActive: { type: Boolean, default: true },
        permissions: [{ type: String }], // ['read', 'trade', 'withdraw']
        lastUsed: { type: Date },
        createdAt: { type: Date, default: Date.now }
    }],

    // AI Assistant Settings
    aiAssistant: {
        enabled: { type: Boolean, default: true },
        personality: {
            type: String,
            enum: ['professional', 'friendly', 'concise', 'detailed'],
            default: 'friendly'
        },
        contextAware: { type: Boolean, default: true }, // Use portfolio data
        suggestionLevel: {
            type: String,
            enum: ['minimal', 'moderate', 'aggressive'],
            default: 'moderate'
        }
    },

    // Privacy & Data
    privacy: {
        shareAnonymousData: { type: Boolean, default: true },
        allowAnalytics: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false },
        activityTracking: { type: Boolean, default: true }
    },

    // Advanced Features
    advanced: {
        developerMode: { type: Boolean, default: false },
        betaFeatures: { type: Boolean, default: false },
        debugMode: { type: Boolean, default: false }
    },

    // Backup & Export
    backup: {
        autoBackup: { type: Boolean, default: false },
        backupFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        lastBackup: { type: Date }
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index
UserSettingsSchema.index({ user: 1 });

// Update timestamp before saving
UserSettingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to get or create settings for user
UserSettingsSchema.statics.getOrCreate = async function (userId) {
    let settings = await this.findOne({ user: userId });

    if (!settings) {
        settings = await this.create({ user: userId });
    }

    return settings;
};

// Instance method to add API key
UserSettingsSchema.methods.addApiKey = function (exchangeData) {
    this.apiKeys.push({
        exchange: exchangeData.exchange,
        label: exchangeData.label,
        apiKey: exchangeData.apiKey, // TODO: Encrypt in production
        apiSecret: exchangeData.apiSecret, // TODO: Encrypt in production
        permissions: exchangeData.permissions || ['read']
    });

    return this.save();
};

// Instance method to remove API key
UserSettingsSchema.methods.removeApiKey = function (apiKeyId) {
    this.apiKeys = this.apiKeys.filter(
        key => key._id.toString() !== apiKeyId.toString()
    );

    return this.save();
};

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
