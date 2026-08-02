import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/mockData.js';

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-4xl font-bold text-foreground mt-2">
            Loved by Travelers Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-premium p-7 relative"
            >
              <Quote className="absolute top-6 right-6 text-primary/10" size={48} />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={15}
                    className={idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
              <p className="text-card-foreground text-sm leading-relaxed mb-6 relative z-10">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-card-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
