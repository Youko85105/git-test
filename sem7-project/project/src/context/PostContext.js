import React, { useContext, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useAsync } from "../hooks/useAsync"
import { getPost } from "../services/posts"

const Context = React.createContext()

export function usePost() {
  return useContext(Context)
}

export function PostProvider({ children }) {
  const { id } = useParams()
  const { loading, error, value: data } = useAsync(() => getPost(id), [id])
  const [comments, setComments] = useState([])
  const commentsByParentId = useMemo(() => {
    const group = {}
    comments.forEach(comment => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)
    })
    return group
  }, [comments])
console.log("All comments:", comments)
console.log("Grouped comments:", commentsByParentId)

  useEffect(() => {
  if (data?.comments == null) return
  setComments(
    data.comments.map(comment => ({
      ...comment,
      id: comment._id,
      parentId: comment.parentId || null,
    }))
  )
}, [data?.comments])

  function getReplies(parentId) {
    return commentsByParentId[parentId]
  }

  function createLocalComment(comment) {
    setComments(prevComments => {
      return [comment, ...prevComments]
    })
  }

  function updateLocalComment(id, updatedComment) {
  setComments(prevComments => {
    return prevComments.map(comment => {
      return comment._id === id ? updatedComment : comment
    })
  })
}

  function deleteLocalComment(id) {
    setComments(prevComments => {
      return prevComments.filter(comment => comment._id !== id)
    })
  }

  function toggleLocalCommentLike(id, addLike) {
  setComments(prevComments => {
    return prevComments.map(comment => {
      if (id === comment._id) {
        const currentCount = comment.likeCount || 0
        return {
          ...comment,
          likeCount: addLike ? currentCount + 1 : Math.max(currentCount - 1, 0),
          likedByMe: addLike,
        }
      } else {
        return comment
      }
    })
  })
}


  return (
    <Context.Provider
      value={{
        post: { id, ...(data?.post || {}) },
        rootComments: commentsByParentId[null],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
      }}
    >
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1 className="error-msg">{error}</h1>
      ) : (
        children
      )}
    </Context.Provider>
  )
}
