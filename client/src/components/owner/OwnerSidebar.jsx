import React from "react";
import { NavLink } from "react-router-dom";
import { Building2, Calendar, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const OwnerSidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: "My Hotels", path: "/owner/hotels", icon: Building2 },
    { name: "Add Hotel", path: "/owner/hotels/add", icon: PlusCircle },
    { name: "Bookings", path: "/owner/bookings", icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        {/* Header Branding */}
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold text-indigo-400">Owner Portal</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage properties & bookings
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm font-semibold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 w-full cursor-pointer"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default OwnerSidebar;