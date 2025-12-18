import { Link } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 

// Login Page Component
// entry-point for ElbiTutors

export default function Login() {
  // store user state and JWT
  const { login } = useAuth(); 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold">ElBiTutors Login</h1>
      
      {/* Google OAuth Authentication Trigger
        In production, this initiates the backend flow at /backend/auth/google.
      */}
      <button 
        onClick={login} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Google
      </button>

      {/* for route testing purposes only */}
      <div className="mt-10 p-4 border border-dashed border-gray-400">
        <p className="text-sm text-gray-500 mb-2">Dev Testing Links:</p>
        <nav className="flex gap-4">
          <Link to="/admin" className="text-blue-500 underline">Go to Admin</Link>
          <Link to="/dashboard" className="text-blue-500 underline">Go to Dashboard</Link>
          <Link to="/booking" className="text-blue-500 underline">Go to Booking</Link>
        </nav>
      </div>
    </div>
  );
}