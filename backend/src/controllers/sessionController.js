import Session from "../models/Session.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import ApiError from "../utils/ApiError.js";
import { sendBookingStatusEmail } from "../utils/emailService.js";

/**
 * @desc    Book a new session
 * @route   POST /api/sessions
 * @access  Private (Tutee)
 * @srs     4.5 Session Booking & 4.7 Group Tutoring
 */
export const bookSession = async (req, res, next) => {
  try {
    const { 
      tutorId, 
      topic, 
      startTime, 
      endTime, 
      isGroup, 
      participantsCount 
    } = req.body;

    // --- 1. INPUT VALIDATION ---
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      throw new ApiError("Cannot book sessions in the past.", 400);
    }

    if (start >= end) {
      throw new ApiError("Start time must be before end time.", 400);
    }

    // Optional: Max 4 hours per session ({ end - start } / { 1000 * 60 * 60 })
    const durationHours = (end - start) / 3600000;
    if (durationHours > 4) {
      throw new ApiError("Session cannot exceed 4 hours.", 400);
    }

    // --- 1.5. SESSION LIMIT CHECK (SRS Constraint) ---
    // Rule: Tutees are limited to a maximum of three active sessions.
    const activeSessionsCount = await Session.countDocuments({
      createdByTuteeId: req.user._id,
      status: { $in: ["pending", "approved"] }
    });

    if (activeSessionsCount >= 3) {
      throw new ApiError("Booking failed. You have reached the maximum limit of 3 active sessions (pending or approved). Please complete a session before booking a new one.", 400);
    }

    // --- 2. GROUP SESSION LOGIC (SRS 4.7) ---
    let maxParticipants = 1;
    if (isGroup) {
      // SRS Limit: "No more than five students"
      if (!participantsCount || participantsCount < 2 || participantsCount > 5) {
        throw new ApiError("Group sessions must have between 2 and 5 participants.", 400);
      }
      maxParticipants = participantsCount;
    } else {
      if (participantsCount && participantsCount > 1) {
        throw new ApiError("Please enable Group Mode to book for multiple students.", 400);
      }
    }

    // --- 3. OVERLAP CHECK (SRS 4.5.3 REQ-2) ---
    // Check against 'approved' AND 'pending' to reserve the slot strictly.
    const conflict = await Session.findOne({
      tutorId,
      status: { $in: ["approved", "pending"] }, 
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflict) {
      throw new ApiError("This time slot is already booked or pending approval.", 400);
    }

    // --- 4. CREATE SESSION ---
    const session = await Session.create({
      tutorId,
      createdByTuteeId: req.user._id,
      topic,
      startTime: start,
      endTime: end,
      isGroup: !!isGroup,
      maxParticipants,
      status: "pending",
      // Automatically add the creator as the first participant
      participants: [
        { 
          userId: req.user._id, 
          attendance_status: "present" 
        }
      ]
    });

    res.status(201).json(session);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get sessions for the logged-in user
 * @route   GET /api/sessions/my-sessions
 * @access  Private
 */
export const getMySessions = async (req, res, next) => {
  try {
    const isTutor = req.user.role === 'tutor';
    const query = isTutor 
      ? { tutorId: req.user._id } 
      : { createdByTuteeId: req.user._id };

    const sessions = await Session.find(query)
      .populate("tutorId", "name email")
      .populate("createdByTuteeId", "name email")
      .sort({ startTime: 1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Approve or Reject Session
 * @route   PUT /api/sessions/:id/status
 * @access  Private (Admin Only)
 * @srs     4.3.3 REQ-8 & 4.5.3 REQ-4
 */
export const updateSessionStatus = async (req, res, next) => {
  const { status } = req.body; 

  // SRS 4.5.3 REQ-4: Support 'cancelled' status
  const validStatuses = ["approved", "rejected", "done", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(`Invalid status. Allowed: ${validStatuses.join(", ")}`, 400);
  }

  try {
    const session = await Session.findById(req.params.id)
      .populate("tutorId", "email name")
      .populate("createdByTuteeId", "email name");

    if (!session) throw new ApiError("Session not found", 404);

    // Permission Check: Granular (SRS 4.2.3)
    const isAdmin = req.user.role === 'admin' || req.user.isLRCAdmin;
    const isTutorOfSession = session.tutorId._id.toString() === req.user._id.toString();
    const isTuteeOwner = session.createdByTuteeId._id.toString() === req.user._id.toString();
    const canManageSessions = isAdmin && (req.user.role === 'admin' || req.user.permissions?.manageSessions);

    if (!canManageSessions) {
      if ((isTutorOfSession && status === 'done')) {
         if (session.status !== 'approved') throw new ApiError("Only approved sessions can be marked as done.", 400);
      } else if (isTuteeOwner && status === 'cancelled') {
         if (session.status === 'done' || session.status === 'rejected') throw new ApiError("Cannot cancel a completed or rejected session.", 400);
      } else {
        throw new ApiError("You are not authorized to perform this action.", 403);
      }
    }

    session.status = status;
    if (isAdmin) session.approvedByAdminId = req.user._id;

    const updatedSession = await session.save();

    // SRS 4.5.2 - Email Notification System (Priority 1)
    // Only send for admin decisions (Approve/Reject)
    if (status === 'approved' || status === 'rejected') {
       await sendBookingStatusEmail(
         session.createdByTuteeId.email,
         session.tutorId.email,
         session, // Contains populated tutor/tutee details
         status
       );
    }

    await AuditLog.create({
      actorId: req.user._id,
      action: `ADMIN_SESSION_${status.toUpperCase()}`,
      targetUserId: session.createdByTuteeId._id,
      details: { sessionId: session._id, tutorId: session.tutorId._id }
    });

    res.json(updatedSession);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all sessions (Status filter)
 * @route   GET /api/sessions/all
 * @access  Private (Admin)
 */
export const getAllSessions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const sessions = await Session.find(filter)
      .populate("tutorId", "name email")
      .populate("createdByTuteeId", "name email")
      .sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a session (Tutee or Tutor)
 * @route   PUT /api/sessions/:id/cancel
 * @access  Private
 */
export const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("tutorId", "email name")
      .populate("createdByTuteeId", "email name");

    if (!session) throw new ApiError("Session not found", 404);

    const isCreator = session.createdByTuteeId?._id.toString() === req.user._id.toString();
    const isTutor = session.tutorId?._id.toString() === req.user._id.toString(); // Tutor's User ID matches

    if (!isCreator && !isTutor) {
      throw new ApiError("Not authorized to cancel this session", 403);
    }

    if (session.status === "cancelled" || session.status === "done") {
      throw new ApiError("Cannot cancel a completed or already cancelled session", 400);
    }

    session.status = "cancelled";
    await session.save();

    // Notify the other party
    const subject = "Session Cancelled - ElbiTutors";
    if (isCreator) {
        
        if(session.tutorId?.email) {
             await sendEmail(session.tutorId.email, subject, `The session for "${session.topic}" has been cancelled by the student.`);
        }
    } else {
        // Tutor cancelled -> Notify Tutee
        if(session.createdByTuteeId?.email) {
            await sendEmail(session.createdByTuteeId.email, subject, `The session for "${session.topic}" has been cancelled by the tutor.`);
        }
    }

    res.json({ message: "Session cancelled successfully", session });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Tutor creates a Group Session Slot
 * @route   POST /api/sessions/group
 * @access  Private (Tutor Only)
 */
export const createGroupSession = async (req, res, next) => {
  try {
    const { topic, startTime, endTime, maxParticipants } = req.body;

    // Validation
    if (!topic || !startTime || !endTime) {
      throw new ApiError("Topic, Start Time, and End Time are required", 400);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) throw new ApiError("Start time must be before end time", 400);
    
    const session = await Session.create({
      tutorId: req.user._id,
      topic,
      startTime: start,
      endTime: end,
      isGroup: true,
      maxParticipants: maxParticipants || 5,
      status: "approved", 
      participants: [] 
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};