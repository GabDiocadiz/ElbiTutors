// Styling
import '../styles/Components.css';

import React, { useState } from 'react';

const EvaluationForm = ({ sessionData, onClose, onSubmit, courseCode, tutorName }) => {
  const [ratings, setRatings] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [comments, setComments] = useState('');

  // Parse course and tutor from sessionData if string format is "Course by Tutor"
  let displayCourse = courseCode;
  let displayTutor = tutorName;

  if (sessionData?.course && !displayCourse && !displayTutor) {
    if (sessionData.course.includes(' by ')) {
      const parts = sessionData.course.split(' by ');
      displayCourse = parts[0];
      displayTutor = parts[1];
    } else {
      displayCourse = sessionData.course;
    }
  }

  // Fallbacks
  displayCourse = displayCourse || sessionData?.course || 'Course Code';
  displayTutor = displayTutor || sessionData?.tutorName || 'Tutor Name';

  const handleRatingChange = (question, value) => {
    setRatings(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ratings, comments });
    }
    onClose();
  };

  const questions = [
    { id: 'q1', text: 'Was the tutor punctual and well-prepared for the session?' },
    { id: 'q2', text: 'Did the tutor explain the concepts clearly and answer your questions effectively?' },
    { id: 'q3', text: 'Was the tutor patient, respectful, and encouraging throughout the session?' },
    { id: 'q4', text: 'Did this session improve your understanding of the subject matter?' },
    { id: 'q5', text: 'How would you rate your overall learning experience with this tutor?' },
  ];

  return (
    <div className="evaluation-overlay" onClick={onClose}>
      <div className="evaluation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="evaluation-form-container">
          <div className="evaluation-header">
            <span className="clipboard-icon">📋</span>
            <h2 className="evaluation-title">Evaluation Form</h2>
          </div>

          <div className="evaluation-divider"></div>

          <div className="session-details">
            <p><strong>Tutor:</strong> {displayTutor}</p>
            <p><strong>Course:</strong> {displayCourse}</p>
          </div>

          <div className="evaluation-divider"></div>

          <div className="instructions">
            <strong>Instructions:</strong> Please evaluate your tutoring session based on the tutor's behavior and your learning experience. Your honest feedback helps us improve the quality of our peer tutoring services.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-header">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>

            <div className="questions-container">
              {questions.map((question, index) => (
                <div key={question.id} className="question-row">
                  <label className="question-label">QUESTION {index + 1} - {question.text}</label>
                  <div className="rating-options">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`rating-circle ${ratings[question.id] === value ? 'selected' : ''}`}
                        onClick={() => handleRatingChange(question.id, value)}
                        aria-label={`Rate ${value} out of 5`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="comments-section">
              <label className="comments-label">COMMENTS:</label>
              <textarea
                className="comments-textarea"
                placeholder="Share any additional feedback, suggestions, or highlights about your session..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;