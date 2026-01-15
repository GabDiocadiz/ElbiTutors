import Tutor from "../models/Tutor.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all Tutors (with sophisticated search)
 * @route   GET /api/tutors
 * @access  Public
 * @srs     2.2 Tutor Discovery & Search
 * @srs     4.4.3 REQ-5 Specialization as searchable keywords
 */
export const getTutors = async (req, res, next) => {
  const { keyword, subject } = req.query;

  try {
    // SRS: Only allow ACTIVE users to be listed as tutors
    const activeUsers = await User.find({ status: 'active' }).select('_id');
    const activeUserIds = activeUsers.map(u => u._id);

    // Base Query: We only list CERTIFIED tutors (SRS 2.3)
    let query = { 
      certified: true,
      userId: { $in: activeUserIds }
    };

    // --- SEARCH LOGIC ---
    if (keyword) {
      const regex = new RegExp(keyword, 'i'); // Case-insensitive

      // Step A: Find Users matching the name AND are active
      const userMatches = await User.find({ name: regex, status: 'active' }).select('_id');
      const userIds = userMatches.map(u => u._id);

      // Step B: Construct Tutor Query
      query.$or = [
        { userId: { $in: userIds } },
        { bio: regex },
        { specializationText: regex },
        { subjectsOffered: regex } 
      ];
    }

    // --- FILTER LOGIC (Strict Subject Match) ---
    if (subject) {
      // SRS 2.2: Course codes serve as searchable tags
      query.subjectsOffered = { $in: [subject] };
    }

    // Execute
    const tutors = await Tutor.find(query)
      .populate("userId", "name email picture degree_program classification status") // Join User Data
      .select("-__v"); // Clean output

    res.json(tutors);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single tutor's full profile
 * @route   GET /api/tutors/:id
 * @access  Public
 * @srs     4.4.3 REQ-1 Dedicated profile page
 */
export const getTutorById = async (req, res, next) => {
  try {
    // Validate MongoID format to prevent server crashes on bad URLs
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError("Tutor not found (Invalid ID)", 404);
    }

    const tutor = await Tutor.findById(req.params.id)
      .populate("userId", "name email picture degree_program classification");

    if (!tutor) {
      throw new ApiError("Tutor not found", 404);
    }

    res.json(tutor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Tutor Profile
 * @route   PUT /api/tutors/profile
 * @access  Private (Tutor Only)
 * @srs     4.4.3 REQ-2, REQ-3, REQ-4
 */
export const updateTutorProfile = async (req, res, next) => {
  const { 
    bio, 
    specializationText, 
    subjectsOffered, 
    availabilityImage,
    googleCalendarLink 
  } = req.body;

  try {
    // 1. Find the Tutor linked to the logged-in User
    const tutor = await Tutor.findOne({ userId: req.user._id });

    if (!tutor) {
      throw new ApiError("Tutor profile not found. Are you a certified tutor?", 404);
    }

    // 2. Queue for Approval (SRS 4.4.2 Stimulus 2)
    tutor.pendingChanges = {
        bio: bio !== undefined ? bio : tutor.bio,
        subjectsOffered: subjectsOffered !== undefined ? subjectsOffered : tutor.subjectsOffered,
        specializationText: specializationText !== undefined ? specializationText : tutor.specializationText,
        availabilityImage: availabilityImage !== undefined ? availabilityImage : tutor.availabilityImage,
        googleCalendarLink: googleCalendarLink !== undefined ? googleCalendarLink : tutor.googleCalendarLink
    };
    tutor.isProfileVerified = false;

    const updatedTutor = await tutor.save();
    res.json({ message: "Changes submitted and pending admin approval.", tutor: updatedTutor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tutors with pending profile changes (Admin)
 * @route   GET /api/tutors/pending
 * @access  Private (Admin)
 */
export const getPendingTutors = async (req, res, next) => {
  try {
    const tutors = await Tutor.find({ isProfileVerified: false })
      .populate("userId", "name email");
    res.json(tutors);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or Reject Tutor Profile Changes (Admin)
 * @route   PUT /api/tutors/:id/approve
 * @access  Private (Admin)
 */
export const approveTutorChanges = async (req, res, next) => {
  const { status } = req.body; // "approve" or "reject"
  
  // SRS Granular Check
  if (req.user.role !== 'admin' && !req.user.permissions?.verifyTutors) {
      throw new ApiError("Not authorized: Missing 'verifyTutors' permission.", 403);
  }

  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) throw new ApiError("Tutor profile not found", 404);

    if (status === "approve") {
      // Move pending changes to live fields
      if (tutor.pendingChanges) {
        tutor.bio = tutor.pendingChanges.bio;
        tutor.subjectsOffered = tutor.pendingChanges.subjectsOffered;
        tutor.specializationText = tutor.pendingChanges.specializationText;
        tutor.availabilityImage = tutor.pendingChanges.availabilityImage;
        tutor.googleCalendarLink = tutor.pendingChanges.googleCalendarLink;
      }
      tutor.isProfileVerified = true;
      tutor.pendingChanges = undefined; // Clear queue
    } else {
      // Reject: Just clear the queue and keep old data
      tutor.isProfileVerified = true;
      tutor.pendingChanges = undefined;
    }

    await tutor.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: `ADMIN_TUTOR_PROFILE_${status.toUpperCase()}`,
      targetUserId: tutor.userId,
      details: { tutorId: tutor._id }
    });

    res.json({ message: `Tutor profile ${status}d.`, tutor });
  } catch (error) {
    next(error);
  }
};