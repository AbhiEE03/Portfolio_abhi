// Single source of truth for SEO/site-level metadata.
// Override the URL per-environment with VITE_SITE_URL (no trailing slash).
const rawSiteUrl = import.meta.env.VITE_SITE_URL || 'https://portfolio-abhi-aayp.vercel.app';

export const SITE_URL = rawSiteUrl.replace(/\/$/, '');

export const SITE_NAME = 'Abhishek Kumar';
export const SITE_TITLE = 'Abhishek Kumar | Full-Stack Developer & Competitive Programmer';
export const SITE_DESCRIPTION =
  'Portfolio of Abhishek Kumar — full-stack web developer and competitive programmer building MERN applications. Browse projects, experience, coding profiles and technical writing.';
export const SITE_LOCALE = 'en_US';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = '@ImAbhisharma24';

export const SOCIAL_PROFILES = [
  'https://github.com/AbhiEE03',
  'https://www.linkedin.com/in/abhikumar24/',
  'https://x.com/ImAbhisharma24',
  'https://leetcode.com/u/abhiee03/',
  'https://codeforces.com/profile/abhisheknoni78',
  'https://www.geeksforgeeks.org/profile/abhishekhtxm',
  'https://www.youtube.com/@Abhishek_2410',
];

// Resolve a path or absolute URL into an absolute URL for og/canonical tags.
export const absoluteUrl = (pathOrUrl = '/') => {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
};
