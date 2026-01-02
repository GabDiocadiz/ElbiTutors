import express from "express";
import { getSubjects, createSubject } from "../controllers/subjectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/subjects
 * @desc    List all subjects
 * @access  Public
 */
router.get("/", getSubjects);

/**
 * @route   POST /api/subjects
 * @desc    Add new subject to catalog
 * @access  Private (Admin Only)
 */
router.post("/", protect, adminOnly, createSubject);

export default router;