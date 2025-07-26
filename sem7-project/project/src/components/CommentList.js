import React from "react";
import Comment from "./Comment";

export default function CommentList({
  comments,
  postId,
  onReply,
  onUpdate,
  onDelete,
  onToggleLike,
  getReplies,
  currentUser,
  loading 
}) {
  return comments.map(comment => (
    <div key={comment._id || comment.id} className="comment-stack">
      <Comment
        id={comment._id || comment.id}
        postId={comment.postId || postId}
        parentId={comment.parentId || null}
        message={comment.message}
        user={comment.user}
        createdAt={comment.createdAt}
        likeCount={comment.likeCount}
        likedByMe={comment.likedByMe}
        onReply={onReply}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onToggleLike={onToggleLike}
        getReplies={getReplies}
        currentUser={currentUser}
        loading={loading}
      />
    </div>
  ));
}