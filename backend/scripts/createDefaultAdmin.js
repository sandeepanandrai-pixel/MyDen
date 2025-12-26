/**
 * Quick Admin Creation - Non-interactive
 * Creates a default admin account
 */

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');

const createDefaultAdmin = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Default admin credentials
        const adminData = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@myden.io',
            phone: '+1234567890',
            password: 'Admin@123',
            role: 'admin',
            isEmailVerified: true,
            isPremium: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin account already exists!');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
            console.log('\n💡 To login, use:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Password: Admin@123\n`);
            process.exit(0);
        }

        // Create admin
        console.log('🔐 Creating default admin account...');
        const admin = await User.create(adminData);

        console.log('\n✅ Admin account created successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('📋 ADMIN LOGIN CREDENTIALS');
        console.log('═══════════════════════════════════════');
        console.log(`Email:    ${admin.email}`);
        console.log(`Password: Admin@123`);
        console.log('═══════════════════════════════════════\n');
        console.log('👤 Admin Details:');
        console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Verified: ${admin.isEmailVerified}`);
        console.log(`   Premium: ${admin.isPremium}`);
        console.log('\n🎉 You can now login at http://localhost:3000/login\n');
        console.log('⚠️  IMPORTANT: Change the password after first login!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
};

createDefaultAdmin();
