import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const location = useLocation();

  // Read whatever auth state exists (safe even if auth slice is missing)
  const authState = useSelector((state) => state.auth || {});

  const user =
    authState.userInfo ||
    authState.user ||
    authState.currentUser ||
    null;

  /*
   * DEVELOPMENT MODE
   * ----------------
   * Allow access to the admin panel even if the user
   * isn't logged in or doesn't have an admin role.
   *
   * Remove this block when your authentication
   * and role management are complete.
   */

  return children;

  /*
  // ---------- Production Version ----------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
  */
};

export default AdminRoute;