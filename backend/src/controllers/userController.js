import User from "../models/User.js";
import Tutor from "../models/Tutor.js";
import AuditLog from "../models/AuditLog.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get Current User Profile
 * @route   GET /api/users/me
 * @access  Private
 * @srs     4.1.2 Tutee Profile Management
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-google_sub");
    if (!user) throw new ApiError("User not found", 404);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Current User Profile
 * @route   PUT /api/users/profile
 * @access  Private
 * @srs     4.1.2 Response 2: User manages own profile details
 */
export const updateUserProfile = async (req, res, next) => {
  const { degree_program, classification, preferred_subjects } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError("User not found", 404);

    // Update allowed fields (Cannot change email or role here)
    if (degree_program !== undefined) user.degree_program = degree_program;
    if (classification !== undefined) user.classification = classification;
    if (preferred_subjects !== undefined) user.preferred_subjects = preferred_subjects;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Users (Admin List)
 * @route   GET /api/users
 * @access  Private (Admin Only)
 * @srs     4.3.3 REQ-2: View, search, and filter all user accounts
 */
export const getUsers = async (req, res, next) => {
  const { keyword } = req.query;

  try {
    let query = {};

    // Search by Name or Email
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } }
      ];
    }

    const users = await User.find(query).select("-google_sub").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create User (Admin Pre-provisioning)
 * @srs     4.3.2 Stimulus 5
 */
export const createUser = async (req, res, next) => {
  const { name, email, role, degree_program } = req.body;

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // 1. Validate UP Mail
    if (!normalizedEmail.endsWith("@up.edu.ph")) {
      throw new ApiError("Only @up.edu.ph emails are allowed.", 400);
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      throw new ApiError("User already exists.", 400);
    }

    // 2. Create User
    const user = await User.create({
      name,
      email: normalizedEmail,
      role: role || "tutee",
      degree_program,
      email_verified: true
    });

    // 3. Handle Tutor Logic
    if (role === 'tutor') {
      await Tutor.create({
        userId: user._id,
        certified: true, 
        subjectsOffered: []
      });
    }

    // 4. Log Action
    await AuditLog.create({
      actorId: req.user._id,
      action: "ADMIN_CREATE_USER",
      targetUserId: user._id,
      details: { role, email: normalizedEmail }
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update User Role
 * @srs     4.3.3 REQ-3
 */
export const updateUserRole = async (req, res, next) => {
  const { role, isLRCAdmin } = req.body;

  try {
    // Prevent Self-Demotion
    if (req.params.id === req.user._id.toString()) {
      throw new ApiError("You cannot change your own role.", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError("User not found", 404);

    const oldRole = user.role;

    if (role) user.role = role;
    if (isLRCAdmin !== undefined) user.isLRCAdmin = isLRCAdmin;

    await user.save();

    if (role === 'tutor' && oldRole !== 'tutor') {
        const tutorExists = await Tutor.findOne({ userId: user._id });
        if (!tutorExists) {
            await Tutor.create({ userId: user._id, certified: true, subjectsOffered: [] });
        }
    }

    await AuditLog.create({
      actorId: req.user._id,
      action: "ADMIN_UPDATE_ROLE",
      targetUserId: user._id,
      details: { oldRole, newRole: role }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate/Suspend User
 * @srs     4.8.3 REQ-5
 */
export const updateUserStatus = async (req, res, next) => {
  const { status } = req.body; 

  const validStatuses = ["active", "suspended", "inactive"];
  if (!validStatuses.includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  try {
    // Prevent Self-Suspension
    if (req.params.id === req.user._id.toString()) {
      throw new ApiError("You cannot suspend your own account.", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError("User not found", 404);

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: "ADMIN_UPDATE_STATUS",
      targetUserId: user._id,
      details: { oldStatus, newStatus: status }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
