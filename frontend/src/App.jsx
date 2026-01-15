import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserProfile } from './services/api';
import { AuthProvider } from './hooks/useAuth'; // Don't forget to wrap App in AuthProvider if not already in index.js!

// Components
import ProtectedRoute from './components/ProtectedRoute'; // <--- IMPORT THIS
import Navbar from './components/NavBar';
import SimpleNavbar from './components/SimpleNavBar';

// Pages
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
import AdminBookings from './pages/AdminBookings';
import AdminTutorApprovals from './pages/AdminTutorApprovals';
import AdminAuditLogs from './pages/AdminAuditLogs';
import TutorProfileView from './pages/TutorProfileView';
import Profile from './pages/Profile';
import Study from './pages/Study';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

function App() { 
  // Removed debug useEffect to prevent "no token" errors on mount when not logged in.

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      {/* NOTE: Ensure <AuthProvider> wraps everything either here 
         or in your main.jsx / index.js file 
      */}
      <Routes>
        {/* --- PUBLIC ROUTES (Accessible by anyone) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/lrc-guide" element={<LRCGuide />} />
        <Route path="/basic-info" element={<BasicInfo />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* --- PROTECTED ROUTES (Logged-in Users Only) --- */}
        {/* We allow 'tutee', 'tutor', and 'admin' to see these pages */}
        <Route element={<ProtectedRoute allowedRoles={['tutee', 'tutor', 'admin']} />}>
            <Route path="/dashboard" element={<><Dashboard /></>} />
            <Route path="/tutor/:tutorId/view" element={<TutorProfileView />} />
            <Route path="/profile" element={<><Navbar /><Profile /></>} />
            <Route path="/study" element={<><Navbar /><Study /></>} />
        </Route>

        {/* --- ADMIN ROUTES (Admin Only) --- */}
        {/* If a 'tutee' tries to go here, they get kicked to /dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<><Navbar /><AdminPanel /></>} />
            <Route path="/admin/dashboard" element={<><Navbar /><AdminDashboard /></>} />
            <Route path="/admin/users" element={<><Navbar /><AdminUsersList /></>} />
            <Route path="/admin/new-lrc-user" element={<><Navbar /><AdminNewLRCUser /></>} />
            <Route path="/admin/reports" element={<><Navbar /><AdminReports /></>} /> 
            <Route path="/admin/bookings" element={<><Navbar /><AdminBookings /></>} />
            <Route path="/admin/tutor-approvals" element={<><Navbar /><AdminTutorApprovals /></>} />
            <Route path="/admin/audit-logs" element={<><Navbar /><AdminAuditLogs /></>} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;