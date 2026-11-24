#!/usr/bin/env node
// Converts a blog draft (markdown + frontmatter) into the payload the blog API stores.
//
//   node content/tools/md-to-post.mjs <draft.md> [--images <map.json>] [--out <payload.json>]
//
// Output HTML uses the same shapes the Quill admin editor saves (<p>, <h2>, <h3>, <ul><li>,
// <strong>, <code>, <pre data-language>, <p><img></p>), so the post stays editable there.
// --images maps local image paths (as written in the draft) to uploaded URLs, e.g.
//   { "./bnp-hackathon/certificate.webp": "https://res.cloudinary.com/..." }
// Without --images it writes a preview only: local paths are kept and published=false.
// Frontmatter `tags` is ignored (the BlogPost model has no tags field).
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const draftPath = args[0];
if (!draftPath || draftPath.startsWith('--')) {
  console.error('usage: node md-to-post.mjs <draft.md> [--images map.json] [--out payload.json]');
  process.exit(1);
}
const imageMap = flag('--images') ? JSON.parse(fs.readFileSync(flag('--images'), 'utf8')) : null;
const outPath = flag('--out') || draftPath.replace(/\.md$/, imageMap ? '.payload.json' : '.preview.json');

const source = fs.readFileSync(draftPath, 'utf8').replace(/\r\n/g, '\n');
const fm = source.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) throw new Error('missing frontmatter');

// --- frontmatter: flat `key: value` pairs, quoted strings, [a, b] lists ---
const meta = {};
for (const line of fm[1].split('\n')) {
  const m = line.match(/^(\w+):\s*(.*)$/);
  if (!m) continue;
  let value = m[2].trim();
  if (/^".*"$/.test(value)) value = JSON.parse(value);
  else if (/^\[.*\]$/.test(value)) value = value.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
  meta[m[1]] = value;
}
for (const key of ['title', 'slug', 'excerpt']) if (!meta[key]) throw new Error(`frontmatter "${key}" is required`);
if ([...meta.excerpt].length > 155) throw new Error(`excerpt is ${[...meta.excerpt].length} chars (max 155)`);

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const missingImages = [];
const mapImage = (src) => {
  if (!imageMap) return src;
  if (!imageMap[src]) missingImages.push(src);
  return imageMap[src] || src;
};

// Inline markdown: `code`, **bold**, [text](url). Code spans are protected first.
const inline = (text) => {
  const codes = [];
  let out = text.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  out = escapeHtml(out)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[i])}</code>`);
};

// Raw <img> lines from the draft: keep alt/width/height, swap the src.
const imageBlock = (line) => {
  const attr = (name) => (line.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const src = attr('src');
  const alt = attr('alt');
  if (!src || alt === undefined) throw new Error(`image needs src and alt: ${line.slice(0, 80)}`);
  const size = ['width', 'height'].map((n) => (attr(n) ? ` ${n}="${attr(n)}"` : '')).join('');
  return `<p><img src="${escapeHtml(mapImage(src))}" alt="${alt}"${size}></p>`;
};

// --- block parser ---
const lines = source.slice(fm[0].length).split('\n');
const html = [];
let paragraph = [];
let list = null;
const flushParagraph = () => { if (paragraph.length) html.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; };
const flushList = () => { if (list) html.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`); list = null; };

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  const fence = line.match(/^```(\w*)\s*$/);
  if (fence) {
    flushParagraph(); flushList();
    const code = [];
    for (i += 1; i < lines.length && !/^```\s*$/.test(lines[i]); i += 1) code.push(lines[i]);
    if (i >= lines.length) throw new Error('unclosed code fence');
    html.push(`<pre data-language="${fence[1] || 'plain'}">${escapeHtml(code.join('\n'))}</pre>`);
    continue;
  }
  const heading = line.match(/^(#{2,3})\s+(.*)$/);
  if (heading) { flushParagraph(); flushList(); html.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue; }
  if (/^#\s/.test(line)) throw new Error('use ## or ### in the body; the title comes from frontmatter');
  if (/^<img\s/.test(line.trim())) { flushParagraph(); flushList(); html.push(imageBlock(line.trim())); continue; }
  const item = line.match(/^[-*]\s+(.*)$/);
  if (item) { flushParagraph(); (list ||= []).push(item[1]); continue; }
  if (!line.trim()) { flushParagraph(); flushList(); continue; }
  if (list) flushList();
  paragraph.push(line.trim());
}
flushParagraph(); flushList();

if (/\[CONFIRM/i.test(source)) throw new Error('draft still contains [CONFIRM] placeholders');
if (imageMap && missingImages.length) throw new Error(`no uploaded URL for: ${missingImages.join(', ')}`);

const payload = {
  title: meta.title,
  slug: meta.slug,
  excerpt: meta.excerpt,
  content: html.join(''),
  coverImageUrl: meta.coverImage ? mapImage(meta.coverImage) : '',
  coverImageAlt: meta.coverImageAlt || '',
  published: false, // publish from the admin after a final look
};
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

// A standalone preview page next to the payload, for reading the converted HTML.
const previewHtml = `<!doctype html><meta charset="utf-8"><title>${escapeHtml(meta.title)}</title>
<style>body{max-width:720px;margin:40px auto;padding:0 16px;font:17px/1.65 system-ui;background:#0f172a;color:#e2e8f0}
img{max-width:100%;height:auto;border-radius:12px}pre{background:#020617;padding:14px;border-radius:10px;overflow:auto}
code{color:#a5f3fc}h1,h2,h3,strong{color:#fff}</style>
${payload.coverImageUrl ? `<img src="${escapeHtml(payload.coverImageUrl)}" alt="${escapeHtml(payload.coverImageAlt)}" width="1200" height="630">` : ''}
<h1>${escapeHtml(meta.title)}</h1>${payload.content}`;
fs.writeFileSync(outPath.replace(/\.json$/, '.html'), previewHtml);

const words = payload.content.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
console.log(`${outPath}  (${words} words, ${(payload.content.match(/<img /g) || []).length} images, excerpt ${[...meta.excerpt].length} chars, published=false)`);
