import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminEditUserModal from '../components/EditUser';
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

  // Mock Database of Users
  // Roles restricted to 'tutee' or 'tutor' (displayed as LRC)
  const [allUsers, setAllUsers] = useState([
    { id: 1, name: 'Dela Cruz, Juan', email: 'jdelacruz@up.edu.ph', role: 'tutee', studentNumber: '2023-12345', degreeProgram: 'BS Computer Science' },
    { id: 2, name: 'Santos, Maria Clara', email: 'msantos@up.edu.ph', role: 'tutor', studentNumber: '2022-12345', degreeProgram: 'BS Applied Mathematics' },
    { id: 3, name: 'Reyes, Jose', email: 'jreyes@up.edu.ph', role: 'tutee', studentNumber: '2023-10101', degreeProgram: 'BS Biology' },
    { id: 4, name: 'Garcia, Miguel', email: 'mgarcia@up.edu.ph', role: 'tutor', studentNumber: '2023-00001', degreeProgram: 'BS Statistics' },
    { id: 5, name: 'Bautista, Ana', email: 'abautista@up.edu.ph', role: 'tutor', studentNumber: '2021-54321', degreeProgram: 'BA Communication Arts' },
    { id: 6, name: 'Ocampo, Luis', email: 'locampo@up.edu.ph', role: 'tutee', studentNumber: '2020-98765', degreeProgram: 'BS Civil Engineering' },
    { id: 7, name: 'Mendoza, Sarah', email: 'smendoza@up.edu.ph', role: 'tutee', studentNumber: '2023-11111', degreeProgram: 'BS Economics' },
    { id: 8, name: 'Lim, Michael', email: 'mlim@up.edu.ph', role: 'tutor', studentNumber: '2019-22222', degreeProgram: 'BS Forestry' },
    { id: 9, name: 'Tan, Anna', email: 'atan@up.edu.ph', role: 'tutee', studentNumber: '2022-33333', degreeProgram: 'BS Chemistry' },
    { id: 10, name: 'Aquino, Tomas', email: 'taquino@up.edu.ph', role: 'tutor', studentNumber: '2021-44444', degreeProgram: 'BA Philosophy' },
    { id: 11, name: 'Gonzales, Jerry', email: 'jgonzales@up.edu.ph', role: 'tutee', studentNumber: '2023-55555', degreeProgram: 'BS Agribusiness' },
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
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const roleFilter = selectedFilter === 'all' 
        ? true 
        : user.role.toLowerCase() === selectedFilter.toLowerCase();
      
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.studentNumber.includes(lowerSearch) ||
        user.degreeProgram.toLowerCase().includes(lowerSearch);

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

  const handleSaveUser = (updatedUser) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (user) => {
    if(window.confirm(`Are you sure you want to delete ${user.name}?`)) {
       setAllUsers(prev => prev.filter(u => u.id !== user.id));
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr 
                    key={user.id} 
                    className={`admin-table-row ${selectedRows.includes(user.id) ? 'selected' : ''}`}
                  >
                    <td className="admin-table-checkbox">
                      <div 
                        className={`checkbox ${selectedRows.includes(user.id) ? 'checked' : ''}`}
                        onClick={() => handleRowSelect(user.id)}
                      ></div>
                    </td>
                    <td>{displayRole(user.role)}</td>
                    <td>{user.studentNumber}</td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.degreeProgram}</td>
                    <td className="admin-action-cell">
                      <button 
                        className="admin-action-icon"
                        onClick={(e) => toggleActionMenu(user.id, e)}
                      >
                        ⋮
                      </button>
                      
                      {openActionMenuId === user.id && (
                        <div className="admin-action-menu">
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