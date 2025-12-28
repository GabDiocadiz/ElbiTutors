import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react'; // for testing
import { getUserProfile } from './services/api';
import Login from './features/auth/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import TutorProfile from './pages/TutorProfile';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
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
      <Navbar />
      <Routes> 
        {/* Landing Page */}
        <Route path="/" element={<Login />} /> 

        {/* Tutor and Tutees Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/tutor-profile" element={<TutorProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<Booking />} /> 
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} /> 

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
