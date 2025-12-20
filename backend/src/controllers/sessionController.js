import Session from "../models/Session.js";
import User from "../models/User.js";

/**
 * @desc    Book a new session
 * @route   POST /api/sessions
 * @access  Private (Tutee)
 * @srs     4.5 Session Booking
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

    // --- 1. INPUT VALIDATION (Sanity Checks) ---
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: "Cannot book sessions in the past." });
    }

    if (start >= end) {
      return res.status(400).json({ message: "Start time must be before end time." });
    }

    // Optional: Limit session duration (e.g., max 3 hours) to prevent abuse
    const durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours > 4) {
      return res.status(400).json({ message: "Session cannot exceed 4 hours." });
    }

    // --- 2. GROUP SESSION LOGIC (SRS 4.7) ---
    let maxParticipants = 1;
    if (isGroup) {
      // SRS: "Greater than one... no more than five"
      if (!participantsCount || participantsCount < 2 || participantsCount > 5) {
        return res.status(400).json({ message: "Group sessions must have between 2 and 5 participants." });
      }
      maxParticipants = participantsCount;
    } else {
      // Force 1 participant if not a group session
      if (participantsCount && participantsCount > 1) {
        return res.status(400).json({ message: "Please enable Group Mode to book for multiple students." });
      }
    }

    // --- 3. OVERLAP CHECK (SRS 4.5.3 REQ-2) ---
    // We check against 'approved' AND 'pending' to reserve the slot strictly.
    const conflict = await Session.findOne({
      tutorId,
      status: { $in: ["approved", "pending"] }, 
      $or: [
        // Standard intersection logic: (StartA < EndB) and (EndA > StartB)
        { 
          startTime: { $lt: end }, 
          endTime: { $gt: start } 
        }
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
      // FIX: Add the creator to the participants list immediately
      participants: [
        { 
          userId: req.user._id, 
          attendance_status: "present" // Default assumption, updated later
        }
      ]
    });

    res.status(201).json(session);

  } catch (error) {
    console.error(error); // Log internal errors for debugging
    res.status(500).json({ message: "Server Error: Unable to book session." });
  }
};

/**
 * @desc    Admin: Approve or Reject Session
 * @route   PUT /api/sessions/:id/status
 * @access  Private (Admin Only)
 */
export const updateSessionStatus = async (req, res) => {
  const { status } = req.body; 

  // --- VALIDATION ---
  // Allow 'rejected' even if Schema defaults to 'pending'/'approved'/'done'
  // (You might need to update your Schema enum to include 'rejected')
  const validStatuses = ["approved", "rejected", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
  }

  try {
    const session = await Session.findById(req.params.id)
      .populate("tutorId", "email name")
      .populate("createdByTuteeId", "email name");

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Update Data
    session.status = status;
    session.approvedByAdminId = req.user._id;

    // --- NOTIFICATION STUB (SRS 4.5.2) ---
    // In a PR, you acknowledge this requirement even if not implementing the mailer yet.
    if (status === 'approved') {
       console.log(`[Notification System] Email sent to Tutor ${session.tutorId.email} and Tutee ${session.createdByTuteeId.email}`);
       // TODO: Integrate Nodemailer or Notification Service here
    }

    const updatedSession = await session.save();
    res.json(updatedSession);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};