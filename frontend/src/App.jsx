import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react'; // for testing
import { getUserProfile } from './services/api';
import Login from './features/auth/Login';
import Home from './pages/Home';
import AboutPage from './pages/About';
import LRCGuide from './components/LRCGuide';
import BasicInfo from './components/BasicInfo';
import TermsAndConditions from './components/TermsAndConditions';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import TutorProfile from './pages/TutorProfile';
import Profile from './pages/Profile';
import Study from './pages/Study';
import Navbar from './components/Navbar';


function App() {
  useEffect(() => {
    // TEST: frozen contract endpoint
    // for frontend testing purposes only
    getUserProfile()
      .then(res => console.log("Success:", res.data))
      .catch(err => console.log("Caught Frozen Error:", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/lrc-guide" element={<LRCGuide />} />
        <Route path="/basic-info" element={<BasicInfo />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* Logged-in Routes with Navbar */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tutors/:id" element={<><Navbar /><TutorProfile /></>} />
        <Route path="/tutor-profile" element={<><Navbar /><TutorProfile /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/study" element={<><Navbar /><Study /></>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<><Navbar /><AdminPanel /></>} /> 

        {/* Page Not Found Error 404 issues */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">404</h1>
            <p>Page Not Found</p>
            <a href="/" className="text-blue-500 underline">Return Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
