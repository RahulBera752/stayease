import { motion } from "framer-motion";
import { MapPin, Star, BadgeCheck, Hotel, Globe } from "lucide-react";

const HotelInfo = ({ hotel }) => {
  if (!hotel) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl"
    >
      {/* Hotel Header & Pricing */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {hotel.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-400">
            {/* Address */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>
                {[hotel.address, hotel.city, hotel.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1.5">
              <Star size={18} fill="#FACC15" className="text-yellow-400" />
              <span className="font-semibold text-white">
                {hotel.averageRating || hotel.starRating || 5}
              </span>
              <span>
                ({hotel.totalReviews ?? 0} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="lg:text-right">
          <p className="text-3xl md:text-4xl font-bold text-primary">
            ₹{hotel.pricePerNight?.toLocaleString("en-IN") || 0}
          </p>
          <span className="text-slate-400 text-sm">Per Night</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mt-6">
        {(hotel.featured || hotel.red) && (
          <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-sm font-medium">
            ⭐ Featured
          </span>
        )}
        {hotel.popular && (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-sm font-medium">
            🔥 Popular
          </span>
        )}
        {hotel.luxury && (
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-full text-sm font-medium">
            👑 Luxury
          </span>
        )}
        {hotel.verified && (
          <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-sm font-medium">
            <BadgeCheck size={16} /> Verified
          </span>
        )}
      </div>

      {/* About Section */}
      <div className="mt-8 border-t border-slate-800/80 pt-6">
        <h2 className="text-2xl font-semibold mb-3 text-white">
          About this Hotel
        </h2>
        <p className="text-slate-300 leading-relaxed">
          {hotel.description || "No description provided for this hotel."}
        </p>
      </div>

      {/* Hotel Specs */}
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <Hotel size={28} className="text-primary shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Available Rooms</h4>
            <p className="text-slate-400 text-sm">
              {hotel.availableRooms ?? 1} Rooms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <Globe size={28} className="text-primary shrink-0" />
          <div>
            <h4 className="font-semibold text-white">Maximum Guests</h4>
            <p className="text-slate-400 text-sm">
              Up to {hotel.maxGuests ?? 2} Guests
            </p>
          </div>
        </div>
      </div>

      {/* Room Types */}
      {hotel.roomTypes?.length > 0 && (
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Available Room Types
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {hotel.roomTypes.map((room, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium"
              >
                {room}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HotelInfo;