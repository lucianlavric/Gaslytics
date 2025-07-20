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
   - `TWELVE_LABS_API_KEY`
   - `FRONTEND_URL` (will be your Vercel URL)
5. Deploy the project
6. Copy the Railway app URL (e.g., `https://your-app.railway.app`)

### 3. Update Frontend Configuration

After getting your Railway URL, update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-app.railway.app/api/$1"
    }
  ]
}
```

## Frontend Deployment (Vercel)

### 1. Prepare Frontend Environment Variables

Create a `.env` file in the `Gaslytics/` directory with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://your-railway-app.railway.app/api
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and create a new project
2. Connect your GitHub repository
3. Select the `Gaslytics/` directory as the source
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_BACKEND_URL`
5. Deploy the project

## Environment Variables Summary

### Backend (Railway)
- `TWELVE_LABS_API_KEY`: Your TwelveLabs API key
- `FRONTEND_URL`: Your Vercel app URL (for CORS)

### Frontend (Vercel)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_BACKEND_URL`: Your Railway backend URL

## Testing Deployment

1. Visit your Vercel app URL
2. Upload a video file
3. Check that processing works via Railway backend
4. Verify results are saved to Supabase

## Troubleshooting

- **CORS errors**: Ensure `FRONTEND_URL` is set correctly in Railway
- **API errors**: Check that `VITE_BACKEND_URL` points to your Railway app
- **Supabase errors**: Verify Supabase credentials in Vercel environment variables 