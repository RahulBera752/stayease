import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  Hotel,
  Users,
  CalendarDays,
  RefreshCw,
  TrendingUp,
  Search,
  ShieldCheck,
  Building2,
  Award,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import toast from "react-hot-toast";
import api from "../../services/api";
import StatCard from "../../components/admin/StatCard";

const COLORS = ["#22C55E", "#F59E0B", "#EF4444", "#4F46E5", "#8B5CF6"];

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  //-----------------------------------------
  // State
  //-----------------------------------------
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    featuredHotels: 0,
    luxuryHotels: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [recentHotels, setRecentHotels] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [hotelsByCity, setHotelsByCity] = useState([]);
  const [hotelsByStatus, setHotelsByStatus] = useState([]);
  const [topHotels, setTopHotels] = useState([]);

  //-----------------------------------------
  // Fetch Dashboard API Data
  //-----------------------------------------
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/dashboard");

      setStats({
        totalHotels: data?.stats?.totalHotels || 0,
        activeHotels: data?.stats?.activeHotels || 0,
        featuredHotels: data?.stats?.featuredHotels || 0,
        luxuryHotels: data?.stats?.luxuryHotels || 0,
        totalUsers: data?.stats?.totalUsers || 0,
        totalAdmins: data?.stats?.totalAdmins || 0,
        totalBookings: data?.stats?.totalBookings || 0,
        confirmedBookings: data?.stats?.confirmedBookings || 0,
        totalRevenue: data?.stats?.totalRevenue || 0,
      });

      setRevenueData(data?.revenueData || []);
      setRecentHotels(data?.recentHotels || []);
      setRecentUsers(data?.recentUsers || []);
      setTopHotels(data?.topHotels || []);
      
      setHotelsByCity(
        (data?.hotelsByCity || []).map((item) => ({
          name: item._id || "Unknown",
          value: item.count,
        }))
      );

      setHotelsByStatus(
        (data?.hotelsByStatus || []).map((item) => ({
          name: item._id || "Unknown",
          value: item.count,
        }))
      );

      // Filter out empty or null statuses like "Unknown" and capitalize properly
      setBookingStatus(
        (data?.bookingStatus || [])
          .filter((item) => item._id && item._id.toLowerCase() !== "unknown")
          .map((item) => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count,
          }))
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  //-----------------------------------------
  // Currency Formatter
  //-----------------------------------------
  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //-----------------------------------------
  // Search Filtering Logic
  //-----------------------------------------
  const filteredHotels = recentHotels.filter((hotel) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      hotel.name?.toLowerCase().includes(query) ||
      hotel.city?.toLowerCase().includes(query) ||
      hotel.status?.toLowerCase().includes(query)
    );
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/admin/hotels?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  //-----------------------------------------
  // Loading Screen
  //-----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-5 text-gray-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Section with Title, Search Bar & Refresh */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's your platform summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotels, cities..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </form>

          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md text-sm font-medium cursor-pointer"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          bg="bg-green-500"
        />
        <StatCard
          title="Total Bookings"
          value={`${stats.confirmedBookings} / ${stats.totalBookings}`}
          icon={CalendarDays}
          bg="bg-orange-500"
        />
        <StatCard
          title="Total Hotels"
          value={stats.totalHotels}
          icon={Hotel}
          bg="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          bg="bg-purple-500"
        />
      </div>

      {/* Revenue Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-indigo-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Revenue Overview</h2>
            <p className="text-gray-500 text-sm">Monthly platform revenue growth</p>
          </div>
        </div>

        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ bottom: 25, right: 10 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                interval={0} 
                angle={-25} 
                textAnchor="end" 
                height={50}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top 5 Performing Hotels Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-amber-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Top 5 Performing Hotels</h2>
            <p className="text-gray-500 text-sm">Hotels with the highest confirmed bookings</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-3">Rank</th>
                <th className="py-3">Hotel Name</th>
                <th className="py-3">City</th>
                <th className="py-3 text-center">Total Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topHotels.map((hotel, index) => (
                <tr key={hotel._id || index} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-bold text-gray-700 text-sm">
                    #{index + 1}
                  </td>
                  <td className="py-4 font-semibold text-gray-800 text-sm">
                    {hotel.name}
                  </td>
                  <td className="text-sm text-gray-600">{hotel.city}</td>
                  <td className="text-center font-bold text-indigo-600">
                    {hotel.bookingCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topHotels.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No top performing hotels found.
            </div>
          )}
        </div>
      </motion.div>

      {/* Hotel Status & City Distribution Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Status Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Status</h2>

          <div className="w-full h-[280px]">
            {bookingStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatus}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {bookingStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No booking records found
              </div>
            )}
          </div>

          <div className="space-y-3 mt-4">
            {bookingStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 capitalize">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hotels By Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Hotels by Status</h2>

          <div className="w-full h-[280px]">
            {hotelsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hotelsByStatus}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {hotelsByStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No status data available
              </div>
            )}
          </div>

          <div className="space-y-3 mt-4">
            {hotelsByStatus.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 capitalize">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hotels by City & Recent Hotels/Users */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Hotels by City Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Hotels by City</h2>

          <div className="w-full h-[280px]">
            {hotelsByCity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hotelsByCity}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {hotelsByCity.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No city data available
              </div>
            )}
          </div>

          <div className="space-y-3 mt-4 max-h-28 overflow-y-auto">
            {hotelsByCity.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 capitalize">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Hotels Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Hotels</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3">Hotel Name</th>
                  <th className="py-3">City</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 font-semibold text-gray-800 text-sm">
                      {hotel.name}
                    </td>
                    <td className="text-sm text-gray-600">{hotel.city}</td>
                    <td className="text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-green-100 text-green-700">
                        {hotel.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredHotels.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No recent hotels found.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3 text-center">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-semibold text-gray-800 text-sm">
                    {user.name}
                  </td>
                  <td className="text-sm text-gray-600">{user.email}</td>
                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsers.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No recent users found.
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="w-full bg-indigo-600 text-white font-medium rounded-xl py-3.5 hover:bg-indigo-700 transition shadow-md cursor-pointer"
            onClick={() => navigate("/admin/hotels/add")}
          >
            + Add New Hotel
          </button>
          <button
            className="w-full border border-gray-200 text-gray-700 font-medium rounded-xl py-3.5 hover:bg-slate-50 transition cursor-pointer"
            onClick={() => navigate("/admin/hotels")}
          >
            Manage Hotels
          </button>
          <button
            className="w-full border border-gray-200 text-gray-700 font-medium rounded-xl py-3.5 hover:bg-slate-50 transition cursor-pointer"
            onClick={() => navigate("/admin/bookings")}
          >
            View Bookings
          </button>
          <button
            className="w-full border border-gray-200 text-gray-700 font-medium rounded-xl py-3.5 hover:bg-slate-50 transition cursor-pointer"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;