import { usePost } from "../contexts/PostContext"
import { useAsyncFn } from "../hooks/useAsync"
import { createComment } from "../services/comments"
import { CommentForm } from "./CommentForm"
import { CommentList } from "./CommentList"
import { useUser } from "../hooks/useUser" // if not already

export function Post() {
  const { post, rootComments, createLocalComment } = usePost()
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)
  const { user: currentUser } = useUser()
  
  console.log("Current user:", currentUser)

  function onCommentCreate(message) {
  if (!currentUser?._id) return Promise.reject("No userId!")

  return createCommentFn({
    postId: post._id,
    message,
    user: currentUser, // ✅ send full user object
  }).then((comment) => {
    // ✅ Patch in currentUser object manually
    comment.user = currentUser
    createLocalComment(comment)
  })
}


  return (
    <>
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm
          loading={loading}
          error={error}
          onSubmit={onCommentCreate}
        />
        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </>
  )
}