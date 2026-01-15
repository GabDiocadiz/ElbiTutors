import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/design.css';

export default function AdminBookings() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, done

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // We need an endpoint to get ALL sessions for admin.
      // For now, let's use the query parameter logic if supported, 
      // or we might need to add a specific admin endpoint in sessionController.
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
      // Update local state instead of re-fetching everything
      setSessions(prev => prev.filter(s => s._id !== sessionId));
    } catch (err) {
      alert("Failed to update session status");
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">Session Management</h1>
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`admin-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`admin-tab ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Completed
          </button>
          <button 
            className={`admin-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="admin-content-card">
        {loading ? (
          <p className="text-center py-10">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No {filter} sessions found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tutee</th>
                  <th>Tutor</th>
                  <th>Topic</th>
                  <th>Schedule</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session._id}>
                    <td>
                      <div className="user-cell">
                        <span className="user-name">{session.createdByTuteeId?.name}</span>
                        <span className="user-email text-xs text-gray-400">{session.createdByTuteeId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-cell">
                        <span className="user-name">{session.tutorId?.name}</span>
                        <span className="user-email text-xs text-gray-400">{session.tutorId?.email}</span>
                      </div>
                    </td>
                    <td>{session.topic}</td>
                    <td>
                        <div className="schedule-cell">
                            <div>{new Date(session.startTime).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                                {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </td>
                    <td>{session.isGroup ? `${session.maxParticipants} (Group)` : '1 (Individual)'}</td>
                    <td>
                      {filter === 'pending' && (
                        <div className="action-btns">
                          <button 
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-2"
                            onClick={() => handleStatusUpdate(session._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            onClick={() => handleStatusUpdate(session._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {filter === 'approved' && (
                        <button 
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          onClick={() => handleStatusUpdate(session._id, 'done')}
                        >
                          Mark as Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
