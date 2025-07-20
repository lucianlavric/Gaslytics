# Gaslytics Deployment Guide

This guide will help you deploy Gaslytics to Vercel (frontend) and Railway (backend).

## Prerequisites

- Vercel account (free tier)
- Railway account (free tier)
- Supabase project with credentials
- TwelveLabs API key

## Backend Deployment (Railway)

### 1. Prepare Backend Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
TWELVE_LABS_API_KEY=your_twelvelabs_api_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 2. Deploy to Railway

1. Go to [Railway](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Select the `backend/` directory as the source
4. Add environment variables in Railway dashboard:
   - `TWELVE_LABS_API_KEY`: Your TwelveLabs API key
   - `FRONTEND_URL`: Will be your Vercel URL (update after frontend deployment)
5. Deploy the project
6. Copy the Railway app URL (e.g., `https://your-app.railway.app`)

### 3. Test Backend Health Check

Visit `https://your-app.railway.app/api/health` to verify the backend is running.

## Frontend Deployment (Vercel)

### 1. Update Vercel Configuration

After getting your Railway URL, update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.railway.app/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Prepare Frontend Environment Variables

Create a `.env.local` file in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://your-railway-app.railway.app/api
```

### 3. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and create a new project
2. Connect your GitHub repository
3. Select the root directory as the source (not backend/)
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_BACKEND_URL`: Your Railway app URL + `/api`
5. Deploy the project
6. Copy your Vercel app URL

### 4. Update Backend CORS

After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Railway to your Vercel URL.

## Environment Variables Summary

### Backend (Railway)
- `TWELVE_LABS_API_KEY`: Your TwelveLabs API key
- `FRONTEND_URL`: Your Vercel app URL (for CORS)

### Frontend (Vercel)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_BACKEND_URL`: Your Railway app URL + `/api`

## Architecture Overview

```
Frontend (Vercel) → Backend (Railway) → TwelveLabs API
     ↓                    ↓                    ↓
  React App         Node.js Server      Video Analysis
  (Upload UI)       (CORS handling)     (AI Processing)
```

## Testing the Deployment

1. **Frontend**: Visit your Vercel URL and test the upload flow
2. **Backend Health**: Visit `https://your-railway-app.railway.app/api/health`
3. **Full Flow**: Upload a video and verify processing works end-to-end

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. **API 404**: Check that `VITE_BACKEND_URL` includes `/api` at the end
3. **TwelveLabs Errors**: Verify your API key is correct and has sufficient credits
4. **Build Failures**: Ensure all dependencies are in `package.json`

### Logs

- **Vercel**: Check deployment logs in Vercel dashboard
- **Railway**: Check application logs in Railway dashboard
- **Frontend**: Use browser dev tools to see API calls
- **Backend**: Check Railway logs for server errors

## Security Notes

- All API keys are stored as environment variables
- CORS is configured to only allow your Vercel domain
- Supabase handles authentication and file storage
- TwelveLabs API calls are proxied through your backend to avoid CORS issues 