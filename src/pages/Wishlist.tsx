import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

export const Wishlist = () => {
  const { products, wishlist } = useShopStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 bg-grey-light">
        <div className="rounded-full bg-grey-dark/5 p-8">
          <Heart className="h-12 w-12 text-grey-medium/40" />
        </div>
        <h2 className="mt-8 text-3xl font-black tracking-tighter text-grey-dark">Your wishlist is empty</h2>
        <p className="mt-4 text-grey-medium">Save items you love to find them easily later.</p>
        <Link to="/shop" className="mt-10">
          <Button size="lg">Explore Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-light pt-24 pb-24 px-6 lg:px-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-grey-dark">Wishlist</h1>
          <p className="mt-2 text-grey-medium">{wishlist.length} items saved</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {wishlistedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
