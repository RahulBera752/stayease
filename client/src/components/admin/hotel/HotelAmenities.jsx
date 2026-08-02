import {
  Wifi,
  Waves,
  Dumbbell,
  Car,
  Coffee,
  Utensils,
  Wine,
  Plane,
  Sparkles,
  PawPrint,
  Mountain,
  Trees,
  Tv,
  ShieldCheck,
  Snowflake,
  Bath,
} from "lucide-react";

const amenities = [
  { name: "wifi", icon: Wifi, label: "WiFi" },
  { name: "pool", icon: Waves, label: "Swimming Pool" },
  { name: "spa", icon: Sparkles, label: "Spa" },
  { name: "gym", icon: Dumbbell, label: "Gym" },
  { name: "parking", icon: Car, label: "Parking" },
  { name: "restaurant", icon: Utensils, label: "Restaurant" },
  { name: "bar", icon: Wine, label: "Bar" },
  { name: "breakfast", icon: Coffee, label: "Breakfast" },
  { name: "room-service", icon: Coffee, label: "Room Service" },
  { name: "airport-shuttle", icon: Plane, label: "Airport Shuttle" },
  { name: "pet-friendly", icon: PawPrint, label: "Pet Friendly" },
  { name: "mountain-view", icon: Mountain, label: "Mountain View" },
  { name: "garden", icon: Trees, label: "Garden" },
  { name: "television", icon: Tv, label: "Smart TV" },
  { name: "security", icon: ShieldCheck, label: "24x7 Security" },
  { name: "air-conditioning", icon: Snowflake, label: "Air Conditioning" },
  { name: "bathtub", icon: Bath, label: "Bathtub" },
];

const HotelAmenities = ({ hotel, handleAmenity }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-lg p-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        Hotel Amenities
      </h2>

      <p className="text-gray-500 dark:text-slate-400 mb-8">
        Select all amenities available in this hotel.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {amenities.map((item) => {
          const Icon = item.icon;
          const selected = hotel?.amenities?.includes(item.name);

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => handleAmenity(item.name)}
              className={`border rounded-2xl p-5 transition-all duration-300 flex flex-col items-center gap-3 cursor-pointer ${
                selected
                  ? "bg-primary text-white border-primary shadow-lg scale-105"
                  : "bg-slate-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700/60 text-gray-700 dark:text-slate-200 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
              }`}
            >
              <Icon size={28} />

              <span className="text-sm font-medium text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Amenities Summary Box */}
      <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/60">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Selected Amenities
        </h3>

        {hotel?.amenities?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {hotel.amenities.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium capitalize shadow-sm"
              >
                {item.replace("-", " ")}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            No amenities selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default HotelAmenities;