import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export const Shop = () => {
  const { products } = useShopStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const categoryFilter = searchParams.get('category');
  const typeFilter = searchParams.get('filter');

  const filteredProducts = products
    .filter(p => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (typeFilter === 'new' && !p.isNew) return false;
      if (typeFilter === 'trending' && !p.isTrending) return false;
      if (p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default newest (assuming order in data is newest first)
    });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 lg:px-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-grey-dark/5 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] bg-grey-dark text-white px-3 py-1 rounded-full">Directory</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-grey-dark/40">Archive 2026</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none text-grey-dark">
            {categoryFilter || 'Shop All'}
          </h1>
          <p className="mt-4 text-[10px] font-bold tracking-widest text-grey-dark/40">Total Results: {filteredProducts.length}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-2 px-8 py-4 text-[11px] font-bold tracking-widest transition-all rounded-full liquid-effect",
              isFilterOpen ? "bg-secondary text-white" : "bg-grey-dark text-white hover:bg-secondary"
            )}
          >
            <Filter className="h-4 w-4" /> Filter
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 bg-white border border-grey-dark/10 px-8 py-4 text-[11px] font-bold tracking-widest hover:bg-grey-dark/5 transition-all rounded-full"
            >
              Sort: {sortOptions.find(o => o.id === sortBy)?.label} <ChevronDown className={cn("h-4 w-4 transition-transform", isSortOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-4 w-64 bg-white rounded-3xl p-2 z-50 shadow-2xl border border-grey-dark/5"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        "w-full px-6 py-4 text-left text-[11px] font-bold tracking-widest transition-all rounded-2xl",
                        sortBy === option.id ? "bg-grey-dark text-white" : "hover:bg-grey-dark/5 text-grey-dark"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-40 text-center rounded-[40px] border-2 border-dashed border-grey-dark/10">
            <p className="text-[11px] font-bold tracking-[0.2em] text-grey-dark/40">No results found</p>
            <Button 
              className="mt-8 rounded-full px-10 py-4 text-[11px] font-bold bg-grey-dark text-white"
              onClick={() => {
                setSearchParams({});
                setMaxPrice(2000);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-4 right-4 z-[70] w-full max-w-md bg-white rounded-[40px] shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-3xl font-black tracking-tighter">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-grey-dark/5 rounded-full hover:bg-grey-dark hover:text-white transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] text-grey-dark/40 block mb-6">Categories</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        searchParams.delete('category');
                        setSearchParams(searchParams);
                      }}
                      className={cn(
                        "text-left px-6 py-4 text-[11px] font-bold rounded-2xl transition-all",
                        !categoryFilter ? "bg-grey-dark text-white" : "bg-grey-dark/5 hover:bg-grey-dark/10"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          searchParams.set('category', cat);
                          setSearchParams(searchParams);
                        }}
                        className={cn(
                          "text-left px-6 py-4 text-[11px] font-bold rounded-2xl transition-all",
                          categoryFilter === cat ? "bg-grey-dark text-white" : "bg-grey-dark/5 hover:bg-grey-dark/10"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] text-grey-dark/40 block mb-6">Price Range</label>
                  <div className="space-y-6">
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-grey-dark/10 appearance-none cursor-pointer accent-secondary rounded-full" 
                    />
                    <div className="flex justify-between text-[11px] font-black text-grey-dark">
                      <span>₹0</span>
                      <span>Up to ₹{maxPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-24">
                <Button 
                  className="w-full h-16 rounded-full bg-secondary text-white border-none font-bold text-[11px] liquid-effect" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
