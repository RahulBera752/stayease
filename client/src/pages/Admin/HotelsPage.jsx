import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Hotel, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

import HotelTable from "../../components/admin/hotel/HotelTable";
import HotelFilters from "../../components/admin/hotel/HotelFilters";
import DeleteHotelModal from "../../components/admin/hotel/DeleteHotelModal";

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    status: "",
    starRating: "",
    sort: "-createdAt",
  });

  const [page, setPage] = useState(1);
  const hotelsPerPage = 10;

  //-----------------------------------------
  // Fetch Hotels
  //-----------------------------------------
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/hotels");
      setHotels(data.hotels || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Unable to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  //-----------------------------------------
  // Delete Modal & Actions
  //-----------------------------------------
  const openDeleteModal = (hotel) => {
    setSelectedHotel(hotel);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setSelectedHotel(null);
  };

  const deleteHotel = async () => {
    if (!selectedHotel) return;

    try {
      setDeleteLoading(true);
      await api.delete(`/hotels/${selectedHotel._id}`);
      toast.success("Hotel deleted successfully");

      setHotels((prev) => prev.filter((item) => item._id !== selectedHotel._id));
      closeDeleteModal();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete hotel");
    } finally {
      setDeleteLoading(false);
    }
  };

  //-----------------------------------------
  // Reset Filters
  //-----------------------------------------
  const resetFilters = () => {
    setFilters({
      keyword: "",
      city: "",
      status: "",
      starRating: "",
      sort: "-createdAt",
    });
    setPage(1);
  };

  //-----------------------------------------
  // Search + Filter + Sort
  //-----------------------------------------
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // Keyword Search
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        (hotel) =>
          hotel.name?.toLowerCase().includes(keyword) ||
          hotel.city?.toLowerCase().includes(keyword) ||
          hotel.country?.toLowerCase().includes(keyword)
      );
    }

    // City Filter
    if (filters.city.trim()) {
      result = result.filter((hotel) =>
        hotel.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Status Filter
    if (filters.status) {
      result = result.filter((hotel) => hotel.status === filters.status);
    }

    // Star Rating Filter
    if (filters.starRating) {
      result = result.filter(
        (hotel) => Number(hotel.starRating) === Number(filters.starRating)
      );
    }

    // Sorting
    switch (filters.sort) {
      case "pricePerNight":
        result.sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
        break;
      case "-pricePerNight":
        result.sort((a, b) => Number(b.pricePerNight) - Number(a.pricePerNight));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "-starRating":
        result.sort((a, b) => Number(b.starRating) - Number(a.starRating));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return result;
  }, [hotels, filters]);

  //-----------------------------------------
  // Pagination
  //-----------------------------------------
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage) || 1;

  const currentHotels = useMemo(() => {
    const start = (page - 1) * hotelsPerPage;
    return filteredHotels.slice(start, start + hotelsPerPage);
  }, [filteredHotels, page, hotelsPerPage]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const refreshHotels = () => {
    fetchHotels();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 min-h-screen">
      {/* ----------------- Header Section ----------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Hotel size={34} className="text-primary" />
            <div>
              {/* Explicit visible heading text */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Hotel Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage all hotels from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={refreshHotels}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/admin/hotels/add"
            className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition font-semibold shadow-md"
          >
            <Plus size={18} />
            Add Hotel
          </Link>
        </div>
      </div>

      {/* ----------------- Statistics Section ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Hotels
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {hotels.length}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Active
          </p>
          <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {hotels.filter((hotel) => hotel.status === "active").length}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Featured
          </p>
          <h2 className="text-3xl font-bold text-amber-500 dark:text-amber-400 mt-2">
            {hotels.filter((hotel) => hotel.featured).length}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Luxury Hotels
          </p>
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {hotels.filter((hotel) => hotel.luxury).length}
          </h2>
        </div>
      </div>

      {/* ----------------- Filters Subcomponent ----------------- */}
      <HotelFilters
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      />

      {/* ----------------- Table Subcomponent ----------------- */}
      <HotelTable
        hotels={currentHotels}
        loading={loading}
        onDelete={openDeleteModal}
      />

      {/* ----------------- Pagination ----------------- */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 pt-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Showing
            <span className="font-semibold text-slate-900 dark:text-white mx-1">
              {filteredHotels.length === 0 ? 0 : (page - 1) * hotelsPerPage + 1}
            </span>
            -
            <span className="font-semibold text-slate-900 dark:text-white mx-1">
              {Math.min(page * hotelsPerPage, filteredHotels.length)}
            </span>
            of
            <span className="font-semibold text-slate-900 dark:text-white mx-1">
              {filteredHotels.length}
            </span>
            hotels
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={previousPage}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition shadow-sm"
            >
              Previous
            </button>

            <div className="flex items-center px-5 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-sm">
              {page} / {totalPages}
            </div>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ----------------- Delete Modal ----------------- */}
      <DeleteHotelModal
        open={deleteOpen}
        hotel={selectedHotel}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onDelete={deleteHotel}
      />
    </div>
  );
};

export default HotelsPage;