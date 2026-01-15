import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjectsOffered: [String],
  availabilityImage: { type: String },
  googleCalendarLink: { type: String }, // SRS 4.4.3 REQ-3
  bio: { type: String },
  certified: { type: Boolean, default: false },
  specializationText: { type: String },
  specializationCodes: [String],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String }, // e.g., "10:00"
    endTime: { type: String }    // e.g., "12:00"
  }],
  isProfileVerified: { type: Boolean, default: true }, // Default true for seeded/initial
  pendingChanges: {
    bio: String,
    subjectsOffered: [String],
    specializationText: String,
    availabilityImage: String
  }
}, { timestamps: true });

export default mongoose.model("Tutor", tutorSchema);

