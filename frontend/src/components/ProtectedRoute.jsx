import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Ensure this path is correct

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for Auth Check to finish (prevents flickering)
  if (loading) {
    return <div className="loading-screen">Loading...</div>; 
  }

  // 2. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but wrong role? (e.g., Tutee trying to access Admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Authorized -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;