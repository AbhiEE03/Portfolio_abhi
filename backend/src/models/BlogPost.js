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

blogPostSchema.pre('save', function preSave(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
