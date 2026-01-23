# KitKat Universe - Deployment Guide for Render

## Quick Deployment Steps

### Step 1: Set Up MongoDB (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a cluster (free tier available)
4. Create a database user:
   - Username: `kitkat`
   - Password: `kitkat09`
5. Get your connection string from MongoDB:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://kitkat:kitkat09@cluster0.xxx.mongodb.net/kitkat-universe...`)

### Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Create a new repository called `kitkat-universe`
3. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kitkat-universe.git
   cd kitkat-universe
   ```

4. Copy all files to this directory:
   - `server.js`
   - `package.json`
   - `.env`
   - All HTML, CSS, JS files (index.html, admin.html, login.html, etc.)

5. Initialize git and push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 3: Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up (free account)
3. Click "New +" → "Web Service"
4. Connect your GitHub account and select the `kitkat-universe` repository
5. Configure the deployment:
   - **Name:** kitkat-universe
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. Add Environment Variables:
   - Click "Add Environment Variable"
   - Add your MongoDB connection string:
     - **Key:** `MONGODB_URI`
     - **Value:** Your MongoDB connection string from Step 1

7. Click "Deploy"

**Wait for deployment to complete** (usually takes 1-2 minutes)

### Step 4: Get Your Live URL

After deployment completes:
- Your site will be at: `https://kitkat-universe.onrender.com` (or similar)
- Update the `API_BASE_URL` in your JS files if needed (usually auto-detects)

---

## Local Testing (Before Deploying)

1. Install Node.js from [nodejs.org](https://nodejs.org)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit: `http://localhost:3000`
   - Main site: `http://localhost:3000`
   - Login: `http://localhost:3000/login`
   - Admin: `http://localhost:3000/admin`

---

## How to Use

### Main Site
- Shows commission status and links
- Automatically updates when admin makes changes
- No password needed

### Admin Panel
- URL: `https://your-site.onrender.com/admin`
- Login with password: `kitkat09`
- Manage links, settings, colors
- All changes sync instantly to the main site

### API Endpoints

**Get Settings:**
```
GET /api/settings
```

**Update Settings:**
```
POST /api/settings
Body: { settings object }
```

**Add Link:**
```
POST /api/links
Body: { title, url, icon }
```

**Update Link:**
```
PUT /api/links/:id
Body: { title, url, icon }
```

**Delete Link:**
```
DELETE /api/links/:id
```

---

## Troubleshooting

**Issue:** "Cannot connect to MongoDB"
- Check MongoDB URI in `.env` file
- Verify MongoDB cluster is active
- Add Render's IP to MongoDB whitelist (allow all IPs: 0.0.0.0/0)

**Issue:** "Settings not loading on main page"
- Check browser console (F12) for errors
- Verify API_BASE_URL matches your Render URL
- Wait 30 seconds for updates to sync

**Issue:** "Admin panel redirects to login"
- Clear browser cache
- Make sure you're using the correct password: `kitkat09`

---

## File Structure

```
kitkat-universe/
├── server.js              (Node.js backend)
├── package.json           (Dependencies)
├── .env                   (Environment variables)
├── index.html             (Main site)
├── admin.html             (Admin panel)
├── login.html             (Login page)
├── main.js                (Main site logic)
├── admin.js               (Admin logic)
├── login.js               (Login logic)
├── styles.css             (Main styles)
├── admin.css              (Admin styles)
└── login.css              (Login styles)
```

---

## Important Notes

✅ **Free Tier Includes:**
- Render: 750 free hours/month (more than enough)
- MongoDB: 5GB storage (more than enough)
- No credit card needed to start

⚠️ **Remember:**
- Change the admin password in `login.js` before deploying
- Use a strong MongoDB password in production
- Render spins down free sites after 15 minutes of inactivity (they wake up automatically)

---

## Need Help?

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Node.js Docs](https://nodejs.org/en/docs/)
