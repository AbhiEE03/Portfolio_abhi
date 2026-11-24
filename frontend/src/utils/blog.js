// Helpers shared by the blog pages and the build-time prerender script
// (scripts/prerender.mjs), so the static HTML and the React render match exactly.

// Quill 2's getSemanticHTML() saves every space as &nbsp;, which stops paragraphs from wrapping.
// Quill also drops loading/decoding attributes, so in-body images get them added here.
export const normalizeContent = (html = '') =>
  html
    .replace(/&nbsp;| /g, ' ')
    .replace(/<img(?![^>]*\sloading=)/g, '<img loading="lazy" decoding="async"');

// Pinned to IST: the build runs in UTC, the author writes in IST, and a post saved
// late in the evening must not show a different date before and after React loads.
const formatter = (month) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month, day: 'numeric', timeZone: 'Asia/Kolkata' });
const longDate = formatter('long');
const shortDate = formatter('short');

export const formatLongDate = (value) => longDate.format(new Date(value));
export const formatShortDate = (value) => shortDate.format(new Date(value));

// Prerendered pages embed the data they were built from, so React can render
// immediately instead of flashing a loading skeleton. Only used when the key
// matches the current route; any other route fetches as usual.
export const PRERENDER_DATA_ID = 'prerender-data';

export const readPrerendered = (key) => {
  if (typeof document === 'undefined') return null;
  try {
    const element = document.getElementById(PRERENDER_DATA_ID);
    if (!element) return null;
    const payload = JSON.parse(element.textContent);
    return payload?.key === key ? payload.data : null;
  } catch {
    return null;
  }
};
