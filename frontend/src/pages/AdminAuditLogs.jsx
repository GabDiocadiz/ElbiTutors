import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/audit-logs');
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionPillStyle = (action) => {
    if (action.includes('REJECT') || action.includes('DELETE')) return 'status-pill status-dismissed';
    if (action.includes('APPROVE') || action.includes('RESOLVE')) return 'status-pill status-resolved';
    if (action.includes('CREATE') || action.includes('UPDATE')) return 'status-pill status-active';
    return 'status-pill status-pending';
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">System Audit Logs</h1>
        <p className="admin-subtitle">Chronological record of all administrative actions for accountability.</p>
        
        <div className="admin-controls">
           <div className="admin-search">
             <input type="text" placeholder="Search by Actor or Action..." className="admin-search-input" />
           </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="no-data-cell">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="no-data-cell">No logs found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr className="admin-table-header">
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Target ID</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} className="admin-table-row">
                    <td>
                      <span className="admin-timestamp">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <span className="admin-timestamp-sub">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>
                      <span className={getActionPillStyle(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <strong>{log.actorId?.name || "Unknown Admin"}</strong>
                    </td>
                    <td>
                      <span className="log-target-id">{log.targetUserId || "N/A"}</span>
                    </td>
                    <td>
                      {log.details ? (
                        <details>
                          <summary className="log-details-summary">View JSON</summary>
                          <pre className="log-details-pre">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span>-</span>
                      )}
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