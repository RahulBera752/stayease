import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  Star,
  Ticket,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx'; // 👈 Update path if needed

export const adminNavLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Hotels', to: '/admin/hotels', icon: Building2 },
  { label: 'Bookings', to: '/admin/bookings', icon: CalendarCheck },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Coupons', to: '/admin/coupons', icon: Ticket },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const SidebarContent = ({ collapsed, onCollapseToggle, onLinkClick, onLogout }) => (
  <div className="flex h-full flex-col">
    {/* Header */}
    <div className={cn('flex items-center h-20 px-5 shrink-0', collapsed ? 'justify-center' : 'justify-between')}>
      {!collapsed && (
        <Link to="/admin" className="flex items-center gap-2" onClick={onLinkClick}>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Stay<span className="text-accent">Ease</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
      )}
      <button
        type="button"
        onClick={onCollapseToggle}
        className="hidden lg:flex p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {adminNavLinks.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onLinkClick}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              collapsed && 'justify-center',
              isActive
                ? 'bg-gradient-primary text-white shadow-soft'
                : 'text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
            )
          }
        >
          <Icon size={19} className="shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>

    {/* Logout Button */}
    <div className="px-3 py-4 border-t border-border">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onLinkClick) onLinkClick();
          onLogout();
        }}
        title={collapsed ? 'Logout' : undefined}
        className={cn(
          'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all shadow-md shadow-red-500/20 active:scale-[0.98] cursor-pointer',
          collapsed && 'justify-center'
        )}
      >
        <LogOut size={19} className="shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  </div>
);

const AdminSidebar = ({ collapsed, onCollapseToggle, mobileOpen, onMobileClose }) => {
  const { logout } = useAuth(); // 👈 Consume the logout function from AuthContext

  const handleLogout = async () => {
    toast.success('Logged out successfully');
    await logout();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-card border-r border-border transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onCollapseToggle={onCollapseToggle}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-premium"
            >
              <button
                type="button"
                onClick={onMobileClose}
                className="absolute top-6 right-4 p-2 rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent
                collapsed={false}
                onCollapseToggle={onMobileClose}
                onLinkClick={onMobileClose}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;