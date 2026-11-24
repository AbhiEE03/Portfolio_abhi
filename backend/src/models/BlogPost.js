const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // The URL of a post. Set once on create; Mongoose then refuses to change it,
    // so editing a title can never break links, sitemaps or search results.
    slug: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    // Describes what the cover shows; empty means the banner is treated as decorative.
    coverImageAlt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Runs before validation, so the required slug exists by the time it is checked.
// (A 'save' hook runs after validation, which made every new post fail.)
// Only ever fills a missing slug on a new post; existing slugs are immutable.
blogPostSchema.pre('validate', function setSlug() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
