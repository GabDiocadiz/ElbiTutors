import { Link } from 'react-router-dom'; // [cite: 109]
import { useAuth } from '../../hooks/useAuth'; // [cite: 92]

export default function Login() {
  const { login } = useAuth(); // [cite: 94]

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold">ElBiTutors Login</h1>
      
      <button 
        onClick={login} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Sign in with Google
      </button>

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