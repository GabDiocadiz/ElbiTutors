import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

const AdminEditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'tutee',
    student_number: '',
    degree_program: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        student_number: user.student_number || '',
        degree_program: user.degree_program || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Edit User Info</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">UP Mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Student Number</label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="admin-form-input"
              >
                <option value="tutee">Tutee</option>
                <option value="tutor">LRC Staff</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Degree Program</label>
            <input
              type="text"
              name="degree_program"
              value={formData.degree_program}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox"
              id="isLRCAdmin"
              name="isLRCAdmin"
              checked={formData.role === 'admin' || formData.isLRCAdmin}
              onChange={(e) => setFormData(prev => ({ ...prev, isLRCAdmin: e.target.checked }))}
            />
            <label htmlFor="isLRCAdmin" className="admin-form-label" style={{ marginBottom: 0 }}>
              Grant Administrator Privileges
            </label>
          </div>

          <div className="admin-modal-actions">
            <button type="button" onClick={onClose} className="admin-modal-button cancel">
              Cancel
            </button>
            <button type="submit" className="admin-modal-button save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditUserModal;