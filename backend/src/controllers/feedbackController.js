import Feedback from "../models/Feedback.js";
import Tutor from "../models/Tutor.js";
import Session from "../models/Session.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Submit Feedback for a completed session
 * @route   POST /api/feedback
 * @access  Private (Tutee)
 * @srs     4.6.3 REQ-1, REQ-2, REQ-3, REQ-4, REQ-5
 */
export const submitFeedback = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;

    // 1. Validate Session basics
    const session = await Session.findById(sessionId);
    if (!session) throw new ApiError("Session not found", 404);

    // SRS 4.6.3 REQ-5: Prevent duplicate feedback
    const existingFeedback = await Feedback.findOne({ sessionId });
    if (existingFeedback) throw new ApiError("Feedback has already been submitted for this session.", 400);

    // Check if session is actually done
    if (session.status !== "done") {
      throw new ApiError("Feedback can only be submitted for completed sessions.", 400);
    }

    // Check if requester is the tutee of this session
    if (session.createdByTuteeId.toString() !== req.user._id.toString()) {
      throw new ApiError("You are not authorized to evaluate this session.", 403);
    }

    // 2. Create Feedback
    const feedback = await Feedback.create({
      sessionId,
      tutorId: session.tutorId,
      tuteeId: req.user._id,
      rating,
      comment
    });

    // 3. Update Tutor Aggregate Rating (SRS 4.6.3 REQ-3)
    const tutorProfile = await Tutor.findOne({ userId: session.tutorId });
    if (tutorProfile) {
      const allFeedback = await Feedback.find({ tutorId: session.tutorId });
      const avgRating = allFeedback.reduce((acc, f) => acc + f.rating, 0) / allFeedback.length;
      
      tutorProfile.rating = parseFloat(avgRating.toFixed(2));
      tutorProfile.ratingCount = allFeedback.length;
      await tutorProfile.save();
    }

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get feedback for a specific tutor (Admin Only)
 * @route   GET /api/feedback/tutor/:tutorId
 * @access  Private (Admin)
 * @srs     4.6.3 REQ-6: Visible only to LRC admins
 */
export const getTutorFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ tutorId: req.params.tutorId })
      .populate("tuteeId", "name email")
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};
