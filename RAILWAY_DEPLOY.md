# 🚂 Railway Deployment Guide

## ✅ Your Backend is Railway-Ready!

### Files Added:
- `backend/railway.toml` - Railway configuration
- Health check endpoint: `/api/health` ✅

---

## 🚀 Deploy Backend to Railway (5 Minutes)

### Step 1: Go to Railway

**Click**: https://railway.app/new

### Step 2: Sign In
- Click **"Login with GitHub"**
- Authorize Railway to access your repositories

### Step 3: Create New Project
1. Click **"Deploy from GitHub repo"**
2. Find and select **"MyDen"**
3. Railway will import your repository

### Step 4: Configure Service

Once created, **click on the service card**, then:

1. **Settings** → **General**:
   - **Root Directory**: `backend`
   - **Watch Paths**: `backend/**`

2. **Settings** → **Deploy**:
   - **Start Command**: `node src/app.js` (auto-detected from railway.toml)
   - **Build Command**: `npm install --production`

### Step 5: Add Environment Variables

Click **"Variables"** tab, then **"Raw Editor"**, paste this:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://sandeepanandrai_db_user:H40NJgy378ohlNuH@myden.yzrreio.mongodb.net/myden?retryWrites=true&w=majority
JWT_SECRET=myden-super-secret-jwt-2024-production
FRONTEND_URL=https://my-den-beta.vercel.app
```

Click **"Update Variables"**

### Step 6: Deploy

Railway will automatically deploy when you save the variables!

**Progress:**
```
⏳ Building...
⏳ Installing dependencies...
⏳ Starting application...
✅ Deployed!
```

**Wait 2-3 minutes...**

### Step 7: Get Your Railway URL

Once deployed:
1. **Click** "Settings"
2. **Scroll to** "Domains"
3. **Click** "Generate Domain"
4. **Copy** the URL (looks like: `https://myden-production-xxxx.up.railway.app`)

---

## 🔗 Connect to Your Frontend

### Update Vercel:

1. **Go to**: https://vercel.com/dashboard
2. **Click** your **my-den-beta** project
3. **Settings** → **Environment Variables**
4. **Edit** `REACT_APP_API_URL`:
   - Change to: `https://your-railway-url.up.railway.app`
5. **Save**

### Redeploy Frontend:

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## ✅ Test Your Complete App!

**Visit**: https://my-den-beta.vercel.app/

You should be able to:
- ✅ Create an account
- ✅ Login
- ✅ See dashboard
- ✅ View market data
- ✅ Everything works end-to-end!

---

## 🐛 Troubleshooting

### Backend Build Failed:

**Check Railway logs**:
- Click on deployment
- View build logs
- Look for error message

**Common fixes**:
- Ensure `backend` root directory is set
- Check environment variables are correct
- Verify MongoDB connection string

### Backend Started But Not Responding:

**Check health endpoint**:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### CORS Errors:

Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly:
```
https://my-den-beta.vercel.app
```
(no trailing slash!)

---

## 💰 Railway Free Tier:

- **$5/month** credit (free)
- **500 hours/month** execution time
- **100 GB** outbound bandwidth
- **More than enough** for development and demo!

---

## 📊 Your Complete Stack:

```
Frontend: Vercel
  └─ https://my-den-beta.vercel.app
  └─ Free, HTTPS, CDN, Auto-deploy

Backend: Railway
  └─ https://myden-production-xxxx.up.railway.app
  └─ Free $5 credit/month, Auto-deploy

Database: MongoDB Atlas
  └─ mongodb+srv://myden.yzrreio.mongodb.net/myden
  └─ Free M0 cluster forever
```

**Total Monthly Cost: $0** 🎉

---

## 📋 Deployment Checklist:

- [x] Backend configured for Railway ✅
- [x] railway.toml added ✅
- [x] Health check endpoint exists ✅
- [ ] Signed up for Railway
- [ ] Created new project from GitHub
- [ ] Set root directory to `backend`
- [ ] Added environment variables
- [ ] Generated Railway domain
- [ ] Updated Vercel with Railway URL
- [ ] Redeployed Vercel
- [ ] Tested complete app!

---

## 🚀 Next Steps After Deployment:

1. **Custom Domain** (optional):
   - Buy domain (GoDaddy, Namecheap, etc.)
   - Add to Vercel
   - Update Railway FRONTEND_URL

2. **Monitoring** (optional):
   - Railway has built-in metrics
   - Add Sentry for error tracking

3. **Scaling** (when needed):
   - Railway auto-scales
   - MongoDB Atlas can upgrade cluster

**You're Live! Share your app with the world!** 🌍✨
