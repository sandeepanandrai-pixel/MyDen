const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    // Use Gmail or your preferred email service
    // For production, use services like SendGrid, AWS SES, or Mailgun
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
        }
    });
};

// Email templates
const emailTemplates = {
    // Email Verification Template
    verification: (userName, verificationLink) => ({
        subject: '✉️ Verify Your Email - MyDen Investment App',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Welcome to MyDen!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName},</h2>
                        <p>Thank you for signing up! We're excited to have you on board.</p>
                        <p>To get started, please verify your email address by clicking the button below:</p>
                        <center>
                            <a href="${verificationLink}" class="button">Verify Email Address</a>
                        </center>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="background: #e0e0e0; padding: 10px; border-radius: 5px; word-break: break-all;">
                            ${verificationLink}
                        </p>
                        <p><strong>This link will expire in 24 hours.</strong></p>
                        <p>If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 MyDen Investment App. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Hi ${userName},\n\nWelcome to MyDen! Please verify your email by visiting: ${verificationLink}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, ignore this email.`
    }),

    // Transaction Confirmation Template
    transaction: (userName, transaction) => {
        const isBuy = transaction.type === 'buy';
        const emoji = isBuy ? '📈' : '📉';
        const color = isBuy ? '#10b981' : '#ef4444';

        return {
            subject: `${emoji} Transaction ${isBuy ? 'Purchase' : 'Sale'} Confirmation - ${transaction.symbol}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: ${color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
                        .detail-label { font-weight: bold; color: #666; }
                        .detail-value { color: #333; }
                        .total { font-size: 24px; font-weight: bold; color: ${color}; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>${emoji} Transaction Confirmed</h1>
                            <p style="margin: 0;">${isBuy ? 'Purchase' : 'Sale'} Successful</p>
                        </div>
                        <div class="content">
                            <h2>Hi ${userName},</h2>
                            <p>Your ${transaction.type} transaction has been successfully processed.</p>
                            
                            <div class="details">
                                <h3>Transaction Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Transaction Type:</span>
                                    <span class="detail-value" style="color: ${color}; font-weight: bold; text-transform: uppercase;">${transaction.type}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Asset:</span>
                                    <span class="detail-value">${transaction.symbol}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Quantity:</span>
                                    <span class="detail-value">${transaction.quantity}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Price per Unit:</span>
                                    <span class="detail-value">$${transaction.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                ${transaction.fees ? `
                                <div class="detail-row">
                                    <span class="detail-label">Fees:</span>
                                    <span class="detail-value">$${transaction.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>` : ''}
                                <div class="detail-row">
                                    <span class="detail-label">Date:</span>
                                    <span class="detail-value">${new Date(transaction.date).toLocaleString()}</span>
                                </div>
                                <div class="detail-row" style="border: none; margin-top: 10px;">
                                    <span class="detail-label">Total Amount:</span>
                                    <span class="total">$${transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                ${transaction.notes ? `
                                <div class="detail-row" style="border-top: 1px solid #e0e0e0; padding-top: 10px;">
                                    <span class="detail-label">Notes:</span>
                                    <span class="detail-value">${transaction.notes}</span>
                                </div>` : ''}
                            </div>
                            
                            <p style="color: #666; font-size: 14px; margin-top: 20px;">
                                <strong>Transaction ID:</strong> ${transaction._id || 'Pending'}
                            </p>
                            
                            <p>You can view this transaction and your updated portfolio in your dashboard.</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 MyDen Investment App. All rights reserved.</p>
                            <p>This is an automated transaction confirmation. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Transaction Confirmed\n\nHi ${userName},\n\nYour ${transaction.type} transaction has been processed:\n\nAsset: ${transaction.symbol}\nQuantity: ${transaction.quantity}\nPrice: $${transaction.price}\nTotal: $${transaction.total}\nDate: ${new Date(transaction.date).toLocaleString()}\n\nTransaction ID: ${transaction._id || 'Pending'}\n\nThank you for using MyDen!`
        };
    },

    // Welcome Email (after verification)
    welcome: (userName) => ({
        subject: '🎉 Welcome to MyDen - Let\'s Get Started!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 You're All Set!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName},</h2>
                        <p>Your email has been verified and your account is now active!</p>
                        
                        <h3>Here's what you can do now:</h3>
                        <div class="feature">
                            <strong>📊 Build Your Portfolio</strong><br>
                            Start buying and selling cryptocurrencies
                        </div>
                        <div class="feature">
                            <strong>🔔 Set Price Alerts</strong><br>
                            Get notified when your target prices are hit
                        </div>
                        <div class="feature">
                            <strong>🤖 AI Strategy Advisor</strong><br>
                            Get personalized investment recommendations
                        </div>
                        <div class="feature">
                            <strong>📈 Track Performance</strong><br>
                            Monitor your portfolio with real-time analytics
                        </div>
                        
                        <p style="margin-top: 30px;">Ready to start your investment journey?</p>
                        <p><strong>Login now and explore!</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2024 MyDen Investment App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Welcome to MyDen!\n\nHi ${userName},\n\nYour account is now active! You can now:\n- Build your portfolio\n- Set price alerts\n- Get AI recommendations\n- Track performance\n\nLogin and start investing!`
    })
};

// Send email function
const sendEmail = async (to, template) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"MyDen Investment App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: template.subject,
            html: template.html,
            text: template.text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Public API
module.exports = {
    sendVerificationEmail: async (email, userName, verificationToken) => {
        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
        const template = emailTemplates.verification(userName, verificationLink);
        return await sendEmail(email, template);
    },

    sendTransactionEmail: async (email, userName, transaction) => {
        const template = emailTemplates.transaction(userName, transaction);
        return await sendEmail(email, template);
    },

    sendWelcomeEmail: async (email, userName) => {
        const template = emailTemplates.welcome(userName);
        return await sendEmail(email, template);
    }
};
