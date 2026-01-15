import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., "UPDATE_ROLE", "SUSPEND_USER"
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String } // Optional capture
}, { timestamps: true });

export default mongoose.model("AuditLog", auditLogSchema);