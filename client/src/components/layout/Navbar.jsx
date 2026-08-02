import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  User, 
  Heart, 
  Calendar, 
  LogOut, 
  LayoutDashboard,
  PlusCircle,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Search Hotels', to: '/search' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // 🚪 Pull centralized user and logout method from AuthContext
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 🏨 Role normalization check
  const userRole = user?.role ? String(user.role).toLowerCase().trim() : '';
  
  // 🔍 Check if current role matches any owner/admin variant
  const isOwnerOrAdmin = ['hotelowner', 'hotel_owner', 'owner', 'admin'].includes(userRole);
  const isAdmin = userRole === 'admin';

  // 🎯 Dynamic routing based on role
  const addHotelLink = isAdmin ? '/admin/hotels/add' : '/owner/hotels/add';
  const manageHotelsLink = isAdmin ? '/admin/hotels' : '/owner/hotels';

  // Debug logger to trace user role in Console (F12)
  useEffect(() => {
    if (user) {
      console.log('👤 [Navbar] Logged-in User Object:', user);
      console.log('🏷️ [Navbar] Current Detected Role:', userRole);
      console.log('🔑 [Navbar] Is Owner or Admin?:', isOwnerOrAdmin);
    }
  }, [user, userRole, isOwnerOrAdmin]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🚪 Clean Handled Logout
  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);

    toast.success('Logged out successfully');

    if (logout) {
      await logout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`font-display text-2xl font-bold tracking-tight transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Stay<span className="text-accent">Ease</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-primary/5'
                    : isActive
                    ? 'text-white bg-white/20'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Action Controls & Profile Menu */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={`p-2.5 rounded-full transition-colors ${
              scrolled
                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-primary/10 hover:bg-primary/25 transition-colors cursor-pointer"
              >
                <img
                  src={
                    user.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || 'User'
                    )}&background=4F46E5&color=fff`
                  }
                  alt={user.name || 'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span
                  className={`text-sm font-medium ${
                    scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'
                  }`}
                >
                  {user.name ? user.name.split(' ')[0] : 'Account'}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden py-2 z-50"
                  >
                    {/* My Profile */}
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    {/* My Bookings */}
                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Calendar size={16} /> My Bookings
                    </Link>

                    {/* Wishlist */}
                    <Link
                      to="/dashboard/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Heart size={16} /> Wishlist
                    </Link>

                    {/* 🏨 HOTEL OWNER & ADMIN OPTIONS */}
                    {isOwnerOrAdmin && (
                      <>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        <Link
                          to={addHotelLink}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          <PlusCircle size={16} /> Add New Hotel
                        </Link>
                        <Link
                          to={manageHotelsLink}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Building2 size={16} /> Manage Hotels
                        </Link>
                      </>
                    )}

                    {/* Admin Dashboard Option */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    {/* Desktop Logout Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-slate-700 dark:text-slate-200 hover:text-primary'
                    : 'text-white hover:text-white/80'
                }`}
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary !py-2.5 !px-5 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className={`lg:hidden p-2 rounded-lg ${
            scrolled ? 'text-slate-700 dark:text-slate-200' : 'text-white'
          }`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white dark:bg-slate-900 shadow-card overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              {user ? (
                <>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User size={18} /> My Profile
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Calendar size={18} /> My Bookings
                  </Link>

                  <Link
                    to="/dashboard/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Heart size={18} /> Wishlist
                  </Link>

                  {/* 🏨 HOTEL OWNER & ADMIN MOBILE OPTIONS */}
                  {isOwnerOrAdmin && (
                    <>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                      <Link
                        to={addHotelLink}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10"
                      >
                        <PlusCircle size={18} /> Add New Hotel
                      </Link>
                      <Link
                        to={manageHotelsLink}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Building2 size={18} /> Manage Hotels
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  )}

                  {/* Mobile Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-4 py-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline flex-1 !py-2.5 text-sm text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 !py-2.5 text-sm text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;