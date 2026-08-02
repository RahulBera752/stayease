import { motion } from "framer-motion";
import {
  Hotel,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Coffee,
  UtensilsCrossed,
  Wind,
  Tv,
  ShieldCheck,
  PawPrint,
  Bath,
  ConciergeBell,
} from "lucide-react";

const amenityIcons = {
  Wifi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Pool: Waves,
  Spa: Bath,
  Restaurant: UtensilsCrossed,
  Breakfast: Coffee,
  AC: Wind,
  Television: Tv,
  Security: ShieldCheck,
  PetFriendly: PawPrint,
  RoomService: ConciergeBell,
};

const HotelAmenities = ({ hotel }) => {
  const amenities = hotel.amenities || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-8 mt-8"
    >
      <h2 className="font-display text-3xl font-bold mb-8">
        Hotel Amenities
      </h2>

      {amenities.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Amenities information is currently unavailable.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {amenities.map((amenity) => {
            const Icon = amenityIcons[amenity] || Hotel;

            return (
              <motion.div
                key={amenity}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                }}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    className="text-primary"
                    size={24}
                  />
                </div>

                <div>
                  <h4 className="font-semibold">
                    {amenity}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Included with your stay
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default HotelAmenities;