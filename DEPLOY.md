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

### Prerendered blog pages and sitemap

`npm run build` runs `vite build`, then `scripts/prerender.mjs`, which fetches every
published post from `GET /api/blog` and writes:

- `dist/blog/<slug>/index.html` and `dist/blog/index.html`: per-page title,
  description, canonical, Open Graph/Twitter tags, JSON-LD and the article text in
  the HTML, so crawlers and link previews never see the homepage card.
- `dist/sitemap.xml`: `/`, `/blog` and every published post (`lastmod` from the
  post's last update).

The API is required. The script retries for Render's cold start, then **fails the
build** rather than shipping pages or a sitemap with posts missing. Vercel keeps the
previous deployment live when a build fails. `vercel.json` pins `buildCommand` to
`npm run build` so this step always runs. Each prerendered page carries a
`<!-- prerendered <time> -->` comment to confirm which build is live.

### Automatic rebuilds (Vercel Deploy Hook)

Publishing, unpublishing, editing or deleting a **published** post makes the backend
call a Vercel Deploy Hook (debounced 60 s, fire-and-forget), so the post gets its
prerendered page and sitemap entry about two minutes later. Setup:

1. Vercel → project → Settings → Git → Deploy Hooks → create one for branch `main`.
2. Render → backend service → Environment → add `VERCEL_DEPLOY_HOOK_URL` = that URL.

Without the variable the feature is off and you redeploy manually after publishing.
The hook URL is a secret: anyone with it can trigger builds (not change code). If it
leaks, delete it in Vercel, create a new one and update Render.

### Publishing a post from markdown

Drafts live in `content/posts/` (markdown + frontmatter, images next to them).
`content/tools/publish-post.mjs <draft.md>` checks everything; add `--apply` to upload
the images, convert the draft and create the post unpublished. Then review it and use
the **Publish** button in the admin. It reads `ADMIN_TOKEN` from the environment.

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
