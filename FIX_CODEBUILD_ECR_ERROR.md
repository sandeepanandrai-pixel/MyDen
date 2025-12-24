# 🔧 Fix CodeBuild ECR Permission Error

## ❌ **Error:**
```
AccessDeniedException: User is not authorized to perform: ecr:GetAuthorizationToken
```

## ✅ **Solution: Add ECR Permissions to CodeBuild Role**

### **Method 1: AWS Console (Easiest - 2 minutes)**

1. **Open IAM Console**:
   - Go to: https://console.aws.amazon.com/iam/
   - Click **Roles** in the left sidebar

2. **Find CodeBuild Role**:
   - Search for: `codebuild-MyDen_CICD-service-role`
   - Click on the role name

3. **Attach ECR Policy**:
   - Click **Add permissions** → **Attach policies**
   - Search for: `AmazonEC2ContainerRegistryPowerUser`
   - Check the box next to it
   - Click **Attach policies**

4. **Verify**:
   - You should see `AmazonEC2ContainerRegistryPowerUser` in the policies list
   - Role now has these permissions:
     - `ecr:GetAuthorizationToken`
     - `ecr:BatchCheckLayerAvailability`
     - `ecr:GetDownloadUrlForLayer`
     - `ecr:BatchGetImage`
     - `ecr:PutImage`
     - `ecr:InitiateLayerUpload`
     - `ecr:UploadLayerPart`
     - `ecr:CompleteLayerUpload`

5. **Retry Build**:
   - Go to CodeBuild
   - Click **Start build** again

---

### **Method 2: AWS CLI (If you have AWS CLI installed)**

```bash
# Attach ECR policy to CodeBuild role
aws iam attach-role-policy \
  --role-name codebuild-MyDen_CICD-service-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

# Verify it's attached
aws iam list-attached-role-policies \
  --role-name codebuild-MyDen_CICD-service-role
```

---

### **Method 3: CloudFormation/Terraform (For Infrastructure as Code)**

If using CloudFormation, update your template:

```yaml
CodeBuildRole:
  Type: AWS::IAM::Role
  Properties:
    ManagedPolicyArns:
      - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
      # ... other policies
```

---

## 🔍 **Why This Happened:**

- CodeBuild needs to:
  1. **Authenticate** with ECR (`ecr:GetAuthorizationToken`)
  2. **Push images** to ECR repositories
  3. **Pull images** if needed

- The service role was created without ECR permissions
- This is a common first-time setup issue

---

## ✅ **After Fixing:**

Your CodeBuild will be able to:
- ✅ Log in to ECR
- ✅ Push Docker images
- ✅ Pull Docker images
- ✅ Complete the build successfully

---

## 🚀 **Next Steps:**

1. **Add the policy** (Method 1 above)
2. **Go to CodeBuild console**
3. **Click "Retry build"**
4. **Watch it succeed!** 🎉

---

## 📝 **Common Issues After This:**

If you still get errors, check:

1. **ECR Repositories Exist**:
   ```bash
   aws ecr describe-repositories --repository-names myden-backend myden-frontend
   ```

2. **CodeBuild Has Other Required Permissions**:
   - CloudWatch Logs (for logging)
   - S3 (for artifacts)
   - VPC (if using VPC)

3. **Buildspec.yml is Correct**:
   - Repository names match
   - Region is correct
   - No syntax errors

---

## 🎯 **Quick Checklist:**

- [ ] IAM role `codebuild-MyDen_CICD-service-role` exists
- [ ] Policy `AmazonEC2ContainerRegistryPowerUser` is attached
- [ ] ECR repositories `myden-backend` and `myden-frontend` exist
- [ ] CodeBuild project points to correct GitHub repo
- [ ] Buildspec.yml is in the root of your repo

---

## 💡 **Pro Tip:**

For production, create a **custom IAM policy** with only the permissions you need:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": [
        "arn:aws:ecr:us-east-1:921963185108:repository/myden-backend",
        "arn:aws:ecr:us-east-1:921963185108:repository/myden-frontend"
      ]
    }
  ]
}
```

This follows the **principle of least privilege**.

---

**Let me know once you've added the policy and I'll help with the next step!** 🚀
