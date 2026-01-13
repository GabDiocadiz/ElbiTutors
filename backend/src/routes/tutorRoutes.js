import express from "express";
import { 
  getTutors, 
  getTutorById, 
  updateTutorProfile 
} from "../controllers/tutorController.js";

// Middleware
import { protect, tutorOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/tutors
 * @desc    Search and List Tutors
 * @access  Public
 */
router.get("/", getTutors);

/**
 * @route   GET /api/tutors/:id
 * @desc    View Specific Tutor Profile
 * @access  Public
 */
router.get("/:id", getTutorById);

/**
 * @route   PUT /api/tutors/profile
 * @desc    Edit My Tutor Profile
 * @access  Private (Tutor Only)
 */
router.put("/profile", protect, tutorOnly, updateTutorProfile);

export default router;