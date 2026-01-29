# Deploy to Netlify

## Prerequisites
1. Have a Netlify account (https://netlify.com)
2. Have your project on GitHub/GitLab/Bitbucket
3. Have a Firebase project set up (for database)

## Deployment Steps

### Option 1: Using Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy the project**
   ```bash
   netlify deploy --prod
   ```

4. **Follow the prompts:**
   - Create a new site
   - Select your team
   - Site name (optional)
   - Publish directory: `public` (Netlify will detect this from netlify.toml)

### Option 2: Using Git Integration

1. **Push your project to GitHub**
2. **Log in to Netlify Dashboard**
3. **Click "Add new site" > "Import from Git"**
4. **Select your repository**
5. **Build settings:**
   - Build command: `npm install` (if needed)
   - Publish directory: `public` (Netlify will detect this from netlify.toml)
   - Functions directory: `api`

## Environment Variables Setup

You must set these variables in **Site settings > Build & deploy > Environment**:

1. **`FIREBASE_SERVICE_ACCOUNT`**
   - The entire content of your Firebase service account JSON file.
   - *Note: Remove newlines if pasting into some UI fields, though Netlify handles JSON well.*
2. **`ADMIN_PASSWORD`**
   - The password for the admin panel (e.g., `kitkat09`).

## Important Configuration Files

- `netlify.toml` - Netlify configuration (redirects and build settings)
- `api/` - API endpoints (Node.js serverless functions)
- `public/` - Static files (HTML, CSS, JS)

## Data Persistence

Your app uses **Firebase Firestore** for:
- Config (title, colors, links, contacts)
- Game leaderboards

Data is stored in the `settings` collection, document `main`.

## API Endpoints (After Deployment)

Base URL: `https://YOUR-SITE.netlify.app`

- `GET /` - Main page
- `GET /games` - Games page
- `GET /admin` - Admin panel
- `POST /api/admin/login` - Login
- `GET /api/config` - Get configuration
- `POST /api/admin/update` - Update config
- `POST /api/admin/links` - Manage links
- `POST /api/admin/leaderboard` - Save scores
- `GET /api/leaderboard?game=uno` - Get leaderboard

## Troubleshooting

**Issue: 500 Error on Save**
- Solution: Check that `FIREBASE_SERVICE_ACCOUNT` is set correctly in Netlify environment variables.

**Issue: 404 on API calls**
- Solution: Ensure `netlify.toml` is in the root directory.

## Local Testing Before Deployment

```bash
npm install netlify-cli -g
netlify dev
```

Visit http://localhost:3000

## After Deployment

Your site will be live at: `https://YOUR_PROJECT_NAME.netlify.app`

Share this link with your users!
