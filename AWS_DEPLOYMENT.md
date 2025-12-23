# AWS Deployment Guide for MyDen Investment App

This guide covers deploying the MyDen full-stack application to AWS using ECS Fargate with CodePipeline.

## Architecture Overview

- **Frontend**: React application served via Nginx on ECS Fargate
- **Backend**: Node.js Express API on ECS Fargate
- **Database**: MongoDB Atlas (recommended) or AWS DocumentDB
- **Container Registry**: Amazon ECR
- **Load Balancer**: Application Load Balancer (ALB)
- **CI/CD**: AWS CodePipeline + CodeBuild + CodeDeploy

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Docker installed locally (for testing)
4. MongoDB Atlas account or AWS DocumentDB cluster

## Step 1: Create MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Whitelist AWS IP ranges
3. Create a database user
4. Get your connection string

### Option B: AWS DocumentDB
```bash
# Create DocumentDB cluster (replace with your values)
aws docdb create-db-cluster \
    --db-cluster-identifier myden-docdb \
    --engine docdb \
    --master-username admin \
    --master-user-password YourPassword123 \
    --vpc-security-group-ids sg-xxxxxxxx
```

## Step 2: Store Secrets in AWS Secrets Manager

```bash
# Store MongoDB URI
aws secretsmanager create-secret \
    --name myden/mongo-uri \
    --secret-string "mongodb+srv://username:password@cluster.mongodb.net/myden?retryWrites=true&w=majority"

# Store JWT Secret
aws secretsmanager create-secret \
    --name myden/jwt-secret \
    --secret-string "your-super-secret-jwt-key-change-this"
```

## Step 3: Create ECR Repositories

```bash
# Create backend repository
aws ecr create-repository \
    --repository-name myden-backend \
    --region us-east-1

# Create frontend repository
aws ecr create-repository \
    --repository-name myden-frontend \
    --region us-east-1
```

## Step 4: Create IAM Roles

### ECS Task Execution Role
```bash
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### ECS Task Role
```bash
aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document file://ecs-task-trust-policy.json
```

## Step 5: Update Configuration Files

1. **taskdef.json**: Replace placeholders:
   - `YOUR_ACCOUNT_ID` with your AWS account ID
   - `YOUR_REGION` with your AWS region (e.g., us-east-1)
   
2. **appspec.yml**: Update subnet and security group IDs

3. **buildspec.yml**: Set environment variables in CodeBuild

## Step 6: Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name myden-cluster \
    --region us-east-1
```

## Step 7: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
    --name myden-alb \
    --subnets subnet-xxxxx subnet-yyyyy \
    --security-groups sg-zzzzz \
    --scheme internet-facing

# Create target group
aws elbv2 create-target-group \
    --name myden-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id vpc-xxxxx \
    --target-type ip

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:... \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

## Step 8: Create ECS Service

```bash
aws ecs create-service \
    --cluster myden-cluster \
    --service-name myden-service \
    --task-definition myden-app:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-zzzzz],assignPublicIp=ENABLED}" \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=frontend,containerPort=80
```

## Step 9: Set Up CodePipeline

1. **Create Pipeline**:
   ```bash
   aws codepipeline create-pipeline --cli-input-json file://pipeline.json
   ```

2. **Connect to GitHub**:
   - In AWS Console, go to CodePipeline
   - Add GitHub as source
   - Authorize AWS access to your repository

3. **Configure Build Stage**:
   - Use the provided `buildspec.yml`
   - Environment variables needed:
     - `AWS_DEFAULT_REGION`
     - `AWS_ACCOUNT_ID`
     - `IMAGE_REPO_NAME_BACKEND`
     - `IMAGE_REPO_NAME_FRONTEND`

## Step 10: Test Local Docker Setup

Before deploying to AWS, test locally:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

## Step 11: Deploy to AWS

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "AWS deployment configuration"
   git push origin master
   ```

2. CodePipeline will automatically:
   - Pull code from GitHub
   - Build Docker images
   - Push to ECR
   - Deploy to ECS

## Monitoring and Logs

### View Logs
```bash
# Backend logs
aws logs tail /ecs/myden-backend --follow

# Frontend logs
aws logs tail /ecs/myden-frontend --follow
```

### CloudWatch Metrics
- Navigate to CloudWatch Console
- Check ECS cluster metrics
- Set up alarms for CPU, memory, and request counts

## Scaling

### Auto Scaling
```bash
# Create auto-scaling target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/myden-cluster/myden-service \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 2 \
    --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --resource-id service/myden-cluster/myden-service \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-name cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Cost Optimization

1. **Use Fargate Spot** for non-production environments
2. **Right-size containers**: Start with 0.5 vCPU / 1GB RAM
3. **Enable Container Insights** only when debugging
4. **Use MongoDB Atlas Free Tier** for development
5. **Set up budget alerts** in AWS Billing

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use AWS Secrets Manager** for all credentials
3. **Enable encryption** for ECR, ECS, and RDS/DocumentDB
4. **Configure security groups** with minimal required access
5. **Enable AWS WAF** on the ALB
6. **Use HTTPS** with ACM certificates
7. **Implement IAM least privilege** principle

## Troubleshooting

### Container won't start
- Check CloudWatch logs
- Verify environment variables
- Test Docker image locally

### Can't connect to database
- Check security group rules
- Verify connection string
- Ensure database is publicly accessible or in same VPC

### 502 Bad Gateway
- Backend container not healthy
- Check backend logs
- Verify backend is listening on correct port

## Estimated Monthly Costs

Based on minimal usage:
- **ECS Fargate**: ~$30-50/month (0.5 vCPU, 1GB RAM × 2 tasks)
- **ALB**: ~$20/month
- **MongoDB Atlas**: Free tier (or ~$10-60/month for M10)
- **ECR**: ~$1/month
- **Data Transfer**: ~$5-10/month
- **CloudWatch Logs**: ~$2-5/month

**Total**: ~$60-150/month

## Support

For issues or questions:
- AWS Documentation: https://docs.aws.amazon.com/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Create an issue on GitHub
