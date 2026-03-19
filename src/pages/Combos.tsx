import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { getAICuratedCombos, Combo } from '../services/geminiService';
import { useShopStore } from '../store/useShopStore';
import { cn } from '../utils/cn';

export const Combos = () => {
  const { products, addToCart } = useShopStore();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      setIsLoading(true);
      const aiCombos = await getAICuratedCombos(products);
      setCombos(aiCombos);
      setIsLoading(false);
    };
    fetchCombos();
  }, []);

  const handleAddComboToCart = (combo: Combo) => {
    const comboProducts = products.filter(p => combo.productIds.includes(p.id));
    comboProducts.forEach(product => {
      addToCart(product, product.sizes[0], product.colors[0]);
    });
  };

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.4em] text-secondary mb-4"
        >
          <Sparkles className="h-4 w-4" />
          AI Curated
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black tracking-tighter text-grey-dark"
        >
          The Combo Series
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-grey-medium max-w-xl"
        >
          Let our AI assistant curate the perfect outfits for you. These hand-picked combinations are designed to elevate your streetwear game.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
          <p className="text-xs font-bold tracking-widest text-grey-medium">AI is curating your looks...</p>
        </div>
      ) : (
        <div className="space-y-32">
          {combos.map((combo, idx) => {
            const comboProducts = products.filter(p => combo.productIds.includes(p.id));
            const totalPrice = comboProducts.reduce((sum, p) => sum + p.price, 0);

            return (
              <motion.section
                key={combo.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  {/* Combo Info */}
                  <div className="lg:w-1/3 sticky top-32">
                    <span className="text-[10px] font-black tracking-[0.3em] text-secondary/60 mb-2 block">Combo {idx + 1}</span>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">{combo.name}</h2>
                    <p className="text-sm text-grey-medium leading-relaxed mb-8">{combo.description}</p>
                    
                    <div className="p-8 rounded-[32px] bg-white border border-grey-dark/5 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-bold tracking-widest text-grey-medium">Total Value</span>
                        <span className="text-2xl font-black">₹{totalPrice}</span>
                      </div>
                      <Button 
                        className="w-full h-14 rounded-2xl" 
                        onClick={() => handleAddComboToCart(combo)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add Full Combo
                      </Button>
                    </div>
                  </div>

                  {/* Combo Products */}
                  <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {comboProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
                
                {idx < combos.length - 1 && (
                  <div className="mt-32 h-px w-full bg-grey-dark/5" />
                )}
              </motion.section>
            );
          })}
        </div>
      )}

      {/* Refresh Combos */}
      {!isLoading && (
        <div className="mt-32 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="group"
          >
            Generate New Combos <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};
