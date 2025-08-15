import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { usePost } from "../contexts/PostContext";
import CommentList from "./CommentList";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PostPage = ({ isDarkMode, toggleTheme, isLoggedIn, logout }) => {
  const location = useLocation();
  const [search] = useSearchParams();
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

  // Read highlight target from state (preferred) or query (?comment= / ?highlight=)
  useEffect(() => {
    const fromState = location.state?.highlightCommentId || null;
    const fromQuery = search.get("comment") || search.get("highlight") || null;
    setHighlightedCommentId(fromState || fromQuery);
  }, [location.state, search]);

  // Optional: smooth-scroll to the highlighted comment when comments load
  useEffect(() => {
    if (!highlightedCommentId || !comments?.length) return;
    // Try two common hooks the comment item might expose:
    const el =
      document.querySelector(`[data-comment-id="${highlightedCommentId}"]`) ||
      document.getElementById(`comment-${highlightedCommentId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-blue-500");
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-500"), 1500);
    }
  }, [highlightedCommentId, comments]);

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
