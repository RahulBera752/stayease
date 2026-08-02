import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Users,
  Star,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
  Hotel,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Hotels",
    path: "/admin/hotels",
    icon: Building2,
  },
  {
    title: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    title: "Reviews",
    path: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Coupons",
    path: "/admin/coupons",
    icon: TicketPercent,
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Safely extract and normalize user role string (handles "hotel_owner", "hotelOwner", "Admin", etc.)
  const rawRole = (user?.role || user?.user?.role || "hotelOwner")
    .toString()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  // Check if current user is an owner (matches "hotelowner", "owner", "hotel_owner")
  const isHotelOwner = rawRole.includes("owner");

  // Filter menu items: Hotel Owners see ONLY "Hotels" and "Reviews", Admins see ALL
  const visibleMenuItems = menuItems.filter((item) => {
    if (isHotelOwner) {
      return item.title === "Hotels" || item.title === "Reviews";
    }
    return true; // Admin sees everything
  });

  const handleLogout = async () => {
    toast.success("Logged out successfully");

    if (logout) {
      await logout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
            <Hotel size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">StayEase</h1>
            <p className="text-xs text-gray-500 capitalize">
              {isHotelOwner ? "Hotel Owner Panel" : "Admin Panel"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white shadow-lg"
                        : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t p-5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 text-white py-3 hover:bg-red-600 transition shadow-md shadow-red-500/20 active:scale-[0.98] cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;