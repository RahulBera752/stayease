import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import OwnerSidebar from "../components/owner/OwnerSidebar";
import { useAuth } from "../context/AuthContext";

const OwnerLayout = () => {
  const { user, loading } = useAuth();

  // Dark styled loading state to prevent flash of unstyled content
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading portal...</span>
        </div>
      </div>
    );
  }

  // Normalize user role check
  const role = (user?.role || user?.user?.role || "").toLowerCase();
  const isOwner = role.includes("owner");

  // Protect route: Redirect non-owners
  if (!user || !isOwner) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Dark Sidebar */}
      <OwnerSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;