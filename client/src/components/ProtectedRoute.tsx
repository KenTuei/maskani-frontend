import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type UserRole = "hunter" | "realtor" | "leaser" | "admin";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  requireApproval?: boolean;
  children?: ReactNode; // Added this to fix the TS2322 error
}

const ProtectedRoute = ({
  allowedRoles,
  requireApproval,
  children, // Destructure children here
}: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Read both keys for backwards compatibility
  const userRole = (localStorage.getItem("userRole") ||
    localStorage.getItem("role")) as UserRole | null;

  const isApproved = localStorage.getItem("isApproved") === "true";

  // 1. Check if user is logged in
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has the correct role
  if (!userRole || !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin-dash" replace />;
      case "realtor":
      case "leaser":
        return <Navigate to="/realtor-dash" replace />;
      case "hunter":
        return <Navigate to="/hunter-dash" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // 3. Check for approval if required
  if (requireApproval && !isApproved) {
    return <Navigate to="/waiting-approval" replace />;
  }

  // 4. Render children if they exist, otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
