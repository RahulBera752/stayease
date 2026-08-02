import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Star,
  BadgeCheck,
  Flame,
  Crown,
  ImageOff,
} from "lucide-react";

const HotelTable = ({
  hotels = [],
  loading = false,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-20 text-center">
        <div className="text-xl font-semibold">Loading Hotels...</div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-20 text-center">
        <h2 className="text-2xl font-bold">No Hotels Found</h2>
        <p className="text-gray-500 mt-3">Add your first hotel.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Hotel</th>
              <th className="p-4">City</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4">Badges</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => {
              const hotelId = hotel._id || hotel.id;
              
              // 1. Prioritize slug for public view link, fallback to ID
              const publicIdentifier = hotel.slug || hotelId;

              // Check image properties from the backend
              const rawProp =
                hotel.photo ||
                hotel.image ||
                hotel.thumbnail ||
                hotel.imageUrl ||
                (Array.isArray(hotel.photos) && hotel.photos[0]) ||
                "";

              const imageStr = typeof rawProp === "string" ? rawProp.trim() : "";

              const BACKEND_URL = "http://localhost:5000";
              let imageUrl = "";
              if (imageStr) {
                imageUrl = imageStr.startsWith("http")
                  ? imageStr
                  : `${BACKEND_URL}${imageStr.startsWith("/") ? "" : "/"}${imageStr}`;
              }

              return (
                <tr
                  key={hotelId}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={hotel.name || "Hotel image"}
                          className="w-20 h-16 rounded-xl object-cover border bg-slate-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`w-20 h-16 rounded-xl border bg-slate-100 flex-col items-center justify-center text-slate-400 text-xs ${
                          imageUrl ? "hidden" : "flex"
                        }`}
                      >
                        <ImageOff size={20} />
                        <span className="mt-1">No Image</span>
                      </div>

                      <div>
                        <h3 className="font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">{hotel.country}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">{hotel.city}</td>

                  <td className="text-center font-semibold text-primary">
                    ₹{hotel.pricePerNight}
                  </td>

                  <td>
                    <div className="flex justify-center items-center gap-1">
                      <Star size={16} fill="#facc15" color="#facc15" />
                      {hotel.starRating}
                    </div>
                  </td>

                  <td className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        hotel.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hotel.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      {hotel.featured && <Star className="text-yellow-500" size={18} />}
                      {hotel.popular && <Flame className="text-red-500" size={18} />}
                      {hotel.luxury && <Crown className="text-purple-600" size={18} />}
                      {hotel.verified && <BadgeCheck className="text-green-600" size={18} />}
                    </div>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      {/* Fixed Eye Button Link */}
                      <Link
                        to={`/hotels/${publicIdentifier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-blue-100 flex justify-center items-center hover:bg-blue-200 transition"
                        title="View Hotel Details (Opens in new tab)"
                      >
                        <Eye size={18} className="text-blue-600" />
                      </Link>

                      <Link
                        to={`/admin/hotels/edit/${hotelId}`}
                        className="w-10 h-10 rounded-lg bg-yellow-100 flex justify-center items-center hover:bg-yellow-200 transition"
                        title="Edit Hotel"
                      >
                        <Pencil size={18} className="text-yellow-700" />
                      </Link>

                      <button
                        onClick={() => onDelete(hotel)}
                        className="w-10 h-10 rounded-lg bg-red-100 flex justify-center items-center hover:bg-red-200 transition"
                        title="Delete Hotel"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelTable;