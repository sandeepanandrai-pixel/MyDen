const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Registration validation rules
const registerValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10,15}$/).withMessage('Phone number must be 10-15 digits'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),

    validate
];

// Login validation rules
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

// Transaction validation rules
const transactionValidation = [
    body('type')
        .notEmpty().withMessage('Transaction type is required')
        .isIn(['buy', 'sell']).withMessage('Type must be either buy or sell'),

    body('symbol')
        .trim()
        .notEmpty().withMessage('Symbol is required')
        .isLength({ min: 1, max: 10 }).withMessage('Symbol must be 1-10 characters')
        .toUpperCase(),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isFloat({ min: 0.00000001, max: 1000000 }).withMessage('Quantity must be a positive number')
        .toFloat(),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0.01, max: 10000000 }).withMessage('Price must be a positive number')
        .toFloat(),

    validate
];

// Watchlist validation
const watchlistValidation = [
    body('symbol')
        .trim()
        .notEmpty().withMessage('Symbol is required')
        .isLength({ min: 1, max: 10 }).withMessage('Symbol must be 1-10 characters')
        .toUpperCase(),

    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    transactionValidation,
    watchlistValidation
};
