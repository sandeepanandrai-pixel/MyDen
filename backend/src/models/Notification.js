const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Notification Content
    type: {
        type: String,
        enum: [
            'alert',           // Price alerts
            'system',          // System messages
            'achievement',     // Gamification achievements
            'trade',           // Transaction confirmations
            'portfolio',       // Portfolio updates
            'security',        // Security notifications
            'promotion',       // Marketing/promotions
            'news'            // Market news
        ],
        required: true
    },

    title: {
        type: String,
        required: true,
        maxlength: 100
    },

    message: {
        type: String,
        required: true,
        maxlength: 500
    },

    // Additional Data
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }, // Store related data (e.g., alert ID, transaction ID, etc.)

    // Notification State
    read: {
        type: Boolean,
        default: false
    },
    readAt: { type: Date },

    // Action
    actionUrl: {
        type: String,
        default: ''
    }, // URL to navigate when clicked
    actionLabel: {
        type: String,
        default: 'View'
    },

    // Visual Properties
    icon: {
        type: String,
        default: 'bell'
    }, // Icon name or emoji
    color: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },

    // Priority & Display
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    persistent: {
        type: Boolean,
        default: false
    }, // Don't auto-dismiss

    // Delivery Status
    sent: {
        type: Boolean,
        default: false
    },
    sentAt: { type: Date },

    deliveryChannels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
    },

    // Timestamps
    expiresAt: { type: Date }, // Auto-delete old notifications
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function () {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to mark multiple as read
NotificationSchema.statics.markMultipleAsRead = function (userId, notificationIds) {
    return this.updateMany(
        {
            user: userId,
            _id: { $in: notificationIds }
        },
        {
            read: true,
            readAt: new Date()
        }
    );
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = function (userId) {
    return this.countDocuments({ user: userId, read: false });
};

// Static method to delete old read notifications
NotificationSchema.statics.cleanupOldNotifications = function (daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return this.deleteMany({
        read: true,
        createdAt: { $lt: cutoffDate }
    });
};

module.exports = mongoose.model('Notification', NotificationSchema);
