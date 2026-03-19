import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ruler, Sparkles, Loader2, ChevronRight, Info, Check, AlertCircle, Shirt, Footprints, Watch } from 'lucide-react';
import { getSizeRecommendation } from '../services/geminiService';
import { useShopStore } from '../store/useShopStore';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../utils/cn';

type Category = 'Clothing' | 'Footwear' | 'Accessories';

export const AISizeGuide = () => {
  const { products } = useShopStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recommendedSize: string; explanation: string } | null>(null);
  const [category, setCategory] = useState<Category>('Clothing');
  const [height, setHeight] = useState(user?.measurements?.height || 175);
  const [weight, setWeight] = useState(user?.measurements?.weight || 70);
  const [chest, setChest] = useState(user?.measurements?.chest || 100);
  const [waist, setWaist] = useState(user?.measurements?.waist || 85);
  const [fitPreference, setFitPreference] = useState<'Slim' | 'Regular' | 'Oversized'>(user?.measurements?.fitPreference || 'Regular');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await getSizeRecommendation({
        height,
        weight,
        chest,
        waist,
        fitPreference,
        product: selectedProduct
      });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Clothing', icon: Shirt, name: 'Clothing' },
    { id: 'Footwear', icon: Footprints, name: 'Footwear' },
    { id: 'Accessories', icon: Watch, name: 'Accessories' },
  ];

  const filteredProducts = products.filter(p => p.category === category);

  return (
    <div className="pt-32 pb-20 px-6 bg-[#FDFCFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="h-3 w-3" />
            Neural Fit Intelligence
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">
            AI SIZE GUIDE<span className="text-black/5">.01</span>
          </h1>
          <p className="max-w-xl mx-auto text-black/40 text-sm font-medium leading-relaxed">
            Eliminate sizing uncertainty with our advanced neural fitting engine. Input your metrics for a precision-engineered size recommendation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Input Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-black/5"
          >
            <form onSubmit={handleCalculate} className="space-y-10">
              {/* Category Selection */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 block px-2">Product Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id as Category);
                        const firstInCat = products.find(p => p.category === cat.id);
                        if (firstInCat) setSelectedProduct(firstInCat);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all duration-500",
                        category === cat.id 
                          ? "bg-black text-white border-black shadow-lg" 
                          : "bg-white border-black/5 text-black/40 hover:border-black/20"
                      )}
                    >
                      <cat.icon className="h-5 w-5" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Selection */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 block px-2">Select Product</label>
                <select 
                  className="w-full px-8 py-5 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-bold uppercase tracking-wider"
                  value={selectedProduct.id}
                  onChange={(e) => {
                    const p = products.find(prod => prod.id === e.target.value);
                    if (p) setSelectedProduct(p);
                  }}
                >
                  {filteredProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Metrics */}
              <div className="space-y-16 py-12 border-y border-black/5">
                <div className="space-y-8">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Height</label>
                    <span className="text-sm font-bold">{height} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="140" 
                    max="220" 
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>
                <div className="space-y-8">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30">Weight</label>
                    <span className="text-sm font-bold">{weight} kg</span>
                  </div>
                  <input 
                    type="range" 
                    min="40" 
                    max="160" 
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-8 bg-black text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-black/10 liquid-effect mt-12"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Calculate Precision Fit
              </button>
            </form>
          </motion.div>

          {/* Result Panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-black/5 min-h-[600px] flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/10">
                      <Check className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-widest">Recommendation Ready</h2>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/30">Neural Analysis Complete</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/30">Your Perfect Size</span>
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[12rem] font-black leading-none tracking-tighter text-black"
                      >
                        {result.recommendedSize}
                      </motion.div>
                    </div>

                    <div className="max-w-md p-10 rounded-[3rem] bg-[#FDFCFB] border border-black/5 relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
                        <Info className="h-32 w-32" />
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-black/60 italic relative z-10">
                        "{result.explanation}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-16 pt-12 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/5">
                        <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest">{selectedProduct.name}</p>
                        <p className="text-[9px] font-bold tracking-widest text-black/30">₹{selectedProduct.price}</p>
                      </div>
                    </div>
                    <button className="px-10 py-4 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-secondary transition-all shadow-lg shadow-black/10">
                      Add to Bag
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/50 border border-dashed border-black/10 rounded-[4rem] min-h-[600px] flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-10 relative">
                    <Ruler className="h-10 w-10 text-black/10" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-black/5 rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black/40">Awaiting Neural Input</h3>
                  <p className="max-w-sm text-sm text-black/30 font-medium leading-relaxed">
                    Configure your physical metrics and select a product on the left to initialize the precision sizing sequence.
                  </p>
                  
                  <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="p-6 rounded-3xl bg-white/50 border border-black/5 flex flex-col items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-black/20" />
                      <p className="text-[8px] font-bold uppercase tracking-widest text-black/30">98% Accuracy Rate</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/50 border border-black/5 flex flex-col items-center gap-3">
                      <Sparkles className="h-4 w-4 text-black/20" />
                      <p className="text-[8px] font-bold uppercase tracking-widest text-black/30">Neural Fit Engine</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xs">01</div>
            <h4 className="text-sm font-bold uppercase tracking-widest">Neural Mapping</h4>
            <p className="text-xs text-black/40 leading-relaxed font-medium">Our AI analyzes thousands of fit data points to understand how different fabrics and cuts interact with various body types.</p>
          </div>
          <div className="space-y-6">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xs">02</div>
            <h4 className="text-sm font-bold uppercase tracking-widest">Metric Precision</h4>
            <p className="text-xs text-black/40 leading-relaxed font-medium">By combining height and weight with product-specific dimensions, we achieve a level of accuracy far beyond standard size charts.</p>
          </div>
          <div className="space-y-6">
            <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-xs">03</div>
            <h4 className="text-sm font-bold uppercase tracking-widest">Zero Waste</h4>
            <p className="text-xs text-black/40 leading-relaxed font-medium">Reducing returns through better sizing is our commitment to sustainable fashion. Get it right the first time, every time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
