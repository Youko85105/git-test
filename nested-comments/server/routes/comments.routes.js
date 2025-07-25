const express = require('express');
const router = express.Router();

const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Post = require('../models/post.model');

// POST /api/comments - Create a new comment (root or nested)
router.post('/', async (req, res) => {
  try {
    const { message, user, postId, parentId } = req.body;

    // Basic validation
    if (!message || !user || !postId) {
      return res.status(400).json({ error: 'message, userId, and postId are required' });
    }

    const comment = await Comment.create({
      message,
      user,
      postId,
      parentId: parentId || null
    });
    
    await comment.populate('user')

    res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// PUT /api/comments/:id - Update a comment by ID (simpler)
router.put('/:id', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const { id: commentId } = req.params;

    if (!message || !userId) {
      return res.status(400).json({ error: 'message and userId are required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.message = message
    await comment.save()
    await comment.populate('user') // ⬅️ add this if you're using `user` in frontend
    res.json(comment) // ⬅️ send full updated comment

  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment by ID
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.body
    const { id: commentId } = req.params

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' })
    }
    
     // ✅ SOFT DELETE instead of removing
    comment.message = null
    comment.deleted = true
    await comment.save()
    await comment.populate('user') // in case frontend needs user info

    // ✅ Also delete all likes associated with this comment
    const Like = require('../models/like.model')
    await Like.deleteMany({ commentId })

    res.json(comment) // return full comment object
  } catch (err) {
    console.error('Delete comment error:', err)
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})


module.exports = router;