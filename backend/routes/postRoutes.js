const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPostById,
  toggleLikePost,
  commentOnPost,
  getUserPostsAndStats,
} = require('../controllers/postController');

// GET all posts & POST a post
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

// GET post by ID
router.route('/:id')
  .get(getPostById);

// PUT like/unlike a post
router.route('/:id/like')
  .put(protect, toggleLikePost);

// POST comment on a post
router.route('/:id/comment')
  .post(protect, commentOnPost);

// GET user posts & stats
router.route('/user/:userId')
  .get(getUserPostsAndStats);

module.exports = router;
