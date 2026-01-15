import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStats
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- Public/Self Routes ---
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// --- Admin Routes ---
// SRS 4.3 Admin Interface
router.get("/stats", protect, adminOnly, getUserStats);
router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.put("/:id/status", protect, adminOnly, updateUserStatus);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;