import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminNewLRCUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', 
    upMail: '',
    studentNumber: '',
    degreeProgram: '',
    role: 'tutee', // Default role (lowercase as per requirement)
    subjects: []
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mock Database for duplicate checking
  const existingUsers = [
    { upMail: 'jdelacruz@up.edu.ph', studentNumber: '2023-12345' },
    { upMail: 'msantos@up.edu.ph', studentNumber: '2022-12345' }
  ];

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      isValid = false;
    }
    if (!formData.upMail.trim()) {
      newErrors.upMail = 'UP Mail is required';
      isValid = false;
    } else if (!formData.upMail.endsWith('@up.edu.ph')) {
      newErrors.upMail = 'Must be a valid UP Mail (@up.edu.ph)';
      isValid = false;
    }
    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = 'Student Number is required';
      isValid = false;
    }
    if (!formData.degreeProgram.trim()) {
      newErrors.degreeProgram = 'Degree Program is required';
      isValid = false;
    }

    // Duplicate Check
    const isDuplicateEmail = existingUsers.some(u => u.upMail === formData.upMail);
    const isDuplicateStudent = existingUsers.some(u => u.studentNumber === formData.studentNumber);

    if (isDuplicateEmail) {
      newErrors.upMail = 'User with this UP Mail already exists';
      isValid = false;
    }
    if (isDuplicateStudent) {
      newErrors.studentNumber = 'User with this Student Number already exists';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (validateForm()) {
      // API call would go here
      console.log('Creating new user:', formData);
      setSuccessMessage(`Successfully created user: ${formData.name}`);
      
      // Reset form
      setFormData({
        name: '',
        upMail: '',
        studentNumber: '',
        degreeProgram: '',
        role: 'tutee',
        subjects: []
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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

        <div className="admin-form-card">
          <h1 className="admin-form-title">New User</h1>

          {successMessage && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name*</label>
              <input
                type="text"
                name="name"
                placeholder="Dela Cruz, Juan"
                value={formData.name}
                onChange={handleInputChange}
                className="admin-form-input"
                style={{ borderColor: errors.name ? '#dc3545' : '' }}
              />
              {errors.name && <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{errors.name}</span>}
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">UP Mail*</label>
                <input
                  type="text"
                  name="upMail"
                  placeholder="username@up.edu.ph"
                  value={formData.upMail}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  style={{ borderColor: errors.upMail ? '#dc3545' : '' }}
                />
                {errors.upMail && <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{errors.upMail}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="admin-form-input"
                >
                  <option value="tutee">Tutee</option>
                  <option value="tutor">LRC Staff</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Student Number*</label>
                <input
                  type="text"
                  name="studentNumber"
                  placeholder="202X-XXXXX"
                  value={formData.studentNumber}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  style={{ borderColor: errors.studentNumber ? '#dc3545' : '' }}
                />
                {errors.studentNumber && <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{errors.studentNumber}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Degree Program*</label>
                <input
                  type="text"
                  name="degreeProgram"
                  placeholder="BS Computer Science"
                  value={formData.degreeProgram}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  style={{ borderColor: errors.degreeProgram ? '#dc3545' : '' }}
                />
                {errors.degreeProgram && <span style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '5px' }}>{errors.degreeProgram}</span>}
              </div>
            </div>

            {/* Optional: Subjects field if user is LRC Staff (tutor) */}
            {formData.role === 'tutor' && (
               <div className="admin-form-group">
                <label className="admin-form-label">Subjects (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CMSC 11, MATH 25 (Comma separated)"
                  className="admin-form-input"
                />
              </div>
            )}

            <button type="submit" className="admin-form-submit">
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}