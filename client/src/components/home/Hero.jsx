import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import toast from "react-hot-toast";

const Hero = () => {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleCheckInChange = (e) => {
    const selectedCheckIn = e.target.value;
    setCheckIn(selectedCheckIn);
    // If checkOut is set and earlier than new checkIn, reset checkOut
    if (checkOut && checkOut < selectedCheckIn) {
      setCheckOut("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    if (checkIn && checkOut && checkOut < checkIn) {
      toast.error("Check-out date must be after check-in");
      return;
    }

    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests: guests.toString(),
    });

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8 }}
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/70" />
      </div>

      <div className="relative z-10 section-container text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="glass px-6 py-2 rounded-full text-white text-sm font-medium inline-block mb-6">
            ✨ Over 12,000 Luxury Stays Across 60+ Cities
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
        >
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
            Escape
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/90 max-w-2xl mx-auto text-lg mt-6 mb-12"
        >
          Handpicked hotels, resorts and villas — booked in seconds,
          remembered for years.
        </motion.p>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="glass rounded-2xl p-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1.2fr_1fr_auto] gap-3 text-left"
        >
          {/* Destination */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
            <MapPin className="text-primary shrink-0" size={20} />

            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Check In */}
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Check In
            </label>

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary shrink-0" />

              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleCheckInChange}
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer"
              />
            </div>
          </div>

          {/* Check Out */}
          <div className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Check Out
            </label>

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary shrink-0" />

              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800">
            <Users className="text-primary shrink-0" size={20} />

            <div className="flex flex-col w-full">
              <label className="text-xs text-slate-500 dark:text-slate-400">
                Guests
              </label>

              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent outline-none text-slate-800 dark:text-white cursor-pointer w-full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option
                    key={num}
                    value={num}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                  >
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 transition-all duration-300 px-6 py-3 min-h-[48px] shadow-lg cursor-pointer"
          >
            <Search size={22} />
          </button>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-10 mt-14 text-white"
        >
          {[
            ["12K+", "Hotels Listed"],
            ["4.8/5", "Average Rating"],
            ["850K+", "Happy Guests"],
            ["60+", "Cities Covered"],
          ].map(([number, text]) => (
            <div key={text}>
              <h3 className="text-3xl font-bold">{number}</h3>
              <p className="text-white/70 text-sm">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;