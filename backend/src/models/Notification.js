import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String }, // e.g., "session_approved", "feedback_received"
  entityType: { type: String }, // optional reference type
  entityId: { type: mongoose.Schema.Types.ObjectId },
  payload: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);

