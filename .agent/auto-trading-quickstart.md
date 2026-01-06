# 🤖 Automated Trading Models - Quick Start

## What Was Created

### 5 Trading Models
1. **🛡️ Conservative Growth** - Low risk, stable returns (5-10% annually)
2. **⚖️ Balanced Portfolio** - Medium risk, balanced approach (10-20% annually)
3. **📈 Growth Focused** - Medium-high risk, growth-oriented (20-40% annually)
4. **🚀 Aggressive Trader** - High risk, volatile (40-80% annually)
5. **⚡ Day Trader Pro** - Very high risk, maximum returns (50-100%+ annually)

## How It Works

1. **User selects a model** and sets investment amount (min $100)
2. **At market open (9:30 AM EST)**: System buys assets based on model allocation
3. **Mid-day (12:00 PM EST)**: Monitors stop-loss (-5%) and take-profit (+10%)
4. **At market close (4:00 PM EST)**: Sells all positions, calculates P/L
5. **Repeat daily** - Fresh positions each trading day

## Files Created

### Backend
- `backend/src/models/AutoTradingModel.js` - Database model
- `backend/src/services/tradingScheduler.js` - Cron job scheduler
- `backend/src/controllers/autoTradingController.js` - API controller
- `backend/src/routes/autoTrading.js` - API routes

### Frontend
- `frontend/src/pages/AutoTrading.jsx` - Main UI page

### Modified Files
- `backend/src/app.js` - Added routes and scheduler initialization
- `backend/package.json` - Added node-cron dependency
- `frontend/src/App.jsx` - Added route
- `frontend/src/components/Layout.jsx` - Added navigation item

## API Endpoints

```
GET    /api/auto-trading/models          - Get all available models
GET    /api/auto-trading/my-model        - Get user's active model
GET    /api/auto-trading/stats           - Get performance statistics
GET    /api/auto-trading/positions       - Get current positions
POST   /api/auto-trading/activate        - Activate a model
POST   /api/auto-trading/deactivate      - Deactivate model
POST   /api/auto-trading/close-all       - Emergency close positions
PUT    /api/auto-trading/settings        - Update settings
```

## Quick Test

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Navigate to**: http://localhost:3000/auto-trading

4. **Select a model**, enter investment amount, and activate!

## Scheduler Status

The trading scheduler runs automatically when the server starts. Check logs for:
```
🤖 Initializing Auto Trading Scheduler...
✅ Trading scheduler initialized successfully
```

## Manual Testing

To test without waiting for scheduled times:

```javascript
// In Node.js console or test file
const tradingScheduler = require('./src/services/tradingScheduler');

// Test market open
await tradingScheduler.executeMarketOpenTrades();

// Test market close
await tradingScheduler.executeMarketCloseTrades();

// Check status
console.log(tradingScheduler.getStatus());
```

## Features

✅ 5 pre-configured trading models  
✅ Automated buy/sell at market open/close  
✅ Real-time position tracking  
✅ Stop-loss and take-profit protection  
✅ Performance statistics (win rate, P/L, etc.)  
✅ Beautiful UI with risk indicators  
✅ Emergency position closing  
✅ Daily P/L tracking  
✅ Transaction history integration  

## Next Steps

1. ✅ Install dependencies: `npm install` (already done)
2. ✅ Test the UI at `/auto-trading`
3. ⏳ Wait for market open to see live trading
4. 📊 Monitor performance in dashboard
5. 🎯 Adjust settings based on results

## Important Notes

⚠️ **Risk Warning**: Cryptocurrency trading involves substantial risk. Only invest what you can afford to lose.

⚠️ **Testing**: The scheduler uses EST timezone. Trades execute at:
- 9:30 AM EST (Market Open)
- 12:00 PM EST (Mid-day Check)
- 4:00 PM EST (Market Close)

⚠️ **Minimum Investment**: $100 per model

⚠️ **One Model Per User**: Users can only have one active model at a time

## Documentation

Full documentation available at: `.agent/auto-trading-documentation.md`

---

**Ready to trade!** 🚀
