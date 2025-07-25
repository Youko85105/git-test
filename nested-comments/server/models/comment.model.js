const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  message: {
  type: String,
  required: function () {
    // only require message if not soft-deleted
    return !this.deleted
  },
},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);