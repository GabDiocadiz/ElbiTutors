import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminBookings() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, done, cancelled

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/sessions/all?status=${filter}`);
      setSessions(response.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await api.put(`/sessions/${sessionId}/status`, { status });
      setSessions(prev => prev.filter(s => s._id !== sessionId));
    } catch (err) {
      alert("Failed to update session status");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Session Management</h1>
        <p className="admin-subtitle">Monitor and manage all tutoring sessions.</p>
        
        <div className="admin-controls">
          <div className="admin-chip-group">
            <button 
              className={`admin-chip ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending Requests
            </button>
            <button 
              className={`admin-chip ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved / Upcoming
            </button>
            <button 
              className={`admin-chip ${filter === 'done' ? 'active' : ''}`}
              onClick={() => setFilter('done')}
            >
              Completed
            </button>
            <button 
              className={`admin-chip ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
             <div className="no-data-cell">Loading sessions...</div>
          ) : sessions.length === 0 ? (
             <div className="no-data-cell">No {filter} sessions found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr className="admin-table-header">
                  <th>Tutee</th>
                  <th>Tutor</th>
                  <th>Topic</th>
                  <th>Schedule</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session._id} className="admin-table-row">
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-name">{session.createdByTuteeId?.name}</span>
                        <span className="admin-user-email">{session.createdByTuteeId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-name">{session.tutorId?.name}</span>
                        <span className="admin-user-email">{session.tutorId?.email}</span>
                      </div>
                    </td>
                    <td>{session.topic}</td>
                    <td>
                        <div className="admin-schedule-cell">
                            <span className="admin-schedule-date">{new Date(session.startTime).toLocaleDateString()}</span>
                            <span className="admin-schedule-time">
                                {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    </td>
                    <td>
                      <span className="status-pill status-done">
                        {session.isGroup ? `Group (${session.maxParticipants})` : 'Individual'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-btn-group">
                        {filter === 'pending' && (
                          <>
                            <button 
                              className="admin-btn-small btn-approve" 
                              onClick={() => handleStatusUpdate(session._id, 'approved')}
                            >
                              Approve
                            </button>
                            <button 
                              className="admin-btn-small btn-reject"
                              onClick={() => handleStatusUpdate(session._id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {filter === 'approved' && (
                          <button 
                            className="admin-btn-small btn-neutral"
                            onClick={() => handleStatusUpdate(session._id, 'done')}
                          >
                            Mark Done
                          </button>
                        )}
                        {(filter === 'done' || filter === 'cancelled') && (
                          <span className="admin-timestamp-sub">Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}