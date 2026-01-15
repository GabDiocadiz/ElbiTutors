import express from 'express';
import { createFeedback, getFeedbackForTutor } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createFeedback);
router.get('/tutor/:tutorId', protect, adminOnly, getFeedbackForTutor);

export default router;
