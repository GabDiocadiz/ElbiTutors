import express from "express";
import { createReport, getReports, resolveReport } from "../controllers/reportController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, adminOnly, getReports);
router.put("/:id/resolve", protect, adminOnly, resolveReport);

export default router;
