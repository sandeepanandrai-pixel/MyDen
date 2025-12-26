# 📊 Database Schema Visual Reference

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                            USER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • firstName, lastName, email, phone, password            │  │
│  │ • profilePicture, bio, dateOfBirth, country              │  │
│  │ • timezone, currency                                      │  │
│  │ • preferences (risk, theme, language, layout)            │  │
│  │ • notifications (email, push, alerts)                    │  │
│  │ • privacy (showPortfolio, leaderboard, social)           │  │
│  │ • security (2FA, emailVerified, tokens)                  │  │
│  │ • watchlist, isPremium, premiumExpiresAt                 │  │
│  │ • lastLogin, loginCount, createdAt, updatedAt            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ (One-to-Many)
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐          ┌─────────────┐        ┌──────────┐
   │Portfolio│          │ Transaction │        │PriceAlert│
   ├─────────┤          ├─────────────┤        ├──────────┤
   │• symbol │          │• type       │        │• symbol  │
   │• qty    │          │• symbol     │        │• target  │
   │• avgBuy │          │• quantity   │        │• condition│
   │• total  │          │• price      │        │• alertType│
   │• current│          │• total      │        │• recurring│
   │• P/L    │          │• fees       │        │• triggered│
   │• updated│          │• notes      │        │• notify   │
   └─────────┘          │• source     │        └──────────┘
                        │• date       │
                        └─────────────┘              │
                                                     │
        ┌────────────────────────────────────────────┼─────────────────┐
        │                                            │                 │
        ▼                                            ▼                 ▼
  ┌─────────────┐                            ┌────────────┐    ┌────────────┐
  │Notification │                            │ChatMessage │    │UserSettings│
  ├─────────────┤                            ├────────────┤    ├────────────┤
  │• type       │                            │• convId    │    │• trading   │
  │• title      │                            │• role      │    │• display   │
  │• message    │                            │• message   │    │• alerts    │
  │• read       │                            │• response  │    │• apiKeys   │
  │• actionUrl  │                            │• context   │    │• aiConfig  │
  │• priority   │                            │• aiModel   │    │• privacy   │
  │• channels   │                            │• tokens    │    │• advanced  │
  │• expiresAt  │                            │• intent    │    │• backup    │
  └─────────────┘                            │• helpful   │    └────────────┘
                                             └────────────┘
                                                                      │
                                                                      │ (One-to-One)
                                                                      │
                                                              Back to USER
```

---

## Collection Details

### Core Collections (User-Centric)

| Collection | Purpose | Key Features | Relationships |
|------------|---------|--------------|---------------|
| **users** | User accounts & profiles | Auth, preferences, security | One-to-many with all others |
| **portfolios** | Holdings tracking | Current values, P/L | Belongs to user |
| **transactions** | Trade history | Buy/sell records, fees | Belongs to user |
| **investmentstrategies** | AI strategies | Risk-based allocations | Shared (no user FK) |

### Feature Collections (Smart Features)

| Collection | Purpose | Key Features | Relationships |
|------------|---------|--------------|---------------|
| **pricealerts** | Smart alerts | Multi-type, recurring | Belongs to user |
| **notifications** | In-app notifications | Multi-channel, TTL | Belongs to user |
| **chatmessages** | AI chat history | Context-aware, feedback | Belongs to user |
| **usersettings** | Advanced settings | Trading, display, API keys | One-to-one with user |

---

## Data Flow Diagrams

### 1. User Registration & Profile Setup

```
┌──────────┐
│  Signup  │
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ Create User      │ ──┐
│ (basic info)     │   │
└──────────────────┘   │
                       │ Parallel Creation
┌──────────────────┐   │
│ Create Settings  │ ◄─┘
│ (defaults)       │
└──────────────────┘
```

### 2. Portfolio & Transaction Flow

```
┌──────────────┐
│   Buy BTC    │
└──────┬───────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌──────────────┐
│ Transaction │  │  Portfolio   │
│   Record    │  │   Update     │
└─────────────┘  └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │Notification  │
                 │ "Trade Done" │
                 └──────────────┘
```

### 3. Smart Alerts Flow

```
┌──────────────┐
│ Create Alert │
│ (BTC > $100k)│
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  PriceAlert DB   │
│  (isActive=true) │
└──────┬───────────┘
       │
       │ Monitored by Cron Job
       │
       ▼
┌──────────────────┐
│ Price Checker    │ ◄── Market API
│ (every minute)   │
└──────┬───────────┘
       │
       │ if (currentPrice > targetPrice)
       │
       ├─────────────┬─────────────┐
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌───────────┐  ┌────────┐
│ Email    │  │Push Notif │  │ In-App │
│ Service  │  │ Service   │  │Notif DB│
└──────────┘  └───────────┘  └────────┘
       │             │             │
       └─────────────┴─────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Mark Alert as   │
            │   Triggered     │
            └─────────────────┘
