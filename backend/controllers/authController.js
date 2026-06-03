const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pulsesocial_jwt_secret_key_123!_dev', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user exists by email
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Check if user exists by username
    const userExistsByUsername = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (userExistsByUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      avatar: avatar || '', // Frontend can send base64 avatar, or we store it empty and use placeholder
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ success: false, message: 'Server error during sign up', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

module.exports = {
  signup,
  login,
};
