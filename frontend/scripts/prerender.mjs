/**
 * Post-build step: writes static HTML for the blog so crawlers and link-preview
 * scrapers get the right page without running JavaScript.
 *
 *   dist/blog/index.html          -> /blog, with the post list in the HTML
 *   dist/blog/<slug>/index.html   -> /blog/<slug>, with the full article in the HTML
 *   dist/sitemap.xml              -> /, /blog and every published post
 *
 * Each page gets its own <title>, description, canonical, Open Graph, Twitter and
 * JSON-LD tags. They replace the homepage's [data-seo-fallback] tags and keep that
 * attribute, so PageMeta removes them once React (Helmet) takes over the head.
 * The data the page was built from is embedded as JSON, so the React app renders
 * the same content straight away, then refreshes it from the API.
 *
 * The blog API is required: if it can't be reached after retries (Render cold
 * starts take up to a minute), the build fails instead of shipping pages that
 * would be missing posts.
 *
 * Env: VITE_API_URL (backend origin), VITE_SITE_URL (public origin).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  DEFAULT_OG_IMAGE,
  RESUME_URL,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from '../src/config/site.js';
import { blogListSchema, blogPostSchema } from '../src/config/structuredData.js';
import { bannerUrl, isCloudinaryUrl, socialImageUrl, thumbnailUrl } from '../src/utils/cloudinary.js';
import { PRERENDER_DATA_ID, formatLongDate, formatShortDate, normalizeContent } from '../src/utils/blog.js';

const API_URL = (process.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const ATTEMPTS = 6;
const TIMEOUT_MS = 30_000;

const log = (msg) => console.log(`[prerender] ${msg}`);
const die = (msg) => {
  console.error(`\n[prerender] BUILD FAILED: ${msg}\n`);
  process.exit(1);
};

// ---------- data ----------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < ATTEMPTS) {
        const wait = attempt * 5_000;
        log(`${url} failed (${error.message}); retry ${attempt}/${ATTEMPTS - 1} in ${wait / 1000}s`);
        await sleep(wait);
      }
    }
  }
  throw new Error(`${url} unreachable after ${ATTEMPTS} attempts: ${lastError?.message}`);
}

// ---------- html helpers ----------

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// JSON inside <script>: "<" (and U+2028/U+2029) become JSON unicode escapes, so
// post content can never close the tag early. Built from char codes on purpose:
// no backslashes or raw separator characters live in this source file.
const BACKSLASH = String.fromCharCode(92);
const UNSAFE_IN_SCRIPT = new RegExp(`[<${String.fromCharCode(0x2028, 0x2029)}]`, 'g');
const jsonForScript = (value) =>
  JSON.stringify(value).replace(UNSAFE_IN_SCRIPT, (c) => `${BACKSLASH}u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function headTags({ title, description, canonical, type, image, imageAlt, jsonLd, published, modified }) {
  const ogImage = image ? socialImageUrl(image) : DEFAULT_OG_IMAGE;
  const knownSize = ogImage === DEFAULT_OG_IMAGE || isCloudinaryUrl(ogImage);
  const meta = (attr, key, content) => `<meta data-seo-fallback="true" ${attr}="${key}" content="${escapeHtml(content)}" />`;
  return [
    `<title data-seo-fallback="true">${escapeHtml(title)}</title>`,
    meta('name', 'description', description),
    `<link data-seo-fallback="true" rel="canonical" href="${escapeHtml(canonical)}" />`,
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', SITE_LOCALE),
    meta('property', 'og:type', type),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:url', canonical),
    meta('property', 'og:image', ogImage),
    meta('property', 'og:image:alt', imageAlt || title),
    ...(knownSize ? [meta('property', 'og:image:width', '1200'), meta('property', 'og:image:height', '630')] : []),
    ...(published ? [meta('property', 'article:published_time', published)] : []),
    ...(modified ? [meta('property', 'article:modified_time', modified)] : []),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:site', TWITTER_HANDLE),
    meta('name', 'twitter:creator', TWITTER_HANDLE),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', ogImage),
    `<script data-seo-fallback="true" type="application/ld+json">${jsonForScript(jsonLd)}</script>`,
  ].join('\n    ');
}

// Static copy of the Navbar: same classes, so the page does not shift when React
// replaces it, and real links for crawlers.
const NAV_LINKS = [
  ['Home', '/#home'],
  ['About', '/#about'],
  ['Experience', '/#experience'],
  ['Projects', '/#projects'],
  ['Blog', '/blog'],
  ['Contact', '/#contact'],
];
const staticHeader = () => `<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
<nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm md:px-6">
<a href="/#home" class="text-3xl font-black tracking-tight text-red-500 hover:text-red-600">My Portfolio</a>
<div class="hidden items-center gap-6 md:flex">${NAV_LINKS.map(
  ([label, href]) =>
    `<a href="${href}" class="text-sm font-medium transition ${label === 'Blog' ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}">${label}</a>`,
).join('')}</div>
<div class="flex items-center gap-2"><a href="${RESUME_URL}" target="_blank" rel="noopener noreferrer" class="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">My Resume</a></div>
</nav>
</header>`;

const shell = (main) =>
  `<div class="min-h-screen bg-slate-950 text-slate-100">${staticHeader()}<main class="w-full">${main}</main></div>`;

// Mirrors BlogPost.jsx.
const postMain = (post) => `<div class="mx-auto max-w-6xl px-4 md:px-6">
<article class="mx-auto max-w-3xl py-12 md:py-16">
<a href="/blog" class="mb-8 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">← Back to Blog</a>
<div class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl">
${
  post.coverImageUrl
    ? `<img src="${escapeHtml(bannerUrl(post.coverImageUrl))}" alt="${escapeHtml(post.coverImageAlt || '')}" width="1200" height="630" loading="eager" fetchpriority="high" decoding="async" class="aspect-[1200/630] h-auto w-full object-cover" />`
    : ''
}
<div class="space-y-6 p-6 md:p-10">
<div>
<p class="text-sm uppercase tracking-[0.2em] text-cyan-300"><time datetime="${escapeHtml(post.createdAt)}">${formatLongDate(post.createdAt)}</time></p>
<h1 class="mt-4 break-words font-display text-3xl font-bold text-white md:text-5xl">${escapeHtml(post.title)}</h1>
</div>
<div class="blog-content prose prose-invert max-w-none text-slate-200 prose-headings:font-display prose-a:text-cyan-300 prose-strong:text-white">${normalizeContent(post.content)}</div>
</div>
</div>
</article>
</div>`;

// Mirrors BlogList.jsx.
const listMain = (posts) => `<section class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
<div class="mb-8">
<p class="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Blog</p>
<h1 class="mt-3 font-display text-3xl font-bold text-white md:text-5xl">Insights &amp; experiments</h1>
</div>
<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
${posts
  .map((post) => {
    const href = `/blog/${post.slug}`;
    const thumb = post.coverImageUrl
      ? `<img src="${escapeHtml(thumbnailUrl(post.coverImageUrl))}" alt="" width="640" height="336" loading="lazy" decoding="async" class="aspect-[1200/630] h-auto w-full object-cover" />`
      : `<div class="relative aspect-[1200/630] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950"><span class="absolute bottom-4 left-5 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">Blog</span></div>`;
    return `<article class="flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-xl">
<a href="${href}" tabindex="-1" aria-hidden="true" class="block">${thumb}</a>
<div class="flex flex-1 flex-col gap-4 p-5">
<p class="text-sm text-cyan-300"><time datetime="${escapeHtml(post.createdAt)}">${formatShortDate(post.createdAt)}</time></p>
<a href="${href}" class="block break-words text-2xl font-semibold text-white transition hover:text-cyan-200">${escapeHtml(post.title)}</a>
<p class="break-words text-slate-300">${escapeHtml(post.excerpt || '')}</p>
<a href="${href}" class="mt-auto inline-flex items-center self-start text-sm font-medium text-cyan-300 hover:text-cyan-200">Read more →</a>
</div>
</article>`;
  })
  .join('\n')}
</div>
</section>`;

// ---------- page assembly ----------

const FALLBACK_TAGS = [
  /<title\b[^>]*data-seo-fallback[^>]*>[\s\S]*?<\/title>\s*/g,
  /<script\b[^>]*data-seo-fallback[^>]*>[\s\S]*?<\/script>\s*/g,
  /<(?:meta|link)\b[^>]*data-seo-fallback[^>]*>\s*/g,
];
const ROOT = '<div id="root"></div>';
// Written into every prerendered page so a rebuild can be confirmed on production.
const BUILD_TIME = new Date().toISOString();

