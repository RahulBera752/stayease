import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Search,
  Star,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const OwnerHotelsPage = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  //-----------------------------------------
  // Fetch Owner Properties
  //-----------------------------------------
  const fetchMyHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hotels/my-hotels");

      const data = response.data;
      if (data?.success || Array.isArray(data)) {
        setHotels(data.hotels || data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHotels();
  }, []);

  //-----------------------------------------
  // Safe Filtering
  //-----------------------------------------
  const filteredHotels = hotels.filter((h) => {
    const term = searchTerm.toLowerCase().trim();
    const nameMatch = (h.name || "").toLowerCase().includes(term);
    const cityMatch = (h.city || "").toLowerCase().includes(term);
    return nameMatch || cityMatch;
  });

  // Calculate Average Rating across properties
  const averageRating =
    hotels.length > 0
      ? (
          hotels.reduce(
            (acc, curr) => acc + (curr.averageRating || curr.starRating || 0),
            0
          ) / hotels.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Properties
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {user?.name || "Hotel Partner"}
            </span>
            ! Manage your listed hotels here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMyHotels}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/owner/hotels/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            Add New Hotel
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Listed
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {hotels.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Listed
            </p>
            <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {hotels.filter((h) => h.status === "active").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Average Rating
            </p>
            <h3 className="text-3xl font-bold text-amber-500 dark:text-amber-400 mt-1">
              {averageRating}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400 flex items-center justify-center">
            <Star size={24} />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search my hotels by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={24} />
            <p>Loading your properties...</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              No hotels found
            </p>
            <p className="text-sm">
              You haven't added any hotels yet or no hotels match your search.
            </p>
            <Link
              to="/owner/hotels/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm mt-2 font-medium hover:bg-indigo-700 transition"
            >
              <Plus size={16} /> Add First Hotel
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Hotel</th>
                  <th className="py-4 px-6">City</th>
                  <th className="py-4 px-6">Price / Night</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm text-slate-700 dark:text-slate-300">
                {filteredHotels.map((hotel) => {
                  const hotelId = hotel._id || hotel.id;

                  return (
                    <tr
                      key={hotelId}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              hotel.thumbnail?.url ||
                              (typeof hotel.thumbnail === "string" ? hotel.thumbnail : null) ||
                              hotel.images?.[0]?.url ||
                              "https://via.placeholder.com/60?text=No+Image"
                            }
                            alt={hotel.name || "Hotel Thumbnail"}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                          />
                          <div>
                            <p className="font-semibold">{hotel.name}</p>
                            <p className="text-xs text-slate-400">
                              {hotel.country || "India"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{hotel.city || "N/A"}</td>
                      <td className="py-4 px-6 font-semibold text-indigo-600 dark:text-indigo-400">
                        ₹{hotel.pricePerNight ?? 0}
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                          ★ {hotel.averageRating || hotel.starRating || 5}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            hotel.status === "active"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {hotel.status || "active"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/hotels/${hotel.slug || hotelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition"
                            title="View Live"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/owner/hotels/edit/${hotelId}`}
                            className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition"
                            title="Edit Hotel"
                          >
                            <Edit size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHotelsPage;