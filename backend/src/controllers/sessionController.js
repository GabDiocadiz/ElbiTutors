import Session from "../models/Session.js";
import User from "../models/User.js";

/**
 * @desc    Book a new session
 * @route   POST /api/sessions
 * @access  Private (Tutee)
 * @srs     4.5 Session Booking & 4.7 Group Tutoring
 */
export const bookSession = async (req, res) => {
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
      return res.status(400).json({ message: "Cannot book sessions in the past." });
    }

    if (start >= end) {
      return res.status(400).json({ message: "Start time must be before end time." });
    }

    // Optional: Max 4 hours per session
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours > 4) {
      return res.status(400).json({ message: "Session cannot exceed 4 hours." });
    }

    // --- 2. GROUP SESSION LOGIC (SRS 4.7) ---
    let maxParticipants = 1;
    if (isGroup) {
      // SRS Limit: "No more than five students"
      if (!participantsCount || participantsCount < 2 || participantsCount > 5) {
        return res.status(400).json({ message: "Group sessions must have between 2 and 5 participants." });
      }
      maxParticipants = participantsCount;
    } else {
      if (participantsCount && participantsCount > 1) {
        return res.status(400).json({ message: "Please enable Group Mode to book for multiple students." });
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
      return res.status(400).json({ 
        message: "This time slot is already booked or pending approval." 
      });
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
    console.error(error);
    res.status(500).json({ message: "Server Error: Unable to book session." });
  }
};

/**
 * @desc    Get sessions for the logged-in user
 * @route   GET /api/sessions/my-sessions
 * @access  Private
 */
export const getMySessions = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Admin: Approve or Reject Session
 * @route   PUT /api/sessions/:id/status
 * @access  Private (Admin Only)
 * @srs     4.3.3 REQ-8 & 4.5.3 REQ-4
 */
export const updateSessionStatus = async (req, res) => {
  const { status } = req.body; 

  const validStatuses = ["approved", "rejected", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
  }

  try {
    const session = await Session.findById(req.params.id)
      .populate("tutorId", "email name")
      .populate("createdByTuteeId", "email name");

    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = status;
    session.approvedByAdminId = req.user._id;

    // TODO: SRS 4.5.2 - Integrate Email Notification System here
    if (status === 'approved') {
       console.log(`[Stub] Emailing confirmation to ${session.tutorId.email} and ${session.createdByTuteeId.email}`);
    }

    const updatedSession = await session.save();
    res.json(updatedSession);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};