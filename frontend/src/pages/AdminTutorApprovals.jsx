import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/design.css';

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
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">Tutor Profile Approvals</h1>
        <p className="admin-subtitle text-gray-400">Review requested changes to tutor profiles before they go live.</p>
      </div>

      <div className="approval-queue">
        {loading ? (
          <p className="text-center py-10">Checking for pending updates...</p>
        ) : pendingTutors.length === 0 ? (
          <div className="empty-state">
            <p className="text-center py-20 text-gray-500">Queue is empty. All tutor profiles are up to date! ✨</p>
          </div>
        ) : (
          pendingTutors.map(tutor => (
            <div key={tutor._id} className="approval-card bg-white p-6 rounded-lg mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="tutor-identity md:w-1/4">
                <h3 className="text-lg font-bold text-maroon">{tutor.userId?.name}</h3>
                <p className="text-sm text-gray-500">{tutor.userId?.email}</p>
                <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                    <span className="font-bold block mb-1">Current Rating:</span> 
                    {tutor.rating} ⭐ ({tutor.ratingCount} reviews)
                </div>
              </div>

              <div className="changes-comparison md:w-2/4 flex-1">
                <div className="comparison-grid grid grid-cols-1 gap-4">
                  <div className="change-item">
                    <span className="text-xs font-bold text-gray-400 uppercase">Biography</span>
                    <div className="flex gap-4 mt-1">
                      <div className="w-1/2 p-2 bg-red-50 text-red-700 text-xs rounded line-through">{tutor.bio}</div>
                      <div className="w-1/2 p-2 bg-green-50 text-green-700 text-xs rounded">{tutor.pendingChanges?.bio}</div>
                    </div>
                  </div>

                  <div className="change-item">
                    <span className="text-xs font-bold text-gray-400 uppercase">Subjects Offered</span>
                    <div className="flex gap-4 mt-1">
                      <div className="w-1/2 p-2 bg-red-50 text-red-700 text-xs rounded line-through">{tutor.subjectsOffered?.join(', ')}</div>
                      <div className="w-1/2 p-2 bg-green-50 text-green-700 text-xs rounded">{tutor.pendingChanges?.subjectsOffered?.join(', ')}</div>
                    </div>
                  </div>

                  <div className="change-item">
                    <span className="text-xs font-bold text-gray-400 uppercase">Specialization Text</span>
                    <div className="flex gap-4 mt-1">
                      <div className="w-1/2 p-2 bg-red-50 text-red-700 text-xs rounded line-through">{tutor.specializationText}</div>
                      <div className="w-1/2 p-2 bg-green-50 text-green-700 text-xs rounded">{tutor.pendingChanges?.specializationText}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="approval-actions md:w-1/4 flex flex-col justify-center gap-2">
                <button 
                  className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
                  onClick={() => handleDecision(tutor._id, 'approve')}
                >
                  Approve Changes
                </button>
                <button 
                  className="bg-white border border-red-600 text-red-600 font-bold py-2 rounded hover:bg-red-50 transition"
                  onClick={() => handleDecision(tutor._id, 'reject')}
                >
                  Reject & Discard
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
