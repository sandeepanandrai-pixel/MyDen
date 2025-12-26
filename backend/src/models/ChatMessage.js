const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Conversation Grouping
    conversationId: {
        type: String,
        required: true,
        index: true
    },

    // Message Content
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },

    message: {
        type: String,
        required: true,
        maxlength: 2000
    },

    // AI Response (if role is 'assistant')
    response: {
        type: String,
        default: ''
    },

    // Context Data (for AI to make better recommendations)
    context: {
        portfolioValue: { type: Number },
        portfolioAssets: [{
            symbol: String,
            quantity: Number,
            value: Number
        }],
        marketCondition: { type: String },
        userRiskTolerance: { type: String },
        recentTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
    },

    // AI Metadata
    aiModel: {
        type: String,
        default: 'gpt-4'
    },

    tokens: {
        prompt: { type: Number, default: 0 },
        completion: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },

    responseTime: {
        type: Number,
        default: 0
    }, // milliseconds

    // Message Metadata
    intent: {
        type: String,
        enum: [
            'general_question',
            'portfolio_advice',
            'market_analysis',
            'transaction_help',
            'strategy_recommendation',
            'risk_assessment',
            'price_inquiry',
            'other'
        ]
    },

    suggestedActions: [{
        label: String,
        action: String,
        url: String
    }],

    // Feedback
    helpful: { type: Boolean },
    feedbackNote: { type: String },

    // Status
    isError: {
        type: Boolean,
        default: false
    },

    errorMessage: { type: String },

    // Timestamps
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
ChatMessageSchema.index({ user: 1, conversationId: 1, timestamp: -1 });
ChatMessageSchema.index({ user: 1, timestamp: -1 });
ChatMessageSchema.index({ conversationId: 1, timestamp: 1 });

// Static method to get conversation history
ChatMessageSchema.statics.getConversationHistory = function (userId, conversationId, limit = 50) {
    return this.find({
        user: userId,
        conversationId: conversationId
    })
        .sort({ timestamp: 1 })
        .limit(limit)
        .select('-context -tokens'); // Exclude large fields
};

// Static method to get recent conversations
ChatMessageSchema.statics.getRecentConversations = function (userId, limit = 10) {
    return this.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $sort: { timestamp: -1 } },
        {
            $group: {
                _id: '$conversationId',
                lastMessage: { $first: '$message' },
                lastTimestamp: { $first: '$timestamp' },
                messageCount: { $sum: 1 }
            }
        },
        { $sort: { lastTimestamp: -1 } },
        { $limit: limit }
    ]);
};

// Static method to create new conversation ID
ChatMessageSchema.statics.generateConversationId = function () {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Instance method to mark as helpful
ChatMessageSchema.methods.markAsHelpful = function (isHelpful, note = '') {
    this.helpful = isHelpful;
    this.feedbackNote = note;
    return this.save();
};

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
