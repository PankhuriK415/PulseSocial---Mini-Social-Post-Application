const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ success: false, message: 'Post must contain text or an image' });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: req.user.username,
      text: text || '',
      image: image || '',
      likes: [],
      comments: []
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Server error creating post', error: error.message });
  }
};

// @desc    Get all posts (paginated for infinite scroll)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      posts,
      page,
      pages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total,
      total
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error fetching posts', error: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching post', error: error.message });
  }
};

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if post already liked by this user
    const likeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Already liked, so unlike (remove)
      post.likes.splice(likeIndex, 1);
    } else {
      // Like (add)
      post.likes.push({
        userId: req.user._id,
        username: req.user.username
      });
    }

    await post.save();
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'Server error updating like', error: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      username: req.user.username,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Server error adding comment', error: error.message });
  }
};

// @desc    Get user posts & stats
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPostsAndStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user posts
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    // Calculate profile statistics
    const totalPosts = posts.length;
    let totalLikesReceived = 0;
    let totalCommentsReceived = 0;
    
    posts.forEach(post => {
      totalLikesReceived += post.likes.length;
      totalCommentsReceived += post.comments.length;
    });

    // Provide a simple post activity timeline count (grouped by day)
    const activityTimeline = {};
    posts.forEach(post => {
      const dateStr = new Date(post.createdAt).toISOString().split('T')[0];
      activityTimeline[dateStr] = (activityTimeline[dateStr] || 0) + 1;
    });

    res.json({
      success: true,
      user,
      posts,
      stats: {
        totalPosts,
        totalLikesReceived,
        totalCommentsReceived,
        activityTimeline
      }
    });
  } catch (error) {
    console.error('Error fetching user profile posts/stats:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching profile data', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  toggleLikePost,
  commentOnPost,
  getUserPostsAndStats
};
