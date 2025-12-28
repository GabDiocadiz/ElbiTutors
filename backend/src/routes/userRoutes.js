import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Manages ONLY the Base User model.

// GET all users (admin-only in production)
router.get("/", /* authMiddleware, adminOnly, */ getAllUsers);

// GET a single user by ID
router.get("/:id", /* authMiddleware, */ getUserById);

// CREATE user (admin use only — staff, LRC admins)
router.post("/", /* authMiddleware, adminOnly, */ createUser);

// UPDATE base user info (names, avatar, etc.)
router.patch("/:id", /* authMiddleware, */ updateUser);

// DELETE user — admin only
router.delete("/:id", /* authMiddleware, adminOnly, */ deleteUser);

export default router;