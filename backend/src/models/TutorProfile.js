import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  certified: { type: Boolean, default: false },
  specializationText: { type: String },
  specializationCodes: [String],
  bio: { type: String },
  
  isVerified: { type: Boolean, default: false }, 
  
  availability: [{
    day: { type: String, required: true }, 
    slots: [{
      start: String, 
      end: String,
      isBooked: { type: Boolean, default: false }
    }]
  }],
}, { timestamps: true });

export default mongoose.model("TutorProfile", tutorProfileSchema);

