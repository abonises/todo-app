import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

const PrivateRoute = ({ role }) => {
  const { user } = useAuth();
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;