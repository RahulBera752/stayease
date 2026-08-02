import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import HotelBasicInfo from "../../components/admin/hotel/HotelBasicInfo";
import HotelPricing from "../../components/admin/hotel/HotelPricing";
import HotelAmenities from "../../components/admin/hotel/HotelAmenities";
import HotelImages from "../../components/admin/hotel/HotelImages";
import HotelSettings from "../../components/admin/hotel/HotelSettings";
import HotelSubmit from "../../components/admin/hotel/HotelSubmit";

const OwnerEditHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  //-----------------------------------------
  // Hotel Form Initial State
  //-----------------------------------------
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
    roomTypes: [],
    starRating: 5,
    averageRating: 5,
    totalReviews: 0,
    checkIn: "12:00",
    checkOut: "11:00",
    amenities: [],
    images: [],
    thumbnail: null,
    featured: false,
    popular: false,
    luxury: false,
    verified: true,
    status: "active",
    seoTitle: "",
    seoDescription: "",
  });

  const amenitiesList = [
    "wifi",
    "pool",
    "spa",
    "gym",
    "parking",
    "restaurant",
    "bar",
    "breakfast",
    "room-service",
    "airport-shuttle",
    "laundry",
    "pet-friendly",
    "conference-room",
    "beach",
    "mountain-view",
    "lake-view",
  ];

  //-----------------------------------------
  // Fetch Existing Hotel Data
  //-----------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchHotel = async () => {
      try {
        setFetching(true);

        const { data } = await api.get(`/hotels/${id}`);
        const fetchedHotel = data?.hotel || data?.data || data;

        if (!fetchedHotel) {
          throw new Error("No hotel data returned from backend");
        }

        if (!isMounted) return;

        setHotel((prev) => ({
          ...prev,
          ...fetchedHotel,
          name: fetchedHotel.name || "",
          slug: fetchedHotel.slug || "",
          description: fetchedHotel.description || "",
          address: fetchedHotel.address || "",
          city: fetchedHotel.city || "",
          country: fetchedHotel.country || "",
          pricePerNight: fetchedHotel.pricePerNight ?? "",
          originalPrice: fetchedHotel.originalPrice ?? "",
          tax: fetchedHotel.tax ?? "",
          availableRooms: fetchedHotel.availableRooms ?? "",
          maxGuests: fetchedHotel.maxGuests ?? "",
          checkIn: fetchedHotel.checkIn || fetchedHotel.checkInTime || "12:00",
          checkOut: fetchedHotel.checkOut || fetchedHotel.checkOutTime || "11:00",
          latitude:
            fetchedHotel.latitude ??
            fetchedHotel.location?.latitude ??
            fetchedHotel.location?.coordinates?.[1] ??
            "",
          longitude:
            fetchedHotel.longitude ??
            fetchedHotel.location?.longitude ??
            fetchedHotel.location?.coordinates?.[0] ??
            "",
          amenities: Array.isArray(fetchedHotel.amenities)
            ? fetchedHotel.amenities
            : [],
          images: Array.isArray(fetchedHotel.images)
            ? fetchedHotel.images
            : [],
          roomTypes: Array.isArray(fetchedHotel.roomTypes)
            ? fetchedHotel.roomTypes
            : [],
          thumbnail:
            fetchedHotel.thumbnail ||
            (fetchedHotel.images?.[0]
              ? {
                  public_id: fetchedHotel.images[0].public_id,
                  url: fetchedHotel.images[0].url,
                }
              : null),
        }));
      } catch (err) {
        console.error("[OwnerEditHotel] Fetch error:", err);
        if (isMounted) {
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load hotel details";
          toast.error(errorMessage);
          navigate("/owner/hotels");
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    if (id) {
      fetchHotel();
    } else {
      toast.error("Invalid Hotel ID");
      navigate("/owner/hotels");
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  //-----------------------------------------
  // Input Handlers
  //-----------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotel((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handleAmenity = (amenity) => {
    setHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const setImages = (value) => {
    setHotel((prev) => {
      const updatedImages =
        typeof value === "function" ? value(prev.images) : value;

      return {
        ...prev,
        images: updatedImages,
        thumbnail:
          prev.thumbnail ||
          (updatedImages.length > 0
            ? {
                public_id: updatedImages[0].public_id,
                url: updatedImages[0].url,
              }
            : null),
      };
    });
  };

  const removeImage = (index) => {
    setHotel((prev) => {
      const removedImage = prev.images[index];
      const updatedImages = prev.images.filter((_, i) => i !== index);

      const wasThumbnail =
        prev.thumbnail?.public_id === removedImage?.public_id ||
        prev.thumbnail?.url === removedImage?.url;

      return {
        ...prev,
        images: updatedImages,
        thumbnail: wasThumbnail
          ? updatedImages.length > 0
            ? {
                public_id: updatedImages[0].public_id,
                url: updatedImages[0].url,
              }
            : null
          : prev.thumbnail,
      };
    });
  };

  const setThumbnail = (index) => {
    setHotel((prev) => {
      if (!prev.images[index]) return prev;

      return {
        ...prev,
        thumbnail: {
          public_id: prev.images[index].public_id,
          url: prev.images[index].url,
        },
      };
    });
  };

  const validateForm = () => {
    if (!hotel.name?.trim()) return toast.error("Hotel name is required");
    if (!hotel.slug?.trim()) return toast.error("Slug is required");
    if (!hotel.city?.trim()) return toast.error("City is required");
    if (!hotel.country?.trim()) return toast.error("Country is required");
    if (!hotel.address?.trim()) return toast.error("Address is required");
    if (hotel.pricePerNight === "" || hotel.pricePerNight === null)
      return toast.error("Price is required");
    if (hotel.availableRooms === "" || hotel.availableRooms === null)
      return toast.error("Available rooms is required");
    if (hotel.maxGuests === "" || hotel.maxGuests === null)
      return toast.error("Maximum guests is required");
    if (!hotel.images || hotel.images.length === 0)
      return toast.error("Upload at least one hotel image");
    return true;
  };

  //-----------------------------------------
  // Form Submission
  //-----------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        owner,
        location,
        id: tempId,
        ...rest
      } = hotel;

      const payload = {
        ...rest,
        pricePerNight: Number(hotel.pricePerNight),
        originalPrice: Number(hotel.originalPrice || 0),
        tax: Number(hotel.tax || 0),
        availableRooms: Number(hotel.availableRooms),
        maxGuests: Number(hotel.maxGuests),
        starRating: Number(hotel.starRating || 5),
        averageRating: Number(hotel.averageRating || 0),
        totalReviews: Number(hotel.totalReviews || 0),
        latitude: hotel.latitude !== "" ? Number(hotel.latitude) : undefined,
        longitude: hotel.longitude !== "" ? Number(hotel.longitude) : undefined,
      };

      await api.put(`/hotels/${id}`, payload);

      toast.success("Hotel updated successfully");
      navigate("/owner/hotels");
    } catch (err) {
      console.error("[OwnerEditHotel] Submit error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update hotel"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-slate-400 animate-pulse">
          Loading hotel details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Card */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h1 className="text-3xl font-bold text-white">Edit Hotel</h1>
        <p className="text-slate-400 mt-1">
          Update your property information below.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={submitHandler} className="space-y-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <HotelBasicInfo
            hotel={hotel}
            handleChange={handleChange}
            generateSlug={generateSlug}
          />
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <HotelPricing hotel={hotel} handleChange={handleChange} />
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <HotelAmenities
            hotel={hotel}
            amenitiesList={amenitiesList}
            handleAmenity={handleAmenity}
          />
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <HotelImages
            hotel={hotel}
            setImages={setImages}
            removeImage={removeImage}
            setThumbnail={setThumbnail}
          />
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <HotelSettings hotel={hotel} handleChange={handleChange} />
        </div>

        <HotelSubmit loading={loading} isEdit={true} />
      </form>
    </div>
  );
};

export default OwnerEditHotelPage;