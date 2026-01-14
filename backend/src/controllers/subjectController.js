import SubjectCatalog from "../models/SubjectCatalog.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all active subjects
 * @route   GET /api/subjects
 * @access  Public
 * @srs     2.2 Product Functions (Course codes as searchable tags)
 */
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await SubjectCatalog.find({ active: true })
      .select("code name classification")
      .sort({ code: 1 }); // Alphabetical order (A-Z)
      
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new subject to the catalog
 * @route   POST /api/subjects
 * @access  Private (Admin Only)
 * @note    Utility for Admins to populate the dropdowns
 */
export const createSubject = async (req, res, next) => {
  const { code, name, classification } = req.body;

  // Input Validation
  if (!code || !name) {
    throw new ApiError("Subject code and name are required.", 400);
  }

  try {
    // Normalization (CMSC 11 -> CMSC 11, cmsc 11 -> CMSC 11)
    const normalizedCode = code.trim().toUpperCase();

    // Duplicate Check
    const exists = await SubjectCatalog.findOne({ code: normalizedCode });
    if (exists) {
      throw new ApiError(`Subject code '${normalizedCode}' already exists.`, 400);
    }

    // 4. Create
    const subject = await SubjectCatalog.create({
      code: normalizedCode,
      name: name.trim(),
      classification
    });

    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};