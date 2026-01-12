import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUserRole,
  updateUserStatus
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- Public/Self Routes ---
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put('/availability', protect, isTutor, updateAvailability);

// --- Admin Routes ---
// SRS 4.3 Admin Interface
router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.put("/:id/status", protect, adminOnly, updateUserStatus);

export default router;