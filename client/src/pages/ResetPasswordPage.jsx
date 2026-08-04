import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/users/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-bold">Password Updated!</h1>
            <p className="text-slate-400 text-sm">
              Your password has been successfully changed. Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm mb-8">
              Please enter your new secure password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">New Password</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                  <Lock className="text-cyan-400 shrink-0" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent w-full p-4 outline-none text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Confirm New Password</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
                  <Lock className="text-cyan-400 shrink-0" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent w-full p-4 outline-none text-white text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-sm shadow-xl hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;