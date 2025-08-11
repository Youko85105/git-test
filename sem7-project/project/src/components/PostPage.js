import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePost } from "../contexts/PostContext";
import CommentList from "./CommentList";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PostPage = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  const location = useLocation();
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);

  const {
    post,
    postId,
    comments,
    getReplies,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    currentUser,
    loading,
  } = usePost();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlight = searchParams.get("highlight");
    if (highlight) {
      setHighlightedCommentId(highlight);
    }
  }, [location.search]);

  if (!post) return <div className="text-center mt-10">Loading post...</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} isLoggedIn={isLoggedIn} logout={logout} />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-6">{post.body}</p>

        <hr className="my-6" />
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentList
          comments={comments || []}
          postId={postId}
          getReplies={getReplies}
          onReply={createComment}
          onUpdate={updateComment}
          onDelete={deleteComment}
          onToggleLike={toggleCommentLike}
          currentUser={currentUser}
          loading={loading}
          highlightId={highlightedCommentId}
        />
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default PostPage;
