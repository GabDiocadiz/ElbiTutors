import mongoose from "mongoose";

const tuteeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  preferredSubjects: [String],
}, { timestamps: true });

export default mongoose.model("Tutee", tuteeSchema);

