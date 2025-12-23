const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
});

// Transaction rate limiter
const transactionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit to 10 transactions per minute
    message: {
        success: false,
        message: 'Too many transactions, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    transactionLimiter
};
