# Auto Trading Manual Test Guide

## Test Accounts

Use these 5 test accounts to test each trading model:

### 1. Conservative Trader
- **Email**: `conservative.trader@test.myden.com`
- **Password**: `Test123!@#`
- **Model**: Blue Chip Dividend (Conservative)
- **Investment**: $1,000

### 2. Balanced Investor
- **Email**: `balanced.investor@test.myden.com`
- **Password**: `Test123!@#`
- **Model**: Balanced Growth & Income
- **Investment**: $2,000

### 3. Growth Seeker
- **Email**: `growth.seeker@test.myden.com`
- **Password**: `Test123!@#`
- **Model**: Tech Growth Momentum
- **Investment**: $3,000

### 4. Aggressive Trader
- **Email**: `aggressive.trader@test.myden.com`
- **Password**: `Test123!@#`
- **Model**: High Volatility Trader
- **Investment**: $5,000

### 5. DayTrader Pro
- **Email**: `daytrader.pro@test.myden.com`
- **Password**: `Test123!@#`
- **Model**: Professional Day Trader
- **Investment**: $10,000

---

## Manual Testing Steps

### Step 1: Create Accounts

For each test account above:

1. Go to your production URL: `https://your-app.vercel.app/signup`
2. Fill in the signup form:
   - First Name: (from list above)
   - Last Name: (from list above)
   - Email: (from list above)
   - Phone: `+1-555-010X` (X = 1-5)
   - Password: `Test123!@#`
3. Click "Create Account"
4. Check if email verification is required or auto-verified
5. If email sent, click verification link (or wait for auto-verify)

### Step 2: Login

1. Go to `/login`
2. Enter email and password
3. Click "Log In"
4. Verify you're redirected to dashboard

### Step 3: Navigate to Auto Trading

1. Click "Auto Trading" in the sidebar
2. Verify you see 5 trading models displayed
3. Check that each model shows:
   - Icon and name
   - Risk level badge
   - Description
   - Expected return
   - Trading style
   - Allocation breakdown

### Step 4: Activate Trading Model

For each account, activate the corresponding model:

1. Click on the model card
2. Verify allocation details appear
3. Enter investment amount (from list above)
4. Click "Activate Model"
5. Verify success message appears
6. Check that dashboard shows:
   - Active model name and icon
   - Investment amount
   - Current value (should equal investment initially)
   - Today's P/L (should be $0.00)
   - Win Rate (should be 0%)

### Step 5: Verify Model Details

1. Check that "Deactivate" button is visible
2. Verify "Current Positions" section shows (initially 0 positions)
3. Check that model configuration is displayed correctly

### Step 6: Test API Endpoints

Use Postman or curl to test:

```bash
# Get available models
curl https://your-backend.railway.app/api/auto-trading/models

# Get user's model (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.railway.app/api/auto-trading/my-model

# Get positions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.railway.app/api/auto-trading/positions

# Get statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.railway.app/api/auto-trading/stats
```

### Step 7: Test Scheduler (Wait for Market Hours)

**Note**: Trades execute at:
- **9:30 AM EST** - Market Open (Buy positions)
- **12:00 PM EST** - Mid-day check (Stop-loss/Take-profit)
- **4:00 PM EST** - Market Close (Sell all positions)

After market open (9:30 AM EST):
1. Refresh the Auto Trading page
2. Verify "Current Positions" shows positions
3. Check each position displays:
   - Symbol (e.g., AAPL, MSFT)
   - Quantity
   - Entry price
   - Current price
   - P/L percentage

After market close (4:00 PM EST):
1. Refresh the page
2. Verify all positions are closed
3. Check "Today's P/L" is updated
4. Verify statistics are updated:
   - Total Trades increased
   - Win Rate calculated
   - Winning/Losing trades counted

### Step 8: Test Deactivation

1. Click "Deactivate" button
2. Confirm the dialog
3. Verify model is deactivated
4. Check that you can select a new model

### Step 9: Test Emergency Close

1. Activate a model
2. Wait for positions to open (9:30 AM EST)
3. Click "Close All" button
4. Confirm the dialog
5. Verify all positions are closed immediately
6. Check P/L is calculated

---

## Automated Testing

Run the automated test script:

```bash
# For local testing
cd backend
BACKEND_URL=http://localhost:5000 node testAutoTrading.js

# For production testing
BACKEND_URL=https://your-backend.railway.app node testAutoTrading.js
```

The script will:
- ✅ Create all 5 test accounts
- ✅ Login to each account
- ✅ Activate the corresponding trading model
- ✅ Fetch and display model details
- ✅ Check positions and statistics
- ✅ Print a comprehensive test summary

---

## Expected Results

### ✅ Success Criteria

1. **Account Creation**: All 5 accounts created successfully
2. **Login**: All accounts can login without errors
3. **Model Activation**: Each model activates with correct allocation
4. **UI Display**: Dashboard shows correct model info
5. **API Responses**: All endpoints return valid data
6. **Scheduler**: Trades execute at correct times (9:30 AM, 4:00 PM EST)
7. **Position Tracking**: Positions display with correct prices
8. **Statistics**: Win rate, P/L, and trade counts update correctly
9. **Deactivation**: Models can be deactivated successfully
10. **Emergency Close**: Positions close immediately when requested

### ❌ Common Issues to Check

1. **Email Verification**: Check if auto-verify is working
2. **Token Expiration**: Ensure JWT tokens are valid
3. **Timezone**: Verify scheduler uses EST correctly
4. **Price Data**: Check that mock prices are realistic
5. **Cache**: Ensure market data cache is working
6. **Concurrent Users**: Test multiple users trading simultaneously
7. **Database**: Verify all data is persisted correctly
8. **Error Handling**: Test with invalid inputs

---

## Monitoring

### Backend Logs

Check Railway logs for:
```
🤖 Initializing Auto Trading Scheduler...
✅ Trading scheduler initialized successfully
📈 Market Open - Executing buy orders...
📉 Market Close - Executing sell orders...
✅ Executed X buy orders for [model name]
✅ Closed all positions for model [id]. P/L: $XX.XX
```

### Database Checks

Verify in MongoDB:
```javascript
// Check AutoTradingModel documents
db.autotradingmodels.find()

// Check active models
db.autotradingmodels.find({ isActive: true })

// Check positions
db.autotradingmodels.find({ "currentPositions.0": { $exists: true } })

// Check statistics
db.autotradingmodels.find({}, { totalStats: 1, dailyStats: 1 })
```

---

## Cleanup

After testing, you can:

1. **Deactivate all models** via UI
2. **Delete test accounts** via database:
```javascript
db.users.deleteMany({ 
  email: { $regex: /@test\.myden\.com$/ } 
})
```

3. **Clear test data**:
```javascript
db.autotradingmodels.deleteMany({ 
  user: { $in: [/* test user IDs */] } 
})
```

---

## Support

If you encounter issues:
1. Check backend logs in Railway
2. Check browser console for frontend errors
3. Verify environment variables are set
4. Ensure database connection is working
5. Check that node-cron is installed
6. Verify timezone settings (should be EST)

---

**Happy Testing! 🚀**
