import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

import Hotelery from "../components/hotel/HotelGallery";
import HotelInfo from "../components/hotel/HotelInfo";
import BookingCard from "../components/hotel/BookingCard";
import HotelAmenities from "../components/hotel/HotelAmenities";
import SimilarHotels from "../components/hotel/SimilarHotels";

// Direct API instance to avoid any env variable loading issues on port 5173
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const HotelDetailsPage = () => {
  const { slug } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHotel = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data } = await api.get(`/hotels/${slug}`);
        
        if (!isMounted) return;

        if (data && data.hotel) {
          setHotel(data.hotel);
        } else if (data) {
          setHotel(data);
        } else {
          setHotel(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching hotel details:", err);
        toast.error(err.response?.data?.message || err.message || "Failed to load hotel");
        setHotel(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHotel();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="animate-spin text-primary" size={45} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background gap-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Hotel Not Found
        </h2>
        <p className="text-muted-foreground">The hotel you are looking for does not exist or was removed.</p>
      </div>
    );
  }

  return (
    <section className="bg-background pt-28 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Hotelery hotel={hotel} />
          <div className="grid lg:grid-cols-[2fr_420px] gap-10 mt-10">
            <div>
              <HotelInfo hotel={hotel} />
              <HotelAmenities hotel={hotel} />
              {hotel.city && <SimilarHotels city={hotel.city} />}
            </div>
            <BookingCard hotel={hotel} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HotelDetailsPage;