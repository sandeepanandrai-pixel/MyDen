/**
 * Create Admin User Script
 * 
 * This script allows you to manually create admin accounts.
 * Admin accounts CANNOT be created through the public signup form.
 * 
 * Usage:
 *   node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Import User model
const User = require('../src/models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Get admin details
        console.log('📝 Enter Admin User Details:\n');
        const firstName = await question('First Name: ');
        const lastName = await question('Last Name: ');
        const rawEmail = await question('Email: ');
        const email = rawEmail.toLowerCase().trim();
        const phone = await question('Phone (optional): ');
        const password = await question('Password: ');

        // Validate inputs
        if (!firstName || !lastName || !email || !password) {
            console.log('\n❌ Error: All fields except phone are required');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('\n❌ Error: User with this email already exists');
            process.exit(1);
        }

        // Create admin user
        console.log('\n🔐 Creating admin user...');
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone: phone || '+0000000000', // Default phone if empty (phone is required)
            password, // Will be hashed by the User model pre-save hook
            role: 'admin',
            isEmailVerified: true, // Auto-verify admin accounts
            isPremium: true // Give admin premium access
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('\n👤 Admin Details:');
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Verified: ${user.isEmailVerified}`);
        console.log(`   Premium: ${user.isPremium}`);
        console.log('\n🎉 The admin can now login with their credentials!\n');

    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
};

// Run the script
console.log('🛡️  MyDen Admin User Creation Script');
console.log('====================================\n');
console.log('⚠️  WARNING: This creates an admin account with full privileges');
console.log('   Only create admin accounts for trusted users\n');

createAdminUser();