```

### 4. AI Chat Flow

```
┌─────────────┐
│ User Message│
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Save to ChatDB   │
│ (role: user)     │
└──────┬───────────┘
       │
       ▼
┌────────────────────────┐
│ Gather Context        │
│ • Portfolio           │
│ • Market Conditions   │
│ • Risk Tolerance      │
│ • Recent Transactions │
└──────┬─────────────────┘
       │
       ▼
┌──────────────────┐
│  AI API Call     │ ◄── OpenAI/Gemini
│  (with context)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Save Response    │
│ (role: assistant)│
│ + metadata       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return to User   │
│ + suggestions    │
└──────────────────┘
```

---

## Index Strategy

### Query Performance Optimization

```
Portfolio Queries:
  GET /portfolio/:userId
  ├─ Index: { user: 1, symbol: 1 }
  └─ Index: { user: 1, currentValue: -1 }

Transaction History:
  GET /transactions/:userId?limit=20
  └─ Index: { user: 1, date: -1 }

Active Alerts:
  GET /alerts/:userId/active
  └─ Index: { user: 1, isActive: 1 }

Unread Notifications:
  GET /notifications/unread
  └─ Index: { user: 1, read: 1, createdAt: -1 }

Chat History:
  GET /chat/:conversationId
  └─ Index: { user: 1, conversationId: 1, timestamp: -1 }

Alert Monitoring (Background Job):
  Cron: Check all active alerts
  └─ Index: { symbol: 1, isActive: 1 }
```

---

## Data Lifecycle

### Timestamps & TTL

```
User
├─ createdAt (permanent)
├─ updatedAt (on every save)
└─ lastLogin (on each login)

Portfolio
├─ createdAt (when position opened)
└─ lastUpdated (price refresh)

Transaction
└─ date (immutable)

PriceAlert
├─ createdAt (permanent)
├─ updatedAt (on every save)
└─ triggeredAt (when fired)

Notification
├─ createdAt (permanent)
└─ expiresAt (TTL - auto-delete)
     └─ Default: 30 days after creation

ChatMessage
└─ timestamp (permanent - user data)
```

---

## Storage Estimates

### Approximate sizes per document:

| Collection | Size/Doc | 1000 Users | 10,000 Users |
|------------|----------|------------|--------------|
| User | ~2 KB | 2 MB | 20 MB |
| UserSettings | ~3 KB | 3 MB | 30 MB |
| Portfolio | ~0.5 KB | varies | varies |
| Transaction | ~0.3 KB | varies | varies |
| PriceAlert | ~0.4 KB | varies | varies |
| Notification | ~0.3 KB | auto-expires | auto-expires |
| ChatMessage | ~1 KB | varies | varies |

### Growth Estimates (per user/year):

- **Transactions**: ~200 docs → 60 KB
- **Chat Messages**: ~500 docs → 500 KB
- **Notifications**: ~1000 docs → 300 KB (then deleted)
- **Price Alerts**: ~50 docs → 20 KB

**Total per user/year**: ~600 KB  
**10,000 users**: ~6 GB/year (+ indexes)

---

## Backup & Migration

### Critical Collections (Must Backup)
1. **users** - Cannot be regenerated
2. **portfolios** - Financial data
3. **transactions** - Audit trail
4. **pricealerts** - User preferences

### Can Regenerate
- **notifications** - Transient
- **investmentstrategies** - Template data

### Consider Archiving
- **chatmessages** - Move old conversations to cold storage
- **transactions** - Archive > 2 years old

---

## Security Layers

```
┌─────────────────────────────────────┐
│        Application Security         │
│  • API rate limiting                │
│  • JWT authentication               │
│  • CORS policies                    │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Model Security              │
│  • Password hashing (bcrypt)        │
│  • Field validation                 │
│  • Enum constraints                 │
│  • Required fields                  │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│       Database Security             │
│  • User authentication              │
│  • Role-based access                │
│  • Network restrictions             │
│  • Encryption at rest               │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### Most Common Queries

```javascript
// Get user with settings
const user = await User.findById(userId);
const settings = await UserSettings.getOrCreate(userId);

// Get portfolio summary
const portfolio = await Portfolio.find({ user: userId })
  .sort({ currentValue: -1 });

// Get recent transactions
const transactions = await Transaction.find({ user: userId })
  .sort({ date: -1 })
  .limit(20);

// Get active alerts
const alerts = await PriceAlert.find({ 
  user: userId, 
  isActive: true 
});

// Get unread notifications
const unread = await Notification.find({ 
  user: userId, 
  read: false 
}).sort({ createdAt: -1 });

// Get chat history
const messages = await ChatMessage.getConversationHistory(
  userId, 
  conversationId, 
  50
);
```

---

**Last Updated:** December 25, 2024  
**Diagram Version:** 2.0.0
