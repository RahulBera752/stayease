import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

import HotelBasicInfo from "../../components/admin/hotel/HotelBasicInfo";
import HotelPricing from "../../components/admin/hotel/HotelPricing";
import HotelAmenities from "../../components/admin/hotel/HotelAmenities";
import HotelImages from "../../components/admin/hotel/HotelImages";
import HotelSettings from "../../components/admin/hotel/HotelSettings";
import HotelSubmit from "../../components/admin/hotel/HotelSubmit";

export function OwnerAddHotelPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //-----------------------------------------
  // Hotel State
  //-----------------------------------------
  const [hotel, setHotel] = useState({
    // Basic
    name: "",
    slug: "",
    description: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",

    // Pricing
    pricePerNight: "",
    originalPrice: "",
    tax: "",

    // Rooms
    availableRooms: "",
    maxGuests: "",
    roomTypes: [],

    // Ratings
    starRating: 5,
    averageRating: 5,
    totalReviews: 0,

    // Time
    checkIn: "12:00",
    checkOut: "11:00",

    // Amenities
    amenities: [],

    // Images
    images: [],
    thumbnail: null,

    // Status
    featured: false,
    popular: false,
    luxury: false,
    verified: true,
    status: "active",

    // SEO
    seoTitle: "",
    seoDescription: "",
  });

  //-----------------------------------------
  // Amenity List
  //-----------------------------------------
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
  // Handle Input Change
  //-----------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setHotel((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //-----------------------------------------
  // Generate Slug
  //-----------------------------------------
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

  //-----------------------------------------
  // Amenities Toggle
  //-----------------------------------------
  const handleAmenity = (amenity) => {
    setHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  //-----------------------------------------
  // Room Types Toggle
  //-----------------------------------------
  const handleRoomType = (roomType) => {
    setHotel((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(roomType)
        ? prev.roomTypes.filter((item) => item !== roomType)
        : [...prev.roomTypes, roomType],
    }));
  };

  //-----------------------------------------
  // Images Handler
  //-----------------------------------------
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

  //-----------------------------------------
  // Remove Image
  //-----------------------------------------
  const removeImage = (index) => {
    setHotel((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: updatedImages,
        thumbnail:
          updatedImages.length > 0
            ? {
                public_id: updatedImages[0].public_id,
                url: updatedImages[0].url,
              }
            : null,
      };
    });
  };

  //-----------------------------------------
  // Set Thumbnail
  //-----------------------------------------
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

  //-----------------------------------------
  // Reset Form
  //-----------------------------------------
  const resetForm = () => {
    setHotel({
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
  };

  //-----------------------------------------
  // Validation
  //-----------------------------------------
  const validateForm = () => {
    if (!hotel.name.trim()) {
      toast.error("Hotel name is required");
      return false;
    }

    if (!hotel.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    if (!hotel.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!hotel.country.trim()) {
      toast.error("Country is required");
      return false;
    }

    if (!hotel.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (!hotel.pricePerNight) {
      toast.error("Price is required");
      return false;
    }

    if (!hotel.availableRooms) {
      toast.error("Available rooms is required");
      return false;
    }

    if (!hotel.maxGuests) {
      toast.error("Maximum guests is required");
      return false;
    }

    if (hotel.images.length === 0) {
      toast.error("Upload at least one hotel image");
      return false;
    }

    return true;
  };

  //-----------------------------------------
  // Submit Handler
  //-----------------------------------------
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Safe coordinate conversions (GeoJSON expects [longitude, latitude])
      const lat = parseFloat(hotel.latitude) || 0;
      const lng = parseFloat(hotel.longitude) || 0;

      const payload = {
        ...hotel,
        latitude: lat,
        longitude: lng,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        pricePerNight: Number(hotel.pricePerNight),
        originalPrice: Number(hotel.originalPrice || 0),
        tax: Number(hotel.tax || 0),
        availableRooms: Number(hotel.availableRooms),
        maxGuests: Number(hotel.maxGuests),
        starRating: Number(hotel.starRating),
        averageRating: Number(hotel.averageRating),
        totalReviews: Number(hotel.totalReviews),
      };

      await api.post("/hotels", payload);

      toast.success("Hotel added successfully! 🚀");
      resetForm();
      navigate("/owner/hotels");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to add hotel"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 bg-background text-foreground min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Add New Hotel</h1>
        <p className="text-muted-foreground mt-2">
          Create a new hotel listing for your property.
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-8">
        <HotelBasicInfo
          hotel={hotel}
          handleChange={handleChange}
          generateSlug={generateSlug}
        />

        <HotelPricing
          hotel={hotel}
          handleChange={handleChange}
        />

        <HotelAmenities
          hotel={hotel}
          amenitiesList={amenitiesList}
          handleAmenity={handleAmenity}
        />

        <HotelImages
          hotel={hotel}
          setImages={setImages}
          removeImage={removeImage}
          setThumbnail={setThumbnail}
        />

        <HotelSettings
          hotel={hotel}
          handleChange={handleChange}
        />

        <HotelSubmit
          loading={loading}
          isEdit={false}
        />
      </form>
    </div>
  );
}

export default OwnerAddHotelPage;