function buildPage(template, { head, main, dataKey, data }) {
  let html = template;
  for (const pattern of FALLBACK_TAGS) html = html.replace(pattern, '');
  html = html.replace('</head>', `    ${head}\n    <!-- prerendered ${BUILD_TIME} -->\n  </head>`);
  const embedded = `<script id="${PRERENDER_DATA_ID}" type="application/json">${jsonForScript({ key: dataKey, data })}</script>`;
  return html.replace(ROOT, `<div id="root">${shell(main)}</div>\n    ${embedded}`);
}

async function writePage(relativeDir, html) {
  const dir = path.join(DIST, relativeDir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html, 'utf8');
}

// ---------- main ----------

const template = await readFile(path.join(DIST, 'index.html'), 'utf8').catch(() =>
  die('dist/index.html not found. Run `vite build` first.'),
);
if (!template.includes(ROOT)) die(`dist/index.html has no ${ROOT}; the template changed.`);
if (!/<title\b[^>]*data-seo-fallback/.test(template)) die('dist/index.html has no [data-seo-fallback] title to replace.');

log(`Fetching posts from ${API_URL}/api/blog`);
let list;
try {
  list = await fetchJson(`${API_URL}/api/blog`);
} catch (error) {
  die(`${error.message}\nThe blog API must be reachable to prerender /blog pages. Check VITE_API_URL and that the Render service is up, then redeploy.`);
}
if (!Array.isArray(list)) die('/api/blog did not return an array.');

