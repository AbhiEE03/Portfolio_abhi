# Backend Deployment Guide (Render)

## 1. Create a Render Web Service

1. Sign in to Render and click `New +` -> `Web Service`.
2. Connect the GitHub repo and choose the `backend` folder as the service root.
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
4. Keep the default Node environment and allow the service to deploy.

## 2. Required environment variables

Add these in the Render dashboard under Environment:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `CLIENT_URL`

## 3. Notes

- `CLIENT_URL` should point to your Vercel frontend URL, for example `https://your-project.vercel.app`.
- For local development, you can still use `http://localhost:5173`.
- `ADMIN_PASSWORD_HASH` should be the bcrypt hash of your admin password.
- `EMAIL_APP_PASSWORD` is the Gmail App Password for the account used to send contact emails.

## 4. Health check

After deployment, confirm the app is reachable at:

- `https://your-render-service.onrender.com/api/health`

This should return a JSON response with `status: "ok"`.
