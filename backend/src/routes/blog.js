const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getBlogPosts,
  getAllBlogPostsAdmin,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/admin/all', authMiddleware, getAllBlogPostsAdmin);
router.get('/:slug', getBlogPostBySlug);
router.post('/', authMiddleware, createBlogPost);
router.put('/:id', authMiddleware, updateBlogPost);
router.delete('/:id', authMiddleware, deleteBlogPost);

module.exports = router;
