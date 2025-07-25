const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const Comment = require('../models/comment.model') // make sure this is at the top

// POST /api/posts - Create a post
router.post('/', async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

    const post = await Post.create({ title, body });
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 1 });
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

//get a post with all info
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .populate("user", "name")

    const Like = require('../models/like.model') // ✅ Add this at top

const userId = req.user?._id
 // ✅ Get userId from client (or from auth middleware if used)

const formattedComments = await Promise.all(
  comments
    .filter(comment => comment.user)
    .map(async comment => {
      const likeCount = await Like.countDocuments({ commentId: comment._id })

      let likedByMe = false
      if (userId) {
        likedByMe = await Like.exists({ commentId: comment._id, user: userId })
      }

      return {
        ...comment.toObject(),
        likeCount,
        likedByMe: !!likedByMe,
        user: {
          id: comment.user._id,
          name: comment.user.name,
        },
      }
    })
)


    res.json({ post, comments: formattedComments })
  } catch (err) {
    console.error('Fetch post by ID error:', err)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

router.post('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { message, user, parentId } = req.body;

  if (!message || !user) {
    return res.status(400).json({ error: 'message, user, and postId are required' });
  }

  try {
    const comment = await Comment.create({
      postId,
      message,
      user,
      parentId: parentId || null,
    });

    // ✅ Populate user's name
    await comment.populate("user", "name");

    // ✅ Send formatted comment back
    const formattedComment = {
      ...comment.toObject(),
      user: {
        id: comment.user._id,
        name: comment.user.name,
      },
    };

    res.status(201).json(formattedComment);
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});



module.exports = router;