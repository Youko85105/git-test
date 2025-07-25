const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ✅ must be 'user'
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true }
}, { timestamps: true });

LikeSchema.index({ user: 1, commentId: 1 }, { unique: true }); // ✅ unique combo

module.exports = mongoose.model('Like', LikeSchema);