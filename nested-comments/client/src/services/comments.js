import { makeRequest } from "./makeRequest"

export function createComment({ postId, message, parentId, user }) {
  return makeRequest(`/posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId, user }, // ✅ add userId
  })
}


export function updateComment({ message, id, userId }) {
  return makeRequest(`/comments/${id}`, {
    method: "PUT",
    data: { message, userId },
  });
}


export function deleteComment({ id, userId }) {
  return makeRequest(`/comments/${id}`, {
    method: "DELETE",
    data: { userId },
  })
}


export function toggleCommentLike({ id: commentId, userId }) {
  return makeRequest(`/likes/toggle`, {
    method: "POST",
    data: { user: userId, commentId }, // backend expects "user" field
  });
}
