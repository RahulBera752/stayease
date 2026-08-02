import React, { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { AlertCircle, X } from "lucide-react";

export default function ReportModal({ isOpen, onClose, booking }) {
  const [reason, setReason] = useState("Cleanliness Issues");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/reports", {
        hotelId: booking.hotel?._id || booking.roomId,
        bookingId: booking._id,
        reason,
        description,
      });

      toast.success("Report submitted successfully. Admin will review it.");
      onClose();
      setDescription("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/10 rounded-3xl p-6 max-w-md w-full text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
          <AlertCircle className="w-5 h-5 text-amber-400" /> Report Stay Issue
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Hotel: {booking.hotel?.name || "Completed Trip"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Cleanliness Issues" className="bg-[#0b1329]">Cleanliness Issues</option>
              <option value="Inaccurate Listing Description" className="bg-[#0b1329]">Inaccurate Listing Description</option>
              <option value="Poor Customer Service" className="bg-[#0b1329]">Poor Customer Service</option>
              <option value="Billing or Price Dispute" className="bg-[#0b1329]">Billing or Price Dispute</option>
              <option value="Safety Concerns" className="bg-[#0b1329]">Safety Concerns</option>
              <option value="Other" className="bg-[#0b1329]">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Description / Details
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the issue in detail..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition disabled:opacity-50 text-sm"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}