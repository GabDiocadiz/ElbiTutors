import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["tutee", "tutor", "admin"], default: "tutee" },
  degree_program: { type: String },
  classification: { type: String },
  isLRCAdmin: { type: Boolean, default: false },
  permissions: {
    verifyTutors: { type: Boolean, default: false },
    manageSessions: { type: Boolean, default: false },
  },
  preferred_subjects: [String],
  warningCount: { type: Number, default: 0 },
  google_sub: { type: String },
  email_verified: { type: Boolean, default: false },
  picture: { type: String },
  status: { 
    type: String, 
    enum: ["active", "suspended", "inactive"], 
    default: "active" 
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);


