import React, { useState } from 'react';
import '../styles/EvaluationForm.css';

const EvaluationForm = ({ sessionData, onClose, onSubmit }) => {
  const [ratings, setRatings] = useState({
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
  });
  const [comments, setComments] = useState('');

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
    { id: 'question1', text: 'How would you rate the tutor\'s knowledge of the subject?' },
    { id: 'question2', text: 'How effective was the tutoring session in helping you understand the material?' },
    { id: 'question3', text: 'How would you rate the tutor\'s communication and teaching skills?' },
    { id: 'question4', text: 'How well did the tutor address your questions and concerns?' },
    { id: 'question5', text: 'How likely are you to recommend this tutor to other students?' },
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
            <p><strong>Tutor:</strong> {sessionData.tutor}</p>
            <p><strong>Tutee:</strong> {sessionData.tutee}</p>
            <p><strong>Course:</strong> {sessionData.course}</p>
            <p><strong>Topic:</strong> {sessionData.topic}</p>
            <p><strong>Date:</strong> {sessionData.date}</p>
          </div>

          <div className="evaluation-divider"></div>

          <div className="instructions">
            <strong>Instructions:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et ullamcorper lorem, non dictum enim.
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
                  <label className="question-label">QUESTION {index + 1} -</label>
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
                placeholder="Anything else you would like to say?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={8}
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
