import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, useShopStore } from '../store/useShopStore';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { wishlist, toggleWishlist } = useShopStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block bg-white rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-grey-dark/5 hover:-translate-y-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute top-4 left-4 z-20 bg-grey-dark/10 backdrop-blur-md text-grey-dark px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
            {product.category}
          </div>
          <motion.img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={cn(
              "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all z-20",
              isWishlisted ? "bg-secondary text-white" : "bg-white/50 text-grey-dark hover:bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </motion.button>

          {product.isNew && (
            <div className="absolute bottom-4 left-4 z-20 bg-secondary text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest liquid-effect">
              New Arrival
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 z-20 bg-white/50 backdrop-blur-md text-grey-dark px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
            <div className="h-1 w-1 rounded-full bg-secondary animate-pulse" />
            AI Fit
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight leading-tight text-grey-dark">
                {product.name}
              </h3>
              <p className="mt-1 text-[10px] font-medium text-grey-dark/40 uppercase tracking-widest">Premium Collection</p>
            </div>
            <span className="text-sm font-black text-secondary">₹{product.price}</span>
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-grey-dark/5 pt-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-grey-dark/30">Available</span>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider group-hover:text-secondary transition-colors liquid-effect">
              Discover <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
