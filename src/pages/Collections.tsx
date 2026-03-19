import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Collections = () => {
  const collections = [
    {
      id: 'essential-combos',
      name: 'The Combo Series',
      desc: 'Curated sets of clothing and footwear designed to work perfectly together.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
      path: '/combos'
    },
    {
      id: 'tech-utility',
      name: 'Tech Utility',
      desc: 'Performance-driven gear for the urban explorer.',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop',
      path: '/shop?category=Clothing'
    },
    {
      id: 'minimal-essentials',
      name: 'Minimal Essentials',
      desc: 'Timeless pieces that form the foundation of any wardrobe.',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop',
      path: '/shop?category=Clothing'
    },
    {
      id: 'footwear-lab',
      name: 'Footwear Lab',
      desc: 'The latest in technical and minimalist footwear design.',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      path: '/shop?category=Footwear'
    }
  ];

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold tracking-[0.4em] text-secondary mb-4 block"
        >
          Curated Series
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter text-grey-dark"
        >
          Collections
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col, idx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="group relative aspect-[4/5] overflow-hidden rounded-[48px] bg-white border border-grey-dark/5 shadow-sm"
          >
            <img 
              src={col.image} 
              alt={col.name} 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-10">
              <h3 className="text-3xl font-black tracking-tighter text-white mb-2">{col.name}</h3>
              <p className="text-sm text-white/60 mb-8 max-w-xs">{col.desc}</p>
              <Link to={col.path}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold tracking-widest text-grey-dark"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
