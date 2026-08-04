import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import HotelCard from "../hotel/HotelCard";
import api from "../../services/api";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchHotels = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const { data } = await api.get("/hotels");
        setHotels(data.hotels || data || []);
      } catch (error) {
        console.error("Error fetching featured hotels:", error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchHotels();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Featured
            </span>
            <h2 className="font-display text-4xl font-bold mt-2">
              Featured Hotels
            </h2>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 text-primary font-medium"
          >
            View all <ArrowUpRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading featured hotels...</div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">No hotels found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {hotels.slice(0, 6).map((hotel, index) => (
              <HotelCard key={hotel._id} hotel={hotel} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHotels;