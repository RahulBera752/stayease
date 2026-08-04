import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/users/forgot-password", { email });
      toast.success("Password reset instructions sent!");
      // If testing without email service, you can log or redirect using data.resetToken
      console.log("Reset Token:", data.resetToken);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process request.");
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

        <h1 className="text-3xl font-extrabold mb-2">Forgot Password?</h1>
        <p className="text-slate-400 text-sm mb-8">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-2">Email Address</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-cyan-400 transition">
              <Mail className="text-cyan-400 shrink-0" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@gmail.com"
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
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;