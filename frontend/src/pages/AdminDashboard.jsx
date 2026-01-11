import { Link } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminDashboard() {
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
              <div className="stat-value">45</div>
              <div className="stat-label">LRC Tutors</div>
            </div>

            <div className="admin-unresolved">
              Unresolved: <strong>8 reports</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
