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

## SEO

The frontend ships a full SEO layer. Nothing extra needs to run in production, but
two things are worth knowing.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | Vercel (frontend) | Public origin, **no trailing slash**. Drives canonical URLs, `og:url` and `sitemap.xml`. Defaults to the current Vercel URL if unset. |
| `VITE_API_URL` | Vercel (frontend) | Already required. Now also read at build time so published blog posts land in `sitemap.xml`. |

If you move to a custom domain, set `VITE_SITE_URL` and update the `Sitemap:` line in
`frontend/public/robots.txt` plus the absolute URLs in `frontend/index.html`.

### Sitemap

`npm run build` runs `scripts/generate-sitemap.mjs` first, which writes
`public/sitemap.xml` from the static routes plus every published post from
`GET /api/blog`. If the API is unreachable the build still succeeds with static
routes only — so **redeploy the frontend after publishing a post** to get it into
the sitemap.

### After deploying

1. Submit `https://<your-domain>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
2. Validate structured data with the [Rich Results Test](https://search.google.com/test/rich-results).
3. Re-scrape link previews via the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).

### Known limitation

This is a client-rendered SPA. Google renders JavaScript, so search indexing works,
but social scrapers (WhatsApp, Slack, LinkedIn, X) do **not** run JS — they only see
the static tags in `index.html`. Every shared link therefore previews with the
site-wide card (`/og-image.png`) rather than a per-post image. Fixing that needs
server-side rendering or a prerender step.

### Regenerating the OG image

`frontend/scripts/og-image-template.html` is the 1200x630 source for `public/og-image.png`.
Edit it, then re-render with headless Chrome:

```bash
chrome --headless --disable-gpu --hide-scrollbars \
  --screenshot=frontend/public/og-image.png --window-size=1200,630 \
  frontend/scripts/og-image-template.html
```
