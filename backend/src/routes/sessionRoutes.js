import express from "express";
import { 
  bookSession, 
  getMySessions, 
  updateSessionStatus 
} from "../controllers/sessionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", protect, bookSession);
router.get("/my-sessions", protect, getMySessions);
router.put("/:id/status", protect, adminOnly, updateSessionStatus);

export default router;