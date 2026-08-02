import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const AdminComingSoon = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-premium flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-full bg-primary/10">
        <Construction size={28} className="text-primary" />
      </div>
      <h2 className="font-display text-xl font-bold text-foreground mb-2">{title} module coming soon</h2>
      <p className="text-muted-foreground max-w-sm">
        This section is being built in an upcoming step. Check back after the next feature update.
      </p>
    </motion.div>
  );
};

export default AdminComingSoon;
