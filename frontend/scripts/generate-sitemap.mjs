/**
 * Generates public/sitemap.xml at build time.
 *
 * Static routes are always written. Blog posts are pulled from the live API so
 * published posts get indexed; if the API is unreachable the build still
 * succeeds with the static routes only.
 *
 * Env: VITE_SITE_URL (public site origin), VITE_API_URL (backend origin).
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://portfolio-abhi-aayp.vercel.app').replace(/\/$/, '');
const API_URL = (process.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const STATIC_ROUTES = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
];

const today = new Date().toISOString().split('T')[0];

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`);

async function fetchBlogRoutes() {
  try {
    const response = await fetch(`${API_URL}/api/blog`, { signal: AbortSignal.timeout(10000) });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = await response.json();

    return posts
      .filter((post) => post?.slug)
      .map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: (post.updatedAt || post.createdAt || '').split('T')[0] || today,
        changefreq: 'monthly',
        priority: '0.7',
      }));
  } catch (error) {
    console.warn(`[sitemap] Could not fetch blog posts from ${API_URL}: ${error.message}`);
    console.warn('[sitemap] Falling back to static routes only.');
    return [];
  }
}

const toUrlEntry = ({ loc, lastmod = today, changefreq, priority }) =>
  [
    '  <url>',
    `    <loc>${escapeXml(SITE_URL + loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');

const blogRoutes = await fetchBlogRoutes();
const routes = [...STATIC_ROUTES, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(toUrlEntry).join('\n')}
</urlset>
`;

const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
await writeFile(outPath, xml, 'utf8');

console.log(`[sitemap] Wrote ${routes.length} URLs (${blogRoutes.length} blog posts) to public/sitemap.xml`);
