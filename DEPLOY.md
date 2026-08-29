# Deployment Guide

## 1. Update the existing Vercel project

Use the existing Vercel project and configure it to build from the `frontend` folder instead of the older Python/Flask setup.

1. Open the project in Vercel.
2. Go to `Settings` -> `General`.
3. Under `Build & Output Settings`, set the root directory to `frontend`.
4. Keep the framework preset as `Vite`.
5. Save the settings and redeploy.

## 2. Set the frontend API URL

In the Vercel project environment variables, add or update:

- `VITE_API_URL=https://your-render-service.onrender.com`

This must point to the live Render backend URL.

## 3. Domain / URL notes

No new domain change is required because the goal is to redeploy into the same existing Vercel project. The site keeps the same Vercel URL while the app logic moves to the new React + Express stack.

## 4. Final deployment flow

- Frontend: Vercel (React + Vite)
- Backend: Render (Node + Express)
- Database: MongoDB Atlas

Once both deployments are live, the frontend will call the backend through `VITE_API_URL` and the admin CMS, projects API, blog API, and contact form will all work in production.
