import Feedback from '../models/Feedback.js';
import Session from '../models/Session.js';
import Tutor from '../models/Tutor.js';

/**
 * @desc    Submit Feedback for a Session
 * @route   POST /api/feedback
 * @access  Private (Tutee)
 * @srs     4.6 Tutor Evaluation and Feedback
 */
export const createFeedback = async (req, res) => {
  const { sessionId, rating, comment } = req.body;

  try {
    // 1. Validate Session Existence and Status
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    // SRS 4.6.1: "after the session is completed"
    if (session.status !== 'done') {
      return res.status(400).json({ message: "You can only rate completed sessions." });
    }

    // 2. Validate Ownership (Must be the Tutee who booked it)
    if (session.createdByTuteeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to rate this session." });
    }

    // 3. Prevent Duplicates (SRS 4.6.3 REQ-5)
    const existingFeedback = await Feedback.findOne({ sessionId });
    if (existingFeedback) {
      return res.status(400).json({ message: "You have already submitted feedback for this session." });
    }

    // 4. Create Feedback
    const feedback = await Feedback.create({
      sessionId,
      tutorId: session.tutorId, // This is the User ID of the Tutor
      tuteeId: req.user._id,
      rating,
      comment
    });

    // 5. Update Tutor's Average Rating (SRS 4.6.3 REQ-3)
    const tutor = await Tutor.findOne({ userId: session.tutorId });
    if (tutor) {
      const allFeedback = await Feedback.find({ tutorId: session.tutorId });
      const totalRating = allFeedback.reduce((acc, curr) => acc + curr.rating, 0);
      
      tutor.ratingCount = allFeedback.length;
      tutor.rating = totalRating / allFeedback.length;
      
      await tutor.save();
    }

    res.status(201).json(feedback);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error: Unable to submit feedback." });
  }
};

/**
 * @desc    Get All Feedback for a Tutor
 * @route   GET /api/feedback/tutor/:tutorId
 * @access  Private (Admin Only - SRS 4.6.3 REQ-6)
 */
export const getFeedbackForTutor = async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ tutorId: req.params.tutorId })
      .populate('tuteeId', 'name email')
      .populate('sessionId', 'topic startTime')
      .sort({ createdAt: -1 });

    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
