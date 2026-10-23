const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    coverImageUrl: {
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
blogPostSchema.pre('validate', function setSlug() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
