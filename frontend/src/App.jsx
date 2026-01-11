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
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersList from './pages/AdminUsersList';
import AdminNewLRCUser from './pages/AdminNewLRCUser';
import AdminReports from './pages/AdminReports';
// import TutorProfile from './pages/TutorProfile';
import TutorProfileView from './pages/TutorProfileView';
import Profile from './pages/Profile';
import Study from './pages/Study';
import NotFound from './pages/NotFound';
import Navbar from './components/NavBar';
import SimpleNavbar from './components/SimpleNavBar';

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
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        {/* <Route path="/tutors/:id" element={<><Navbar /><TutorProfile /></>} /> */}
        {/* <Route path="/tutor-profile" element={<><Navbar /><TutorProfile /></>} /> */}
        <Route path="/tutor/:tutorId/view" element={<TutorProfileView />} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />
        <Route path="/study" element={<><Navbar /><Study /></>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<><SimpleNavbar /><AdminPanel /></>} />
        <Route path="/admin/dashboard" element={<><SimpleNavbar /><AdminDashboard /></>} />
        <Route path="/admin/users" element={<><SimpleNavbar /><AdminUsersList /></>} />
        <Route path="/admin/new-lrc-user" element={<><SimpleNavbar /><AdminNewLRCUser /></>} />
        <Route path="/admin/reports" element={<><SimpleNavbar /><AdminReports /></>} /> 

        {/* Page Not Found Error 404 issues */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;