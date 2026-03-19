import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shirt, Ruler, Eye, LayoutGrid, Loader2, ChevronRight, Palette, Tag, Brain } from 'lucide-react';
import { generateOutfit, analyzeBodyType, virtualTryOn } from '../services/geminiService';
import { Mannequin } from '../components/Mannequin';
import { cn } from '../utils/cn';

type Feature = 'outfit_generator' | 'body_analysis' | 'virtual_try_on';

export const AILab = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('outfit_generator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);

  // Form states
  const [outfitForm, setOutfitForm] = useState({ occasion: '', weather: '', style: '', budget: '' });
  const [bodyForm, setBodyForm] = useState({ height: '', weight: '', chest: '', waist: '' });
  const [tryOnForm, setTryOnForm] = useState({ item_name: '', category: '', color: '', user_style: '' });

  const handleGenerateOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setCurrentOutfitIndex(0);
    try {
      const data = await generateOutfit(outfitForm);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeBody = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeBodyType(bodyForm);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVirtualTryOn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await virtualTryOn(tryOnForm);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { id: 'outfit_generator', name: 'Outfit Generator', icon: Shirt, description: 'Personalized men\'s outfit suggestions.' },
    { id: 'body_analysis', name: 'Body Type Analyzer', icon: Ruler, description: 'Find the best fits for your physique.' },
    { id: 'virtual_try_on', name: 'Virtual Try-On', icon: Eye, description: 'Visualize how items match your style.' },
  ];

  // Helper to get colors for mannequin
  const getMannequinColors = () => {
    if (!result) return {};
    
    if (activeFeature === 'outfit_generator') {
      const currentOutfit = Array.isArray(result) ? result[currentOutfitIndex] : result;
      if (!currentOutfit) return {};
      return {
        topColor: currentOutfit.color_palette?.[0] || '#E5E7EB',
        bottomColor: currentOutfit.color_palette?.[1] || '#D1D5DB',
        shoesColor: currentOutfit.color_palette?.[2] || '#9CA3AF'
      };
    }

    if (activeFeature === 'virtual_try_on') {
      const isTop = tryOnForm.category.toLowerCase() === 'top' || tryOnForm.category.toLowerCase() === 'outerwear';
      return {
        topColor: isTop ? tryOnForm.color : '#E5E7EB',
        bottomColor: !isTop ? tryOnForm.color : '#D1D5DB',
        shoesColor: '#9CA3AF'
      };
    }

    return {};
  };

  const mannequinColors = getMannequinColors();

  return (
    <div className="pt-32 pb-20 px-6 bg-grey-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-grey-dark/5 text-grey-dark text-[10px] font-bold tracking-[0.2em] mb-6">
            <Sparkles className="h-3 w-3 text-secondary" />
            Computational Fashion Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-6">
            AI LAB<span className="text-grey-dark/10">.02</span>
          </h1>
          <p className="max-w-xl mx-auto text-grey-dark/50 text-base font-medium">
            Next-generation men's fashion intelligence. Powered by advanced neural models to redefine your personal style.
          </p>
        </motion.div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setActiveFeature(f.id as Feature);
                setResult(null);
              }}
              className={cn(
                "p-6 rounded-[2rem] text-left transition-all group relative overflow-hidden",
                activeFeature === f.id 
                  ? "bg-grey-dark text-white shadow-xl shadow-grey-dark/20" 
                  : "bg-white border border-grey-dark/5 hover:border-grey-dark/20 text-grey-dark"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                activeFeature === f.id ? "bg-white/10" : "bg-grey-dark/5"
              )}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold tracking-wider mb-1">{f.name}</h3>
              <p className={cn(
                "text-[10px] tracking-widest font-medium",
                activeFeature === f.id ? "text-white/40" : "text-grey-dark/30"
              )}>
                {f.description}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Input Panel */}
          <motion.div 
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-grey-dark/5 sticky top-32"
          >
            {activeFeature === 'outfit_generator' && (
              <form onSubmit={handleGenerateOutfit} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Occasion</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Summer Wedding, Job Interview"
                    className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                    value={outfitForm.occasion}
                    onChange={(e) => setOutfitForm({...outfitForm, occasion: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Weather</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Hot & Humid, Rainy Autumn"
                    className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                    value={outfitForm.weather}
                    onChange={(e) => setOutfitForm({...outfitForm, weather: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Style</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                      value={outfitForm.style}
                      onChange={(e) => setOutfitForm({...outfitForm, style: e.target.value})}
                      required
                    >
                      <option value="">Select Style</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Streetwear">Streetwear</option>
                      <option value="Classic">Classic</option>
                      <option value="Avant-Garde">Avant-Garde</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Budget</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $200"
                      className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                      value={outfitForm.budget}
                      onChange={(e) => setOutfitForm({...outfitForm, budget: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-grey-dark text-white rounded-full font-bold tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50 liquid-effect"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate Outfit
                </button>
              </form>
            )}

            {activeFeature === 'body_analysis' && (
              <form onSubmit={handleAnalyzeBody} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Height (cm)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 180"
                        className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                        value={bodyForm.height}
                        onChange={(e) => setBodyForm({...bodyForm, height: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Weight (kg)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 75"
                        className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                        value={bodyForm.weight}
                        onChange={(e) => setBodyForm({...bodyForm, weight: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Chest (cm)</label>
                      <input 
                        type="number" 
                        placeholder="Optional"
                        className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                        value={bodyForm.chest}
                        onChange={(e) => setBodyForm({...bodyForm, chest: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Waist (cm)</label>
                      <input 
                        type="number" 
                        placeholder="Optional"
                        className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                        value={bodyForm.waist}
                        onChange={(e) => setBodyForm({...bodyForm, waist: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full py-5 bg-grey-dark text-white rounded-full font-bold tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50 liquid-effect"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
                    Analyze Physique
                  </button>
              </form>
            )}

            {activeFeature === 'virtual_try_on' && (
              <form onSubmit={handleVirtualTryOn} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Oversized Linen Shirt"
                    className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                    value={tryOnForm.item_name}
                    onChange={(e) => setTryOnForm({...tryOnForm, item_name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Category</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                      value={tryOnForm.category}
                      onChange={(e) => setTryOnForm({...tryOnForm, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sage Green"
                      className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                      value={tryOnForm.color}
                      onChange={(e) => setTryOnForm({...tryOnForm, color: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold tracking-widest text-grey-dark/40 block px-2">Your Personal Style</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Modern Minimalist"
                    className="w-full px-6 py-4 rounded-2xl bg-grey-dark/5 border-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm font-medium"
                    value={tryOnForm.user_style}
                    onChange={(e) => setTryOnForm({...tryOnForm, user_style: e.target.value})}
                    required
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-grey-dark text-white rounded-full font-bold tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50 liquid-effect"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Start Virtual Try-On
                </button>
              </form>
            )}
          </motion.div>

          {/* Result Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={`${activeFeature}-result`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-grey-dark/5 min-h-[600px]"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    {/* Visual Representation */}
                    {(activeFeature === 'outfit_generator' || activeFeature === 'body_analysis' || activeFeature === 'virtual_try_on') && (
                      <div className="xl:col-span-5 flex flex-col gap-8">
                        <div className="bg-grey-dark/5 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[450px]">
                          <Mannequin 
                            {...mannequinColors}
                            bodyType={result.body_type || 'Average'}
                            className="w-full h-full"
                          />
                        </div>
                        
                        {/* Secondary Visual (Image) for specific features if needed, 
                            but we usually show it in the data column. 
                            Let's move the AI generated image here for better balance if it exists. */}
                        {activeFeature === 'virtual_try_on' && result.image_url && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-grey-dark/5"
                          >
                            <img 
                              src={result.image_url} 
                              alt="Virtual Try-On Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-grey-dark text-[8px] font-bold tracking-widest">
                              Neural Preview
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Data Representation */}
                    <div className={cn(
                      "space-y-10",
                      (activeFeature === 'outfit_generator' || activeFeature === 'body_analysis' || activeFeature === 'virtual_try_on') ? "xl:col-span-7" : "w-full"
                    )}>
                      {activeFeature === 'outfit_generator' && Array.isArray(result) && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h2 className="text-3xl font-black tracking-tighter">{result[currentOutfitIndex].outfit_name}</h2>
                              <p className="text-[10px] font-bold tracking-widest text-grey-dark/30">Option {currentOutfitIndex + 1} of {result.length}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setCurrentOutfitIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentOutfitIndex === 0}
                                className="p-3 rounded-full bg-grey-dark/5 hover:bg-grey-dark/10 disabled:opacity-20 transition-all"
                              >
                                <ChevronRight className="h-4 w-4 rotate-180" />
                              </button>
                              <button 
                                onClick={() => setCurrentOutfitIndex(prev => Math.min(result.length - 1, prev + 1))}
                                disabled={currentOutfitIndex === result.length - 1}
                                className="p-3 rounded-full bg-grey-dark text-white hover:bg-secondary disabled:opacity-20 transition-all"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentOutfitIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-8"
                            >
                              {result[currentOutfitIndex].image_url && (
                                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-grey-dark/5">
                                  <img 
                                    src={result[currentOutfitIndex].image_url} 
                                    alt={result[currentOutfitIndex].outfit_name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-grey-dark text-[10px] font-bold tracking-widest shadow-lg">
                                    Neural Preview
                                  </div>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-3xl bg-grey-dark/5 border border-grey-dark/5 transition-all hover:border-secondary/20">
                                  <span className="text-[9px] font-bold tracking-widest text-grey-dark/30 block mb-2">Top</span>
                                  <p className="text-xs font-bold leading-tight">{result[currentOutfitIndex].top}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-grey-dark/5 border border-grey-dark/5 transition-all hover:border-secondary/20">
                                  <span className="text-[9px] font-bold tracking-widest text-grey-dark/30 block mb-2">Bottom</span>
                                  <p className="text-xs font-bold leading-tight">{result[currentOutfitIndex].bottom}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-grey-dark/5 border border-grey-dark/5 transition-all hover:border-secondary/20">
                                  <span className="text-[9px] font-bold tracking-widest text-grey-dark/30 block mb-2">Shoes</span>
                                  <p className="text-xs font-bold leading-tight">{result[currentOutfitIndex].shoes}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold tracking-widest text-grey-dark/40 px-2">Accessories</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result[currentOutfitIndex].accessories.map((acc: string) => (
                                    <span key={acc} className="px-5 py-2.5 rounded-full bg-white border border-grey-dark/5 text-[10px] font-bold tracking-widest shadow-sm">
                                      {acc}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="p-8 rounded-[2.5rem] bg-secondary text-white shadow-xl shadow-secondary/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                  <Sparkles className="h-12 w-12" />
                                </div>
                                <div className="relative z-10">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[10px] font-bold tracking-[0.2em]">Curator's Note</span>
                                  </div>
                                  <p className="text-base font-medium leading-relaxed italic">"{result[currentOutfitIndex].style_tip}"</p>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      )}

                      {activeFeature === 'body_analysis' && (
                        <div className="space-y-10">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h2 className="text-4xl font-black tracking-tighter">{result.body_type}</h2>
                              <p className="text-[10px] font-bold tracking-widest text-secondary">Neural Physique Profile</p>
                            </div>
                            <div className="px-5 py-2 rounded-full bg-grey-dark text-white text-[10px] font-bold tracking-widest shadow-lg">
                              Analysis Complete
                            </div>
                          </div>

                          {result.image_url && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-grey-dark/5 group"
                            >
                              <img 
                                src={result.image_url} 
                                alt={result.body_type}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              <div className="absolute bottom-10 left-10 right-10">
                                <p className="text-white text-xs font-bold tracking-[0.3em] opacity-80 mb-2">Physique Reference</p>
                                <h3 className="text-white text-2xl font-black tracking-tighter">Optimized for {result.body_type}</h3>
                              </div>
                            </motion.div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6 p-8 rounded-[2.5rem] bg-grey-dark/5 border border-grey-dark/5">
                              <h4 className="text-[10px] font-bold tracking-widest text-secondary px-2">Recommended Fits</h4>
                              <div className="space-y-3">
                                {result.recommended_fits.map((fit: string) => (
                                  <div key={fit} className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-grey-dark/5 transition-all hover:translate-x-1">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                                      <ChevronRight className="h-3 w-3 text-secondary" />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight">{fit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-6 p-8 rounded-[2.5rem] bg-grey-dark/5 border border-grey-dark/5">
                              <h4 className="text-[10px] font-bold tracking-widest text-secondary px-2">Best Styles</h4>
                              <div className="space-y-3">
                                {result.best_clothing_styles.map((style: string) => (
                                  <div key={style} className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-grey-dark/5 transition-all hover:translate-x-1">
                                    <div className="w-6 h-6 rounded-full bg-grey-dark/5 flex items-center justify-center">
                                      <Shirt className="h-3 w-3 text-grey-dark" />
                                    </div>
                                    <span className="text-xs font-bold tracking-tight">{style}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-10 rounded-[3rem] bg-grey-dark text-white space-y-4 relative overflow-hidden shadow-2xl">
                            <div className="absolute -bottom-10 -right-10 opacity-5">
                              <Brain className="h-40 w-40" />
                            </div>
                            <div className="relative z-10">
                              <div className="flex items-center gap-2 mb-4">
                                <Brain className="h-5 w-5 text-secondary" />
                                <span className="text-[10px] font-bold tracking-[0.3em]">Neural Styling Insights</span>
                              </div>
                              <p className="text-lg font-medium leading-relaxed text-white/90">{result.styling_tips}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeFeature === 'virtual_try_on' && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h2 className="text-3xl font-black tracking-tighter">Style Preview</h2>
                              <p className="text-[10px] font-bold tracking-widest text-secondary">Virtual Try-On Sequence</p>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-grey-dark text-white text-[10px] font-bold tracking-widest">
                              Active Session
                            </div>
                          </div>

                          <div className="p-8 rounded-[2rem] bg-grey-dark/5 border border-dashed border-grey-dark/20">
                            <div className="flex items-center gap-2 mb-3">
                              <Tag className="h-3 w-3 text-grey-dark/40" />
                              <span className="text-[9px] font-bold tracking-widest text-grey-dark/40">Item Analysis</span>
                            </div>
                            <p className="text-sm font-medium text-grey-dark/70 leading-relaxed italic">
                              "{result.item_preview_description}"
                            </p>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-bold tracking-widest text-grey-dark/40 px-2">Perfect Matches</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div className="p-6 rounded-3xl bg-white border border-grey-dark/5 space-y-2">
                                <span className="text-[9px] font-bold tracking-widest text-grey-dark/30">Pants</span>
                                <p className="text-sm font-bold">{result.matching_items.pants}</p>
                              </div>
                              <div className="p-6 rounded-3xl bg-white border border-grey-dark/5 space-y-2">
                                <span className="text-[9px] font-bold tracking-widest text-grey-dark/30">Shoes</span>
                                <p className="text-sm font-bold">{result.matching_items.shoes}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-8 rounded-[2rem] bg-grey-dark text-white">
                            <p className="text-sm font-medium leading-relaxed">{result.style_tip}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/50 border border-dashed border-grey-dark/10 rounded-[3rem] min-h-[600px] flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-10 relative">
                    <Sparkles className="h-10 w-10 text-grey-dark/10" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-grey-dark/5 rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-4 text-grey-dark/40">Awaiting Neural Input</h3>
                  <p className="max-w-sm text-sm text-grey-dark/30 font-medium leading-relaxed">
                    Select a feature and configure the parameters on the left to initialize the fashion generation sequence.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
