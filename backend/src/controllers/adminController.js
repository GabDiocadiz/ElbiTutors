import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const unresolvedReports = await Report.countDocuments({ status: 'Pending' });
    res.status(200).json({ totalTutors, unresolvedReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};