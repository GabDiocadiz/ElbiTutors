import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tuteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);

