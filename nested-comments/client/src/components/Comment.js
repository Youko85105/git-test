import { IconBtn } from "./IconBtn"
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa"
import { usePost } from "../contexts/PostContext"
import { CommentList } from "./CommentList"
import { useState } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../services/comments"
import { CommentForm } from "./CommentForm"
import { useUser } from "../hooks/useUser"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
})

export function Comment({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
  parentId
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost()
  const createCommentFn = useAsyncFn(createComment)
  const updateCommentFn = useAsyncFn(updateComment)
  const deleteCommentFn = useAsyncFn(deleteComment)
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)
  const childComments = getReplies(id) || []
  const { user: currentUser, loading: userLoading } = useUser()
  const commentOwnerId = user?.id || user?._id
  const deleted = !message  // ← mark if comment is deleted (message is null)

  if (userLoading) return null

  
  console.log("child comments for hiding them" , childComments)
  console.log("Replies for", id, ":", getReplies(id))
  console.log("wanna know like or unlike" , likedByMe)

  function onCommentReply(message) {
  if (!currentUser) return
  return createCommentFn.execute({
    postId: post._id,
    message,
    parentId: id,
    user: currentUser, // ✅ send full user object now
  }).then(comment => {
    setIsReplying(false)
    createLocalComment(comment)
  })
}



  function onCommentUpdate(message) {
  return updateCommentFn
    .execute({
      postId: post._id,
      message,
      id,
      userId: currentUser._id, // ✅ Add this
    })
    .then(comment => {
    setIsEditing(false)
    updateLocalComment(id, comment) // full object
    })
}


  function onCommentDelete() {
  return deleteCommentFn
    .execute({
      postId: post._id,
      id,
      userId: currentUser._id, // ✅ Add this
    })
    .then((deletedComment) => {
  updateLocalComment(id, deletedComment)
})

}


  function onToggleCommentLike() {
  return toggleCommentLikeFn
    .execute({
      id,
      postId: post._id,
      userId: currentUser._id, // ✅ Add this
    })
    .then(({ addLike }) => toggleLocalCommentLike(id, addLike))
}


  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user?.name || "Anonymous"}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.error}
          />
        ) : (
          <div className="message">
  {deleted ? <em className="text-muted">This comment was deleted</em> : message}
</div>

        )}
        {!deleted && (
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "Unlike" : "Like"}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying(prev => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          {!userLoading && String(currentUser?._id) === String(commentOwnerId) && (
            <>
              <IconBtn
                onClick={() => setIsEditing(prev => !prev)}
                isActive={isEditing}
                Icon={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
              />
              <IconBtn
                disabled={deleteCommentFn.loading}
                onClick={onCommentDelete}
                Icon={FaTrash}
                aria-label="Delete"
                color="danger"
              />
            </>
          )}
        </div>
        )}
        {deleteCommentFn.error && (
          <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )}
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  )
}
