// Handles all User CRUD operations.
// Authentication & authorization will be added later.

import User from "../models/User.js";
import Tutor from "../models/Tutor.js";
import Tutee from "../models/Tutee.js";
import TutorProfile from "../models/TutorProfile.js";

/* GET /api/users
   Get all users (ADMIN ONLY — but auth later) */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

/*  GET /api/users/:id
    Get a single user by ID */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({ message: "Server error fetching user" });
  }
};

/*  POST /api/users
    Create a new user (Admin creates roles manually)*/
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      role = "tutee",
      degree_program,
      classification,
      preferred_subjects,
      specializationText,
      specializationCodes,
      subjectsOffered,
      bio,
    } = req.body;

    // Base User creation
    const newUser = await User.create({
      name,
      email,
      role,
      degree_program,
      classification,
      preferred_subjects,
    });

    // If user is a tutor, create Tutor and TutorProfile docs
    let tutorData = null;
    if (role === "tutor") {
      tutorData = await Tutor.create({
        userId: newUser._id,
        subjectsOffered: subjectsOffered || [],
        bio: bio || "",
        specializationText,
        specializationCodes,
      });

      await TutorProfile.create({
        tutorId: tutorData._id,
        specializationText,
        specializationCodes,
      });
    }

    // If user is a tutee, create a Tutee document
    let tuteeData = null;
    if (role === "tutee") {
      tuteeData = await Tutee.create({
        userId: newUser._id,
        preferredSubjects: preferred_subjects || [],
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      tutor: tutorData,
      tutee: tuteeData,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Server error creating user" });
  }
};

/* PUT /api/users/:id
   Update user data (name, degree_program, role, ...) */
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: updated,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Server error updating user" });
  }
};

/* DELETE /api/users/:id
   Delete a user and all related documents*/
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Delete role-specific documents
    if (user.role === "tutor") {
      const tutor = await Tutor.findOne({ userId: user._id });
      if (tutor) await TutorProfile.deleteOne({ tutorId: tutor._id });
      await Tutor.deleteOne({ userId: user._id });
    }

    if (user.role === "tutee") {
      await Tutee.deleteOne({ userId: user._id });
    }

    // Delete main user
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Server error deleting user" });
  }
};
