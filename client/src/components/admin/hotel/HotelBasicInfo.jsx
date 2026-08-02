import React from "react";

const HotelBasicInfo = ({ hotel, handleChange, generateSlug }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-3">
        Basic Information
      </h2>

      {/* Row 1: Name & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Hotel Name
          </label>
          <input
            type="text"
            name="name"
            value={hotel.name || ""}
            onChange={(e) => generateSlug(e.target.value)}
            placeholder="e.g. Grand Luxury Resort"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={hotel.slug || ""}
            onChange={handleChange}
            placeholder="grand-luxury-resort"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Row 2: Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={hotel.description || ""}
          onChange={handleChange}
          placeholder="Describe your property..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
        />
      </div>

      {/* Row 3: Address & City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={hotel.address || ""}
            onChange={handleChange}
            placeholder="123 Main Street"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={hotel.city || ""}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Row 4: Country, Latitude, Longitude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={hotel.country || ""}
            onChange={handleChange}
            placeholder="India"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={hotel.latitude ?? ""}
            onChange={handleChange}
            placeholder="19.0760"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={hotel.longitude ?? ""}
            onChange={handleChange}
            placeholder="72.8777"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>
    </div>
  );
};

export default HotelBasicInfo;