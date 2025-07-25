import { Comment } from "./Comment"

export function CommentList({ comments }) {
  console.log("Rendered comments:", comments) 
  return comments.map(comment => (
    <div key={comment._id} className="comment-stack">
      <Comment
        id={comment._id}
        parentId={comment.parentId || null} // ✅ Add this
        message={comment.message}
        user={comment.user}
        createdAt={comment.createdAt}
        likeCount={comment.likeCount}
        likedByMe={comment.likedByMe}
      />
    </div>
  ))
}