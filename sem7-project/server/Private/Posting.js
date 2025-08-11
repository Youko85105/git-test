import mongoose from "mongoose";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Subscription from "../models/Subscription.js";
import { deleteImage } from "../Util/CloudinaryUpload.js";
import { checkAuthorization } from "./Authorization.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { notify } from "../services/notifications.js";

export const createPost = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    const post = { ...req.body };
    post.author = new mongoose.Types.ObjectId(user);

    // Initialize attachments as an array if not already
    post.attachments = post.attachments || []; // Ensure attachments is always an array

    if (Array.isArray(req.files)) {
        const attachments = req.attachments;
        console.log(attachments)
        post.attachments = attachments;
    }
    if (req.user.role == "creator") {
        try {
            const newPost = new Post(post);
            await newPost.save();
            // ✅ Notify all active subscribers that this creator published a new post
            try {
                const subs = await Subscription
                    .find({ creatorId: user, active: true })
                    .select("subscriberId")
                    .lean();

                const actorId = user; // the creator who posted
                const creatorName = req.user?.username || "A creator you follow";

                await Promise.all(
                    subs.map(s =>
                        notify({
                            userId: s.subscriberId,         // recipient
                            actorId,                         // who caused it
                            type: "post:new",                // your type key
                            message: `${creatorName} posted a new update`,
                            metadata: { postId: newPost._id, creatorId: actorId },
                        })
                    )
                );
            } catch (nErr) {
                // don't fail the request if notifications hiccup
                console.warn("notify(post:new) failed:", nErr);
            }

            return res.status(201).json({ message: "Post created successfully", post: newPost });
        } catch (error) {
            return res.status(501).json({ message: error });
        }
    } else {
        post.attachments.map(pic => deleteImage(pic.publicId));
        return res.status(401).json({ message: "Unauthorized access" });
    }
};

export const getAllPosts = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    let creator;

    if (req.params.creatorId) {
        creator = req.params.creatorId;
    }
    if (!creator) {    //show a creator his own posts on dashboard
        try {
            const posts = await Post.find({ author: user });
            return res.status(200).json(posts);
        } catch (error) {
            return res.status(404).json({ message: error });
        }
    } else if (creator && isSubscribed(user, creator)) {     //show a creator's post to his active subscriber on creator's profile
        try {
            console.log("subscribed");
            const posts = await Post.find({ author: creator });
            return res.status(200).json(posts);
        } catch (error) {
            return res.status(404).json({ message: error });
        }
    } else {
        return res.status(401).json({ message: "Unauthorized Access" });
    }
};

const isSubscribed = async (user, creator) => {
    const subscription = await Subscription.findOne({
        subscriberId: user,
        creatorId: creator,
        active: true
    });
    if (subscription) {
        console.log("subscribed")
        return true;
    } else {
        console.log("not subscribed")
        return false;
    }
}

export const editPost = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    const role = req.user.role;
    const postId = req.params.postId;
    const editData = { ...req.body };
    if (Array.isArray(req.files)) {
        const attachments = req.attachments;
        console.log(attachments)
        editData.attachments = attachments;
    }
    try {
        const post = await Post.findById(postId).select('author attachments');
        if (role == "creator" && post.author == user) {
            const editedPost = await Post.findByIdAndUpdate(postId, { $set: editData });
            await editedPost.save();
            post.attachments.map(pic => deleteImage(pic.publicId));
            return res.status(200).json({ message: "Post edited successfully", post: editedPost });
        } else {
            return res.status(401).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.log("Update error");
        editData.attachments.map(pic => deleteImage(pic.publicId));
        return res.status(500).json({ message: error });
    }
};

export const deletePost = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    const role = req.user.role;
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId).select('author attachments');
        if (role == "creator" && post.author == user) {
            await Post.findByIdAndDelete(postId);
            post.attachments.map(pic => { deleteImage(pic.publicId) });
            return res.status(200).json({ message: "Successfully deleted ", post });
        } else {
            return res.status(401).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.log("Delete error");
        return res.status(500).json({ message: error });
    }
};

export const likePost = async (req, res) => {
    checkAuthorization(req, res);
    const user = req.user.id;
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId).select('likes author');
        if (isSubscribed(user, post.author)) {
            const like = new PostLike({
                postId,
                subscriberId: user
            })
            await like.save();
            return res.status(204);
        } else {
            return res.status(401).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const getPostWithComments = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    try {
        console.log("📌 Looking for post ID:", req.params.postId);
        console.log("🔎 req.user:", req.user);       // Should include `id` and `_id`
        console.log("🧠 req.user._id:", req.user._id);
        console.log("🧠 req.user.id:", req.user.id); // Might be undefined
        const post = await Post.findById(postId).populate('author', 'username');
        console.log("Populated author:", post.author);
        console.log("📌 Post found:", post);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comments = await Comment.find({ postId: new mongoose.Types.ObjectId(postId) })
            .sort({ createdAt: 1 })
            .populate('user', 'username profilePic role');
        console.log("Hi we are comments: ", comments)
        const formattedComments = await Promise.all(
            comments.filter(c => c.user).map(async comment => {
                const likeCount = await Like.countDocuments({ commentId: comment._id });
                const likedByMe = userId
                    ? await Like.exists({ commentId: comment._id, user: userId })
                    : false;

                return {
                    ...comment.toObject(),
                    likeCount,
                    likedByMe: !!likedByMe,
                    user: comment.user
                };
            })
        );

        return res.status(200).json({
            post: {
                ...post.toObject(),
                author: {
                    id: post.author._id,
                    name: post.author.username,
                },
            },
            comments: formattedComments
        });

    } catch (error) {
        console.log("🔥 req.user:", req.user);
        console.error("❌ Fetch post with comments error:", error);
        return res.status(500).json({ error: "Failed to fetch post and comments" });
    }
};