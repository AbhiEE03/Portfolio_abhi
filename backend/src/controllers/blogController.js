const BlogPost = require('../models/BlogPost');

const sanitizeExcerpt = (html) => {
  if (!html) return '';

  const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText.length > 150 ? `${plainText.slice(0, 147).trim()}...` : plainText;
};

const getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug coverImageUrl excerpt createdAt');

    return res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch blog posts' });
  }
};

const getBlogPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Get blog post by slug error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch blog post' });
  }
};

const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImageUrl, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await BlogPost.create({
      title,
      content,
      excerpt: excerpt || sanitizeExcerpt(content),
      coverImageUrl,
      published: published ?? true,
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('Create blog post error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { excerpt, content, title, coverImageUrl, published } = req.body;
    const payload = { ...req.body };

    if (title && !payload.slug) {
      payload.slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (content && !excerpt) {
      payload.excerpt = sanitizeExcerpt(content);
    }

    const updated = await BlogPost.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Update blog post error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error.message);
    return res.status(500).json({ message: 'Failed to delete blog post' });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
