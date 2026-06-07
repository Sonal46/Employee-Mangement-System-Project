import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="grid min-h-screen place-items-center text-ink">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
