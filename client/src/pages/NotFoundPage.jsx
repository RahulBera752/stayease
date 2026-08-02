import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, SearchX } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10">
          <SearchX size={44} className="text-primary" />
        </div>
        <h1 className="font-display text-6xl font-bold text-foreground mb-3">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
