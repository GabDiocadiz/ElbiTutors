import mongoose from "mongoose";

const warningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  decidedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  decision: { type: String }, // e.g., "temporary suspension", "warning issued"
  reason: { type: String },
}, { timestamps: true });

export default mongoose.model("Warning", warningSchema);

