// "Innoversité 2026: Rule Engine" -> "innoversite-2026-rule-engine"
// NFKD splits an accented letter into its base letter plus a combining mark
// (é -> e + ´); the marks (Unicode category M) are then dropped, so accented
// letters become plain ones instead of being cut out of the slug.
const slugify = (text = '') =>
  String(text)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

module.exports = slugify;
