const mongoose = require('mongoose');

const PriceAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true
    },
    name: {
        type: String,
        default: ''
    }, // e.g., "Bitcoin Price Alert"

    // Alert Configuration
    targetPrice: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['above', 'below', 'crosses_above', 'crosses_below'],
        required: true
    },

    // Alert Type (for Smart Alerts)
    alertType: {
        type: String,
        enum: ['price', 'percentage_change', 'volume', 'market_cap'],
        default: 'price'
    },

    // For percentage change alerts
    percentageThreshold: { type: Number }, // e.g., 5 for 5% change
    timeframe: {
        type: String,
        enum: ['1h', '24h', '7d', '30d'],
        default: '24h'
    },

    // Notification Settings
    notificationMethod: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
    },

    // Alert Status
    isActive: {
        type: Boolean,
        default: true
    },
    triggered: {
        type: Boolean,
        default: false
    },
    triggeredAt: { type: Date },
    triggeredPrice: { type: Number },

    // Recurrence
    recurring: {
        type: Boolean,
        default: false
    }, // Reset after triggering
    triggerCount: {
        type: Number,
        default: 0
    },

    // Metadata
    note: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
PriceAlertSchema.index({ user: 1, isActive: 1 });
PriceAlertSchema.index({ user: 1, triggered: 1 });
PriceAlertSchema.index({ symbol: 1, isActive: 1 });
PriceAlertSchema.index({ triggeredAt: -1 });

// Update timestamp before saving
PriceAlertSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Instance method to check if alert should trigger
PriceAlertSchema.methods.shouldTrigger = function (currentPrice) {
    if (!this.isActive || this.triggered) return false;

    switch (this.condition) {
        case 'above':
            return currentPrice > this.targetPrice;
        case 'below':
            return currentPrice < this.targetPrice;
        case 'crosses_above':
            // Would need previous price to implement properly
            return currentPrice > this.targetPrice;
        case 'crosses_below':
            // Would need previous price to implement properly
            return currentPrice < this.targetPrice;
        default:
            return false;
    }
};

// Instance method to trigger the alert
PriceAlertSchema.methods.trigger = function (currentPrice) {
    this.triggered = true;
    this.triggeredAt = new Date();
    this.triggeredPrice = currentPrice;
    this.triggerCount += 1;

    // If recurring, reset for next trigger
    if (this.recurring) {
        this.triggered = false;
    } else {
        this.isActive = false;
    }

    return this.save();
};

module.exports = mongoose.model('PriceAlert', PriceAlertSchema);
