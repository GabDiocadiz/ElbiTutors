import Report from "../models/Report.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/**
 * @desc    Create a new report
 * @route   POST /api/reports
 * @access  Private
 * @srs     4.8.1 Reporting
 */
export const createReport = async (req, res, next) => {
  try {
    const { reportedId, sessionId, description } = req.body;

    if (!reportedId || !description) {
      throw new ApiError("Reported user and description are required.", 400);
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reportedId,
      sessionId,
      description,
      status: "pending"
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports (Admin only)
 * @route   GET /api/reports
 * @access  Private (Admin)
 */
export const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const reports = await Report.find(filter)
      .populate("reporterId", "name email")
      .populate("reportedId", "name email warningCount status")
      .populate("sessionId")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resolve a report & Issue Warning
 * @route   PUT /api/reports/:id/resolve
 * @access  Private (Admin)
 * @srs     4.8.3 REQ-5: Admin actions (warnings, suspension)
 * @srs     4.8.1: "After three valid reports, the account shall be temporarily terminated."
 */
export const resolveReport = async (req, res, next) => {
  try {
    const { issueWarning } = req.body; // true/false
    const report = await Report.findById(req.params.id);

    if (!report) {
      throw new ApiError("Report not found", 404);
    }

    if (report.status === "resolved") {
      throw new ApiError("Report is already resolved", 400);
    }

    report.status = "resolved";
    await report.save();

    let message = "Report resolved.";

    // Logic: Issue Warning if admins deems it necessary
    if (issueWarning) {
      const user = await User.findById(report.reportedId);
      if (user) {
        user.warningCount = (user.warningCount || 0) + 1;
        
        // SRS 4.8.1: "After three valid reports, the account shall be temporarily terminated."
        if (user.warningCount >= 3) {
          user.status = "suspended";
          message += " User has been SUSPENDED due to reaching 3 warnings.";
        } else {
          message += ` Warning issued. Total warnings: ${user.warningCount}.`;
        }
        await user.save();
      }
    }

    res.json({ message, report });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dismiss a report (Invalid/No action)
 * @route   PUT /api/reports/:id/dismiss
 * @access  Private (Admin)
 */
export const dismissReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      throw new ApiError("Report not found", 404);
    }

    report.status = "dismissed";
    await report.save();

    res.json({ message: "Report dismissed.", report });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status (Generic)
 * @route   PUT /api/reports/:id/status
 * @access  Private (Admin)
 */
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      throw new ApiError("Report not found", 404);
    }

    report.status = status;
    await report.save();

    res.json({ message: `Report status updated to ${status}.`, report });
  } catch (error) {
    next(error);
  }
};
