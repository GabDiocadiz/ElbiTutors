import { useState } from 'react';
import Footer from '../components/Footer';
import logoLightMode from '../assets/logo_lightmode.png';
import '../styles/design.css';

export default function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="logged-in-home">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-logo-container">
          <img 
            src={logoLightMode} 
            alt="ELBI Tutors Logo" 
            className="hero-logo-img"
          />
        </div>
        
        <h1 className="hero-tagline">
          <span className="maroon-text">Learn. </span>
          <span className="gold-text">Teach.</span>
          <span className="maroon-text"> </span>
          <span className="green-text">Succeed.</span>
          <span className="maroon-text"> </span>
          <span className="dark-text">Together.</span>
        </h1>
        
        <p className="hero-subtitle">
          Connect with peers, certified tutors, and group study opportunities — all in one place.
        </p>
      </section>

      {/* Who's on ELBITutors Section */}
      <section className="whos-on-section">
        <h2 className="whos-on-title">Who's on ELBITutors</h2>

        <div className="whos-on-content">
          <div className="user-types-container">
            <div className="user-type-card">
              <svg className="user-type-icon" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="67" cy="67" r="67" fill="#ddd"/>
                <path d="M67 45C71.4183 45 75.6702 46.7559 78.8583 49.9441C82.0464 53.1323 83.8023 57.3841 83.8023 61.8023C83.8023 66.2206 82.0464 70.4724 78.8583 73.6606C75.6702 76.8488 71.4183 78.6047 67 78.6047C62.5818 78.6047 58.3299 76.8488 55.1418 73.6606C51.9536 70.4724 50.1977 66.2206 50.1977 61.8023C50.1977 57.3841 51.9536 53.1323 55.1418 49.9441C58.3299 46.7559 62.5818 45 67 45ZM67 84.8837C79.3023 84.8837 100.326 90.8558 100.326 103.163V111.721H33.6744V103.163C33.6744 90.8558 54.6977 84.8837 67 84.8837Z" fill="#666"/>
              </svg>
              <div className="user-type-content">
                <h3 className="user-type-title">Students</h3>
                <p className="user-type-description">Iskolar ng bayan who need help in their subjects.</p>
                {isExpanded && (
                  <p className="user-type-expanded-text">
                    All UPLB students who want academic support.
                    Can book one-on-one tutoring, join LRC-led reviews, or participate in group study sessions.
                    Have the opportunity to rate and review tutors after each session.
                  </p>
                )}
              </div>
            </div>

            <div className="user-type-card">
              <svg className="user-type-icon" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="67" cy="67" r="67" fill="#ddd"/>
                <path d="M95 50.5H80.5V45C80.5 42.6131 79.5518 40.3239 77.864 38.636C76.1761 36.9482 73.8869 36 71.5 36H62.5C60.1131 36 57.8239 36.9482 56.136 38.636C54.4482 40.3239 53.5 42.6131 53.5 45V50.5H39C36.6131 50.5 34.3239 51.4482 32.636 53.136C30.9482 54.8239 30 57.1131 30 59.5V89C30 91.3869 30.9482 93.6761 32.636 95.364C34.3239 97.0518 36.6131 98 39 98H95C97.3869 98 99.6761 97.0518 101.364 95.364C103.052 93.6761 104 91.3869 104 89V59.5C104 57.1131 103.052 54.8239 101.364 53.136C99.6761 51.4482 97.3869 50.5 95 50.5ZM62.5 45H71.5V50.5H62.5V45ZM95 89H39V59.5H53.5V69H62.5V59.5H71.5V69H80.5V59.5H95V89Z" fill="#666"/>
              </svg>
              <div className="user-type-content">
                <h3 className="user-type-title">Certified Tutors</h3>
                <p className="user-type-description">Trusted mentors hosting official review and lecture sessions.</p>
                {isExpanded && (
                  <p className="user-type-expanded-text">
                    Verified and trained by the Learning Resource Center (LRC).
                    Host official review classes and structured academic support sessions.
                    Provide trusted and high-quality guidance to students preparing for exams.
                  </p>
                )}
              </div>
            </div>
          </div>

          <button className="see-more-btn" onClick={toggleExpanded}>
            {isExpanded ? (
              <svg className="chevron-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 18.75L15 11.25L7.5 18.75" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="chevron-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 11.25L15 18.75L22.5 11.25" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span className="see-more-btn-text">See more</span>
          </button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <h2 className="how-it-works-title">How it works?</h2>
        
        <div className="steps-container">
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M81.6667 87.5L55.4167 61.25C53.3333 62.9167 50.9375 64.2361 48.2292 65.2083C45.5208 66.1806 42.6389 66.6667 39.5833 66.6667C32.0139 66.6667 25.6076 64.0451 20.3646 58.8021C15.1215 53.559 12.5 47.1528 12.5 39.5833C12.5 32.0139 15.1215 25.6076 20.3646 20.3646C25.6076 15.1215 32.0139 12.5 39.5833 12.5C47.1528 12.5 53.559 15.1215 58.8021 20.3646C64.0451 25.6076 66.6667 32.0139 66.6667 39.5833C66.6667 42.6389 66.1806 45.5208 65.2083 48.2292C64.2361 50.9375 62.9167 53.3333 61.25 55.4167L87.5 81.6667L81.6667 87.5ZM39.5833 58.3333C44.7917 58.3333 49.2187 56.5104 52.8646 52.8646C56.5104 49.2187 58.3333 44.7917 58.3333 39.5833C58.3333 34.375 56.5104 29.9479 52.8646 26.3021C49.2187 22.6562 44.7917 20.8333 39.5833 20.8333C34.375 20.8333 29.9479 22.6562 26.3021 26.3021C22.6562 29.9479 20.8333 34.375 20.8333 39.5833C20.8333 44.7917 22.6562 49.2187 26.3021 52.8646C29.9479 56.5104 34.375 58.3333 39.5833 58.3333Z" fill="#852221"/>
            </svg>
            <h3 className="step-title">Search</h3>
            <p className="step-description">Look for available tutors by subject, skill, or rating.</p>
          </div>
          
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50.0003 49.9998C45.417 49.9998 41.4934 48.3679 38.2295 45.104C34.9656 41.8401 33.3337 37.9165 33.3337 33.3332C33.3337 28.7498 34.9656 24.8262 38.2295 21.5623C41.4934 18.2984 45.417 16.6665 50.0003 16.6665C54.5837 16.6665 58.5073 18.2984 61.7712 21.5623C65.035 24.8262 66.667 28.7498 66.667 33.3332C66.667 37.9165 65.035 41.8401 61.7712 45.104C58.5073 48.3679 54.5837 49.9998 50.0003 49.9998ZM16.667 83.3332V71.6665C16.667 69.3054 17.2746 67.1353 18.4899 65.1561C19.7052 63.1769 21.3198 61.6665 23.3337 60.6248C27.6392 58.4721 32.0142 56.8575 36.4587 55.7811C40.9031 54.7047 45.417 54.1665 50.0003 54.1665C54.5837 54.1665 59.0975 54.7047 63.542 55.7811C67.9864 56.8575 72.3614 58.4721 76.667 60.6248C78.6809 61.6665 80.2955 63.1769 81.5107 65.1561C82.726 67.1353 83.3337 69.3054 83.3337 71.6665V83.3332H16.667ZM25.0003 74.9998H75.0003V71.6665C75.0003 70.9026 74.8094 70.2082 74.4274 69.5832C74.0455 68.9582 73.542 68.4721 72.917 68.1248C69.167 66.2498 65.3823 64.8436 61.5628 63.9061C57.7434 62.9686 53.8892 62.4998 50.0003 62.4998C46.1114 62.4998 42.2573 62.9686 38.4378 63.9061C34.6184 64.8436 30.8337 66.2498 27.0837 68.1248C26.4587 68.4721 25.9552 68.9582 25.5732 69.5832C25.1913 70.2082 25.0003 70.9026 25.0003 71.6665V74.9998ZM50.0003 41.6665C52.292 41.6665 54.2538 40.8505 55.8857 39.2186C57.5177 37.5866 58.3337 35.6248 58.3337 33.3332C58.3337 31.0415 57.5177 29.0797 55.8857 27.4478C54.2538 25.8158 52.292 24.9998 50.0003 24.9998C47.7087 24.9998 45.7469 25.8158 44.1149 27.4478C42.483 29.0797 41.667 31.0415 41.667 33.3332C41.667 35.6248 42.483 37.5866 44.1149 39.2186C45.7469 40.8505 47.7087 41.6665 50.0003 41.6665Z" fill="#852221"/>
            </svg>
            <h3 className="step-title">Select</h3>
            <p className="step-description">View a tutor's profile, availability, and feedback.</p>
          </div>
          
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M63.7497 69.5835L69.583 63.7502L54.1663 48.3335V29.1668H45.833V51.6668L63.7497 69.5835ZM49.9997 91.6668C44.2358 91.6668 38.8191 90.5731 33.7497 88.3856C28.6802 86.1981 24.2705 83.2293 20.5205 79.4793C16.7705 75.7293 13.8018 71.3196 11.6143 66.2502C9.42676 61.1807 8.33301 55.7641 8.33301 50.0002C8.33301 44.2363 9.42676 38.8196 11.6143 33.7502C13.8018 28.6807 16.7705 24.271 20.5205 20.521C24.2705 16.771 28.6802 13.8022 33.7497 11.6147C38.8191 9.42725 44.2358 8.3335 49.9997 8.3335C55.7636 8.3335 61.1802 9.42725 66.2497 11.6147C71.3191 13.8022 75.7288 16.771 79.4788 20.521C83.2289 24.271 86.1976 28.6807 88.3851 33.7502C90.5726 38.8196 91.6663 44.2363 91.6663 50.0002C91.6663 55.7641 90.5726 61.1807 88.3851 66.2502C86.1976 71.3196 83.2289 75.7293 79.4788 79.4793C75.7288 83.2293 71.3191 86.1981 66.2497 88.3856C61.1802 90.5731 55.7636 91.6668 49.9997 91.6668ZM49.9997 83.3335C59.2358 83.3335 67.1004 80.087 73.5934 73.5939C80.0865 67.1009 83.333 59.2363 83.333 50.0002C83.333 40.7641 80.0865 32.8995 73.5934 26.4064C67.1004 19.9134 59.2358 16.6668 49.9997 16.6668C40.7636 16.6668 32.899 19.9134 26.4059 26.4064C19.9129 32.8995 16.6663 40.7641 16.6663 50.0002C16.6663 59.2363 19.9129 67.1009 26.4059 73.5939C32.899 80.087 40.7636 83.3335 49.9997 83.3335Z" fill="#852221"/>
            </svg>
            <h3 className="step-title">Schedule</h3>
            <p className="step-description">Choose an open time slot or request a session.</p>
          </div>
          
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.1667 67.5L73.5417 38.125L67.7083 32.2917L44.1667 55.8333L32.2917 43.9583L26.4583 49.7917L44.1667 67.5ZM20.8333 87.5C18.5417 87.5 16.5799 86.684 14.9479 85.0521C13.316 83.4201 12.5 81.4583 12.5 79.1667V20.8333C12.5 18.5417 13.316 16.5799 14.9479 14.9479C16.5799 13.316 18.5417 12.5 20.8333 12.5H79.1667C81.4583 12.5 83.4201 13.316 85.0521 14.9479C86.684 16.5799 87.5 18.5417 87.5 20.8333V79.1667C87.5 81.4583 86.684 83.4201 85.0521 85.0521C83.4201 86.684 81.4583 87.5 79.1667 87.5H20.8333Z" fill="#852221"/>
            </svg>
            <h3 className="step-title">Confirm</h3>
            <p className="step-description">Get notified once the tutor approves.</p>
          </div>
          
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 97 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M46.875 71.7332V7.37827C46.875 7.37827 38.475 0 26.5625 0C14.65 0 6.25 6.55846 6.25 6.55846V71.7332C6.25 71.7332 14.65 65.378 26.5625 65.378C38.475 65.378 46.875 71.7332 46.875 71.7332ZM90.625 71.7332V7.37827C90.625 7.37827 82.225 0 70.3125 0C58.4 0 50 6.55846 50 6.55846V71.7332C50 71.7332 58.4 65.378 70.3125 65.378C82.225 65.378 90.625 71.7332 90.625 71.7332ZM96.875 13.1169H93.75V75.4223H56.25V78.7015H40.625V75.4223H3.125V13.1169H0V78.7015H37.5V81.9808H59.5688L59.375 78.7015H96.875V13.1169Z" fill="#800000"/>
            </svg>
            <h3 className="step-title">Attend</h3>
            <p className="step-description">Meet in-person (depending on the arrangement).</p>
          </div>
          
          <div className="step-card">
            <svg className="step-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33.333 75.0002L49.9997 62.2918L66.6663 75.0002L60.4163 54.3752L77.083 42.5002H56.6663L49.9997 20.8335L43.333 42.5002H22.9163L39.583 54.3752L33.333 75.0002ZM49.9997 91.6668C44.2358 91.6668 38.8191 90.5731 33.7497 88.3856C28.6802 86.1981 24.2705 83.2293 20.5205 79.4793C16.7705 75.7293 13.8018 71.3196 11.6143 66.2502C9.42676 61.1807 8.33301 55.7641 8.33301 50.0002C8.33301 44.2363 9.42676 38.8196 11.6143 33.7502C13.8018 28.6807 16.7705 24.271 20.5205 20.521C24.2705 16.771 28.6802 13.8022 33.7497 11.6147C38.8191 9.42725 44.2358 8.3335 49.9997 8.3335C55.7636 8.3335 61.1802 9.42725 66.2497 11.6147C71.3191 13.8022 75.7288 16.771 79.4788 20.521C83.2289 24.271 86.1976 28.6807 88.3851 33.7502C90.5726 38.8196 91.6663 44.2363 91.6663 50.0002C91.6663 55.7641 90.5726 61.1807 88.3851 66.2502C86.1976 71.3196 83.2289 75.7293 79.4788 79.4793C75.7288 83.2293 71.3191 86.1981 66.2497 88.3856C61.1802 90.5731 55.7636 91.6668 49.9997 91.6668Z" fill="#852221"/>
            </svg>
            <h3 className="step-title">Review</h3>
            <p className="step-description">Rate and give feedback after the session.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
