# Render Free Tier Keep-Alive Guide

This guide explains how to keep your Pravah FastAPI backend service permanently warm on **Render's Free Tier** using a free scheduled HTTP cron ping.

---

## 1. Why Keep-Alive Is Needed

Render's free web services automatically **spin down (sleep) after 15 minutes of inbound HTTP inactivity**. 
* When a dormant service receives a new visitor, it undergoes a **cold start** taking between **40 to 60 seconds** to provision the container and boot the FastAPI application.
* Pravah is equipped with an 8-second startup probe and client-side fallback equations. If Render takes > 8 seconds to wake up, the frontend automatically falls back to illustrative local demo data and displays the top banner:
  > **Demo data mode — backend unreachable. Numbers shown are illustrative.**

By setting up an automated HTTP GET ping every **10 minutes**, your Render web service stays continuously active, eliminating cold starts entirely and ensuring immediate live responses.

---

## 2. Dedicated Keep-Alive Endpoint

Pravah provides a dedicated, lightweight health ping route designed specifically for keep-alive monitoring:

```http
GET /api/v1/health/ping
```

* **Response**: `{"status": "pong"}` (HTTP 200 OK)
* **Overhead**: Microsecond execution, 0 database queries, minimal memory footprint.
* **Full URL**: `https://<your-render-service-name>.onrender.com/api/v1/health/ping`

*(Replace `<your-render-service-name>` with your actual Render backend URL, e.g. `https://pravah-api.onrender.com`)*

---

## 3. Option A: Free Keep-Alive via cron-job.org (Recommended)

[cron-job.org](https://cron-job.org) is a free web cron service that requires no credit card and allows scheduling HTTP requests down to 1-minute intervals.

### Step-by-Step Setup:
1. Go to [https://cron-job.org](https://cron-job.org) and sign up for a free account.
2. Log in and navigate to the **Cronjobs** tab in the dashboard.
3. Click **Create Cronjob**.
4. Fill in the job details:
   * **Title**: `Pravah Backend Keep-Alive`
   * **URL**: `https://<your-render-service-name>.onrender.com/api/v1/health/ping`
   * **Execution Schedule**: Choose **Every 10 minutes** (`*/10 * * * *`).
   * **Request Method**: `GET`
   * **Failure Notification**: Optionally enable email alerts if the service is down.
5. Click **Create**.
6. The cron job will now ping your backend every 10 minutes, keeping the Render free container warm 24/7.

---

## 4. Option B: Free Keep-Alive via UptimeRobot

[UptimeRobot](https://uptimerobot.com) provides 50 free monitors with 5-minute check intervals.

### Step-by-Step Setup:
1. Register for a free account at [https://uptimerobot.com](https://uptimerobot.com).
2. Click **+ Add New Monitor**.
3. Configure the monitor:
   * **Monitor Type**: `HTTP(s)`
   * **Friendly Name**: `Pravah API Health Ping`
   * **URL (or IP)**: `https://<your-render-service-name>.onrender.com/api/v1/health/ping`
   * **Monitoring Interval**: `5 minutes` or `10 minutes`
4. Click **Create Monitor**.
5. This serves both as an uptime tracker and an automatic keep-alive pinger.

---

## 5. Option C: Free Keep-Alive via GitHub Actions (Repo-Native)

You can also use a GitHub Actions workflow inside this repository to ping the backend on a cron schedule:

Create `.github/workflows/keepalive.yml`:

```yaml
name: Render Backend Keep-Alive

on:
  schedule:
    # Runs every 10 minutes (UTC)
    - cron: '*/10 * * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Pravah Health Endpoint
        run: |
          curl -s -f -m 15 https://${{ secrets.RENDER_BACKEND_HOST }}/api/v1/health/ping || true
```

*Add `RENDER_BACKEND_HOST` (e.g. `pravah-api.onrender.com`) to your GitHub Repository Secrets.*

---

## 6. Verification

1. In your **Render Dashboard**, open your web service's **Logs** tab.
2. Every 10 minutes, you should see an incoming log entry:
   ```text
   GET /api/v1/health/ping HTTP/1.1 200 OK
   ```
3. When visiting the frontend deployment, the app will connect to the live backend in under **100ms**, with zero startup delays and no fallback banner.
