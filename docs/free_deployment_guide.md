# Pravah (प्रवाह) — Free Cloud Deployment Guide

This guide details how to deploy the entire **Pravah** platform (FastAPI Backend + Vite React Frontend) live to the web **100% free of charge**, with automatic HTTPS and zero credit card required.

---

## ⚡ Option 1: 1-Click Zero-Config Deployment on Render (Recommended)

Render offers a free tier for both Web Services (Python/FastAPI) and Static Sites (Vite/React). We have pre-configured a [`render.yaml`](../render.yaml) Blueprint in the repository that automatically provisions and links both services.

### Step 1: Sign Up on Render
1. Go to [https://render.com](https://render.com) and click **Get Started for Free**.
2. Sign in with your **GitHub account** (`synapsecreates`).

### Step 2: Deploy with Blueprint
1. In your Render Dashboard, click the **New +** button in the top navigation bar.
2. Select **Blueprint**.
3. Connect your repository: `synapsecreates/pravah`.
4. Render will automatically read `render.yaml` and display two services:
   - **`pravah-backend`** (Python Web Service · Free Tier)
   - **`pravah-frontend`** (Static Site · Free Tier)
5. Click **Apply**.

### Step 3: Access Your Live Application
* Render will install dependencies, build the Vite app, start Uvicorn, and provide two live URLs:
  - **Live Web App**: `https://pravah-frontend.onrender.com`
  - **Live REST API**: `https://pravah-backend.onrender.com/api/v1/health`
  - **Interactive API Docs**: `https://pravah-backend.onrender.com/docs`
* Any future `git push origin main` will automatically rebuild and deploy the updates.

> [!NOTE]
> Free tier services on Render spin down after 15 minutes of inactivity. When a request arrives, they wake up automatically within 20–30 seconds.

---

## 🌐 Option 2: Vercel (Frontend) + Render (Backend)

If you prefer using **Vercel** for the fastest global frontend CDN delivery:

### Step 1: Deploy Backend to Render
1. Sign in to [https://render.com](https://render.com).
2. Click **New +** $	o$ **Web Service**.
3. Select your repository: `synapsecreates/pravah`.
4. Configure the settings:
   * **Name**: `pravah-api`
   * **Root Directory**: `backend`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free`
5. Click **Create Web Service**.
6. Copy your backend URL once live (e.g., `https://pravah-api.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** $	o$ **Project**.
3. Import `synapsecreates/pravah`.
4. Configure Project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and choose `frontend`.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   * **Name**: `VITE_API_URL`
   * **Value**: Your Render backend URL (e.g., `https://pravah-api.onrender.com`)
6. Click **Deploy**.
7. Vercel will deploy your app to `https://pravah.vercel.app` with instant global edge caching and automatic SSL.

---

## 🚀 Option 3: Koyeb (Serverless Container · Free Tier)

[Koyeb](https://www.koyeb.com/) offers a free nano tier that runs Python apps with zero sleep time in Frankfurt/Washington:

1. Sign up on [https://www.koyeb.com](https://www.koyeb.com) with GitHub.
2. Click **Create App** $	o$ **GitHub**.
3. Select `synapsecreates/pravah`.
4. Builder: `Buildpack`
5. Work directory: `backend`
6. Build command: `pip install -r requirements.txt`
7. Run command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
8. Deploy to get a live URL: `https://<your-app>.koyeb.app`.

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Optional (Prod) | `""` (relative `/api/v1`) | Base URL of the backend API (e.g. `https://pravah-api.onrender.com`). |
| `GEMINI_API_KEY` | Optional | `""` | Google Gemini API key for dynamic semantic JD parsing. If omitted, the deterministic offline NOS rule engine activates automatically with 0 errors. |
| `BACKEND_CORS_ORIGINS` | Optional | `["*"]` | Allowed CORS origins for the FastAPI server. |
