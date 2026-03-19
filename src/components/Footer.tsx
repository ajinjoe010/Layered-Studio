import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="px-6 pb-12">
      <div className="bg-grey-dark rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div>
              <Link to="/" className="text-2xl font-black tracking-tighter">LAYERED</Link>
              <p className="mt-4 text-white/40 text-xs tracking-widest font-bold">© 2024 All Right Reserved.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-widest text-white/40 mb-6">Shop</h4>
              <ul className="space-y-2 text-xs font-bold tracking-widest">
                <li><Link to="/shop" className="hover:text-white/60">All Products</Link></li>
                <li><Link to="/combos" className="hover:text-white/60">Combos</Link></li>
                <li><Link to="/shop?category=Clothing" className="hover:text-white/60">Clothing</Link></li>
                <li><Link to="/shop?category=Footwear" className="hover:text-white/60">Footwear</Link></li>
                <li><Link to="/accessories" className="hover:text-white/60">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-widest text-white/40 mb-6">Company</h4>
              <ul className="space-y-2 text-xs font-bold tracking-widest">
                <li><Link to="/about" className="hover:text-white/60">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white/60">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-widest text-white/40 mb-6">Legal</h4>
              <ul className="space-y-2 text-xs font-bold tracking-widest">
                <li><a href="#" className="hover:text-white/60">Privacy</a></li>
                <li><a href="#" className="hover:text-white/60">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
