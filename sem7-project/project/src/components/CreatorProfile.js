import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCreatorPosts } from '../services/posts';
import CommentsSection from './CommentsSection';
import Navbar from './Navbar';

// lightweight inline icons (no library)
const Icon = {
  Heart: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M12 21s-7.2-4.35-9.6-8.4C.5 9.2 2.3 5.5 6 5.5c2 0 3.2 1 4 2 0.8-1 2-2 4-2 3.7 0 5.5 3.7 3.6 7.1C19.2 16.65 12 21 12 21z" />
    </svg>
  ),
  Message: (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
    </svg>
  ),
  Check: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" />
    </svg>
  ),
};

const CreatorProfile = ({ isDarkMode, toggleTheme }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [creatorError, setCreatorError] = useState(null);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // UI state (local only for now)
  const [openComments, setOpenComments] = useState({});     // { [postId]: boolean }
  const [likeState, setLikeState] = useState({});           // { [postId]: { liked:boolean, count:number } }

  // 1) public creator profile
  useEffect(() => {
    let alive = true;
    setCreatorLoading(true);

    fetch(`http://localhost:3002/api/public/creator/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creator');
        return res.json();
      })
      .then(data => { if (alive) { setCreator(data); setCreatorLoading(false); } })
      .catch(err => { if (alive) { setCreatorError(err.message); setCreatorLoading(false); } });

    return () => { alive = false; };
  }, [id]);

  // 2) gated posts by subscription
  useEffect(() => {
    let alive = true;
    setPostsLoading(true);

    getCreatorPosts(id)
      .then(data => {
        if (!alive) return;
        setIsSubscribed(true);
        setPosts(Array.isArray(data) ? data : (data?.posts || []));
      })
      .catch(() => {
        if (!alive) return;
        // Any failure (e.g., 401) => treat as not subscribed
        setIsSubscribed(false);
        setPosts([]);
      })
      .finally(() => { if (alive) setPostsLoading(false); });

    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    setOpenComments({});
    setLikeState({});
  }, [id]);

  if (creatorLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        Loading creator...
      </div>
    );
  }

  // Helpers
  const getLikeInfo = (post) => {
    const pid = post._id || post.id;
    const local = likeState[pid] || {};
    const baseCount = typeof post.likeCount === 'number' ? post.likeCount : 0;
    return {
      liked: local.liked ?? post.likedByMe ?? false,
      count: local.count ?? baseCount,
    };
  };
  const toggleComment = (postId) =>
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const toggleLike = (post) => {
    const pid = post._id || post.id;
    const { liked, count } = getLikeInfo(post);
    const next = { liked: !liked, count: Math.max(0, count + (liked ? -1 : 1)) };
    setLikeState((prev) => ({ ...prev, [pid]: next }));
    // later: call like/unlike API and handle errors (revert if needed)
  };

  if (creatorError || !creator) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator not found</h2>
          <Link to="/" className="text-blue-500 underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // inside CreatorProfile.jsx
  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        // not logged in → go login, then come back here
        navigate(`/login?redirect=/creator/${id}`);
        return;
      }

      // ⚠️ Use the EXACT path your server exposes (match your Postman tab)
      const res = await fetch(`http://localhost:3002/api/private/subscribe/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate(`/login?redirect=/creator/${id}`);
        return;
      }
      if (!res.ok) throw new Error(`Subscribe failed (${res.status})`);

      const data = await res.json();

      // Your server returns { url: session.url } (see your screenshot),
      // so redirect using data.url (NOT checkoutUrl).
      if (data.url) {
        window.location.href = data.url;          // go to Stripe Checkout
        return;
      }

      // (If you later change server to return { checkoutUrl }, handle it here)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback if neither key exists
      throw new Error("No checkout URL returned");
    } catch (err) {
      console.error(err);
      navigate(`/subscribe/${id}/error`);
    }
  };

  const avatar = creator?.profilePic?.url || '/images/creator.jpg';
  const displayName = creator?.username || creator?.name || 'Unknown';
  const handle = creator?.handle ? `@${creator.handle}` : '';
  const bio = creator?.bio || creator?.description || '';
  const postCount = Array.isArray(posts) ? posts.length : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* ✅ no auth props */}
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Link to="/" className="text-blue-500 underline mb-8 inline-block">← Back to Home</Link>

        {/* Profile header card */}
        <div className={`mb-10 rounded-2xl overflow-hidden border shadow-sm ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          {/* Cover (placeholder gradient) */}
          <div className={`h-28 w-full ${isDarkMode ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`} />

          {/* Header content */}
          <div className="p-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              {/* Avatar */}
              <img
                src={avatar}
                alt={displayName}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-md"
              />

              {/* Name + meta */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{displayName}</h1>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                    <Icon.Check /> Creator
                  </span>
                </div>
                <div className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{handle}</div>
                {bio && <p className={`mt-3 max-w-2xl ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{bio}</p>}

                {/* Stats + CTA */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-semibold text-gray-900 dark:text-white">{postCount}</span> posts
                  </div>

                  <div className="flex-1" />

                  {!isSubscribed ? (
                    <button
                      onClick={handleSubscribe}
                      className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      Subscribe
                    </button>
                  ) : (
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-700'}`}>
                      Subscribed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        <div>
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>

          {postsLoading ? (
            <div className="text-center opacity-70">Loading posts…</div>
          ) : isSubscribed ? (
            posts.length ? (
              <div className="space-y-6">
                {posts.map((post) => {
                  const pid = post._id || post.id;
                  const likeInfo = getLikeInfo(post);
                  const commentsOpen = !!openComments[pid];
                  const attachments = Array.isArray(post.attachments) ? post.attachments : [];

                  return (
                    <div
                      key={pid}
                      className={`p-6 rounded-xl shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                    >
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="whitespace-pre-wrap">{post.content || post.body}</p>

                      {/* Attachments gallery (Cloudinary) */}
                      {attachments.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {attachments.map((att, i) => (
                            <a key={att.publicId || i} href={att.url} target="_blank" rel="noreferrer" className="block group">
                              <div className="relative w-full overflow-hidden rounded-xl border
                        aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                                <img
                                  src={att.url}
                                  alt={`attachment ${i + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Action bar */}
                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <button
                          onClick={() => toggleLike(post)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${likeInfo.liked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : isDarkMode
                              ? 'border-gray-600 hover:bg-gray-700 text-gray-200'
                              : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          aria-pressed={likeInfo.liked}
                        >
                          <Icon.Heart />
                          {likeInfo.liked ? 'Liked' : 'Like'}{likeInfo.count ? ` • ${likeInfo.count}` : ''}
                        </button>

                        <button
                          onClick={() => toggleComment(pid)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          aria-expanded={commentsOpen}
                        >
                          <Icon.Message />
                          {commentsOpen ? 'Hide comments' : 'Comment'}
                        </button>
                      </div>

                      {/* Comments drawer */}
                      {commentsOpen && (
                        <div className="mt-5">
                          <CommentsSection postId={pid} title="Comments" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center opacity-70">No posts yet.</div>
            )
          ) : (
            <div className="text-center p-8 border rounded-xl bg-yellow-100 text-yellow-800">
              <p>You must subscribe to view this creator's posts.</p>
              <button onClick={handleSubscribe} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
                Subscribe
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
