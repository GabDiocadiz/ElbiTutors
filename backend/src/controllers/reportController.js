import Report from "../models/Report.js";
import User from "../models/User.js";

/**
 * @desc    Create a new report
 * @route   POST /api/reports
 * @access  Private
 * @srs     4.8.1 Reporting
 */
export const createReport = async (req, res) => {
  try {
    const { reportedId, sessionId, description } = req.body;

    if (!reportedId || !description) {
      return res.status(400).json({ message: "Reported user and description are required." });
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all reports (Admin only)
 * @route   GET /api/reports
 * @access  Private (Admin)
 */
export const getReports = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Resolve a report & Issue Warning
 * @route   PUT /api/reports/:id/resolve
 * @access  Private (Admin)
 * @srs     4.8.3 REQ-5 & REQ-6 ("Three Warnings" Rule)
 */
export const resolveReport = async (req, res) => {
  try {
    const { issueWarning } = req.body; // true/false
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.status === "resolved") {
      return res.status(400).json({ message: "Report is already resolved" });
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
    res.status(500).json({ message: error.message });
  }
};
