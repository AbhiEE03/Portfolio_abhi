#!/usr/bin/env node
// Creates a blog post from a markdown draft, unpublished, ready for review in the admin.
//
//   $env:ADMIN_TOKEN = Read-Host 'Paste admin token'      (PowerShell; not saved to history)
//   node content/tools/publish-post.mjs content/posts/my-post.md            -> checks only
//   node content/tools/publish-post.mjs content/posts/my-post.md --apply    -> uploads + creates
//
// Steps: checks the token and that the slug is free, uploads every local image the
// draft references (frontmatter coverImage + <img src="./...">) through /api/upload,
// converts the draft with md-to-post.mjs, then POSTs it with published=false.
// Publish it from the admin with the Publish button after reviewing.
//
// The token is read from ADMIN_TOKEN only; it is never printed or written to disk.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const API = (process.env.API_URL || 'https://portfolio-abhi-backend.onrender.com').replace(/\/$/, '');
const SITE = 'https://portfolio-abhi-aayp.vercel.app';
const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const draft = process.argv[2];
const APPLY = process.argv.includes('--apply');
// Stops the script without process.exit(): on Windows, exiting while fetch connections
// are still open crashes Node with a libuv assertion.
class Stop extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
process.on('uncaughtException', (error) => {
  if (!(error instanceof Stop)) throw error;
  if (error.code) console.error(`ABORT: ${error.message}`);
  else console.log(error.message);
  process.exitCode = error.code;
});
const fail = (msg) => { throw new Stop(msg, 1); };

if (!draft || draft.startsWith('--')) fail('usage: node publish-post.mjs <draft.md> [--apply]');
if (!process.env.ADMIN_TOKEN) fail('ADMIN_TOKEN is not set in this terminal.');
const auth = { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` };

const source = fs.readFileSync(draft, 'utf8');
const slug = (source.match(/^slug:\s*(\S+)\s*$/m) || [])[1];
if (!slug) fail('draft has no slug in its frontmatter');
const localImages = [...new Set([
  ...[...source.matchAll(/^coverImage:\s*(\.\/\S+)\s*$/gm)].map((m) => m[1]),
  ...[...source.matchAll(/<img\s[^>]*src="(\.\/[^"]+)"/g)].map((m) => m[1]),
])];
for (const img of localImages) {
  const file = path.resolve(path.dirname(draft), img);
  if (!fs.existsSync(file)) fail(`image not found: ${img}`);
  if (fs.statSync(file).size > 200 * 1024) fail(`image over 200 KB: ${img}`);
}

// Checks that change nothing.
const adminRes = await fetch(`${API}/api/blog/admin/all`, { headers: auth });
if (adminRes.status !== 200) fail(`token rejected (HTTP ${adminRes.status}); log in again and copy a fresh token`);
if ((await adminRes.json()).some((p) => p.slug === slug)) fail(`a post with slug "${slug}" already exists`);
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-post-'));
execFileSync('node', [path.join(TOOLS, 'md-to-post.mjs'), draft, '--out', path.join(work, 'preview.json')], { stdio: 'pipe' });
console.log(`OK: token valid, slug "${slug}" is free, ${localImages.length} images found, draft converts cleanly.`);
if (!APPLY) throw new Stop('Checks only. Re-run with --apply to upload and create the post.', 0);

// Upload images, convert with their URLs, create the post unpublished.
const map = {};
for (const img of localImages) {
  const file = path.resolve(path.dirname(draft), img);
  const form = new FormData();
  form.append('image', new Blob([fs.readFileSync(file)], { type: 'image/webp' }), path.basename(file));
  const res = await fetch(`${API}/api/upload`, { method: 'POST', headers: auth, body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.url) fail(`upload of ${img} failed (HTTP ${res.status})`);
  map[img] = body.url;
  console.log(`uploaded ${img} -> ${body.url}`);
}
const mapFile = path.join(work, 'images.json');
const payloadFile = path.join(work, 'payload.json');
fs.writeFileSync(mapFile, JSON.stringify(map, null, 2));
execFileSync('node', [path.join(TOOLS, 'md-to-post.mjs'), draft, '--images', mapFile, '--out', payloadFile], { stdio: 'inherit' });
const payload = JSON.parse(fs.readFileSync(payloadFile, 'utf8'));

const res = await fetch(`${API}/api/blog`, {
  method: 'POST',
  headers: { ...auth, 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...payload, published: false }),
});
const created = await res.json().catch(() => ({}));
if (!res.ok) fail(`create failed (HTTP ${res.status}) ${created.message || ''}`);
console.log(`Created unpublished post ${created._id} with slug ${created.slug}.`);
console.log(`Review and publish: ${SITE}/admin/dashboard`);
console.log(`After publishing it will be at: ${SITE}/blog/${created.slug}`);
