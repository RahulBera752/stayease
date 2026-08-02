import {
  Crown,
  BadgeCheck,
  Flame,
  Star,
  ShieldCheck,
  FileText,
} from "lucide-react";

const HotelSettings = ({
  hotel,
  handleChange,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck
          size={30}
          className="text-primary"
        />

        <div>
          <h2 className="text-2xl font-bold">
            Hotel Settings
          </h2>

          <p className="text-gray-500">
            Configure hotel visibility and SEO settings.
          </p>
        </div>
      </div>

      {/* Status */}

      <div className="grid lg:grid-cols-2 gap-8">

        <div>

          <h3 className="font-semibold text-lg mb-5">
            Visibility
          </h3>

          <div className="space-y-4">

            <label className="flex items-center justify-between border rounded-xl p-4 hover:border-primary">

              <div className="flex items-center gap-3">

                <Star
                  className="text-yellow-500"
                  size={22}
                />

                <div>

                  <h4 className="font-semibold">
                    Featured Hotel
                  </h4>

                  <p className="text-sm text-gray-500">
                    Show on homepage
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                name="featured"
                checked={hotel.featured}
                onChange={handleChange}
                className="w-5 h-5"
              />

            </label>

            <label className="flex items-center justify-between border rounded-xl p-4 hover:border-primary">

              <div className="flex items-center gap-3">

                <Flame
                  className="text-red-500"
                  size={22}
                />

                <div>

                  <h4 className="font-semibold">
                    Popular Hotel
                  </h4>

                  <p className="text-sm text-gray-500">
                    Trending hotels
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                name="popular"
                checked={hotel.popular}
                onChange={handleChange}
                className="w-5 h-5"
              />

            </label>

            <label className="flex items-center justify-between border rounded-xl p-4 hover:border-primary">

              <div className="flex items-center gap-3">

                <Crown
                  className="text-purple-600"
                  size={22}
                />

                <div>

                  <h4 className="font-semibold">
                    Luxury Hotel
                  </h4>

                  <p className="text-sm text-gray-500">
                    Premium collection
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                name="luxury"
                checked={hotel.luxury}
                onChange={handleChange}
                className="w-5 h-5"
              />

            </label>

            <label className="flex items-center justify-between border rounded-xl p-4 hover:border-primary">

              <div className="flex items-center gap-3">

                <BadgeCheck
                  className="text-green-600"
                  size={22}
                />

                <div>

                  <h4 className="font-semibold">
                    Verified Hotel
                  </h4>

                  <p className="text-sm text-gray-500">
                    Trust badge
                  </p>

                </div>

              </div>

              <input
                type="checkbox"
                name="verified"
                checked={hotel.verified}
                onChange={handleChange}
                className="w-5 h-5"
              />

            </label>

          </div>

        </div>

        {/* SEO */}

        <div>

          <div className="flex items-center gap-2 mb-5">

            <FileText
              size={22}
              className="text-primary"
            />

            <h3 className="text-lg font-semibold">
              SEO Information
            </h3>

          </div>

          <div className="space-y-5">

            <div>

              <label className="font-medium">
                SEO Title
              </label>

              <input
                type="text"
                name="seoTitle"
                value={hotel.seoTitle || ""}
                onChange={handleChange}
                placeholder="Luxury Hotel in Goa"
                className="w-full border rounded-xl p-3 mt-2"
              />

            </div>

            <div>

              <label className="font-medium">
                SEO Description
              </label>

              <textarea
                rows={5}
                name="seoDescription"
                value={hotel.seoDescription || ""}
                onChange={handleChange}
                placeholder="Meta description..."
                className="w-full border rounded-xl p-3 mt-2 resize-none"
              />

            </div>

            <div>

              <label className="font-medium">
                Status
              </label>

              <select
                name="status"
                value={hotel.status}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 mt-2"
              >
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

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HotelSettings;