import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // 2. Unauthenticated check
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Extract Role safely across different backend response structures
  const rawRole =
    user?.role ||
    user?.user?.role ||
    user?.data?.role ||
    user?.userInfo?.role ||
    "";

  // Normalize string: lowercase & strip non-alphanumeric characters
  const normalize = (str) =>
    (str || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");

  const userRole = normalize(rawRole);

  // 4. Permission Validation
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some(
      (role) => normalize(role) === userRole
    );

    // DEBUG LOG: Open Browser Console (F12) to see this!
    console.log("🔍 [ProtectedRoute Check]:", {
      path: location.pathname,
      userObject: user,
      detectedRawRole: rawRole,
      normalizedUserRole: userRole,
      allowedRoles: allowedRoles.map(normalize),
      isAllowed: hasPermission,
    });

    if (!hasPermission) {
      console.warn(
        `⛔ Access Denied for role "${rawRole}" on path "${location.pathname}"`
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;