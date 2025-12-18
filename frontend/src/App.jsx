import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { useEffect } from 'react'; // for testing
import { getUserProfile } from './services/api';
import Login from './features/auth/Login';
import Dashboard from './pages/Dashboard'; 
import AdminPanel from './pages/AdminPanel';
import TutorProfile from './pages/TutorProfile'; 
import Booking from './pages/Booking'; 


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
        <Route path="/" element={<Login />} /> 

        {/* Tutor and Tutees Routes */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/tutors/:id" element={<TutorProfile />} /> 
        <Route path="/booking" element={<Booking />} /> 
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;