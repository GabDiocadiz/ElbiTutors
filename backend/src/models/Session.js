import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendance_status: { type: String, enum: ["present", "absent"], default: "present" },
});

const sessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdByTuteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String },
  location: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isGroup: { type: Boolean, default: false },
  maxParticipants: { type: Number, default: 1 },
  status: { type: String, enum: ["pending", "approved", "done"], default: "pending" },
  approvedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [participantSchema],
  deleted_at: { type: Date },
}, { timestamps: true });

export default mongoose.model("Session", sessionSchema);

