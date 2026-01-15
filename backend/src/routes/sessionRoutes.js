import express from "express";
import { 
  bookSession, 
  getMySessions, 
  getAllSessions,
  updateSessionStatus,
  cancelSession,
  createGroupSession
} from "../controllers/sessionController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/all", protect, adminOnly, getAllSessions);
router.put("/:id/status", protect, updateSessionStatus);
router.put("/:id/cancel", protect, cancelSession);
router.post("/group", protect, tutorOnly, createGroupSession);

export default router;