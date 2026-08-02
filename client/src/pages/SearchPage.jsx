import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const [loading, setLoading] = useState(true);

  const [hotels, setHotels] = useState([]);

  const [filteredHotels, setFilteredHotels] = useState([]);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "recommended",
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/hotels/search", {
        params: {
          destination,
          checkIn,
          checkOut,
          guests,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        },
      });

      setHotels(data.hotels || []);
      setFilteredHotels(data.hotels || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    let result = [...hotels];

    if (filters.rating) {
      result = result.filter(
        (hotel) => hotel.averageRating >= Number(filters.rating)
      );
    }

    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;

      case "price-high":
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;

      case "rating":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;

      default:
        break;
    }

    setFilteredHotels(result);
  }, [filters, hotels]);

  const totalHotels = useMemo(
    () => filteredHotels.length,
    [filteredHotels]
  );

  return (
    <section className="min-h-screen bg-background pt-28 pb-16">

      <div className="section-container">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-5xl font-bold text-foreground mb-3">
            Search Hotels
          </h1>

          <p className="text-muted-foreground">
            Discover luxury stays around the world.
          </p>
        </motion.div>

        {/* Search Summary */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-4 gap-5">

            <div className="flex items-center gap-3">
              <MapPin className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Destination
                </p>

                <h4 className="font-semibold">
                  {destination || "Anywhere"}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Check In
                </p>

                <h4>{checkIn || "--"}</h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Check Out
                </p>

                <h4>{checkOut || "--"}</h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Guests
                </p>

                <h4>{guests}</h4>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Filters */}

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={20} />
              <h3 className="font-semibold text-lg">
                Filters
              </h3>
            </div>

            <div className="space-y-5">

              <div>
                <label className="text-sm font-medium">
                  Minimum Price
                </label>

                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: e.target.value,
                    })
                  }
                  className="w-full mt-2 rounded-xl border px-4 py-3 bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Maximum Price
                </label>

                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value,
                    })
                  }
                  className="w-full mt-2 rounded-xl border px-4 py-3 bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Rating
                </label>

                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      rating: e.target.value,
                    })
                  }
                  className="w-full mt-2 rounded-xl border px-4 py-3 bg-background"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Star</option>
                  <option value="4">4 Star & Above</option>
                  <option value="3">3 Star & Above</option>
                </select>
              </div>
                            <div>
                <label className="text-sm font-medium">
                  Sort By
                </label>

                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sort: e.target.value,
                    })
                  }
                  className="w-full mt-2 rounded-xl border px-4 py-3 bg-background"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                onClick={fetchHotels}
                className="w-full bg-gradient-primary text-white rounded-xl py-3 font-semibold hover:shadow-glow transition"
              >
                Apply Filters
              </button>
            </div>
          </motion.aside>

          {/* Results */}

          <div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-xl">
                {totalHotels} Hotel{totalHotels !== 1 && "s"} Found
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2
                  size={42}
                  className="animate-spin text-primary"
                />
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Search
                  size={60}
                  className="mx-auto mb-4 text-primary"
                />

                <h3 className="font-display text-2xl font-bold mb-2">
                  No Hotels Found
                </h3>

                <p className="text-muted-foreground">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredHotels.map((hotel) => (
                  <motion.div
                    key={hotel._id}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="grid md:grid-cols-[320px_1fr]">

                      <img
                        src={
                          hotel.thumbnail?.url ||
                          hotel.images?.[0]?.url ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={hotel.name}
                        className="w-full h-72 md:h-full object-cover"
                      />

                      <div className="p-6 flex flex-col justify-between">

                        <div>

                          <div className="flex justify-between items-start">

                            <div>

                              <h3 className="font-display text-2xl font-bold">
                                {hotel.name}
                              </h3>

                              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                                <MapPin size={16} />
                                {hotel.city}, {hotel.country}
                              </p>

                            </div>

                            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                              <Star
                                size={16}
                                fill="currentColor"
                              />
                              {hotel.averageRating || hotel.starRating}
                            </div>

                          </div>

                          <p className="mt-4 text-muted-foreground line-clamp-3">
                            {hotel.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-5">
                            {hotel.amenities?.slice(0, 5).map((item) => (
                              <span
                                key={item}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mt-8">

                          <div>

                            <p className="text-3xl font-bold text-primary">
                              ₹{hotel.pricePerNight}
                            </p>

                            <span className="text-muted-foreground text-sm">
                              per night
                            </span>

                          </div>

                          <Link
                            to={`/hotels/${hotel.slug}`}
                            className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all"
                          >
                            View Details
                          </Link>

                        </div>

                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default SearchPage;