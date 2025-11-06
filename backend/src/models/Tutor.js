import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjectsOffered: [String],
  availabilityImage: { type: String },
  bio: { type: String },
  certified: { type: Boolean, default: false },
  specializationText: { type: String },
  specializationCodes: [String],
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Tutor", tutorSchema);

