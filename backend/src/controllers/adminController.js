import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardStats = async (req, res) => {
  const totalTutors = await User.countDocuments({ role: 'tutor' });
  const pendingReports = await Report.countDocuments({ status: 'Pending' });
  res.json({ totalTutors, pendingReports }); // Feeds AdminDashboard.jsx
};