import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminReports() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Dropdown Action Menu
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Data State
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setAllReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.admin-action-cell')) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Functional Search & Filter Logic
  const filteredReports = useMemo(() => {
    return allReports.filter(report => {
      const matchesFilter = selectedFilter === 'all' || report.status.toLowerCase() === selectedFilter.toLowerCase();
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        report.reporterId?.name?.toLowerCase().includes(lowerSearch) ||
        report.reportedId?.name?.toLowerCase().includes(lowerSearch) ||
        report.description?.toLowerCase().includes(lowerSearch);

      return matchesFilter && matchesSearch;
    });
  }, [allReports, selectedFilter, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleRowSelect = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleActionMenu = (id, e) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'Resolved') {
        const issueWarning = window.confirm("Issue a warning to the reported user?");
        await api.put(`/reports/${id}/resolve`, { issueWarning });
      } else if (newStatus === 'Dismissed') {
        await api.put(`/reports/${id}/dismiss`);
      } else if (newStatus === 'Pending') {
        // Reopen report (Generic status update)
        await api.put(`/reports/${id}/status`, { status: 'pending' });
      }
      
      // Refresh data
      const response = await api.get('/reports');
      setAllReports(response.data);
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Failed to update report status.");
    }
    setOpenActionMenuId(null);
  };

  const handleViewDetails = (report) => {
    console.log('View details for report:', report);
    // Logic to open a modal or navigate to details page would go here
    alert(`Report Details:\nReporter: ${report.reporter}\nAgainst: ${report.reportedUser}\nReason: ${report.reason}`);
    setOpenActionMenuId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        
        <button 
          className="admin-back-button"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <h1 className="admin-title">User Reports</h1>

        <div className="admin-controls">
          <div className="admin-chip-group">
            <button 
              className={`admin-chip ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('all'); setCurrentPage(1); }}
            >
              All
            </button>
            <button 
              className={`admin-chip ${selectedFilter === 'pending' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('pending'); setCurrentPage(1); }}
            >
              Pending
            </button>
            <button 
              className={`admin-chip ${selectedFilter === 'resolved' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('resolved'); setCurrentPage(1); }}
            >
              Resolved
            </button>
            <button 
              className={`admin-chip ${selectedFilter === 'dismissed' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('dismissed'); setCurrentPage(1); }}
            >
              Dismissed
            </button>
          </div>

          <div className="admin-search">
            <input
              type="text"
              placeholder="Search Reporter, User, Reason"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="admin-search-input"
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr className="admin-table-header">
                <th className="admin-table-checkbox">
                  <div className="checkbox"></div>
                </th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map(report => (
                  <tr 
                    key={report._id} 
                    className={`admin-table-row ${selectedRows.includes(report._id) ? 'selected' : ''}`}
                  >
                    <td className="admin-table-checkbox">
                      <div 
                        className={`checkbox ${selectedRows.includes(report._id) ? 'checked' : ''}`}
                        onClick={() => handleRowSelect(report._id)}
                      ></div>
                    </td>
                    <td>{report.reporterId?.name || 'Unknown'}</td>
                    <td>{report.reportedId?.name || 'Unknown'}</td>
                    <td>{report.description}</td>
                    <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-pill ${report.status === 'resolved' ? 'status-resolved' : report.status === 'pending' ? 'status-pending' : 'status-dismissed'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="admin-action-cell">
                      <button 
                        className="admin-action-icon"
                        onClick={(e) => toggleActionMenu(report.id, e)}
                      >
                        ⋮
                      </button>
                      
                      {openActionMenuId === report.id && (
                        <div className="admin-action-menu">
                          <button 
                            className="admin-action-item" 
                            onClick={() => handleViewDetails(report)}
                          >
                            View Details
                          </button>
                          
                          {report.status === 'Pending' && (
                            <>
                              <button 
                                className="admin-action-item" 
                                style={{ color: 'var(--uplb-green)' }}
                                onClick={() => handleStatusChange(report.id, 'Resolved')}
                              >
                                Mark Resolved
                              </button>
                              <button 
                                className="admin-action-item delete" 
                                onClick={() => handleStatusChange(report.id, 'Dismissed')}
                              >
                                Dismiss
                              </button>
                            </>
                          )}

                          {report.status !== 'Pending' && (
                             <button 
                                className="admin-action-item" 
                                onClick={() => handleStatusChange(report.id, 'Pending')}
                              >
                                Reopen
                              </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-cell">
                    No reports found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`admin-chip ${currentPage === 1 ? 'disabled' : ''}`}
            >
              Previous
            </button>
            <span className="admin-pagination-text">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`admin-chip ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}