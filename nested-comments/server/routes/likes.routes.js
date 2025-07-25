const express = require('express');
const router = express.Router();
const Like = require('../models/like.model');
const mongoose = require("mongoose")

// POST /api/likes - Like a comment
router.post('/', async (req, res) => {
  try {
    let { user, commentId } = req.body;
    if (!user || !commentId)
      return res.status(400).json({ error: 'user and commentId are required' });

    user = new mongoose.Types.ObjectId(user);
    commentId = new mongoose.Types.ObjectId(commentId);

    const like = await Like.create({ user, commentId }); // ✅ FIXED here
    res.status(201).json(like);
  } catch (err) {
    console.error('❌ Create like error:', err.message, err.keyValue);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You already liked this comment.' });
    }
    res.status(500).json({ error: 'Failed to like comment' });
  }
});


// GET /api/likes/:commentId - Get all likes for a comment
router.get('/:commentId', async (req, res) => {
  try {
    const likes = await Like.find({ commentId: req.params.commentId });
    res.json(likes);
  } catch (err) {
    console.error('Fetch likes error:', err);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

// POST /api/likes/toggle - Toggle like for a comment
router.post('/toggle', async (req, res) => {
  try {
    const { user, commentId } = req.body;
    if (!user || !commentId) {
      return res.status(400).json({ error: 'user and commentId are required' });
    }

    const existingLike = await Like.findOne({ user, commentId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      return res.json({ addLike: false });
    } else {
      // Like
      await Like.create({ user, commentId });
      return res.json({ addLike: true });
    }
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

module.exports = router;