# 🚀 QUICK DEPLOY GUIDE - Get Live in 1 Hour

## Step 1: Fix Docker Build (15 minutes)

### Create docker-compose.yml for easy deployment

```yaml
version: '3.8'

services:
  backend:
    image: 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-backend:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=http://YOUR_EC2_IP:3000
    restart: unless-stopped

  frontend:
    image: 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-frontend:latest
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://YOUR_EC2_IP:5000
    restart: unless-stopped
    depends_on:
      - backend
```

## Step 2: Setup MongoDB Atlas (10 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create FREE account
3. Click "Build a Database" → Choose FREE tier (M0)
4. Choose AWS as provider, us-east-2 region
5. Click "Create"
6. Create database user:
   - Username: `mydenuser`
   - Password: (generate strong password - save it!)
7. Add IP: Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
8. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://mydenuser:<password>@cluster0.xxxxx.mongodb.net/myden?retryWrites=true&w=majority`

## Step 3: Launch EC2 Instance (10 minutes)

### Using AWS Console:

1. **Go to EC2**: https://console.aws.amazon.com/ec2/
2. **Click "Launch Instance"**
3. **Configure**:
   - Name: `MyDen-App`
   - AMI: **Amazon Linux 2023** (or Ubuntu 22.04)
   - Instance type: **t3.medium** (2 vCPU, 4GB RAM - free tier eligible for 1 month)
   - Key pair: Create new or use existing (SAVE THE .pem FILE!)
   - Network: Allow SSH (22), HTTP (80), Custom TCP (5000)
   - Storage: 20 GB gp3
4. **Click "Launch Instance"**
5. **Wait 2 minutes** for it to start
6. **Copy Public IP address**

### Security Group Rules:
```
SSH (22) - Your IP
HTTP (80) - 0.0.0.0/0
Custom TCP (5000) - 0.0.0.0/0
HTTPS (443) - 0.0.0.0/0 (for later)
```

## Step 4: Connect to EC2 & Setup (15 minutes)

### SSH into your instance:

#### Windows (PowerShell):
```powershell
# Fix permissions on .pem file (one time)
icacls "path\to\your-key.pem" /inheritance:r
icacls "path\to\your-key.pem" /grant:r "$($env:USERNAME):(R)"

# Connect
ssh -i "path\to\your-key.pem" ec2-user@YOUR_EC2_PUBLIC_IP
```

#### Mac/Linux:
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

### Once connected, run these commands:

```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

### SSH back in:
```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

## Step 5: Deploy Your App (10 minutes)

### Configure AWS CLI and login to ECR:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 921963185108.dkr.ecr.us-east-2.amazonaws.com
```

### Create docker-compose.yml:

```bash
# Create project directory
mkdir ~/myden-app && cd ~/myden-app

# Create docker-compose.yml
nano docker-compose.yml
```

**Paste this (update YOUR_EC2_IP and MONGO_URI):**

```yaml
version: '3.8'

services:
  backend:
    image: 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-backend:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGO_URI=mongodb+srv://mydenuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/myden?retryWrites=true&w=majority
      - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
      - FRONTEND_URL=http://YOUR_EC2_IP
    restart: unless-stopped

  frontend:
    image: 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-frontend:latest
    ports:
      - "80:80"
    restart: unless-stopped
    depends_on:
      - backend
```

**Save**: Ctrl+X, Y, Enter

### Pull images and start:

```bash
# Pull images from ECR
docker-compose pull

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Step 6: Access Your Live App! (2 minutes)

**Open browser and go to:**
```
http://YOUR_EC2_PUBLIC_IP
```

You should see your app running! 🎉

---

## 🐛 Troubleshooting

### If app doesn't load:

```bash
# Check if containers are running
docker ps

# Check backend logs
docker-compose logs backend

# Check frontend logs
docker-compose logs frontend

# Restart everything
docker-compose down
docker-compose up -d
```

### If MongoDB connection fails:

1. Check connection string format
2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
3. Check username/password

### If images don't exist in ECR:

**You need to build and push first:**

```bash
# On your local machine or use CodeBuild
cd backend
docker build -t 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-backend:latest .
docker push 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-backend:latest

cd ../frontend
docker build -t 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-frontend:latest .
docker push 921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-frontend:latest
```

---

## ✅ You're Live!

Your app is now running at: `http://YOUR_EC2_IP`

### Next Steps (Optional):

1. **Get a domain** (GoDaddy, Namecheap, Route 53)
2. **Setup HTTPS** (Let's Encrypt + nginx)
3. **Add auto-restart** (systemd service)
4. **Setup backups** (MongoDB snapshots)
5. **Add monitoring** (CloudWatch)

---

## 🎯 Quick Reference

**Start app**: `docker-compose up -d`
**Stop app**: `docker-compose down`
**View logs**: `docker-compose logs -f`
**Restart**: `docker-compose restart`
**Update**: `docker-compose pull && docker-compose up -d`

**EC2 IP**: Save this somewhere!
**MongoDB URI**: Keep this secret!
**JWT Secret**: Change before production!

---

## 💰 Cost Estimate

**Monthly cost (if you keep running):**
- EC2 t3.medium: ~$30/month (or FREE for 750 hours/month first year)
- MongoDB Atlas M0: FREE forever
- Data transfer: ~$5/month
- **Total**: ~$35/month (or FREE with AWS free tier)

**To minimize costs:**
- Stop EC2 when not using
- Use t3.micro instead ($7/month)
- Set up auto-shutdown at night

---

**YOU'RE LIVE! 🚀**
