const HotelPricing = ({ hotel, handleChange }) => {
  return (
    <div className="bg-slate-900 rounded-3xl shadow-lg p-8 border border-slate-800 text-white">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Pricing & Capacity
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Price Per Night */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Price Per Night (₹)
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={hotel.pricePerNight}
            onChange={handleChange}
            min="0"
            placeholder="5000"
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
            required
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Original Price (₹)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={hotel.originalPrice}
            onChange={handleChange}
            min="0"
            placeholder="6500"
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
          />
        </div>

        {/* Tax */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Tax (%)
          </label>
          <input
            type="number"
            name="tax"
            value={hotel.tax || ""}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="18"
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
          />
        </div>

        {/* Star Rating */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Star Rating
          </label>
          <select
            name="starRating"
            value={hotel.starRating}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value={1} className="bg-slate-800 text-white">⭐ 1 Star</option>
            <option value={2} className="bg-slate-800 text-white">⭐⭐ 2 Stars</option>
            <option value={3} className="bg-slate-800 text-white">⭐⭐⭐ 3 Stars</option>
            <option value={4} className="bg-slate-800 text-white">⭐⭐⭐⭐ 4 Stars</option>
            <option value={5} className="bg-slate-800 text-white">⭐⭐⭐⭐⭐ 5 Stars</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Available Rooms */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Available Rooms
          </label>
          <input
            type="number"
            name="availableRooms"
            value={hotel.availableRooms}
            onChange={handleChange}
            min="1"
            placeholder="50"
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
          />
        </div>

        {/* Maximum Guests */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Maximum Guests
          </label>
          <input
            type="number"
            name="maxGuests"
            value={hotel.maxGuests}
            onChange={handleChange}
            min="1"
            placeholder="4"
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Status
          </label>
          <select
            name="status"
            value={hotel.status}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            <option value="active" className="bg-slate-800 text-white">Active</option>
            <option value="inactive" className="bg-slate-800 text-white">Inactive</option>
            <option value="draft" className="bg-slate-800 text-white">Draft</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Check-in Time */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Check-in Time
          </label>
          <input
            type="time"
            name="checkIn"
            value={hotel.checkIn || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
          />
        </div>

        {/* Check-out Time */}
        <div>
          <label className="block font-medium mb-2 text-slate-300">
            Check-out Time
          </label>
          <input
            type="time"
            name="checkOut"
            value={hotel.checkOut || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
};

export default HotelPricing;