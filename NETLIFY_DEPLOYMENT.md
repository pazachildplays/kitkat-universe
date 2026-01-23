# 🚀 Netlify Deployment Guide - KitKat Universe

## Step-by-Step Instructions

### **STEP 1: Prepare Your Project**

1. Open your project folder in terminal
2. Make sure all files are committed to Git:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   ```

---

### **STEP 2: Create GitHub Repository** (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click **New Repository**
3. Name it: `kitkat-universe`
4. Click **Create Repository**
5. Follow the instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kitkat-universe.git
   git branch -M main
   git push -u origin main
   ```

---

### **STEP 3: Sign Up for Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Click **Sign Up**
3. Choose **Sign up with GitHub**
4. Authorize Netlify to access your GitHub

---

### **STEP 4: Deploy to Netlify**

1. In Netlify dashboard, click **Add new site**
2. Choose **Import an existing project**
3. Select **GitHub** as your provider
4. Find and click your `kitkat-universe` repository
5. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm install`
   - **Publish directory**: `public`
   - **Functions directory**: `.netlify/functions`
6. Click **Deploy site**

⏳ **Wait 2-5 minutes for deployment...**

---

### **STEP 5: Your Site is Live!**

You'll get a URL like: `https://xxxxx.netlify.app`

- **Public page**: `https://xxxxx.netlify.app/`
- **Admin panel**: `https://xxxxx.netlify.app/admin`
- **Password**: `kitkat09`

---

## 📝 Important Notes for Netlify

### **Data Storage**
- Your config.json is saved in `/data/` folder on Netlify
- Changes made in admin panel are **saved permanently**
- Files persist between deployments

### **API Endpoints**
Netlify automatically converts your serverless functions:
- `/api/config` → `/.netlify/functions/api`
- `/api/admin/login` → `/.netlify/functions/api`
- All other API calls work the same way

### **Custom Domain** (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `mysite.com`)
4. Follow DNS setup instructions

---

## 🔧 Troubleshooting

### **Login not working?**
- Password is: `kitkat09`
- Check browser console (F12) for errors
- Try clearing browser cache

### **Changes not saving?**
- Check that password is correct
- Ensure file permissions allow writing to `/data/`
- Check Netlify function logs in dashboard

### **API endpoints returning 404?**
- Verify `netlify.toml` exists in root
- Check that `.netlify/functions/api.js` exists
- Redeploy: Go to **Deploys** → **Trigger deploy**

---

## 📱 Making Changes After Deployment

1. Make changes to your files locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Updated site"
   git push
   ```
3. Netlify automatically redeploys (2-5 minutes)

---

## 🎉 You're Done!

Your KitKat Universe site is now live on Netlify!

Share your link: `https://xxxxx.netlify.app/`

Need help? Check Netlify documentation: [docs.netlify.com](https://docs.netlify.com)
