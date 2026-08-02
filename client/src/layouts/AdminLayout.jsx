import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-black">

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Topbar */}
        <header
          className={`fixed top-0 right-0 h-20 bg-white border-b border-gray-200 shadow-sm z-30 transition-all duration-300 ${
            collapsed ? "lg:left-20" : "lg:left-72"
          }`}
        >
          <Topbar />
        </header>

        {/* Page Content */}
        <main className="pt-24 px-6 pb-6 min-h-screen bg-gray-100 text-black overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;