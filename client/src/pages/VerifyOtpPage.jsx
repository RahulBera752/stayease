import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, loading } = useAuth();

  const userId = location.state?.userId;
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  if (!userId) {
    return <Navigate to="/signup" replace />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await api.post("/auth/verify-otp", {
        userId,
        otp,
      });

      setUser(data.user);

      toast.success(data.message);

      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);

      const { data } = await api.post("/auth/resend-otp", {
        userId,
      });

      toast.success(data.message);

      setTimer(60);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-20">

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
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <ShieldCheck className="text-white" size={30} />
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold text-center text-white">
            Verify Email
          </h1>

          <p className="text-center text-white/70 mt-2 mb-8">
            Enter the verification code sent to
            <br />
            <span className="font-semibold text-white">
              {email}
            </span>
          </p>

          <form
            onSubmit={handleVerify}
            className="space-y-6"
          >

            <div>

              <label className="block text-white/80 text-sm mb-2">
                Verification Code
              </label>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl bg-white/95 dark:bg-slate-800/95 text-center tracking-[12px] text-2xl font-bold py-4 outline-none border border-transparent focus:border-primary transition text-slate-900 dark:text-white"
              />
            </div>
                        <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-white py-3.5 font-semibold hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Account
                  <ShieldCheck size={18} />
                </>
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-white/70 text-sm">
                Resend OTP in{" "}
                <span className="font-semibold text-primary">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={handleResendOtp}
                className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors"
              >
                {resending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCcw size={16} />
                    Resend OTP
                  </>
                )}
              </button>
            )}
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-4 text-sm text-white/60">
              Need another account?
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-secondary transition-colors"
            >
              Register Again
            </Link>
          </div>

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

export default VerifyOtpPage;