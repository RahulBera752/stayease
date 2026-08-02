import { Search, RotateCcw } from "lucide-react";

const HotelFilters = ({
  filters,
  setFilters,
  onReset,
}) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold">
          Filter Hotels
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Search Hotel"
            className="w-full border rounded-xl pl-10 pr-4 py-3"
          />

        </div>

        {/* City */}

        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="City"
          className="border rounded-xl p-3"
        />

        {/* Status */}

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border rounded-xl p-3"
        >
          <option value="">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

          <option value="draft">
            Draft
          </option>

        </select>

        {/* Star */}

        <select
          name="starRating"
          value={filters.starRating}
          onChange={handleChange}
          className="border rounded-xl p-3"
        >
          <option value="">
            All Ratings
          </option>

          <option value="5">
            ⭐⭐⭐⭐⭐
          </option>

          <option value="4">
            ⭐⭐⭐⭐
          </option>

          <option value="3">
            ⭐⭐⭐
          </option>

          <option value="2">
            ⭐⭐
          </option>

          <option value="1">
            ⭐
          </option>

        </select>

        {/* Sort */}

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="border rounded-xl p-3"
        >
          <option value="-createdAt">
            Newest
          </option>

          <option value="pricePerNight">
            Price Low → High
          </option>

          <option value="-pricePerNight">
            Price High → Low
          </option>

          <option value="-starRating">
            Highest Rating
          </option>

          <option value="name">
            Hotel Name
          </option>

        </select>

      </div>

    </div>
  );
};

export default HotelFilters;