import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "text-white",
  bg = "bg-indigo-600",
  change,
  changeType = "up",
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between">

        <div className="flex-1">

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {value}
          </h2>

          {change && (
            <div
              className={`mt-4 flex items-center gap-1 text-sm font-semibold ${
                changeType === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {changeType === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}

              <span>{change}</span>
            </div>
          )}

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${bg}`}
        >
          {Icon && (
            <Icon
              size={30}
              className={color}
            />
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default StatCard;