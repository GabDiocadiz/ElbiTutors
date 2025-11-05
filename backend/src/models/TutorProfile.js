import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  certified: { type: Boolean, default: false },
  specializationText: { type: String },
  specializationCodes: [String],
  bio: { type: String },
}, { timestamps: true });

export default mongoose.model("TutorProfile", tutorProfileSchema);

