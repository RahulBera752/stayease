import { useState, useEffect } from "react";

const HotelGallery = ({ hotel }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  // Robustly extract and flatten all possible image formats from the database
  const getImagesList = () => {
    let list = [];

    // 1. Check if hotel.images is an array or a single string
    if (hotel?.images) {
      if (Array.isArray(hotel.images)) {
        list = hotel.images;
      } else if (typeof hotel.images === "string") {
        list = [hotel.images];
      }
    }

    // 2. Also check individual/singular image fields
    if (hotel?.thumbnail && !list.includes(hotel.thumbnail)) {
      list.unshift(hotel.thumbnail);
    }
    if (hotel?.image && !list.includes(hotel.image)) {
      list.unshift(hotel.image);
    }

    // 3. Normalize everything to string URLs
    const normalized = list
      .map((img) => {
        if (!img) return null;
        if (typeof img === "string") return img;
        return img.url || img.secure_url || null;
      })
      .filter(Boolean);

    // If empty after all checks, use fallback
    return normalized.length > 0 ? normalized : [fallbackImage];
  };

  const images = getImagesList();
  const [mainImage, setMainImage] = useState(images[0]);

  // Keep state synced if hotel updates
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [hotel]);

  return (
    <div className="space-y-4">
      {/* Main Large Image View */}
      <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl bg-slate-900 shadow-xl relative border border-slate-800">
        <img
          src={mainImage || fallbackImage}
          alt={hotel?.name || "Hotel"}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
      </div>

      {/* Thumbnail Selection Grid - Displays whenever there is 1 or more images */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => setMainImage(imgUrl)}
              className={`h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                mainImage === imgUrl
                  ? "border-primary scale-[1.02] shadow-lg shadow-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl || fallbackImage}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelGallery;