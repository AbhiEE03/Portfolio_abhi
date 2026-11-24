// Rebuilds the Vercel frontend after a change that affects the public blog, so a
// new or edited post gets its prerendered page and sitemap entry without a manual
// redeploy.
//
// - Does nothing unless VERCEL_DEPLOY_HOOK_URL is set (local dev stays inert).
// - Debounced: a burst of edits within the window triggers one build.
// - Fire-and-forget: never delays or fails the admin request that caused it.
// - The hook URL is a secret and is never logged.
//
// If the build fails (e.g. the API is down), Vercel keeps the last good deployment.
const https = require('https');

const DEBOUNCE_MS = Number(process.env.DEPLOY_HOOK_DEBOUNCE_MS) || 60_000;
let timer = null;
let reasons = [];

const callHook = (hookUrl) =>
  new Promise((resolve, reject) => {
    const request = https.request(hookUrl, { method: 'POST', timeout: 15_000 }, (response) => {
      response.resume();
      resolve(response.statusCode);
    });
    request.on('timeout', () => request.destroy(new Error('timed out')));
    request.on('error', reject);
    request.end();
  });

const scheduleSiteRebuild = (reason) => {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return;

  reasons.push(reason);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const summary = reasons.join('; ');
    timer = null;
    reasons = [];
    try {
      const status = await callHook(hookUrl);
      console.log(`[DEPLOY HOOK] site rebuild triggered (HTTP ${status}) after: ${summary}`);
    } catch (error) {
      console.error(`[DEPLOY HOOK] trigger failed (${error.message}) after: ${summary}`);
    }
  }, DEBOUNCE_MS);

  console.log(`[DEPLOY HOOK] rebuild scheduled in ${DEBOUNCE_MS / 1000}s: ${reason}`);
};

module.exports = { scheduleSiteRebuild };
