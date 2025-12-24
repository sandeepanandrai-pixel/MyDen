const { body } = require('express-validator');

// Enhanced transaction validation with balance checks
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
        .isFloat({ min: 0.00000001, max: 1000000 }).withMessage('Quantity must be between 0.00000001 and 1,000,000')
        .toFloat()
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Quantity must be greater than 0');
            }
            return true;
        }),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0.01, max: 10000000 }).withMessage('Price must be between $0.01 and $10,000,000')
        .toFloat()
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Price must be greater than 0');
            }
            return true;
        }),

    // Custom validation for total amount
    body().custom((value, { req }) => {
        const { quantity, price } = req.body;
        const total = quantity * price;

        if (total > 100000) {
            throw new Error('Single transaction cannot exceed $100,000. Please contact support for larger trades.');
        }

        if (total < 1) {
            throw new Error('Transaction total must be at least $1');
        }

        return true;
    })
];

module.exports = {
    ...require('./validation'),
    transactionValidation
};
