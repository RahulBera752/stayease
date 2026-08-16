import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/contact' },
    { label: 'Press', to: '/about' },
    { label: 'Blog', to: '/' },
  ],
  Support: [
    { label: 'Help Center', to: '/contact' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Cancellation Options', to: '/my-bookings' },
    { label: 'Safety Information', to: '/about' },
  ],
  Explore: [
    { label: 'Search Hotels', to: '/search' },
    { label: 'Popular Destinations', to: '/search' },
    { label: 'Special Offers', to: '/search' },
    { label: 'Gift Cards', to: '/contact' },
  ],
  Legal: [
    { label: 'Terms of Service', to: '/about' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Cookie Policy', to: '/cookies' },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed! Watch your inbox for exclusive deals.');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-4">
            <Link to="/" className="font-display text-3xl font-bold text-white">
              Stay<span className="text-accent">Ease</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              Discover extraordinary stays across the world's most sought-after destinations.
              Curated luxury, seamless booking, unforgettable experiences.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin size={16} className="text-accent shrink-0" />
                <span>221B Marine Drive, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail size={16} className="text-accent shrink-0" />
                <span>support@stayease.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone size={16} className="text-accent shrink-0" />
                <span>+91 22 4000 1234</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-primary transition-colors duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-white font-semibold text-sm mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-slate-400 hover:text-accent transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-3">Get Exclusive Deals</h4>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe and get 10% off your next booking.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg bg-gradient-primary hover:shadow-glow transition-all"
                aria-label="Subscribe"
              >
                <Send size={17} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
          <p>Crafted with care for travelers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;