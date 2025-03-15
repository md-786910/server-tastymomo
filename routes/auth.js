const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id).select('-__v');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/user
// @desc    Update user profile
// @access  Private
router.put('/user', auth, async (req, res) => {
  const { name, address } = req.body;

  try {
    const user = await User.findById(req.user.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;