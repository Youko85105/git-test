const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// POST /api/users - Create a user and set cookie
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await User.create({ name });

    // Set cookie
    res
      .cookie("userId", user._id.toString(), {
        httpOnly: false,         // must be false so frontend JS can access it
        sameSite: "Lax",
        secure: false,           // set to true if using HTTPS
      })
      .status(201)
      .json(user);
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get one user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error('Fetch user by ID error:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})


module.exports = router;