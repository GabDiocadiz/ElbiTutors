import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tutorsCount: 0,
    unresolvedReports: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users to count tutors
        const usersRes = await api.get('/users');
        const tutorsCount = usersRes.data.filter(u => u.role === 'tutor').length;

        // Fetch reports to count pending
        const reportsRes = await api.get('/reports?status=pending');
        const unresolvedReports = reportsRes.data.length;

        setStats({ tutorsCount, unresolvedReports, loading: false });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-dashboard-content">
          <div className="admin-actions">
            <Link to="/admin/users" className="admin-action-button">
              View All Users →
            </Link>
            <Link to="/admin/new-lrc-user" className="admin-action-button">
              New LRC User →
            </Link>
            <Link to="/admin/reports" className="admin-action-button">
              Reports →
            </Link>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="stat-value">{stats.loading ? '...' : stats.tutorsCount}</div>
              <div className="stat-label">LRC Tutors</div>
            </div>

            <div className="admin-unresolved">
              Unresolved: <strong>{stats.loading ? '...' : stats.unresolvedReports} reports</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
