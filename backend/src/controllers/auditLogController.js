import AuditLog from "../models/AuditLog.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Get all audit logs
 * @route   GET /api/audit-logs
 * @access  Private (Admin)
 * @srs     4.3.3 REQ-5
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate("actorId", "name email")
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 actions for performance

    res.json(logs);
  } catch (error) {
    next(error);
  }
};
