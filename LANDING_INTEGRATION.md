# 🌐 Landing Page Integration Guide

## Overview

The landing page is now integrated as the main entry point for MyDen, with links to your React application.

---

## 🔗 URL Structure

### Development
- **Landing Page**: `file:///path/to/landing-page/index.html` or via local server
- **React App**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login`
- **Signup**: `http://localhost:3000/signup`
- **Backend API**: `http://localhost:5000`

### Production
- **Landing Page**: `https://myden.io` (root domain)
- **React App**: `https://app.myden.io` (subdomain)
- **Login**: `https://app.myden.io/login`
- **Signup**: `https://app.myden.io/signup`
- **Backend API**: `https://api.myden.io`

---

## 🚀 Setup Options

### Option 1: Simple Local Development (Current Setup)

**Run both separately:**

```bash
# Terminal 1 - React App (port 3000)
cd frontend
npm start

# Terminal 2 - Landing Page (port 8000)
cd landing-page
python -m http.server 8000

# Terminal 3 - Backend (port 5000)
cd backend
npm start
```

**Access:**
- Landing: `http://localhost:8000`
- App: `http://localhost:3000`

---

### Option 2: Serve Landing from React App

Move landing page to React's `public` folder:

```bash
# Copy landing page to React public folder
cp landing-page/index.html frontend/public/landing.html
cp landing-page/styles.css frontend/public/landing-styles.css
cp landing-page/script.js frontend/public/landing-script.js
```

Update `frontend/public/landing.html` links to relative paths.

**Access:** `http://localhost:3000/landing.html`

---

### Option 3: Reverse Proxy with Express

Create `backend/src/routes/landing.js`:

```javascript
const express = require('express');
const router = express.Router();
const path = require('path');

// Serve landing page
router.use(express.static(path.join(__dirname, '../../../landing-page')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../landing-page/index.html'));
});

module.exports = router;
```

Add to `backend/src/app.js`:
```javascript
const landingRouter = require('./routes/landing');
app.use('/', landingRouter);
```

**Access:** `http://localhost:5000` (backend serves landing page)

---

## 🌍 Production Deployment

### Recommended: Separate Deployments

**Landing Page → Netlify/Vercel**
```bash
cd landing-page
netlify deploy --prod
# or
vercel --prod
```

**React App → Vercel/Netlify**
```bash
cd frontend
vercel --prod
```

**Backend → Railway/Heroku**
```bash
cd backend
git push heroku master
```

### Update Production URLs

Edit `landing-page/index.html` to use production URLs:

```html
<!-- Replace localhost:3000 with production URL -->
<a href="https://app.myden.io/login" class="btn-login">Login</a>
<a href="https://app.myden.io/signup" class="btn-primary">Get Started</a>
```

---

## 📝 Configuration Files

### For Different Environments

Create `landing-page/config.js`:

```javascript
const config = {
    development: {
        appUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:5000'
    },
    production: {
        appUrl: 'https://app.myden.io',
        apiUrl: 'https://api.myden.io'
    }
};

const env = window.location.hostname === 'localhost' ? 'development' : 'production';
window.MYDEN_CONFIG = config[env];
```

Then in `index.html`:
```html
<script src="config.js"></script>
<script>
    // Use dynamic URLs
    document.querySelectorAll('a[href*="localhost:3000"]').forEach(link => {
        link.href = link.href.replace('http://localhost:3000', window.MYDEN_CONFIG.appUrl);
    });
</script>
```

---

## 🎯 User Flow

```
User visits Landing Page
        ↓
Clicks "Get Started" or "Login"
        ↓
Redirects to React App (localhost:3000 or app.myden.io)
        ↓
User signs up or logs in
        ↓
React App loads Dashboard
```

---

## 🔧 Quick Test

1. **Start all servers:**
   ```bash
   # React App
   cd frontend && npm start &
   
   # Backend
   cd backend && npm start &
   
   # Landing Page
   cd landing-page && python -m http.server 8000
   ```

2. **Open landing page:**
   ```
   http://localhost:8000
   ```

3. **Click "Get Started":**
   - Should redirect to `http://localhost:3000/signup`
   
4. **Click "Login":**
   - Should redirect to `http://localhost:3000/login`

---

## 📋 Updated Links

All these buttons/links now point to React app:

**Navigation:**
- Login button → `http://localhost:3000/login`
- Get Started button → `http://localhost:3000/signup`

**Hero Section:**
- "Start Investing Free" → `http://localhost:3000/signup`

**Pricing:**
- Free plan "Get Started" → `http://localhost:3000/signup`
- Pro plan "Start Free Trial" → `http://localhost:3000/signup?plan=pro`

**CTA Section:**
- "Start Investing Today" → `http://localhost:3000/signup`

**Mobile Menu:**
- Login → `http://localhost:3000/login`
- Get Started → `http://localhost:3000/signup`

---

## 🎨 Customization

### Update URLs for Production

Create a build script `landing-page/build.sh`:

```bash
#!/bin/bash

# Replace localhost with production URLs
sed -i 's|http://localhost:3000|https://app.myden.io|g' index.html

echo "✅ URLs updated for production"
```

Make it executable:
```bash
chmod +x build.sh
./build.sh
```

---

## 🚀 Deployment Checklist

### Before Deploying Landing Page

- [ ] Update all URLs from localhost to production
- [ ] Test all links work correctly
- [ ] Verify mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Test in different browsers
- [ ] Optimize images (if any added)
- [ ] Minify CSS/JS (optional)

### Deploy Landing Page

```bash
cd landing-page

# Option 1: Netlify Drop
# Drag folder to app.netlify.com/drop

# Option 2: Netlify CLI
netlify deploy --prod

# Option 3: Vercel
vercel --prod

# Option 4: GitHub Pages
git subtree push --prefix landing-page origin gh-pages
```

---

## 📊 Analytics

Add Google Analytics to track conversions:

```html
<!-- Before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
  
  // Track signup clicks
  document.querySelectorAll('a[href*="/signup"]').forEach(btn => {
    btn.addEventListener('click', () => {
      gtag('event', 'click', {
        'event_category': 'CTA',
        'event_label': 'Signup Button'
      });
    });
  });
</script>
```

---

## ✅ Summary

**Current Setup:**
- ✅ Landing page links to React app (localhost:3000)
- ✅ All CTA buttons updated
- ✅ Mobile menu links updated
- ✅ Ready for local testing

**Next Steps:**
1. Test landing page → signup flow
2. Test landing page → login flow
3. Update URLs for production deployment
4. Deploy landing page separately
5. Set up domain/subdomain routing

---

**Last Updated:** December 26, 2024  
**Status:** ✅ Integrated & Ready to Test!
