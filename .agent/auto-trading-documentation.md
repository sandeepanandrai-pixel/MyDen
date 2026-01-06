# Automated Trading Models - Complete Documentation

## Overview
The Automated Trading Models feature allows users to select from 5 pre-configured trading strategies that automatically buy and sell cryptocurrency positions based on market open and close times.

## Features

### 5 Trading Models

#### 1. Conservative Growth 🛡️
- **Risk Level**: Low
- **Expected Return**: 5-10% annually
- **Allocation**:
  - Bitcoin: 50%
  - Ethereum: 30%
  - USDT: 20%
- **Trading Style**: Buy and hold with daily rebalancing
- **Best For**: Risk-averse investors seeking stable returns

#### 2. Balanced Portfolio ⚖️
- **Risk Level**: Medium
- **Expected Return**: 10-20% annually
- **Allocation**:
  - Bitcoin: 40%
  - Ethereum: 30%
  - BNB: 15%
  - Cardano: 10%
  - USDT: 5%
- **Trading Style**: Swing trading with trend following
- **Best For**: Investors seeking balanced risk/reward

#### 3. Growth Focused 📈
- **Risk Level**: Medium-High
- **Expected Return**: 20-40% annually
- **Allocation**:
  - Ethereum: 30%
  - Solana: 20%
  - Polygon: 15%
  - Avalanche: 15%
  - Chainlink: 10%
  - USDT: 10%
- **Trading Style**: Active trading with momentum indicators
- **Best For**: Growth-oriented investors

#### 4. Aggressive Trader 🚀
- **Risk Level**: High
- **Expected Return**: 40-80% annually (high volatility)
- **Allocation**:
  - Ethereum: 25%
  - Solana: 20%
  - Avalanche: 15%
  - Polygon: 15%
  - NEAR: 10%
  - Fantom: 10%
  - USDT: 5%
- **Trading Style**: Day trading with technical analysis
- **Best For**: Experienced traders comfortable with volatility

#### 5. Day Trader Pro ⚡
- **Risk Level**: Very High
- **Expected Return**: 50-100%+ annually (extreme volatility)
- **Allocation**:
  - Bitcoin: 20%
  - Ethereum: 20%
  - Solana: 15%
  - BNB: 15%
  - Avalanche: 10%
  - Polygon: 10%
  - Chainlink: 10%
- **Trading Style**: Pure day trading - all positions closed daily
- **Best For**: Professional traders seeking maximum returns

## Trading Schedule

### Market Hours (EST)
- **Market Open**: 9:30 AM EST
- **Market Close**: 4:00 PM EST
- **Trading Days**: Monday - Friday

### Automated Actions

#### Market Open (9:30 AM EST)
1. System calculates allocation based on selected model
2. Executes buy orders for each asset
3. Records entry prices and quantities
4. Updates user portfolio
5. Creates transaction records

#### Mid-Day Check (12:00 PM EST)
1. Monitors all open positions
2. Checks stop-loss levels (default: -5%)
3. Checks take-profit levels (default: +10%)
4. Automatically closes positions if triggers hit
5. Records partial P/L

#### Market Close (4:00 PM EST)
1. Closes all open positions
2. Calculates profit/loss for the day
3. Updates statistics (win rate, total P/L)
4. Resets for next trading day
5. Sends summary notifications

## Technical Architecture

### Backend Components

#### 1. Database Model (`AutoTradingModel.js`)
```javascript
{
  user: ObjectId,
  modelType: String, // conservative, balanced, growth, aggressive, daytrader
  isActive: Boolean,
  investmentAmount: Number,
  currentPositions: [{
    symbol: String,
    quantity: Number,
    entryPrice: Number,
    entryTime: Date,
    currentValue: Number
  }],
  dailyStats: {
    tradesExecuted: Number,
    profitLoss: Number,
    profitLossPercentage: Number,
    lastTradeDate: Date
  },
  totalStats: {
    totalTrades: Number,
    winningTrades: Number,
    losingTrades: Number,
    totalProfit: Number,
    totalLoss: Number,
    winRate: Number,
    averageReturn: Number
  },
  settings: {
    stopLoss: Number, // Percentage
    takeProfit: Number, // Percentage
    maxPositions: Number,
    riskPerTrade: Number
  }
}
```

#### 2. Trading Scheduler (`tradingScheduler.js`)
- Uses `node-cron` for scheduled tasks
- Manages market open/close executions
- Handles stop-loss/take-profit monitoring
- Updates portfolios and transactions
- Singleton service initialized on server startup

#### 3. Controller (`autoTradingController.js`)
Endpoints:
- `GET /api/auto-trading/models` - Get available models
- `GET /api/auto-trading/my-model` - Get user's active model
- `GET /api/auto-trading/stats` - Get performance statistics
- `GET /api/auto-trading/positions` - Get current positions
- `POST /api/auto-trading/activate` - Activate a model
- `POST /api/auto-trading/deactivate` - Deactivate model
- `POST /api/auto-trading/close-all` - Emergency close all positions
- `PUT /api/auto-trading/settings` - Update settings

### Frontend Components

