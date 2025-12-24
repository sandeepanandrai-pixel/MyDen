# 🚀 DEPLOY NOW - Your Specific Configuration

## ✅ Your MongoDB is Ready!
Connection String: 
```
mongodb+srv://sandeepanandrai_db_user:H40NJgy378ohlNuH@myden.yzrreio.mongodb.net/myden?retryWrites=true&w=majority
```

---

## NEXT STEPS:

### Step 1: Launch EC2 Instance (10 minutes)

1. **Go to EC2 Console**: https://console.aws.amazon.com/ec2/v2/home?region=us-east-2#Instances:
2. **Click "Launch Instance"**
3. **Configure**:
   ```
   Name: MyDen-App
   AMI: Amazon Linux 2023 AMI
   Instance type: t3.medium (or t3.micro for lower cost)
   Key pair: Create new → Name it "myden-key" → Download myden-key.pem
   
   Network Settings → Edit:
   - Create security group: myden-app-sg
   - Add rules:
     * SSH (22) - My IP
     * HTTP (80) - Anywhere (0.0.0.0/0)
     * Custom TCP (5000) - Anywhere (0.0.0.0/0)
   
   Storage: 20 GB gp3
   ```
4. **Click "Launch Instance"**
5. **Wait 2 minutes**, then copy the **Public IPv4 address**

---

### Step 2: Connect to Your EC2 (5 minutes)

#### On Windows PowerShell:
```powershell
# Navigate to where you downloaded the .pem file
cd Downloads

# Fix permissions
icacls "myden-key.pem" /inheritance:r
icacls "myden-key.pem" /grant:r "$($env:USERNAME):(R)"

# Connect (replace YOUR_EC2_IP with actual IP)
ssh -i myden-key.pem ec2-user@YOUR_EC2_IP
```

---

### Step 3: Setup Server (10 minutes)

Once connected to EC2, run these commands:

```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Verify installations
node --version  # Should show v18.x
npm --version
pm2 --version

# Install nginx for frontend
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Step 4: Deploy Backend (10 minutes)

```bash
# Create app directory
mkdir -p ~/myden-app
cd ~/myden-app

# Clone your code from GitHub
git clone https://github.com/sandeepanandrai-pixel/MyDen.git .

# Or upload via SCP if you prefer
# (On your local machine):
# scp -i myden-key.pem -r ./my-fullstack-app ec2-user@YOUR_EC2_IP:~/myden-app

# Install backend dependencies
cd backend
npm install --production

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://sandeepanandrai_db_user:H40NJgy378ohlNuH@myden.yzrreio.mongodb.net/myden?retryWrites=true&w=majority
JWT_SECRET=myden-super-secret-jwt-key-change-this-in-production-2024
FRONTEND_URL=http://YOUR_EC2_IP
EOF

# Replace YOUR_EC2_IP with actual IP
nano .env
# Update FRONTEND_URL with your EC2 public IP, then Ctrl+X, Y, Enter

# Start backend with PM2
pm2 start src/app.js --name myden-backend
pm2 save
pm2 startup  # Follow the command it shows
```

---

### Step 5: Deploy Frontend (15 minutes)

```bash
# Go to frontend directory
cd ~/myden-app/frontend

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://YOUR_EC2_IP:5000
EOF

# Update with your EC2 IP
nano .env
# Replace YOUR_EC2_IP, then Ctrl+X, Y, Enter

# Install dependencies
npm install

# Build the app
npm run build

# Copy build to nginx directory
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r build/* /usr/share/nginx/html/

# Configure nginx
sudo tee /etc/nginx/conf.d/myden.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Restart nginx
sudo systemctl restart nginx

# Remove default config
sudo rm /etc/nginx/conf.d/default.conf 2>/dev/null || true
sudo systemctl restart nginx
```

---

### Step 6: Access Your Live App! 🎉

**Open your browser and go to:**
```
http://YOUR_EC2_IP
```

You should see your app running live!

---

## 🐛 Troubleshooting

### Check backend status:
```bash
pm2 status
pm2 logs myden-backend
```

### Check frontend:
```bash
sudo systemctl status nginx
sudo nginx -t  # Test config
sudo tail -f /var/log/nginx/error.log
```

### Restart services:
```bash
pm2 restart myden-backend
sudo systemctl restart nginx
```

### Check MongoDB connection:
```bash
cd ~/myden-app/backend
node
> const mongoose = require('mongoose');
> mongoose.connect('YOUR_MONGO_URI');
> .exit
```

---

## 🔒 Important Security Notes

**After your app is working**, do these:

1. **Change JWT Secret**:
   ```bash
   cd ~/myden-app/backend
   nano .env
   # Change JWT_SECRET to a long random string
   pm2 restart myden-backend
   ```

2. **Restrict SSH**:
   - Go to EC2 console → Security Groups
   - Edit SSH rule to only allow your IP

3. **Setup HTTPS** (later):
   - Get a domain name
   - Use Let's Encrypt for free SSL

---

## 💰 Cost

**Running costs:**
- t3.medium: ~$0.042/hour (~$30/month)
- t3.micro: ~$0.010/hour (~$7/month) - cheaper but slower
- MongoDB Atlas M0: FREE
- Data transfer: ~$5/month

**To save money:**
- Stop EC2 when not in use
- Use t3.micro instead
- Setup auto-shutdown schedule

---

## 📝 Quick Commands

**Start backend**: `pm2 start myden-backend`
**Stop backend**: `pm2 stop myden-backend`
**Restart backend**: `pm2 restart myden-backend`
**View backend logs**: `pm2 logs myden-backend`

**Restart nginx**: `sudo systemctl restart nginx`
**Check nginx**: `sudo systemctl status nginx`

**Update app**:
```bash
cd ~/myden-app
git pull
cd backend && npm install && pm2 restart myden-backend
cd ../frontend && npm install && npm run build && sudo cp -r build/* /usr/share/nginx/html/
```

---

**YOU'RE LIVE! 🚀**

**Your app URL**: `http://YOUR_EC2_IP`
