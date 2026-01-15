import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminEditUserModal from '../components/EditUser';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminUsersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for Dropdown Action Menu and Modal
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const itemsPerPage = 10;

  // State for Users and UI
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const roleFilter = selectedFilter === 'all' 
        ? true 
        : user.role.toLowerCase() === selectedFilter.toLowerCase();
      
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.student_number?.includes(lowerSearch) ||
        user.degree_program?.toLowerCase().includes(lowerSearch);

      return roleFilter && matchesSearch;
    });
  }, [allUsers, selectedFilter, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      // API call to update user role/status
      await api.put(`/users/${updatedUser._id}/role`, { 
        role: updatedUser.role,
        isLRCAdmin: updatedUser.isLRCAdmin 
      });
      
      // Refresh list
      const response = await api.get('/users');
      setAllUsers(response.data);
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Failed to update user.");
    }
  };

  const handleDelete = async (user) => {
    if(window.confirm(`Are you sure you want to delete ${user.name}? This will deactivate their account.`)) {
      try {
        // We use status update to 'inactive' as a soft delete
        await api.put(`/users/${user._id}/status`, { status: 'inactive' });
        
        // Refresh list
        const response = await api.get('/users');
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
    setOpenActionMenuId(null);
  };

  // Helper to display role
  const displayRole = (role) => {
    if (role.toLowerCase() === 'tutor') return 'LRC';
    if (role.toLowerCase() === 'tutee') return 'Tutee';
    return role;
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

        <h1 className="admin-title">All Users</h1>

        <div className="admin-controls">
          <div className="admin-chip-group">
            <button 
              className={`admin-chip ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('all'); setCurrentPage(1); }}
            >
              All
            </button>
            <button 
              className={`admin-chip ${selectedFilter === 'tutee' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('tutee'); setCurrentPage(1); }}
            >
              Tutee Only
            </button>
            <button 
              className={`admin-chip ${selectedFilter === 'tutor' ? 'active' : ''}`}
              onClick={() => { setSelectedFilter('tutor'); setCurrentPage(1); }}
            >
              LRC
            </button>
          </div>

          <div className="admin-search">
            <input
              type="text"
              placeholder="Search Name, Email, Std. No."
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
                <th>Role</th>
                <th>Student Number</th>
                <th>UP Mail</th>
                <th>Full Name</th>
                <th>Degree Program</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr 
                    key={user._id} 
                    className={`admin-table-row ${selectedRows.includes(user._id) ? 'selected' : ''}`}
                  >
                    <td className="admin-table-checkbox">
                      <div 
                        className={`checkbox ${selectedRows.includes(user._id) ? 'checked' : ''}`}
                        onClick={() => handleRowSelect(user._id)}
                      ></div>
                    </td>
                    <td>{displayRole(user.role)}</td>
                    <td>{user.student_number || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.degree_program || 'N/A'}</td>
                    <td>
                      <span className={`status-pill status-${user.status || 'active'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="admin-action-cell">
                      <button 
                        className="admin-action-icon"
                        onClick={(e) => toggleActionMenu(user._id, e)}
                      >
                        ⋮
                      </button>
                      
                      {openActionMenuId === user._id && (
                        <div className="admin-action-menu active">
                          <button className="admin-action-item" onClick={() => handleEdit(user)}>
                            Edit
                          </button>
                          <button className="admin-action-item delete" onClick={() => handleDelete(user)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-cell">
                    No users found matching your search.
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

        {/* Edit Modal */}
        <AdminEditUserModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          user={selectedUser} 
          onSave={handleSaveUser}
        />
      </div>
    </div>
  );
}