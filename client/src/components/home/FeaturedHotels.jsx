import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import HotelCard from "../hotel/HotelCard";
import api from "../../services/api";

const RedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await api.get("/hotels");

    console.log("Hotels:", data.hotels);

if (data.hotels.length) {
  console.log("First Hotel:", data.hotels[0]);
  console.log("Images:", data.hotels[0].images);
  console.log("Thumbnail:", data.hotels[0].thumbnail);
}
        setHotels(data.hotels || []);
      } catch (error) {
        console.error("Hotel Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <section className="py-24 bg-muted/30">
      <div className="section-container">

        <div className="flex items-end justify-between mb-12">

          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Handpicked
            </span>

            <h2 className="font-display text-4xl font-bold mt-2">
              Hotels
            </h2>

            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover luxury hotels from our premium collection.
            </p>
          </div>

          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 text-primary font-medium"
          >
            View all hotels
            <ArrowUpRight size={18} />
          </Link>

        </div>

        {loading ? (
          <div className="text-center py-20">
            Loading hotels...
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            No hotels found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {hotels.map((hotel, index) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default RedHotels;