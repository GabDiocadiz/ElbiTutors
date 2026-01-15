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

  const getLogColor = (action) => {
    if (action.includes('REJECT')) return 'bg-red-50 text-red-700 border-red-200';
    if (action.includes('APPROVE') || action.includes('RESOLVE')) return 'bg-green-50 text-green-700 border-green-200';
    if (action.includes('CREATE')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">System Audit Logs</h1>
        <p className="admin-subtitle">Chronological record of all administrative actions for accountability.</p>

        <div className="admin-content-card mt-6">
          {loading ? (
            <p className="text-center py-10">Loading audit trail...</p>
          ) : logs.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No logs found.</p>
          ) : (
            <div className="log-list space-y-4">
              {logs.map(log => (
                <div key={log._id} className={`log-item p-4 rounded-lg border flex justify-between items-start ${getLogColor(log.action)}`}>
                  <div className="log-details">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm tracking-wide">{log.action}</span>
                      <span className="text-xs opacity-75">• {new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">{log.actorId?.name || "Unknown Admin"}</span> 
                      Performed action on target ID: {log.targetUserId || "N/A"}
                    </p>
                    {log.details && (
                      <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
