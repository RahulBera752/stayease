import React from "react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <section className="bg-background pt-32 pb-16 min-h-screen text-foreground">
      <div className="section-container max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: August 2026</p>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-xl font-semibold text-white mt-6">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, booking a stay, or contacting support. This includes your name, email address, phone number, and payment details.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">2. How We Use Your Information</h2>
            <p>
              Your information is used to process bookings, manage your user profile, communicate updates regarding your reservations, and maintain platform security.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">3. Data Security</h2>
            <p>
              We implement industry-standard security measures, including encrypted cookies and secure tokens, to protect your personal information from unauthorized access.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us at support@stayease.com.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyPage;