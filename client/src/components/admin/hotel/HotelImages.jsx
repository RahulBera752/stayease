import { ImagePlus, Star, Trash2 } from "lucide-react";
import ImageUploader from "../ImageUploader";

const HotelImages = ({
  hotel,
  setImages,
  removeImage,
  setThumbnail,
}) => {
  const imagesList = Array.isArray(hotel?.images) ? hotel.images : [];

  // Helper to safely extract string URLs from strings, objects, Files, or FileLists
  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img instanceof File || img instanceof Blob) {
      return URL.createObjectURL(img);
    }
    return img.url || img.secure_url || img.preview || "";
  };

  const isThumbnailMatch = (img) => {
    const currentUrl = getImageUrl(img);
    const thumb = hotel?.thumbnail;
    
    if (!thumb) return false;
    if (typeof thumb === "string") {
      return thumb === currentUrl;
    }
    return thumb.url === currentUrl || thumb.secure_url === currentUrl;
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Hotel Images
          </h2>
          <p className="text-gray-500 mt-1">
            Upload hotel gallery images.
          </p>
        </div>

        <ImagePlus
          size={34}
          className="text-primary"
        />
      </div>

      {/* Upload */}
      <ImageUploader
        images={imagesList}
        setImages={setImages}
      />

      {/* Gallery */}
      {imagesList.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-5">
            Gallery Images
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {imagesList.map((image, index) => {
              const imageUrl = getImageUrl(image);
              const isThumb = isThumbnailMatch(image);

              return (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden border group bg-gray-50"
                >
                  <img
                    src={imageUrl}
                    alt={`Hotel ${index + 1}`}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setThumbnail(index)}
                        className={`flex-1 py-2 rounded-xl flex justify-center items-center gap-2 transition ${
                          isThumb
                            ? "bg-yellow-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Star size={16} />
                        {isThumb ? "Thumbnail" : "Set Thumbnail"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-12 rounded-xl bg-red-500 text-white flex justify-center items-center hover:bg-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Badge */}
                  {isThumb && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      Thumbnail
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelImages;