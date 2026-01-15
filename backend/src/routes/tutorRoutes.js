import express from "express";
import { 
  getTutors, 
  getTutorById, 
  updateTutorProfile,
  getPendingTutors,
  approveTutorChanges
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

// Admin Only: Approval Queue
import { adminOnly } from "../middlewares/authMiddleware.js";
router.get("/pending", protect, adminOnly, getPendingTutors);

router.put("/profile", protect, tutorOnly, updateTutorProfile);

/**
 * @route   GET /api/tutors/:id
 * @desc    View Specific Tutor Profile
 * @access  Public
 */
router.get("/:id", getTutorById);

router.put("/:id/approve", protect, adminOnly, approveTutorChanges);

export default router;