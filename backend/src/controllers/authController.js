const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Generate verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email: rawEmail, phone, password, role } = req.body;

    if (!rawEmail || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const email = rawEmail.toLowerCase().trim();

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Security: Prevent admin signup through public registration
        // Admin accounts must be created manually
        if (role === 'admin') {
            return res.status(403).json({
                message: 'Admin accounts cannot be created through signup. Please contact support.'
            });
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'user', // Force role to 'user' regardless of input
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });

        if (user) {
            // Send verification email
            const emailResult = await sendVerificationEmail(
                email,
                firstName,
                verificationToken
            );

            if (!emailResult.success) {
                console.error('Failed to send verification email:', emailResult.error);
            }

            res.status(201).json({
                message: 'Registration successful! Please check your email to verify your account.',
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified
                },
                // Don't send token yet - user needs to verify email first
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification link'
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.firstName);

        res.json({
            message: 'Email verified successfully! You can now log in.',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
    const { email: rawEmail } = req.body;

    if (!rawEmail) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const email = rawEmail.toLowerCase().trim();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        const emailResult = await sendVerificationEmail(
            email,
            user.firstName,
            verificationToken
        );

        if (!emailResult.success) {
            return res.status(500).json({
                message: 'Failed to send verification email'
            });
        }

        res.json({
            message: 'Verification email sent! Please check your inbox.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email: rawEmail, password } = req.body;

    if (!rawEmail || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const email = rawEmail.toLowerCase().trim();

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if email is verified
            if (!user.isEmailVerified) {
                return res.status(403).json({
                    message: 'Please verify your email before logging in. Check your inbox for the verification link.',
                    emailVerified: false,
                    email: user.email
                });
            }

            // Update last login
            user.lastLogin = new Date();
            user.loginCount = (user.loginCount || 0) + 1;
            await user.save();

            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isPremium: user.isPremium,
                preferences: user.preferences,
                notifications: user.notifications,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send Reset Link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email: rawEmail } = req.body;

    if (!rawEmail) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const email = rawEmail.toLowerCase().trim();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // For security, don't reveal if user exists
            return res.json({ message: 'If a user with this email exists, a password reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Send reset email
        // Require it here since it was added to exports
        const { sendPasswordResetEmail } = require('../utils/emailService');
        await sendPasswordResetEmail(user.email, user.firstName, resetToken);

        res.json({ message: 'If a user with this email exists, a password reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        // Set new password (will be hashed by model)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Auto-verify email if resetting password
        if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
        }

        await user.save();

        res.json({ message: 'Password reset successful! You can now log in with your new password.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
