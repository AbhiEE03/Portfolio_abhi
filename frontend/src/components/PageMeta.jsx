import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  TWITTER_HANDLE,
  absoluteUrl,
} from '../config/site';

// index.html ships a static copy of the SEO tags so non-JS scrapers (WhatsApp,
// Slack, LinkedIn) still get a preview. Under React 19, metadata is hoisted
// natively and *appended* to <head>, so those static tags would otherwise linger
// as duplicates — and on sub-routes they would contradict the real canonical.
// Drop them once, as soon as React owns the head.
let fallbackTagsRemoved = false;

const removeFallbackTags = () => {
  if (fallbackTagsRemoved || typeof document === 'undefined') return;
  fallbackTagsRemoved = true;
  document.head.querySelectorAll('[data-seo-fallback]').forEach((el) => el.remove());
};

/**
 * Renders the full per-route SEO head: title, description, canonical,
 * Open Graph, Twitter card and optional JSON-LD structured data.
 *
 * @param {string}  [title]        Document title. Falls back to the site title.
 * @param {string}  [description]  Meta description. Falls back to the site description.
 * @param {string}  [path]         Route path ("/blog/my-post") used for the canonical URL.
 * @param {string}  [image]        OG image path or absolute URL.
 * @param {string}  [type]         OG type: "website" (default) or "article".
 * @param {boolean} [noindex]      Keep the route out of search results.
 * @param {object}  [jsonLd]       schema.org object (or array) emitted as JSON-LD.
 * @param {string}  [publishedTime] ISO date for article:published_time.
 * @param {string}  [modifiedTime]  ISO date for article:modified_time.
 */

export default function PageMeta({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  publishedTime,
  modifiedTime,
}) {
  useEffect(removeFallbackTags, []);

  // Serialized so callers can pass a freshly-built object each render without
  // re-running the effect on every render.
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : null;

  // Keep exactly one JSON-LD block in <head>, refreshed when the route changes.
  useEffect(() => {
    if (!jsonLdText) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = jsonLdText;
    document.head.appendChild(script);

    return () => script.remove();
  }, [jsonLdText]);

  const pageTitle = title || SITE_TITLE;
  const pageDescription = description || SITE_DESCRIPTION;
  const canonical = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
  // Dimensions are only known for the bundled default card (1200x630).
  const isDefaultImage = ogImage === DEFAULT_OG_IMAGE;

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {/* A noindex route (404, admin) should not claim a canonical URL. */}
      {!noindex && <link rel="canonical" href={canonical} />}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={pageTitle} />
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />

      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
    </Helmet>
  );
}