#### AutoTrading Page (`AutoTrading.jsx`)
Features:
- Model selection cards with detailed information
- Active model dashboard with real-time P/L
- Current positions display
- Performance statistics
- Investment amount input
- Activation/deactivation controls
- Emergency position closing

## User Flow

### Activating a Model

1. **Navigate to Auto Trading**
   - Click "Auto Trading" in sidebar
   - View available models

2. **Select a Model**
   - Click on desired model card
   - Review allocation and risk level
   - Check expected returns

3. **Set Investment Amount**
   - Enter amount (minimum $100)
   - Review allocation breakdown

4. **Activate**
   - Click "Activate Model"
   - Confirm activation
   - Wait for next market open

5. **Monitor Performance**
   - View real-time positions
   - Track daily P/L
   - Review statistics

### Deactivating a Model

1. **Wait for Market Close**
   - Cannot deactivate with open positions
   - System automatically closes at 4:00 PM EST

2. **Click Deactivate**
   - Confirm deactivation
   - Model stops trading

3. **Emergency Close**
   - Use "Close All" button if needed
   - Immediately exits all positions
   - May result in suboptimal prices

## Risk Management

### Built-in Protections

1. **Stop-Loss** (Default: -5%)
   - Automatically closes losing positions
   - Prevents excessive losses
   - Configurable per user

2. **Take-Profit** (Default: +10%)
   - Locks in profits automatically
   - Reduces greed-based losses
   - Configurable per user

3. **Position Limits**
   - Maximum positions per model
   - Prevents over-diversification
   - Ensures adequate capital per trade

4. **Daily Reset**
   - All positions closed at market close
   - No overnight risk
   - Fresh start each day

### User Responsibilities

- ⚠️ **Understand Risk Levels**: Higher returns = higher risk
- ⚠️ **Only Invest What You Can Afford to Lose**
- ⚠️ **Monitor Performance Regularly**
- ⚠️ **Adjust Settings Based on Experience**
- ⚠️ **Use Emergency Close if Needed**

## Statistics Tracking

### Daily Stats
- Trades Executed Today
- Today's Profit/Loss
- Today's P/L Percentage
- Last Trade Date

### Total Stats
- Total Trades (All Time)
- Winning Trades
- Losing Trades
- Total Profit
- Total Loss
- Win Rate (%)
- Average Return per Trade

## Installation & Setup

### Backend Dependencies
```bash
cd backend
npm install node-cron
```

### Database Migration
No migration needed - models are created automatically on first use.

### Environment Variables
No additional environment variables required.

### Server Initialization
The trading scheduler automatically initializes when the server starts:
```javascript
// In app.js
const tradingScheduler = require('./services/tradingScheduler');
tradingScheduler.initialize();
```

## Testing

### Manual Testing

1. **Test Model Activation**
   ```bash
   POST /api/auto-trading/activate
   {
     "modelType": "conservative",
     "investmentAmount": 1000
   }
   ```

2. **Test Position Retrieval**
   ```bash
   GET /api/auto-trading/positions
   ```

3. **Test Statistics**
   ```bash
   GET /api/auto-trading/stats
   ```

### Scheduler Testing

To test without waiting for scheduled times, you can manually trigger:
```javascript
// In Node REPL or test script
const tradingScheduler = require('./services/tradingScheduler');
await tradingScheduler.executeMarketOpenTrades();
await tradingScheduler.executeMarketCloseTrades();
```

## Future Enhancements

### Planned Features
1. **Custom Models**: Allow users to create custom allocations
2. **Backtesting**: Test strategies on historical data
3. **Paper Trading**: Practice without real money
4. **Advanced Indicators**: RSI, MACD, Bollinger Bands
5. **Multi-Timeframe**: Support for different holding periods
6. **Social Trading**: Copy successful traders
7. **AI Optimization**: Machine learning for allocation
8. **Mobile Notifications**: Push alerts for trades
9. **Performance Reports**: Weekly/monthly summaries
10. **Tax Reporting**: Export for tax purposes

### Technical Improvements
- [ ] Add Redis for caching market data
- [ ] Implement WebSocket for real-time updates
- [ ] Add comprehensive error handling
- [ ] Implement retry logic for failed trades
- [ ] Add logging and monitoring
- [ ] Create admin dashboard for oversight
- [ ] Implement rate limiting on trading endpoints
- [ ] Add unit and integration tests

## Troubleshooting

### Common Issues

**Issue**: Scheduler not running
- **Solution**: Check server logs for initialization errors
- **Check**: Ensure `node-cron` is installed

**Issue**: Trades not executing
- **Solution**: Verify market data service is working
- **Check**: Check timezone settings (must be EST)

**Issue**: Positions not closing
- **Solution**: Check if market close time has passed
- **Check**: Verify user has active positions

**Issue**: Statistics not updating
- **Solution**: Ensure trades are completing successfully
- **Check**: Review transaction logs

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Test API endpoints manually
4. Contact development team

## License & Disclaimer

⚠️ **IMPORTANT DISCLAIMER**:
- This is an automated trading system
- Past performance does not guarantee future results
- Cryptocurrency trading involves substantial risk
- Users are responsible for their own investment decisions
- The system is provided "as-is" without warranties
- Always do your own research (DYOR)

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Author**: MyDen Development Team
