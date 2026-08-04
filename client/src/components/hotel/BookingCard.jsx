import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BookingCard = ({ hotel }) => {
  const navigate = useNavigate();

  // Format today's date as YYYY-MM-DD to restrict past dates
  const todayStr = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!totalNights) return hotel.pricePerNight;

    return hotel.pricePerNight * totalNights;
  }, [hotel.pricePerNight, totalNights]);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (checkIn < todayStr) {
      toast.error("Check-in date cannot be in the past.");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }

    if (guests > hotel.maxGuests) {
      toast.error(
        `Maximum ${hotel.maxGuests} guests allowed.`
      );
      return;
    }

    navigate("/booking", {
      state: {
        hotel,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      },
    });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-3xl p-7 sticky top-28 h-fit"
    >
      <h2 className="font-display text-3xl font-bold">
        Book Your Stay
      </h2>

      <div className="mt-6">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-primary">
            ₹{hotel.pricePerNight}
          </span>

          <span className="text-muted-foreground mb-1">
            / night
          </span>
        </div>

        {hotel.discount > 0 && (
          <div className="mt-2 text-green-600 font-medium">
            {hotel.discount}% OFF Available
          </div>
        )}
      </div>

      <div className="space-y-5 mt-8">
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Calendar size={18} />
            Check In
          </label>

          <input
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={(e) => {
              const newCheckIn = e.target.value;
              setCheckIn(newCheckIn);
              if (checkOut && checkOut <= newCheckIn) {
                const nextDay = new Date(newCheckIn);
                nextDay.setDate(nextDay.getDate() + 1);
                setCheckOut(nextDay.toISOString().split("T")[0]);
              }
            }}
            className="w-full rounded-xl border px-4 py-3 bg-background cursor-pointer"
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Calendar size={18} />
            Check Out
          </label>

          <input
            type="date"
            min={checkIn || todayStr}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 bg-background cursor-pointer"
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Users size={18} />
            Guests
          </label>

          <input
            type="number"
            min={1}
            max={hotel.maxGuests}
            value={guests}
            onChange={(e) =>
              setGuests(Number(e.target.value))
            }
            className="w-full rounded-xl border px-4 py-3 bg-background"
          />
        </div>
      </div>

      <div className="border-t mt-8 pt-6 space-y-3">
        <div className="flex justify-between">
          <span>Nights</span>
          <span>{totalNights || 1}</span>
        </div>

        <div className="flex justify-between">
          <span>Guests</span>
          <span>{guests}</span>
        </div>

        <div className="flex justify-between">
          <span>Price</span>
          <span>
            ₹{hotel.pricePerNight}
          </span>
        </div>

        <div className="flex justify-between text-xl font-bold border-t pt-4">
          <span>Total</span>

          <span className="text-primary">
            ₹{totalPrice}
          </span>
        </div>
      </div>

      <button
        onClick={handleBooking}
        className="w-full mt-8 bg-gradient-primary text-white rounded-xl py-4 font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
      >
        Reserve Now
      </button>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck
            className="text-green-500"
            size={20}
          />
          <span>Free cancellation within 24 hours</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <CreditCard
            className="text-primary"
            size={20}
          />
          <span>Secure payment gateway</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default BookingCard;