import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  ShieldCheck,
  HeartHandshake,
  Award,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Luxury Hotels",
    description:
      "Handpicked premium hotels and resorts offering exceptional comfort and unforgettable experiences.",
  },
  {
    icon: Globe,
    title: "Worldwide Destinations",
    description:
      "Explore beautiful destinations with carefully selected luxury accommodations.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description:
      "Book confidently with secure payments and verified hotel partners.",
  },
  {
    icon: HeartHandshake,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available anytime to assist with your travel needs.",
  },
];

const stats = [
  {
    number: "12K+",
    label: "Luxury Hotels",
  },
  {
    number: "850K+",
    label: "Happy Guests",
  },
  {
    number: "60+",
    label: "Cities",
  },
  {
    number: "4.8",
    label: "Average Rating",
  },
];

const AboutPage = () => {
  return (
    <section className="bg-background pt-28 pb-20">
      <div className="section-container">

        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="glass px-5 py-2 rounded-full text-primary font-medium">
            About StayEase
          </span>

          <h1 className="font-display text-5xl md:text-6xl font-bold mt-6">
            Luxury Hotel Booking
            <span className="block text-primary">
              Made Simple
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-8">
            StayEase helps travelers discover exceptional hotels,
            premium resorts, and unforgettable luxury stays with
            a seamless booking experience.
          </p>
        </motion.div>

        {/* Story */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 mt-20"
        >
          <h2 className="font-display text-4xl font-bold mb-6">
            Our Story
          </h2>

          <p className="text-muted-foreground leading-8">
            StayEase was created with one goal—to make luxury travel
            effortless. We partner with the finest hotels, resorts,
            and villas to provide memorable experiences for every
            traveler.
          </p>

          <p className="text-muted-foreground leading-8 mt-5">
            Whether you're planning a romantic getaway, a business
            trip, or a family vacation, StayEase ensures every stay
            is comfortable, secure, and unforgettable.
          </p>
        </motion.div>

        {/* Statistics */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {stats.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <h3 className="font-display text-4xl font-bold text-primary">
                {item.number}
              </h3>

              <p className="text-muted-foreground mt-2">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}

        <div className="mt-24">

          <h2 className="font-display text-4xl font-bold text-center mb-12">
            Why Choose StayEase
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5 }}
                  className="glass rounded-3xl p-8"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Icon
                      className="text-primary"
                      size={28}
                    />
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-7">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}

          </div>
        </div>

        {/* Mission */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 mt-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <Award
              className="text-primary"
              size={32}
            />

            <h2 className="font-display text-3xl font-bold">
              Our Mission
            </h2>
          </div>

          <p className="text-muted-foreground leading-8">
            To provide a premium hotel booking experience that is
            fast, secure, and enjoyable while connecting travelers
            with the world's finest luxury accommodations.
          </p>
        </motion.div>

        {/* Team */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 mt-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Users
              className="text-primary"
              size={32}
            />

            <h2 className="font-display text-3xl font-bold">
              Our Team
            </h2>
          </div>

          <p className="text-muted-foreground leading-8">
            Our passionate developers, designers, and travel experts
            work together to build an exceptional platform that makes
            every journey memorable.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutPage;