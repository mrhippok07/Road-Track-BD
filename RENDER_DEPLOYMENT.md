# 🚀 Road Track BD - Deployment Guide (Render.com)

Follow these steps to deploy your **Road Track BD** platform from GitHub to Render.

## 1. Prepare Your GitHub Repository
Ensure all your files are pushed to a GitHub repository.
1. Initialize Git (if not already): `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Final production ready platform"`
4. Push to your GitHub repo.

---

## 2. Deploy to Render.com
Render is a great free hosting platform for Node.js backends.

### Step A: Create a New Web Service
1. Log in to [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `Road-Track-BD4` repository.

### Step B: Configure Build & Start Settings
Configure the service with these settings:
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node backend/server.js` (or `npm start` if you have a start script)

### Step C: Environment Variables
Click on the **Environment** tab and add the following:
| Key | Value | Note |
|-----|-------|------|
| `PORT` | `10000` | Render usually provides this |
| `JWT_SECRET` | `your_secret_key` | Make it strong! |
| `GOOGLE_MAPS_API_KEY` | `your_google_maps_key` | From Google Cloud Console |
| `NODE_ENV` | `production` | Enables production optimizations |

---

## 3. GitHub Pages (For Frontend - Optional)
Since this is a full-stack App (Node.js + Express), **Render** will host both the frontend and backend together. You do **NOT** need GitHub Pages separately unless you want to split them. Render will serve the `frontend/` folder automatically via Express.

#### 🔗 Your App URL:
Once deployed, Render will provide a URL like `https://road-track-bd.onrender.com`.

---

## 4. Final Production Checklist
- [ ] Ensure `.env` is NOT uploaded to GitHub (added to `.gitignore`).
- [ ] Check if the Google Maps API Key has "HTTP Referrer" restrictions set to your Render URL for security.
- [ ] Verify that all image paths remain correct.

---

### Support
Developed with ❤️ by Antigravity (Google DeepMind) for **Road Track BD**.
