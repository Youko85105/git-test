import React, { useState, useMemo, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useAsyncFn } from '../hooks/useAsync';
import {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getPost
} from '../services/comments';

// Mock user for now - in a real app, this would come from auth context
const mockUser = {
  _id: 'user123',
  name: 'Current User'
};

// Mock comments for demo when backend is not available
const mockComments = [
  {
    _id: 'comment1',
    message: 'This is a sample comment to show how the nested comment system works!',
    user: { _id: 'user1', name: 'John Doe' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likeCount: 3,
    likedByMe: false,
    parentId: null
  },
  {
    _id: 'comment2',
    message: 'This is a reply to the first comment. You can nest comments infinitely!',
    user: { _id: 'user2', name: 'Jane Smith' },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    likeCount: 1,
    likedByMe: true,
    parentId: 'comment1'
  }
];

export default function CommentsSection({ postId, title = "Comments" }) {
  const [comments, setComments] = useState([]);
  const [currentUser] = useState(mockUser); // In real app, get from auth context
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  
  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);

  // Group comments by parentId for nested structure
  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach(comment => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  const rootComments = commentsByParentId[null] || [];

  // Load comments for the post
  useEffect(() => {
    if (postId) {
      getPost(postId)
        .then(data => {
          if (data?.comments) {
            setComments(
              data.comments.map(comment => ({
                ...comment,
                id: comment._id,
                parentId: comment.parentId || null,
              }))
            );
          }
        })
        .catch(error => {
          console.error('Failed to load comments:', error);
          // Fall back to mock comments for demo purposes
          setIsUsingMockData(true);
          setComments(
            mockComments.map(comment => ({
              ...comment,
              id: comment._id,
              parentId: comment.parentId || null,
            }))
          );
        });
    }
  }, [postId]);

  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }

  function createLocalComment(comment) {
    setComments(prevComments => [comment, ...prevComments]);
  }

  function updateLocalComment(id, updatedComment) {
    setComments(prevComments => {
      return prevComments.map(comment => 
        comment._id === id ? updatedComment : comment
      );
    });
  }

  function deleteLocalComment(id) {
    setComments(prevComments => {
      return prevComments.filter(comment => comment._id !== id);
    });
  }

  function toggleLocalCommentLike(id, addLike) {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (id === comment._id) {
          const currentCount = comment.likeCount || 0;
          return {
            ...comment,
            likeCount: addLike ? currentCount + 1 : Math.max(currentCount - 1, 0),
            likedByMe: addLike,
          };
        }
        return comment;
      });
    });
  }

  // Handler functions
  function onCommentCreate(message) {
    if (!currentUser) return Promise.reject('User not logged in');
    
    return createCommentFn.execute({
      postId,
      message,
      parentId: null,
      user: currentUser,
    }).then(comment => {
      createLocalComment(comment);
    }).catch(error => {
      // If API fails, create a mock comment for demo
      const mockComment = {
        _id: 'mock_' + Date.now(),
        message,
        user: currentUser,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        likedByMe: false,
        parentId: null
      };
      createLocalComment(mockComment);
      throw error; // Still throw error to show user the API issue
    });
  }

  function onCommentReply({ postId, message, parentId, user }) {
    return createCommentFn.execute({
      postId,
      message,
      parentId,
      user,
    }).then(comment => {
      createLocalComment(comment);
    });
  }

  function onCommentUpdate({ message, id, userId }) {
    return updateCommentFn.execute({
      message,
      id,
      userId,
    }).then(comment => {
      updateLocalComment(id, comment);
    });
  }

  function onCommentDelete({ id, userId }) {
    return deleteCommentFn.execute({
      id,
      userId,
    }).then((deletedComment) => {
      updateLocalComment(id, deletedComment);
    });
  }

  function onToggleCommentLike({ id, userId }) {
    return toggleCommentLikeFn.execute({
      id,
      userId,
    }).then(({ addLike }) => {
      toggleLocalCommentLike(id, addLike);
    });
  }

  const loading = {
    create: createCommentFn.loading,
    createError: createCommentFn.error,
    update: updateCommentFn.loading,
    updateError: updateCommentFn.error,
    delete: deleteCommentFn.loading,
    deleteError: deleteCommentFn.error,
    like: toggleCommentLikeFn.loading,
    likeError: toggleCommentLikeFn.error,
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">{title} ({comments.length})</h3>
      
      {isUsingMockData && (
        <div className="api-warning" style={{ 
          background: '#fef3cd', 
          border: '1px solid #fdd835', 
          borderRadius: '4px', 
          padding: '12px', 
          marginBottom: '16px',
          color: '#8b5a00'
        }}>
          <strong>Demo Mode:</strong> Backend API not available. Showing sample comments. 
          To enable full functionality, start the backend server: <code>cd nested-comments/server && npm start</code>
        </div>
      )}
      
      <div className="comment-form-section">
        <CommentForm
          onSubmit={onCommentCreate}
          loading={createCommentFn.loading}
          error={createCommentFn.error}
        />
      </div>

      {rootComments.length > 0 && (
        <div className="comments-list">
          <CommentList
            comments={rootComments}
            onReply={onCommentReply}
            onUpdate={onCommentUpdate}
            onDelete={onCommentDelete}
            onToggleLike={onToggleCommentLike}
            getReplies={getReplies}
            currentUser={currentUser}
            loading={loading}
          />
        </div>
      )}

      {comments.length === 0 && (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}