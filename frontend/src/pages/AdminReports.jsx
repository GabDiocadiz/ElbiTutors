import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Mock Database of Reports
  const [allReports, setAllReports] = useState([
    { id: 1, reporter: 'Dela Cruz, Juan', reportedUser: 'Reyes, Jose', reason: 'Inappropriate behavior during session', date: '2023-10-25', status: 'Pending' },
    { id: 2, reporter: 'Santos, Maria', reportedUser: 'Lim, Michael', reason: 'No-show for scheduled tutoring', date: '2023-10-24', status: 'Resolved' },
    { id: 3, reporter: 'Gonzales, Jerry', reportedUser: 'Aquino, Tomas', reason: 'Offensive language in chat', date: '2023-10-23', status: 'Pending' },
    { id: 4, reporter: 'Ocampo, Luis', reportedUser: 'Tan, Anna', reason: 'Spamming messages', date: '2023-10-22', status: 'Dismissed' },
    { id: 5, reporter: 'Bautista, Ana', reportedUser: 'Garcia, Miguel', reason: 'Did not pay attention', date: '2023-10-20', status: 'Resolved' },
    { id: 6, reporter: 'Mercado, Bea', reportedUser: 'Torres, Mark', reason: 'Late arrival consistently', date: '2023-10-18', status: 'Pending' },
    { id: 7, reporter: 'Cruz, John', reportedUser: 'Diaz, Rico', reason: 'Rude remarks', date: '2023-10-15', status: 'Resolved' },
  ]);

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
        report.reporter.toLowerCase().includes(lowerSearch) ||
        report.reportedUser.toLowerCase().includes(lowerSearch) ||
        report.reason.toLowerCase().includes(lowerSearch);

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

  const handleStatusChange = (id, newStatus) => {
    setAllReports(prev => prev.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    ));
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
                    key={report.id} 
                    className={`admin-table-row ${selectedRows.includes(report.id) ? 'selected' : ''}`}
                  >
                    <td className="admin-table-checkbox">
                      <div 
                        className={`checkbox ${selectedRows.includes(report.id) ? 'checked' : ''}`}
                        onClick={() => handleRowSelect(report.id)}
                      ></div>
                    </td>
                    <td>{report.reporter}</td>
                    <td>{report.reportedUser}</td>
                    <td>{report.reason}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`status-pill ${report.status === 'Resolved' ? 'status-resolved' : report.status === 'Pending' ? 'status-pending' : 'status-dismissed'}`}>
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