import mongoose from "mongoose";

const subjectCatalogSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classification: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("SubjectCatalog", subjectCatalogSchema);

