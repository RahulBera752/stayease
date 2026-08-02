import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { adminNavLinks } from './AdminSidebar.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const AdminTopbar = ({ onMenuClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTitle =
    [...adminNavLinks].reverse().find((link) => location.pathname.startsWith(link.to))?.label || 'Dashboard';

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to log out');
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-20 px-4 sm:px-6 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{currentTitle}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Manage your StayEase platform</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <img
              src={
                user?.avatar?.url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=4F46E5&color=fff`
              }
              alt={user?.name || 'Admin'}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {user?.name?.split(' ')[0] || 'Admin'}
            </span>
            <ChevronDown size={15} className="hidden sm:block text-muted-foreground" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-xl2 bg-card shadow-premium border border-border overflow-hidden py-2"
              >
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User size={16} /> My Profile
                </Link>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
