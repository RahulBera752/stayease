import { motion } from 'framer-motion';
import { BadgePercent, Headset, ShieldCheck, CalendarCheck } from 'lucide-react';

const whyChooseUsData = [
  {
    id: 1,
    icon: BadgePercent,
    title: "Best Price Guarantee",
    description: "Find a lower price elsewhere? We match it, no questions asked.",
  },
  {
    id: 2,
    icon: Headset,
    title: "24/7 Concierge Support",
    description: "Real humans, real help — day or night, wherever you are.",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Verified Reviews Only",
    description: "Every review comes from a guest who actually stayed.",
  },
  {
    id: 4,
    icon: CalendarCheck,
    title: "Free Cancellation",
    description: "Plans change. Cancel most bookings free up to 24 hours before.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-luxury relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-14">
          <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">
            Why StayEase
          </span>
          <h2 className="font-display text-4xl font-bold text-white mt-2">
            The Luxury Experience You Deserve
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUsData.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-7 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-white/20">
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;