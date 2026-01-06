/**
 * Auto Trading Test Script
 * Creates 5 test accounts and tests all auto-trading models
 * 
 * Usage:
 *   node testAutoTrading.js
 * 
 * Environment:
 *   Set BACKEND_URL to your production/staging backend URL
 *   Example: BACKEND_URL=https://your-backend.railway.app node testAutoTrading.js
 */

const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api`;

// Test accounts configuration
const TEST_ACCOUNTS = [
    {
        firstName: 'Conservative',
        lastName: 'Trader',
        email: 'conservative.trader@test.myden.com',
        phone: '+1-555-0101',
        password: 'Test123!@#',
        model: 'conservative',
        investment: 1000
    },
    {
        firstName: 'Balanced',
        lastName: 'Investor',
        email: 'balanced.investor@test.myden.com',
        phone: '+1-555-0102',
        password: 'Test123!@#',
        model: 'balanced',
        investment: 2000
    },
    {
        firstName: 'Growth',
        lastName: 'Seeker',
        email: 'growth.seeker@test.myden.com',
        phone: '+1-555-0103',
        password: 'Test123!@#',
        model: 'growth',
        investment: 3000
    },
    {
        firstName: 'Aggressive',
        lastName: 'Trader',
        email: 'aggressive.trader@test.myden.com',
        phone: '+1-555-0104',
        password: 'Test123!@#',
        model: 'aggressive',
        investment: 5000
    },
    {
        firstName: 'DayTrader',
        lastName: 'Pro',
        email: 'daytrader.pro@test.myden.com',
        phone: '+1-555-0105',
        password: 'Test123!@#',
        model: 'daytrader',
        investment: 10000
    }
];

// Test results storage
const testResults = {
    accountsCreated: [],
    modelsActivated: [],
    errors: [],
    summary: {}
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
    const config = {
        method,
        url: `${API_BASE}${endpoint}`,
        headers: {}
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.data = data;
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await axios(config);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            status: error.response?.status
        };
    }
}

// Step 1: Register test accounts
async function registerAccount(account) {
    console.log(`\n📝 Registering account: ${account.email}`);

    const result = await apiCall('POST', '/auth/register', {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.phone,
        password: account.password,
        role: 'user'
    });

    if (result.success) {
        console.log(`✅ Account created: ${account.email}`);
        testResults.accountsCreated.push(account.email);
        return true;
    } else {
        console.log(`❌ Failed to create account: ${result.error}`);
        testResults.errors.push({
            step: 'registration',
            account: account.email,
            error: result.error
        });
        return false;
    }
}

// Step 2: Login to account
async function loginAccount(account) {
    console.log(`\n🔐 Logging in: ${account.email}`);

    const result = await apiCall('POST', '/auth/login', {
        email: account.email,
        password: account.password
    });

    if (result.success && result.data.token) {
        console.log(`✅ Login successful: ${account.email}`);
        return result.data.token;
    } else {
        console.log(`❌ Login failed: ${result.error}`);
        testResults.errors.push({
            step: 'login',
            account: account.email,
            error: result.error
        });
        return null;
    }
}

// Step 3: Get available models
async function getAvailableModels() {
    console.log(`\n📊 Fetching available trading models...`);

    const result = await apiCall('GET', '/auto-trading/models');

    if (result.success) {
        console.log(`✅ Found ${result.data.models.length} trading models`);
        result.data.models.forEach(model => {
            console.log(`   - ${model.icon} ${model.name} (${model.riskLevel} Risk)`);
        });
        return result.data.models;
    } else {
        console.log(`❌ Failed to fetch models: ${result.error}`);
        return [];
    }
}

// Step 4: Activate trading model
async function activateModel(account, token) {
    console.log(`\n🚀 Activating ${account.model} model for ${account.email}`);

    const result = await apiCall('POST', '/auto-trading/activate', {
        modelType: account.model,
        investmentAmount: account.investment
    }, token);

    if (result.success) {
        console.log(`✅ Model activated: ${account.model} with $${account.investment}`);
        testResults.modelsActivated.push({
            email: account.email,
            model: account.model,
            investment: account.investment
        });
        return true;
    } else {
        console.log(`❌ Failed to activate model: ${result.error}`);
        testResults.errors.push({
            step: 'activation',
            account: account.email,
            error: result.error
        });
        return false;
    }
}

// Step 5: Get user's active model
async function getUserModel(account, token) {
    console.log(`\n📈 Fetching active model for ${account.email}`);

    const result = await apiCall('GET', '/auto-trading/my-model', null, token);

    if (result.success && result.data.hasModel) {
        const model = result.data.model;
        console.log(`✅ Active Model: ${model.config.name}`);
        console.log(`   Investment: $${model.investmentAmount}`);
        console.log(`   Status: ${model.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Positions: ${model.currentPositions?.length || 0}`);
        return model;
    } else {
        console.log(`❌ Failed to fetch model: ${result.error}`);
        return null;
    }
}

// Step 6: Get current positions
async function getPositions(account, token) {
    console.log(`\n💼 Fetching positions for ${account.email}`);

    const result = await apiCall('GET', '/auto-trading/positions', null, token);

    if (result.success) {
        console.log(`✅ Positions: ${result.data.positions?.length || 0}`);
        if (result.data.positions && result.data.positions.length > 0) {
            result.data.positions.forEach(pos => {
                console.log(`   - ${pos.symbol}: ${pos.quantity} @ $${pos.entryPrice}`);
            });
        }
        return result.data;
    } else {
        console.log(`❌ Failed to fetch positions: ${result.error}`);
        return null;
    }
}

// Step 7: Get statistics
async function getStats(account, token) {
    console.log(`\n📊 Fetching statistics for ${account.email}`);

    const result = await apiCall('GET', '/auto-trading/stats', null, token);

    if (result.success) {
        const stats = result.data.stats;
        console.log(`✅ Statistics:`);
        console.log(`   Total Trades: ${stats.totalStats?.totalTrades || 0}`);
        console.log(`   Win Rate: ${stats.totalStats?.winRate?.toFixed(2) || 0}%`);
        console.log(`   Total P/L: $${stats.totalStats?.totalProfit - stats.totalStats?.totalLoss || 0}`);
        return stats;
    } else {
        console.log(`❌ Failed to fetch stats: ${result.error}`);
        return null;
    }
}

// Step 8: Test model deactivation (optional)
async function deactivateModel(account, token) {
    console.log(`\n⏸️  Deactivating model for ${account.email}`);

    const result = await apiCall('POST', '/auto-trading/deactivate', null, token);

    if (result.success) {
        console.log(`✅ Model deactivated successfully`);
        return true;
    } else {
        console.log(`⚠️  Deactivation note: ${result.error}`);
        return false;
    }
}

// Main test execution
async function runTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🤖 AUTO TRADING TEST SUITE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Backend URL: ${BACKEND_URL}`);
    console.log(`Test Accounts: ${TEST_ACCOUNTS.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Step 1: Get available models first
    const models = await getAvailableModels();
    if (models.length === 0) {
        console.log('\n❌ No models available. Aborting tests.');
        return;
    }

    // Step 2: Process each test account
    for (const account of TEST_ACCOUNTS) {
        console.log('\n' + '─'.repeat(60));
        console.log(`Testing Account: ${account.firstName} ${account.lastName}`);
        console.log('─'.repeat(60));

        // Register account
        const registered = await registerAccount(account);
        if (!registered) {
            console.log(`⚠️  Skipping ${account.email} due to registration failure`);
            continue;
        }

        // Wait a bit for email verification (or auto-verify)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Login
        const token = await loginAccount(account);
        if (!token) {
            console.log(`⚠️  Skipping ${account.email} due to login failure`);
            continue;
        }

        // Activate trading model
        const activated = await activateModel(account, token);
        if (!activated) {
            console.log(`⚠️  Model activation failed for ${account.email}`);
            continue;
        }

        // Get user's model details
        await getUserModel(account, token);

        // Get positions (will be empty initially)
        await getPositions(account, token);

        // Get statistics
        await getStats(account, token);

        // Wait between accounts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Print summary
    printSummary();
}

// Print test summary
function printSummary() {
    console.log('\n\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 TEST SUMMARY');
    console.log('═══════════════════════════════════════════════════════');

    console.log(`\n✅ Accounts Created: ${testResults.accountsCreated.length}/${TEST_ACCOUNTS.length}`);
    testResults.accountsCreated.forEach(email => {
        console.log(`   - ${email}`);
    });

    console.log(`\n🚀 Models Activated: ${testResults.modelsActivated.length}/${TEST_ACCOUNTS.length}`);
    testResults.modelsActivated.forEach(item => {
        console.log(`   - ${item.email}: ${item.model} ($${item.investment})`);
    });

    if (testResults.errors.length > 0) {
        console.log(`\n❌ Errors: ${testResults.errors.length}`);
        testResults.errors.forEach((error, idx) => {
            console.log(`   ${idx + 1}. [${error.step}] ${error.account}: ${error.error}`);
        });
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✨ Test execution completed!');
    console.log('═══════════════════════════════════════════════════════\n');

    // Success rate
    const successRate = (testResults.modelsActivated.length / TEST_ACCOUNTS.length * 100).toFixed(1);
    console.log(`Success Rate: ${successRate}%`);

    if (successRate === '100.0') {
        console.log('🎉 All tests passed!');
    } else if (successRate >= '80.0') {
        console.log('⚠️  Most tests passed, but some issues detected.');
    } else {
        console.log('❌ Multiple failures detected. Please review errors above.');
    }
}

// Run the tests
runTests().catch(error => {
    console.error('\n💥 Fatal error during test execution:', error);
    process.exit(1);
});