const posts = [];
for (const summary of list) {
  if (!SLUG_PATTERN.test(summary?.slug || '')) die(`refusing unsafe or empty slug: ${JSON.stringify(summary?.slug)}`);
  try {
    posts.push(await fetchJson(`${API_URL}/api/blog/${summary.slug}`));
  } catch (error) {
    die(error.message);
  }
}

for (const post of posts) {
  const canonical = `${SITE_URL}/blog/${post.slug}`;
  const html = buildPage(template, {
    head: headTags({
      title: `${post.title} — ${SITE_NAME}`,
      description: post.excerpt || `Blog post by ${SITE_NAME}.`,
      canonical,
      type: 'article',
      image: post.coverImageUrl,
      imageAlt: post.coverImageAlt,
      jsonLd: blogPostSchema(post),
      published: post.createdAt,
      modified: post.updatedAt || post.createdAt,
    }),
    main: postMain(post),
    dataKey: `post:${post.slug}`,
    data: post,
  });
  await writePage(path.join('blog', post.slug), html);
  log(`wrote /blog/${post.slug}`);
}

await writePage(
  'blog',
  buildPage(template, {
    head: headTags({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      canonical: `${SITE_URL}/blog`,
      type: 'website',
      jsonLd: blogListSchema,
    }),
    main: listMain(list),
    dataKey: 'blog-list',
    data: list,
  }),
);
log(`wrote /blog (${list.length} posts)`);

// ---------- sitemap ----------
// Built from the same posts as the pages above, so the two can never disagree.
// lastmod only where there is a real date: each post's last update, and /blog's
// newest post. "/" has no honest date, so it gets none (Google ignores lastmod
// values that look made up). changefreq/priority are omitted; Google ignores them.
const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
const day = (iso) => String(iso || '').slice(0, 10);
const postDate = (post) => day(post.updatedAt || post.createdAt);
const newest = posts.map(postDate).filter(Boolean).sort().at(-1);

const sitemapEntries = [
  { loc: `${SITE_URL}/` },
  { loc: `${SITE_URL}/blog`, lastmod: newest },
  ...posts.map((post) => ({ loc: `${SITE_URL}/blog/${post.slug}`, lastmod: postDate(post) })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(({ loc, lastmod }) => `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`)
  .join('\n')}
</urlset>
`;
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
log(`wrote sitemap.xml (${sitemapEntries.length} URLs)`);
