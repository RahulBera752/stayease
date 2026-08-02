import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils.js';

const StatCard = ({ label, value, change, trend, icon: Icon, iconClass, delay = 0 }) => {
  const isUp = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-premium p-5 sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1.5">{value}</h3>
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconClass)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
            isUp ? 'text-emerald-600 bg-emerald-500/10' : 'text-destructive bg-destructive/10'
          )}
        >
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(change)}%
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
