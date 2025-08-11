import express from 'express';  // Import express using ES Modules
import mongoose from 'mongoose'; // Import mongoose
import Comment from '../models/comment.model.js'; // Import your Comment model (add .js extension)
import Post from '../models/Post.js';  // Import Post model (add .js extension)
import Notification from '../models/notification.model.js';  // Import Notification model (add .js extension)
import authMiddleware from '../middleware/AuthMiddleware.js';
import Like from '../models/like.model.js';  // ✅ CORRECT ES Module
import { notify } from '../services/notifications.js';

const router = express.Router();

// ✅ CREATE COMMENT — Protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, postId, parentId } = req.body;
    const user = req.user;

    if (!message || !postId) {
      return res.status(400).json({ error: 'Message and postId are required' });
    }

    const comment = await Comment.create({
      message,
      user: new mongoose.Types.ObjectId(user._id),  // From req.user
      postId: new mongoose.Types.ObjectId(postId),
      parentId: parentId || null
    });

    // ✅ Use discriminator-aware populate
    await comment.populate({
  path: 'user',
  select: 'username profilePic role'
});


    const post = await Post.findById(postId);

    if (post && post.user_id && post.user_id.toString() !== user._id.toString()) {
      await Notification.create({
        user_id: post.user_id,
        actor_id: user._id,
        type: 'comment',
        message: `💬 ${comment.user.username} commented on your post.`,
        post_id: postId,
        comment_id: comment._id,
        is_read: false,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// ✅ UPDATE COMMENT — Protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const { id: commentId } = req.params;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.message = message;
    await comment.save();
    // ✅ Use discriminator-aware populate
    await comment.populate({
  path: 'user',
  select: 'username profilePic role'
});

    res.json(comment);
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// ✅ DELETE COMMENT — Protected
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    // ✅ Soft delete
    comment.message = null;
    comment.deleted = true;
    await comment.save();
    // ✅ Use discriminator-aware populate
    await comment.populate({
  path: 'user',
  select: 'username profilePic role'
});


    // ✅ Delete associated likes
    await Like.deleteMany({ commentId });

    res.json(comment);
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});


export default router;  // Use export default for ES Module
