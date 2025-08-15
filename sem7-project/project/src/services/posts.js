// src/services/posts.js
import { makeRequest } from "./makeRequest";

// Viewer: fetch a creator's posts (subscription-gated)
export function getCreatorPosts(creatorId) {
  return makeRequest(`/private/post/${creatorId}`);
}

// Creator: fetch my own posts (dashboard)
export function getMyPosts() {
  return makeRequest(`/private/post`);
}

// Single post + comments (detail)
export function getPostDetail(postId) {
  return makeRequest(`/private/post/detail/${postId}`);
}

/** ---- Backward-compat shims so old imports don't break ---- */
export const getPost = getPostDetail;  // old name -> new route
export const getPosts = getMyPosts;    // old ambiguous name -> "my posts"
