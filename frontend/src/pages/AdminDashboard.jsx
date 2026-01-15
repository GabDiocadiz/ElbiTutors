import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    tutorsCount: 0,
    unresolvedReports: 0,
    pendingBookings: 0,
    pendingProfiles: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch specific dashboard stats from backend
        const statsRes = await api.get('/users/stats');
        const tutorsCount = statsRes.data.tutorsCount || 0;

        // Fetch reports to count pending
        const reportsRes = await api.get('/reports?status=pending');
        const unresolvedReports = reportsRes.data.length;

        // Fetch pending bookings
        const bookingsRes = await api.get('/sessions/all?status=pending');
        const pendingBookings = bookingsRes.data.length;

        // Fetch pending tutor profile changes
        const profilesRes = await api.get('/tutors/pending');
        const pendingProfiles = profilesRes.data.length;

        setStats({ 
          tutorsCount, 
          unresolvedReports, 
          pendingBookings,
          pendingProfiles,
          loading: false 
        });
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
            <Link to="/admin/bookings" className="admin-action-button">
              Session Requests →
            </Link>
            <Link to="/admin/tutor-approvals" className="admin-action-button">
              Tutor Verifications →
            </Link>
            <Link to="/admin/audit-logs" className="admin-action-button">
              System Logs →
            </Link>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="stat-value">{stats.loading ? '...' : stats.tutorsCount}</div>
              <div className="stat-label">LRC Tutors</div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-value">{stats.loading ? '...' : stats.pendingBookings}</div>
              <div className="stat-label">New Bookings</div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-value">{stats.loading ? '...' : stats.pendingProfiles}</div>
              <div className="stat-label">Profile Edits</div>
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
