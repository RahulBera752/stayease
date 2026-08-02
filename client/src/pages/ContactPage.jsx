import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Backend API will be connected later

      await new Promise((resolve) => setTimeout(resolve, 1200));

      toast.success("Message sent successfully.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-background pt-28 pb-20">
      <div className="section-container">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="glass px-5 py-2 rounded-full text-primary font-medium">
            Contact Us
          </span>

          <h1 className="font-display text-5xl md:text-6xl font-bold mt-6">
            We'd Love To
            <span className="block text-primary">
              Hear From You
            </span>
          </h1>

          <p className="mt-6 text-muted-foreground text-lg">
            Need assistance with your booking?
            Our support team is available 24/7.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-10 mt-20">

          {/* Contact Info */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 space-y-8"
          >
            <div className="flex gap-4">
              <Mail className="text-primary" size={28} />
              <div>
                <h3 className="font-semibold text-xl">
                  Email
                </h3>
                <p className="text-muted-foreground">
                  support@stayease.com
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-primary" size={28} />
              <div>
                <h3 className="font-semibold text-xl">
                  Phone
                </h3>
                <p className="text-muted-foreground">
                  +91 9876543210
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="text-primary" size={28} />
              <div>
                <h3 className="font-semibold text-xl">
                  Office
                </h3>
                <p className="text-muted-foreground">
                  Kolkata, West Bengal, India
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-primary" size={28} />
              <div>
                <h3 className="font-semibold text-xl">
                  Working Hours
                </h3>
                <p className="text-muted-foreground">
                  Monday - Sunday
                  <br />
                  24 Hours Support
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8"
          >
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 bg-background"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 bg-background"
                  placeholder="Your Email"
                />
              </div>

            </div>

            <div className="mt-5">
              <label className="block mb-2 font-medium">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 bg-background"
                placeholder="Subject"
              />
            </div>

            <div className="mt-5">
              <label className="block mb-2 font-medium">
                Message
              </label>

              <textarea
                rows={7}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 bg-background resize-none"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-gradient-primary text-white rounded-xl py-4 font-semibold hover:shadow-glow transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>

        </div>

      </div>
    </section>
  );
};

export default ContactPage;