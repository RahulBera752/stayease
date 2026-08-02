import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { Tag, Plus, Trash2, Calendar, Percent } from "lucide-react";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons");
      // Accommodate array response directly or inside data wrapper
      const list = response.data?.data || response.data || [];
      setCoupons(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Fetch Coupons Error:", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    
    if (!code || !discountPercentage || !expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);

      // Pass formatted ISO date to ensure backend compatibility
      const payload = {
        code: code.trim().toUpperCase(),
        discountPercentage: Number(discountPercentage),
        expiryDate: new Date(expiryDate).toISOString(),
      };

      const response = await api.post("/coupons", payload);

      toast.success("Coupon created successfully!");
      
      // Clear form inputs
      setCode("");
      setDiscountPercentage("");
      setExpiryDate("");

      // Update state dynamically or re-fetch
      if (response.data?.data) {
        setCoupons((prev) => [response.data.data, ...prev]);
      } else {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Create Coupon Error:", error);
      const errMsg =
        error.response?.data?.message || error.message || "Error creating coupon";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete Coupon Error:", error);
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray">
      <div className="flex items-center gap-3 mb-8">
        <Tag className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-slate-400 text-sm">
            Create discount codes and set expiry dates for promotional offers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Coupon Form */}
        <div className="bg-[#0b1329] border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" /> Add New Coupon
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 uppercase focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Discount Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="20"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
                <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Valid Until (Expiry Date)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 [color-scheme:dark]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 mt-2"
            >
              {submitting ? "Creating..." : "Save Coupon"}
            </button>
          </form>
        </div>

        {/* Coupon List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Active Coupons</h2>

          {loading ? (
            <p className="text-slate-400">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center border border-white/10 rounded-3xl bg-white/5 text-slate-400">
              No coupons created yet.
            </div>
          ) : (
            coupons.map((coupon) => {
              const isExpired = new Date(coupon.expiryDate) < new Date();

              return (
                <div
                  key={coupon._id || coupon.id}
                  className="bg-[#0b1329] border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-extrabold text-lg">
                      {coupon.discountPercentage}%
                    </div>
                    <div>
                      <h3 className="font-mono font-extrabold text-lg text-cyan-400">
                        {coupon.code}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Expires:{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                            Expired
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCoupon(coupon._id || coupon.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;