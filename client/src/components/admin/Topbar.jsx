import { useState } from "react";
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Menu,
} from "lucide-react";

const Topbar = () => {
  const [search, setSearch] = useState("");

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button className="lg:hidden">
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Welcome back, Admin 👋
          </p>
        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80">

          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search hotels, bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none ml-3 w-full text-sm"
          />

        </div>

        {/* Notification */}

        <button className="relative w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">

          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        {/* Settings */}

        <button className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <Settings size={20} />
        </button>

        {/* Admin Profile */}

        <button className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2 hover:bg-gray-200 transition">

          <img
            src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />

          <div className="hidden md:block text-left">

            <p className="text-sm font-semibold">
              Administrator
            </p>

            <p className="text-xs text-gray-500">
              Super Admin
            </p>

          </div>

          <ChevronDown size={16} />

        </button>

      </div>

    </header>
  );
};

export default Topbar;