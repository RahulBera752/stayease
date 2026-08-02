import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  Star,
  Wifi,
  Waves,
  Sparkles,
  ArrowRight,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

// Demo fallback ONLY initialized on the very first visit if localStorage is completely clean
const INITIAL_DEMO_WISHLIST = [
  {
    id: "1",
    slug: "luxury-resort-goa",
    name: "The Leela Palace",
    location: "Goa, India",
    price: 3000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    slug: "sea-view-digha",
    name: "Sea Shell Resort",
    location: "Digha, India",
    price: 1500,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
  },
];

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load wishlist cleanly from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("stayease_wishlist");

    if (savedWishlist !== null) {
      try {
        // Read exact array saved in localStorage (even if empty [])
        const parsed = JSON.parse(savedWishlist);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Error reading wishlist:", err);
        setWishlist([]);
      }
    } else {
      // First time loading the app: set demo data & store key
      setWishlist(INITIAL_DEMO_WISHLIST);
      localStorage.setItem("stayease_wishlist", JSON.stringify(INITIAL_DEMO_WISHLIST));
    }
    setIsLoading(false);
  }, []);

  // 2. Remove hotel logic with flexible ID matching
  const handleRemove = (idToRemove, hotelName) => {
    const updatedWishlist = wishlist.filter((item) => {
      // Support matching by id or slug
      const itemId = String(item.id || item._id || item.slug);
      const targetId = String(idToRemove);
      return itemId !== targetId;
    });

    // Update state & persist to localStorage immediately
    setWishlist(updatedWishlist);
    localStorage.setItem("stayease_wishlist", JSON.stringify(updatedWishlist));

    toast.success(`${hotelName || "Hotel"} removed from wishlist`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] pt-28 flex items-center justify-center text-slate-400">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              My Wishlist
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-semibold">
                {wishlist.length}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Your saved luxury stays and favorite destinations.
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors w-fit"
          >
            Explore More Hotels <ArrowRight size={16} />
          </Link>
        </div>

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlist.map((hotel) => {
                const hotelId = hotel.id || hotel._id || hotel.slug;

                return (
                  <motion.div
                    key={hotelId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="group relative bg-[#131b2e] border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex flex-col"
                  >
                    {/* Image Header */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                      <img
                        src={hotel.image || hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md">
                        Featured
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(hotelId, hotel.name)}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-all backdrop-blur-md shadow-lg cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Heart size={18} className="fill-rose-500 text-rose-500 hover:text-white hover:fill-white transition-colors" />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                            <Star size={14} className="fill-amber-400" />
                            <span>{hotel.rating || 4.8}</span>
                          </div>
                        </div>

                        <p className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                          <MapPin size={14} className="text-indigo-400" />
                          {hotel.location || hotel.city || "India"}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                          <span className="p-2 rounded-lg bg-slate-800/80 text-slate-300" title="Free WiFi">
                            <Wifi size={14} />
                          </span>
                          <span className="p-2 rounded-lg bg-slate-800/80 text-slate-300" title="Pool">
                            <Waves size={14} />
                          </span>
                          <span className="p-2 rounded-lg bg-slate-800/80 text-slate-300" title="Luxury Features">
                            <Sparkles size={14} />
                          </span>
                        </div>
                      </div>

                      {/* Footer / Price */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-white">₹{hotel.price}</span>
                          <span className="text-xs text-slate-400"> / night</span>
                        </div>

                        <button
                          onClick={() => navigate(`/hotels/${hotel.slug || hotelId}`)}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Wishlist View */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-[#131b2e]/50 border border-slate-800 rounded-2xl space-y-4"
          >
            <div className="inline-flex p-4 rounded-full bg-slate-800/80 text-slate-400">
              <Building size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-200">Your wishlist is empty</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't added any stays to your wishlist yet. Explore luxury hotels and tap the heart icon to save them.
            </p>
            <div className="pt-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg"
              >
                Browse Hotels
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;