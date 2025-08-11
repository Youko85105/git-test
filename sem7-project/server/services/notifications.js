// services/notification.service.js
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

/**
 * Create and (optionally) push a notification.
 * @param {Object} p
 * @param {string|ObjectId} p.userId  - recipient
 * @param {string|ObjectId} [p.actorId] - who triggered it
 * @param {string} p.type - e.g. 'post:new'
 * @param {string} [p.message]
 * @param {Object} [p.metadata] - { postId, commentId, status, amount, ... }
 */
export async function notify({ userId, actorId, type, message, metadata }) {
  const doc = await Notification.create({
    user_id: new mongoose.Types.ObjectId(userId),
    actor_id: actorId ? new mongoose.Types.ObjectId(actorId) : undefined,
    type,
    message,
    metadata,
  });

  // Optional socket push if you add Socket.IO later:
  // global.io?.to(String(userId)).emit("notification:new", doc);

  return doc;
}
