import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Hotel,
  Building2,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role: 'user' (Guest) or 'hotelOwner'
  });

  // Helper to direct existing sessions to their role dashboard
  const redirectByUserRole = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "hotelOwner") return "/owner/dashboard";
    return "/";
  };

  if (!loading && user) {
    return <Navigate to={redirectByUserRole(user.role)} replace />;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (formData.phone.trim().length < 10) {
      toast.error("Enter a valid phone number");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const { data } = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      toast.success(data.message || "Account created successfully!");

      navigate("/verify-otp", {
        state: {
          userId: data.userId,
          email: formData.email,
          role: formData.role,
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create account";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Hotel className="text-white" size={30} />
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold text-center text-white mb-2">
            Create Account
          </h1>

          <p className="text-center text-white/70 mb-6">
            Join StayEase and discover luxury stays.
          </p>

          {/* Role Selection Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-3 p-1.5 bg-white/10 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "user" }))}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                formData.role === "user"
                  ? "bg-primary text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <UserCheck size={16} />
              Booker / Guest
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: "hotelOwner" }))}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                formData.role === "hotelOwner"
                  ? "bg-primary text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Building2 size={16} />
              Hotel Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-white/95 dark:bg-slate-800/95 rounded-xl py-3.5 pl-12 pr-4 outline-none border border-transparent focus:border-primary transition text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Email
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

            {/* Phone Number */}
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-white/95 dark:bg-slate-800/95 rounded-xl py-3.5 pl-12 pr-4 outline-none border border-transparent focus:border-primary transition text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className="text-white/80 text-sm block mb-1.5">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full bg-white/95 dark:bg-slate-800/95 rounded-xl py-3.5 pl-12 pr-12 outline-none border border-transparent focus:border-primary transition text-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white py-3.5 font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Account...
                </>
              ) : (
                <>
                  {formData.role === "hotelOwner" ? "Register Partner Account" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-white/75">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-6 text-center">
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

export default SignupPage;