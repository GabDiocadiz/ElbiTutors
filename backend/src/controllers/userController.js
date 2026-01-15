import User from "../models/User.js";
import Tutor from "../models/Tutor.js";
import AuditLog from "../models/AuditLog.js";

/**
 * @desc    Get Current User Profile
 * @route   GET /api/users/me
 * @access  Private
 * @srs     4.1.2 Tutee Profile Management
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-google_sub");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update Current User Profile
 * @route   PUT /api/users/profile
 * @access  Private
 * @srs     4.1.2 Response 2: User manages own profile details
 */
export const updateUserProfile = async (req, res) => {
  const { degree_program, classification, preferred_subjects } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update allowed fields (Cannot change email or role here)
    if (degree_program !== undefined) user.degree_program = degree_program;
    if (classification !== undefined) user.classification = classification;
    if (preferred_subjects !== undefined) user.preferred_subjects = preferred_subjects;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get All Users (Admin List)
 * @route   GET /api/users
 * @access  Private (Admin Only)
 * @srs     4.3.3 REQ-2: View, search, and filter all user accounts
 */
export const getUsers = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create User (Admin Pre-provisioning)
 * @srs     4.3.2 Stimulus 5
 */
export const createUser = async (req, res) => {
  const { name, email, role, degree_program } = req.body;

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // 1. Validate UP Mail
    if (!normalizedEmail.endsWith("@up.edu.ph")) {
      return res.status(400).json({ message: "Only @up.edu.ph emails are allowed." });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update User Role
 * @srs     4.3.3 REQ-3
 */
export const updateUserRole = async (req, res) => {
  const { role, isLRCAdmin } = req.body;

  try {
    // Prevent Self-Demotion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Deactivate/Suspend User
 * @srs     4.8.3 REQ-5
 */
export const updateUserStatus = async (req, res) => {
  const { status } = req.body; 

  const validStatuses = ["active", "suspended", "inactive"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Prevent Self-Suspension
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot suspend your own account." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

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
    res.status(500).json({ message: error.message });
  }
};
