import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);

