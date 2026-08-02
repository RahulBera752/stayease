import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  Wifi,
  Waves,
  Sparkles,
  Coffee,
  Dumbbell,
  Car,
  Wine,
  Mountain,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";

const amenityIconMap = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  breakfast: Coffee,
  gym: Dumbbell,
  parking: Car,
  bar: Wine,
  beach: Waves,
  "mountain-view": Mountain,
  "lake-view": Waves,
  fireplace: Flame,
  heritage: Sparkles,
};

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";

const HotelCard = ({ hotel, index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Unique identifier
  const hotelId = hotel._id || hotel.id || hotel.slug;

  // Resolve image URL from any supported structure (Cloudinary, local uploads, or direct URLs)
  const getImage = () => {
    let rawPath = "";

    // 1. Extract raw image string/object from all possible properties
    if (typeof hotel?.thumbnail === "string" && hotel.thumbnail.trim()) {
      rawPath = hotel.thumbnail;
    } else if (hotel?.thumbnail?.url) {
      rawPath = hotel.thumbnail.url;
    } else if (typeof hotel?.image === "string" && hotel.image.trim()) {
      rawPath = hotel.image;
    } else if (hotel?.image?.url) {
      rawPath = hotel.image.url;
    } else if (typeof hotel?.coverImage === "string" && hotel.coverImage.trim()) {
      rawPath = hotel.coverImage;
    } else if (hotel?.coverImage?.url) {
      rawPath = hotel.coverImage.url;
    } else if (hotel?.images?.length) {
      const first = hotel.images[0];
      rawPath = typeof first === "string" ? first : first?.url || first?.secure_url || "";
    } else if (hotel?.photos?.length) {
      const first = hotel.photos[0];
      rawPath = typeof first === "string" ? first : first?.url || "";
    }

    if (!rawPath) {
      return "https://placehold.co/600x400?text=Hotel";
    }

    // 2. Format local server uploads path (e.g., uploads\image.png -> http://localhost:5000/uploads/image.png)
    const normalizedPath = rawPath.replace(/\\/g, "/");

    if (
      normalizedPath.startsWith("http://") ||
      normalizedPath.startsWith("https://") ||
      normalizedPath.startsWith("data:")
    ) {
      return normalizedPath;
    }

    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.slice(1)
      : normalizedPath;

    return `${BACKEND_BASE_URL}/${cleanPath}`;
  };

  const image = getImage();
  const price = hotel.pricePerNight ?? hotel.price ?? 0;
  const originalPrice = hotel.originalPrice ?? price;

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const rating = hotel.averageRating || hotel.starRating || 5;
  const reviews = hotel.totalReviews || 0;

  // Sync favorite state with localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("stayease_wishlist") || "[]"
      );
      const exists = savedWishlist.some(
        (item) => String(item._id || item.id || item.slug) === String(hotelId)
      );
      setIsFavorite(exists);
    } catch (err) {
      console.error("Error reading wishlist:", err);
    }
  }, [hotelId]);

  // Toggle Favorite
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let currentWishlist = [];
    try {
      currentWishlist = JSON.parse(
        localStorage.getItem("stayease_wishlist") || "[]"
      );
    } catch (err) {
      currentWishlist = [];
    }

    let updatedWishlist = [];

    if (isFavorite) {
      updatedWishlist = currentWishlist.filter(
        (item) => String(item._id || item.id || item.slug) !== String(hotelId)
      );
      toast.success("Removed from wishlist");
      setIsFavorite(false);
    } else {
      const hotelToAdd = {
        id: hotelId,
        _id: hotel._id || hotelId,
        slug: hotel.slug || hotelId,
        name: hotel.name,
        location: hotel.city ? `${hotel.city}, ${hotel.country || ""}` : "India",
        price: price,
        rating: rating,
        image: image,
      };

      updatedWishlist = [...currentWishlist, hotelToAdd];
      toast.success("Added to wishlist");
      setIsFavorite(true);
    }

    localStorage.setItem("stayease_wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
    >
      <Link
        to={`/hotels/${hotel.slug}`}
        className="card-premium group block h-full"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={image}
            alt={hotel.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400?text=Hotel";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {(hotel.isFeatured || hotel.featured) && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
              Featured
            </span>
          )}

          <button
            type="button"
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow hover:scale-105 transition-transform"
          >
            <Heart
              size={17}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
          </button>

          {discount > 0 && (
            <span className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
              {discount}% OFF
            </span>
          )}

          <div className="absolute bottom-3 right-3 bg-white rounded-lg px-2 py-1 flex items-center gap-1 shadow">
            <Star
              size={13}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-xs font-semibold">
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900">
            {hotel.name}
          </h3>

          <p className="text-gray-500 mt-1">
            {hotel.city}, {hotel.country}
          </p>

          <div className="flex gap-3 mt-4">
            {(hotel.amenities || [])
              .slice(0, 4)
              .map((item) => {
                const Icon =
                  amenityIconMap[item] || Sparkles;

                return (
                  <div
                    key={item}
                    className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <Icon
                      size={15}
                      className="text-indigo-600"
                    />
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between items-end mt-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{price}
                </span>

                {originalPrice > price && (
                  <span className="line-through text-gray-400">
                    ₹{originalPrice}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500">
                per night • {reviews} reviews
              </p>
            </div>

            <span className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold">
              Book Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HotelCard;