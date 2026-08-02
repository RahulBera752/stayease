import { motion } from "framer-motion";

const SimilarHotels = ({ city }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-8 mt-8"
    >
      <h2 className="font-display text-3xl font-bold mb-4">
        Similar Hotels
      </h2>

      <p className="text-muted-foreground">
        More luxury hotels in <strong>{city}</strong> will appear here.
      </p>
    </motion.div>
  );
};

export default SimilarHotels;