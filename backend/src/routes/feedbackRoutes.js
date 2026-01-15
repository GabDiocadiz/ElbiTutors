import express from "express";
import { submitFeedback, getTutorFeedback } from "../controllers/feedbackController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tutee submits feedback
router.post("/", protect, submitFeedback);

// Admin views feedback for a tutor
router.get("/tutor/:tutorId", protect, adminOnly, getTutorFeedback);

export default router;
