// Styling
import '../styles/Components.css';

import React, { useState, useRef, useEffect } from 'react';

const SUBJECTS = [
  'AAE', 'ABE', 'AGRI', 'ANSC', 'BIO', 'BOT', 'CE', 'ChE', 
  'CHEM', 'CMSC', 'ECON', 'EE', 'ENSC', 'FBS', 'FOR', 
  'FPPS', 'FRM', 'Math', 'MCB', 'PHYS', 'SFI', 'STAT'
];

const SubjectDropdown = ({ selectedSubjects = [], onChange, placeholder = "Select the subject(s) you want to teach" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubjectClick = (subject) => {
    const newSelected = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    onChange(newSelected);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayText = selectedSubjects.length > 0 
    ? selectedSubjects.join(', ') 
    : placeholder;

  return (
    <div className="subject-dropdown-container" ref={dropdownRef}>
      <div className="subject-dropdown-header" onClick={handleToggle}>
        <span className={`subject-dropdown-text ${selectedSubjects.length === 0 ? 'placeholder' : ''}`}>
          {displayText}
        </span>
        <svg 
          className={`subject-dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="14" 
          height="8" 
          viewBox="0 0 14 8" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L7.70711 7.70711C7.31658 8.09763 6.68342 8.09763 6.29289 7.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z" 
            fill="#1A1A1A"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="subject-dropdown-list">
          {SUBJECTS.map((subject, index) => {
            const isSelected = selectedSubjects.includes(subject);
            const isFirst = index === 0;
            const isLast = index === SUBJECTS.length - 1;
            
            return (
              <div 
                key={subject} 
                className={`subject-dropdown-option ${isSelected ? 'selected' : ''} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
                onClick={() => handleSubjectClick(subject)}
              >
                <span className="subject-option-text">{subject}</span>
                {isSelected && (
                  <svg 
                    className="subject-checkmark"
                    width="18" 
                    height="13" 
                    viewBox="0 0 18 13" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M17.7071 0.292893C18.0976 0.683417 18.0976 1.31658 17.7071 1.70711L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071L0.292893 7.70711C-0.0976311 7.31658 -0.0976311 6.68342 0.292893 6.29289C0.683417 5.90237 1.31658 5.90237 1.70711 6.29289L6 10.5858L16.2929 0.292893C16.6834 -0.0976311 17.3166 -0.0976311 17.7071 0.292893Z" 
                      fill="#800000"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectDropdown;
