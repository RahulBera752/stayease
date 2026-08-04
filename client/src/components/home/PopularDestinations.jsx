import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { popularCities } from '../../data/mockData.js';
import api from '../../services/api.js';

const PopularDestinations = ({ hotels: propHotels }) => {
  const [hotels, setHotels] = useState(propHotels || []);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // If hotels were passed as props, use them
    if (propHotels && propHotels.length > 0) {
      setHotels(propHotels);
      return;
    }

    // Otherwise, fetch exactly ONCE on mount
    const fetchHotels = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const { data } = await api.get('/hotels');
        const fetchedList = data.hotels || data || [];
        setHotels(fetchedList);
      } catch (err) {
        console.error('Failed to fetch hotels for destinations:', err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchHotels();
  }, []); // 👈 Empty dependency array prevents re-triggering on parent re-renders!

  // Helper function to count actual hotels matching each city
  const getCityHotelCount = (cityName) => {
    if (!hotels || !Array.isArray(hotels) || hotels.length === 0) return 0;

    const query = cityName.toLowerCase().trim();

    return hotels.filter((hotel) => {
      const name = (hotel.name || '').toLowerCase();
      const city = (hotel.city || '').toLowerCase();
      const state = (hotel.state || '').toLowerCase();
      const country = (hotel.country || '').toLowerCase();
      const address = (hotel.address || '').toLowerCase();

      const locationStr =
        typeof hotel.location === 'string'
          ? hotel.location.toLowerCase()
          : '';

      return (
        city.includes(query) ||
        name.includes(query) ||
        state.includes(query) ||
        country.includes(query) ||
        address.includes(query) ||
        locationStr.includes(query)
      );
    }).length;
  };

  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Explore
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2">
              Popular Destinations
            </h2>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all"
          >
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {popularCities.map((city, i) => {
            const actualCount = getCityHotelCount(city.name);

            return (
              <motion.div
                key={city.id || city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <Link
                  to={`/search?destination=${encodeURIComponent(city.name)}`}
                  className="group relative block h-48 rounded-xl2 overflow-hidden shadow-card"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-base">
                      {city.name}
                    </h3>
                    <p className="text-white/75 text-xs">
                      {actualCount} {actualCount === 1 ? 'hotel' : 'hotels'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;