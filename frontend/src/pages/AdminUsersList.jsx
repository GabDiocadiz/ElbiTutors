import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminEditUserModal from '../components/EditUser';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the new modal
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminUsersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for Menus
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  
  // State for Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null); // Track who we are deleting

  const itemsPerPage = 10;
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
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

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.admin-action-cell')) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter Logic
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
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
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

  // 1. Trigger the Modal (Don't delete yet)
  const handleDeleteClick = (user, e) => {
    if (e) e.stopPropagation();
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setOpenActionMenuId(null);
  };

  // 2. Actually Delete (Called by Modal)
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // Call the DELETE endpoint
      await api.delete(`/users/${userToDelete._id}`);
      
      // Refresh list
      const response = await api.get('/users');
      setAllUsers(response.data);
      
      // Reset state
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      await api.put(`/users/${updatedUser._id}/role`, { role: updatedUser.role });
      const response = await api.get('/users');
      setAllUsers(response.data);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const displayRole = (role) => {
    if (role.toLowerCase() === 'tutor') return 'LRC';
    if (role.toLowerCase() === 'tutee') return 'Tutee';
    return role;
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <button className="admin-back-button" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>

        <h1 className="admin-title">All Users</h1>

        <div className="admin-controls">
          <div className="admin-chip-group">
            <button className={`admin-chip ${selectedFilter === 'all' ? 'active' : ''}`} onClick={() => setSelectedFilter('all')}>All</button>
            <button className={`admin-chip ${selectedFilter === 'tutee' ? 'active' : ''}`} onClick={() => setSelectedFilter('tutee')}>Tutee Only</button>
            <button className={`admin-chip ${selectedFilter === 'tutor' ? 'active' : ''}`} onClick={() => setSelectedFilter('tutor')}>LRC</button>
          </div>
          <div className="admin-search">
            <input
              type="text"
              placeholder="Search Name, Email, Std. No."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr className="admin-table-header">
                <th className="admin-table-checkbox"><div className="checkbox"></div></th>
                <th>Role</th>
                <th>Student Number</th>
                <th>UP Mail</th>
                <th>Full Name</th>
                <th>Degree Program</th>
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
                      <div className={`checkbox ${selectedRows.includes(user._id) ? 'checked' : ''}`} onClick={() => handleRowSelect(user._id)}></div>
                    </td>
                    <td>{displayRole(user.role)}</td>
                    <td>{user.student_number || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.degree_program || 'N/A'}</td>
                    <td className="admin-action-cell">
                      <button className="admin-action-icon" onClick={(e) => toggleActionMenu(user._id, e)}>
                        ⋮
                      </button>
                      
                      {openActionMenuId === user._id && (
                        <div className="admin-action-menu active">
                          <button className="admin-action-item" onClick={() => handleEdit(user)}>
                            Edit
                          </button>
                          
                          {/* DELETE BUTTON */}
                          <button 
                            className="admin-action-item delete" 
                            onClick={(e) => handleDeleteClick(user, e)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="no-data-cell">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
             <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`admin-chip ${currentPage === 1 ? 'disabled' : ''}`}>Previous</button>
             <span className="admin-pagination-text">Page {currentPage} of {totalPages}</span>
             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`admin-chip ${currentPage === totalPages ? 'disabled' : ''}`}>Next</button>
          </div>
        )}

        {/* Edit User Modal */}
        <AdminEditUserModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          user={selectedUser} 
          onSave={handleSaveUser}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={`Are you sure about this action? This will permanently delete ${userToDelete?.name} from the database.`}
        />
      </div>
    </div>
  );
}