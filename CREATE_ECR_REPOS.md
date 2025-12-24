# Create ECR Repositories for Your App

## You need to create 2 ECR repositories in us-east-2

### Method 1: AWS Console (Easiest - 2 minutes)

1. **Go to ECR Console**: https://us-east-2.console.aws.amazon.com/ecr/repositories
2. **Click "Create repository"**
3. **Repository 1**:
   - Repository name: `myden-backend`
   - Leave other settings as default
   - Click "Create repository"
4. **Click "Create repository" again**
5. **Repository 2**:
   - Repository name: `myden-frontend`
   - Leave other settings as default
   - Click "Create repository"

### Method 2: AWS CLI (If you have it)

```bash
# Create backend repository
aws ecr create-repository --repository-name myden-backend --region us-east-2

# Create frontend repository
aws ecr create-repository --repository-name myden-frontend --region us-east-2
```

### Verify

You should see both repositories listed at:
https://us-east-2.console.aws.amazon.com/ecr/repositories

---

## ✅ After Creating Repositories

The buildspec.yml will be able to push Docker images to:
- `921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-backend`
- `921963185108.dkr.ecr.us-east-2.amazonaws.com/myden-frontend`

**Do this NOW before the next build!**
