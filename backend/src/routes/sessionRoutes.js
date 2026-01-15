import express from "express";
import { 
  bookSession, 
  getMySessions, 
  getAllSessions,
  updateSessionStatus 
} from "../controllers/sessionController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/all", protect, adminOnly, getAllSessions);
router.put("/:id/status", protect, updateSessionStatus);

export default router;