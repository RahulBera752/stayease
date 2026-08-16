import React from "react";
import { motion } from "framer-motion";

const CookiePage = () => {
  return (
    <section className="bg-background pt-32 pb-16 min-h-screen text-foreground">
      <div className="section-container max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: August 2026</p>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-white mt-6">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and session details.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">2. How We Use Cookies</h2>
            <p>
              StayEase uses secure cookies to maintain your login session (JWT authentication), remember user configurations, and analyze platform traffic performance.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">3. Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. Note that disabling essential cookies may impact your ability to log in or book stays on StayEase.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CookiePage;