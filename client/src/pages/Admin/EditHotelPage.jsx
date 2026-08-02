import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import HotelBasicInfo from "../../components/admin/hotel/HotelBasicInfo";
import HotelPricing from "../../components/admin/hotel/HotelPricing";
import HotelAmenities from "../../components/admin/hotel/HotelAmenities";
import HotelImages from "../../components/admin/hotel/HotelImages";
import HotelSettings from "../../components/admin/hotel/HotelSettings";
import HotelSubmit from "../../components/admin/hotel/HotelSubmit";

const EditHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [hotel, setHotel] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    pricePerNight: "",
    originalPrice: "",
    tax: "",
    availableRooms: "",
    maxGuests: "",
    starRating: 5,
    checkIn: "12:00",
    checkOut: "11:00",
    amenities: [],
    images: [],
    thumbnail: "",
    featured: false,
    popular: false,
    luxury: false,
    verified: true,
    status: "active",
    seoTitle: "",
    seoDescription: "",
  });

  // Helper to safely extract string URLs from strings, objects, Files, or FileLists
  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img instanceof File || img instanceof Blob) {
      return URL.createObjectURL(img);
    }
    return img.url || img.secure_url || img.preview || "";
  };

  //---------------------------------------
  // Fetch Hotel
  //---------------------------------------
  const fetchHotel = async () => {
    try {
      setFetchLoading(true);

      const { data } = await api.get(`/hotels/${id}`);
      const hotelData = data.hotel || data;

      setHotel({
        ...hotelData,
        images: Array.isArray(hotelData.images) ? hotelData.images : [],
        thumbnail: getImageUrl(hotelData.thumbnail) || getImageUrl(hotelData.images?.[0]),
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Hotel not found"
      );
      navigate("/admin/hotels");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchHotel();
  }, [id]);

  //---------------------------------------
  // Handle Input Change
  //---------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHotel((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //---------------------------------------
  // Amenities
  //---------------------------------------
  const handleAmenity = (amenity) => {
    setHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  //---------------------------------------
  // Slug Generator
  //---------------------------------------
  const generateSlug = (value) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

    setHotel((prev) => ({
      ...prev,
      name: value,
      slug,
    }));
  };

  //---------------------------------------
  // Images (Hardened for Files, FileLists, and Arrays)
  //---------------------------------------
  const setImages = (newImages) => {
    setHotel((prev) => {
      let resolved = typeof newImages === "function" ? newImages(prev.images) : newImages;

      if (resolved instanceof FileList) {
        resolved = Array.from(resolved);
      }

      const resolvedImages = Array.isArray(resolved)
        ? resolved
        : [resolved].filter(Boolean);

      const firstUrl = resolvedImages.length > 0 ? getImageUrl(resolvedImages[0]) : "";

      return {
        ...prev,
        images: resolvedImages,
        thumbnail: prev.thumbnail || firstUrl,
      };
    });
  };

  //---------------------------------------
  // Remove Image
  //---------------------------------------
  const removeImage = (index) => {
    setHotel((prev) => {
      const updatedImages = (prev.images || []).filter((_, i) => i !== index);
      const removedUrl = getImageUrl(prev.images[index]);

      let newThumbnail = prev.thumbnail;
      if (updatedImages.length === 0) {
        newThumbnail = "";
      } else if (prev.thumbnail === removedUrl) {
        newThumbnail = getImageUrl(updatedImages[0]);
      }

      return {
        ...prev,
        images: updatedImages,
        thumbnail: newThumbnail,
      };
    });
  };

  //---------------------------------------
  // Thumbnail
  //---------------------------------------
  const setThumbnail = (index) => {
    const url = getImageUrl(hotel.images[index]);
    setHotel((prev) => ({
      ...prev,
      thumbnail: url,
    }));
  };

  //---------------------------------------
  // Update Hotel
  //---------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/hotels/${id}`, hotel);

      toast.success("Hotel updated successfully");
      navigate("/admin/hotels");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update hotel"
      );
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------------
  // Loading State
  //---------------------------------------
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-5 text-slate-500 dark:text-slate-400">
            Loading Hotel...
          </p>
        </div>
      </div>
    );
  }

  //---------------------------------------
  // JSX
  //---------------------------------------
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Edit Hotel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Update hotel information.
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-8">
        <HotelBasicInfo
          hotel={hotel}
          handleChange={handleChange}
          generateSlug={generateSlug}
        />

        <HotelPricing hotel={hotel} handleChange={handleChange} />

        <HotelAmenities
          hotel={hotel}
          handleAmenity={handleAmenity}
        />

        <HotelImages
          hotel={hotel}
          setImages={setImages}
          removeImage={removeImage}
          setThumbnail={setThumbnail}
        />

        <HotelSettings hotel={hotel} handleChange={handleChange} />

        <HotelSubmit loading={loading} isEdit={true} />
      </form>
    </div>
  );
};

export default EditHotelPage;