import { motion } from 'motion/react';
import { useShopStore } from '../store/useShopStore';
import { ProductCard } from '../components/ProductCard';

export const Accessories = () => {
  const { products } = useShopStore();
  const accessoryProducts = products.filter(p => p.category === 'Accessories');

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold tracking-[0.4em] text-secondary mb-4 block"
        >
          The Essentials
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter text-grey-dark"
        >
          Accessories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-grey-medium max-w-xl"
        >
          Elevate your look with our curated selection of premium accessories. From handcrafted leather to industrial silver.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {accessoryProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
