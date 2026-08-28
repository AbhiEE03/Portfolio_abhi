# Portfolio_abhi

This repository contains the monorepo for the portfolio redesign project.

## Project structure

- `frontend/` — React + Vite + Tailwind CSS frontend
- `backend/` — Node.js + Express server and API

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Notes

- The frontend uses Vite and Tailwind CSS.
- The backend exposes a basic health endpoint at `/api/health`.
- Use `.env` files for local configuration and keep them out of version control.
