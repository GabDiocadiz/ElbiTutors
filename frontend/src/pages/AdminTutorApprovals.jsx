import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminTutorApprovals() {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutors/pending');
      setPendingTutors(response.data);
    } catch (err) {
      console.error("Failed to fetch pending tutor changes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (tutorId, status) => {
    try {
      await api.put(`/tutors/${tutorId}/approve`, { status });
      setPendingTutors(prev => prev.filter(t => t._id !== tutorId));
    } catch (err) {
      alert("Failed to process approval");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Tutor Profile Approvals</h1>
        <p className="admin-subtitle">Review requested changes to tutor profiles before they go live.</p>
        
        {loading ? (
          <div className="no-data-cell">Checking for pending updates...</div>
        ) : pendingTutors.length === 0 ? (
          <div className="admin-stat-card">
            <span className="stat-value" style={{ fontSize: '3rem' }}>✨</span>
            <p className="stat-label">Queue is empty</p>
            <p className="admin-timestamp-sub">All tutor profiles are up to date.</p>
          </div>
        ) : (
          <div className="admin-card-list">
            {pendingTutors.map(tutor => (
              <div key={tutor._id} className="admin-card">
                
                {/* Header Section */}
                <div className="admin-card-header">
                  <div className="admin-card-title-group">
                    <h3 className="admin-card-title">
                      {tutor.userId?.name}
                    </h3>
                    <p className="admin-card-subtitle">{tutor.userId?.email}</p>
                  </div>
                  <div className="status-pill status-pending">
                    Pending Review
                  </div>
                </div>

                <div className="admin-card-body">
                   <div className="admin-info-box">
                      <strong>Current Rating:</strong> {tutor.rating || 'N/A'} ⭐ ({tutor.ratingCount} reviews)
                   </div>

                   {/* Comparison Grid */}
                   <div className="comparison-container">
                      
                      {/* Bio Change */}
                      <div className="comparison-row">
                        <span className="comparison-label">Biography</span>
                        <div className="comparison-diff">
                          <div className="diff-box old">
                            {tutor.bio || <em>No previous bio</em>}
                          </div>
                          <div className="diff-arrow">→</div>
                          <div className="diff-box new">
                            {tutor.pendingChanges?.bio}
                          </div>
                        </div>
                      </div>

                      {/* Subjects Change */}
                      <div className="comparison-row">
                        <span className="comparison-label">Subjects</span>
                        <div className="comparison-diff">
                          <div className="diff-box old">
                            {tutor.subjectsOffered?.join(', ')}
                          </div>
                          <div className="diff-arrow">→</div>
                          <div className="diff-box new">
                            {tutor.pendingChanges?.subjectsOffered?.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Specialization Change */}
                      <div className="comparison-row">
                        <span className="comparison-label">Specialization</span>
                        <div className="comparison-diff">
                          <div className="diff-box old">
                            {tutor.specializationText}
                          </div>
                          <div className="diff-arrow">→</div>
                          <div className="diff-box new">
                            {tutor.pendingChanges?.specializationText}
                          </div>
                        </div>
                      </div>

                   </div>
                </div>

                {/* Footer / Actions */}
                <div className="admin-card-footer">
                   <button 
                     className="admin-form-submit btn-approve"
                     onClick={() => handleDecision(tutor._id, 'approve')}
                   >
                     Approve Changes
                   </button>
                   <button 
                     className="admin-back-button btn-reject"
                     style={{ marginBottom: 0, color: '#C62828', borderColor: '#FFCDD2' }}
                     onClick={() => handleDecision(tutor._id, 'reject')}
                   >
                     Reject
                   </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}