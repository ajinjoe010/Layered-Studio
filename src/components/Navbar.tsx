import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Search, Home as HomeIcon, Briefcase, Menu, Sparkles, Heart, X, ChevronRight, Instagram, Twitter, Facebook } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../utils/cn';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, wishlist } = useShopStore();
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const centerLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Shop', path: '/shop', icon: Briefcase },
    { name: 'AI Lab', path: '/ai-lab', icon: Sparkles },
  ];

  const getProfilePath = () => {
    if (!isAuthenticated) return '/auth';
    return user?.role === 'admin' ? '/admin-panel' : '/profile';
  };

  const rightLinks = [
    { name: 'Profile', path: getProfilePath(), icon: User },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, count: wishlist.length },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, count: cart.length },
  ];

  const menuCategories = [
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Trending Now', path: '/trending-now' },
    { name: 'Combos', path: '/combos' },
    { name: 'Clothing', path: '/shop?category=Clothing' },
    { name: 'Footwear', path: '/shop?category=Footwear' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Collections', path: '/collections' },
  ];

  const springConfig = { type: 'spring', stiffness: 150, damping: 20, mass: 1.2 } as const;

  return (
    <>
      <div className="fixed top-6 left-0 w-full z-50 px-6 lg:px-12 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            'mx-auto flex items-center justify-between px-6 lg:px-8 transition-all duration-500 rounded-full border border-white/20 backdrop-blur-xl pointer-events-auto',
            isScrolled 
              ? 'h-12 w-[90%] lg:w-[60%] bg-white/30 shadow-sm' 
              : 'h-16 w-full max-w-7xl bg-white/50 shadow-md'
          )}
        >
          {/* Left Section: Menu & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8 bg-grey-dark text-white rounded-full hover:bg-secondary transition-all liquid-effect"
            >
              <Menu className="h-4 w-4" />
            </button>
            
            <Link to="/" className="flex items-center group">
              <span className="text-sm font-black tracking-tighter group-hover:text-secondary transition-colors">
                Layered
              </span>
            </Link>
          </div>

          {/* Center Section: Main Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {centerLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-[10px] font-bold tracking-widest transition-all",
                    isActive 
                      ? "text-secondary" 
                      : "text-grey-dark/60 hover:text-grey-dark"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center gap-4">
            {rightLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "relative flex items-center justify-center transition-all",
                    isActive 
                      ? "text-secondary" 
                      : "text-grey-dark/60 hover:text-grey-dark"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.count !== undefined && link.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-grey-dark text-[8px] font-bold text-white rounded-full border border-white/50">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-4 left-4 bottom-4 w-full max-w-sm z-[70] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b border-grey-dark/5">
                <span className="text-xs font-black tracking-[0.2em] text-grey-dark/40">Navigation</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 bg-grey-dark/5 rounded-full hover:bg-grey-dark hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-10">
                <div className="space-y-10">
                  <div>
                    <div className="space-y-2">
                      {centerLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          className="flex items-center justify-between group p-4 rounded-2xl hover:bg-grey-dark/5 transition-all"
                        >
                          <span className="text-3xl font-black tracking-tighter group-hover:text-secondary transition-colors">
                            {link.name}
                          </span>
                          <div className="h-10 w-10 rounded-full bg-grey-dark/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-grey-dark/40 mb-6 block px-4">Collections</span>
                    <div className="grid grid-cols-1 gap-2 px-4">
                      {menuCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          to={cat.path}
                          className="text-sm font-bold tracking-wider text-grey-dark/60 hover:text-secondary transition-colors py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-grey-dark text-white">
                <div className="flex items-center gap-6 mb-8">
                  <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="text-white/60 hover:text-secondary transition-colors"><Facebook className="h-5 w-5" /></a>
                </div>
                <p className="text-[10px] font-bold tracking-widest text-white/40">
                  © 2026 Layered Studio
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
