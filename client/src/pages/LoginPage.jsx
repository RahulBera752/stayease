import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Hotel,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const { data } = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // 🔍 Handle both { user: {...} } and direct {...} responses
      const userData = data?.user || data;

      console.log("🔑 [LoginPage] Login response user:", userData);

      setUser(userData);

      toast.success(data.message || "Welcome back!");

      // 🚀 Always navigate to the Home Page after login
      navigate("/", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to log in";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // If already logged in, redirect directly to Home Page
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-secondary/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Hotel className="text-white" size={30} />
            </div>
          </div>

          <h1 className="font-display text-4xl text-center text-white font-bold mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-white/70 mb-8">
            Sign in to your StayEase account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-white/95 dark:bg-slate-800/95 rounded-xl py-3.5 pl-12 pr-4 outline-none border border-transparent focus:border-primary transition text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/80 text-sm font-medium mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-white/95 dark:bg-slate-800/95 rounded-xl py-3.5 pl-12 pr-12 outline-none border border-transparent focus:border-primary transition text-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
                <input
                  type="checkbox"
                  className="rounded border-slate-500"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white py-3.5 font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing In...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-white/75">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginPage;