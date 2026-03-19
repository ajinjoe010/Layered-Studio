import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ChevronRight, Star, Info, Ruler, X, Sparkles, Check } from 'lucide-react';
import { Product, useShopStore } from '../store/useShopStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { getOutfitRecommendations, getSizeRecommendation } from '../services/geminiService';

export const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, wishlist, toggleWishlist } = useShopStore();
  const { user, updateMeasurements } = useAuthStore();
  const product = products.find((p) => p.id === id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [recommendations, setRecommendations] = useState<{ products: Product[]; explanation: string }>({ products: [], explanation: '' });
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [sizeRec, setSizeRec] = useState<{ recommendedSize: string; explanation: string } | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  
  const [height, setHeight] = useState(user?.measurements?.height || 180);
  const [weight, setWeight] = useState(user?.measurements?.weight || 75);
  const [chest, setChest] = useState(user?.measurements?.chest || 100);
  const [waist, setWaist] = useState(user?.measurements?.waist || 85);
  const [fitPreference, setFitPreference] = useState<'Slim' | 'Regular' | 'Oversized'>(user?.measurements?.fitPreference || 'Regular');
  const [saveToProfile, setSaveToProfile] = useState(false);
  
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Theme mapping for dynamic background colors
  const themeMap: Record<string, { bg: string; accent: string }> = {
    'Black': { bg: '#F5F5F5', accent: '#1A1A1A' },
    'White': { bg: '#FFFFFF', accent: '#000000' },
    'Beige': { bg: '#FDF8F2', accent: '#D2B48C' },
    'Navy': { bg: '#F0F4F8', accent: '#000080' },
    'Grey': { bg: '#F8F8F8', accent: '#808080' },
    'Sand': { bg: '#FAF7F2', accent: '#C2B280' },
    'Olive': { bg: '#F2F4EF', accent: '#556B2F' },
    'Cream': { bg: '#FFFEFA', accent: '#FFFDD0' },
    'Striped': { bg: '#FDFCFB', accent: '#CCCCCC' },
    'Onyx': { bg: '#F2F2F2', accent: '#353935' },
    'Bone': { bg: '#F9F6F2', accent: '#E3DAC9' },
    'Slate': { bg: '#F0F2F5', accent: '#708090' },
    'Vintage Black': { bg: '#F4F4F4', accent: '#2B2B2B' },
    'Tan': { bg: '#FDF7F2', accent: '#D2B48C' },
    'Silver': { bg: '#F5F5F7', accent: '#C0C0C0' },
    'Neon Grey': { bg: '#F0F0F0', accent: '#D3D3D3' },
    'Triple Black': { bg: '#F0F0F0', accent: '#000000' },
    'Chocolate': { bg: '#F7F3F0', accent: '#7B3F00' },
    'Graphite': { bg: '#F2F2F2', accent: '#383838' },
    'Matte Black': { bg: '#F2F2F2', accent: '#282828' },
    'Dark Brown': { bg: '#F7F3F0', accent: '#654321' },
    'Off-White': { bg: '#FAF9F6', accent: '#FAF9F6' },
    'Classic Black': { bg: '#F2F2F2', accent: '#000000' },
    'Charcoal': { bg: '#F2F2F2', accent: '#36454F' },
    'Tortoise': { bg: '#FDF7F2', accent: '#483C32' },
    'Burgundy': { bg: '#F9F2F2', accent: '#800020' },
    'Camel': { bg: '#FDF8F2', accent: '#C19A6B' },
    'Natural': { bg: '#FAF9F6', accent: '#F5F5DC' },
    'Brown': { bg: '#F7F3F0', accent: '#964B00' },
  };

  const currentTheme = themeMap[selectedColor] || { bg: '#FDFCFB', accent: '#1A1A1A' };

  // Real color mapping
  const colorMap: Record<string, string> = {
    'Black': '#1A1A1A',
    'White': '#FFFFFF',
    'Beige': '#D2B48C',
    'Navy': '#000080',
    'Grey': '#808080',
    'Sand': '#C2B280',
    'Olive': '#556B2F',
    'Cream': '#FFFDD0',
    'Striped': 'repeating-linear-gradient(45deg, #eee, #eee 10px, #ccc 10px, #ccc 20px)',
  };

  const getColorStyle = (color: string) => {
    const hex = colorMap[color] || color.toLowerCase();
    return hex.startsWith('repeating') ? { background: hex } : { backgroundColor: hex };
  };

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setSelectedImage(0);
      
      // Fetch AI recommendations
      setIsRecommendationLoading(true);
      getOutfitRecommendations(product, products).then((res) => {
        setRecommendations(res);
        setIsRecommendationLoading(false);
      });
    }
    window.scrollTo(0, 0);
  }, [id, product]);

  // Automatic image sliding
  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [product]);

  if (!product) return <div className="py-32 text-center">Product not found</div>;

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product, selectedSize, selectedColor);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const handleSizeRec = async () => {
    setIsCalculatingSize(true);
    const rec = await getSizeRecommendation({
      height,
      weight,
      chest,
      waist,
      fitPreference,
      product
    });
    setSizeRec(rec);
    setSelectedSize(rec.recommendedSize);
    setIsCalculatingSize(false);

    if (saveToProfile) {
      updateMeasurements({
        height,
        weight,
        chest,
        waist,
        fitPreference
      });
    }
  };

  return (
    <motion.div 
      animate={{ backgroundColor: currentTheme.bg }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="min-h-screen text-[#1A1A1A] font-sans selection:bg-black selection:text-white overflow-x-hidden"
    >
      {/* Top Navigation Control */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-24 left-8 z-40"
      >
        <Link 
          to="/shop" 
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-black/5 bg-white/50 backdrop-blur-md hover:bg-black hover:text-white transition-all duration-500 shadow-sm"
        >
          <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-12 lg:pb-16">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Product Information (Col 1-3) */}
          <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-8 pt-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <motion.span 
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="text-[9px] font-bold tracking-[0.4em] text-black/60 block mb-4"
              >
                Summer Collection / 2024
              </motion.span>
              
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-8"
              >
                {product.name}
              </motion.h1>

              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="mb-8"
              >
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40 mb-2">Price</div>
                <div className="text-3xl font-bold text-black">₹{product.price}</div>
              </motion.div>

              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-xs text-black/50 leading-relaxed font-medium mb-8 max-w-xs"
              >
                {product.description}
              </motion.p>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-4 py-6 border-t border-black/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-black/5 shadow-sm">
                  <Heart className="h-4 w-4 text-secondary fill-secondary" />
                </div>
                <div>
                  <span className="text-xs font-bold block">143k</span>
                  <span className="text-[9px] tracking-widest text-black/60">Appreciations</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Center Column: Main Product Display (Col 4-9) */}
          <div className="order-1 lg:order-2 lg:col-span-6 w-full px-4 lg:px-6 flex flex-col lg:flex-row gap-6">
            {/* Vertical Thumbnails (Desktop) */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-4 py-4">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-16 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-500",
                      selectedImage === idx ? "border-black shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.button>
                ))}
              </div>
            )}

            <motion.div 
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="relative aspect-[3/4] w-full max-h-[70vh] overflow-hidden rounded-[3rem] shadow-2xl shadow-black/5 bg-white group"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedImage}
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) {
                      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                    } else if (info.offset.x < -100) {
                      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                    }
                  }}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Minimalist Counter Overlay */}
              {product.images.length > 1 && (
                <div className="absolute top-8 right-8 px-5 py-2 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg">
                  <span className="text-[10px] font-black tracking-[0.2em] text-black">
                    {String(selectedImage + 1).padStart(2, '0')} <span className="text-black/30 mx-1">/</span> {String(product.images.length).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Mobile Thumbnails Overlay */}
              {product.images.length > 1 && (
                <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        selectedImage === idx ? "w-8 bg-white" : "bg-white/40 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Swipe Indicators */}
              {product.images.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-6 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-black/5 hover:bg-black hover:text-white transition-all"
                    >
                      <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-6 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-black/5 hover:bg-black hover:text-white transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Right Column: Product Options Panel (Col 10-12) */}
          <div className="order-3 lg:col-span-3 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 lg:p-10 rounded-[3rem] border border-black/5 shadow-xl shadow-black/[0.02] liquid-effect"
            >
              {/* Color Selection */}
              <div className="mb-10">
                <span className="text-[9px] font-bold tracking-[0.3em] text-black/60 block mb-6">
                  Palette Selection
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all duration-500 p-1 relative group",
                        selectedColor === color ? "border-black" : "border-transparent hover:border-black/20"
                      )}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/5 shadow-inner" 
                        style={getColorStyle(color)} 
                      />
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest whitespace-nowrap">
                        {color}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Reference & Model Info */}
              <div className="space-y-6 mb-10 pb-8 border-b border-black/5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-black/60">Ref. Code</span>
                  <span className="text-[9px] font-bold tracking-widest">#7682-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold tracking-[0.3em] text-black/60">Model Fit</span>
                  <span className="text-[9px] font-bold tracking-widest">Size S / 177cm</span>
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === 'One Size') && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-black/60">
                      {product.category === 'Footwear' ? 'Select Size (EU)' : 
                       product.name.toLowerCase().includes('watch') ? 'Case Size' : 'Select Size'}
                    </span>
                    <button 
                      onClick={() => setIsSizeModalOpen(true)}
                      className="text-[9px] font-bold tracking-[0.3em] text-secondary hover:underline flex items-center gap-2"
                    >
                      <Ruler className="h-3 w-3" /> Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "h-12 flex items-center justify-center rounded-xl border text-[10px] font-bold transition-all duration-500 liquid-effect",
                          selectedSize === size 
                            ? "bg-black text-white border-black shadow-lg shadow-black/10" 
                            : "bg-white text-black/60 border-transparent hover:border-black/20 hover:text-black"
                        )}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className={cn(
                    "w-full h-16 rounded-2xl transition-all duration-500 shadow-xl liquid-effect group relative overflow-hidden",
                    isAddingToCart 
                      ? "bg-emerald-500 text-white border-none shadow-emerald-500/20" 
                      : "bg-black text-white hover:bg-black/90 border-none shadow-black/10"
                  )}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <AnimatePresence mode="wait">
                    {isAddingToCart ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <Check className="h-4 w-4" />
                        <span className="tracking-[0.4em] font-bold text-[9px]">Added to Bag</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" /> 
                        <span className="tracking-[0.4em] font-bold text-[9px]">Add to Bag</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    "w-full h-16 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-500 liquid-effect",
                    wishlist.includes(product.id)
                      ? "bg-secondary/10 border-secondary text-secondary"
                      : "bg-white border-black/5 text-black/60 hover:border-black hover:text-black"
                  )}
                >
                  <Heart className={cn("h-4 w-4", wishlist.includes(product.id) && "fill-current")} />
                  <span className="uppercase tracking-[0.4em] font-bold text-[9px]">
                    {wishlist.includes(product.id) ? "In Wishlist" : "Add to Wishlist"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Outfit Recommendations Section */}
      <section className="px-6 lg:px-12 py-32 bg-[#FDFCFB] border-y border-black/5 relative overflow-hidden">
        {/* Decorative AI Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/10">
                  <Sparkles className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.5em] text-secondary italic">AI Curated Outfit</span>
              </div>
              <h2 className="text-5xl lg:text-8xl font-bold tracking-tighter leading-none mb-8">Complete<br/>The Look</h2>
              
              {isRecommendationLoading ? (
                <div className="flex items-center gap-3 text-black/30">
                  <div className="h-4 w-4 border-2 border-black/10 border-t-secondary rounded-full animate-spin" />
                  <span className="text-[10px] font-bold tracking-widest">Analyzing your style...</span>
                </div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-black/50 leading-relaxed font-medium italic border-l-2 border-secondary/20 pl-6"
                >
                  "{recommendations.explanation}"
                </motion.p>
              )}
            </div>
            <Link to="/shop" className="flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] text-black/30 hover:text-black transition-all group">
              Explore All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isRecommendationLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
              {[1, 2].map(i => (
                <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-grey-light animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
              {recommendations.products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detailed Information Sections */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 space-y-32">
        
        {/* Fit & Details Grid */}
        <div className="grid lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-secondary block mb-6 italic">The Fit</span>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">Precision Tailoring</h2>
              <p className="text-sm text-black/50 leading-relaxed font-medium max-w-md">
                Designed with a contemporary silhouette that balances structure and ease. This piece is engineered to drape naturally while maintaining a sharp, defined profile.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40 mb-4">Silhouette</div>
                <div className="text-sm font-bold">Relaxed Modern</div>
              </div>
              <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40 mb-4">Length</div>
                <div className="text-sm font-bold">Mid-Thigh</div>
              </div>
              <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40 mb-4">Sleeve</div>
                <div className="text-sm font-bold">Full Tapered</div>
              </div>
              <div className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm">
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40 mb-4">Stretch</div>
                <div className="text-sm font-bold">Minimal (2%)</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-secondary block mb-6 italic">The Details</span>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">Craftsmanship</h2>
              <p className="text-sm text-black/50 leading-relaxed font-medium max-w-md">
                Every stitch is a testament to our commitment to quality. From the reinforced seams to the custom-molded hardware, no detail is overlooked.
              </p>
            </div>

            <ul className="space-y-6">
              {[
                "Premium Italian-sourced fabric blend",
                "Reinforced double-needle stitching",
                "Custom engraved hardware detailing",
                "Sustainable dyeing process",
                "Breathable interior lining"
              ].map((detail, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-medium text-black/70">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Customer Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-24 border-t border-black/5"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.4em] text-secondary block mb-6 italic">Feedback</span>
              <h2 className="text-4xl lg:text-7xl font-bold tracking-tighter">Client Reviews</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-[9px] font-bold tracking-[0.3em] text-black/40">Average Rating</div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-black text-black" />)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Elena R.", rating: 5, text: "The fit is absolutely perfect. It drapes beautifully and feels incredibly premium. Worth every rupee.", date: "2 days ago" },
              { name: "Marcus T.", rating: 5, text: "Incredible attention to detail. The fabric quality is unlike anything I've seen at this price point.", date: "1 week ago" },
              { name: "Sophia L.", rating: 4, text: "Beautiful piece. Slightly longer than expected but the tailoring is top-notch. Love the color palette.", date: "2 weeks ago" }
            ].map((review, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white border border-black/5 shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500 group">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-black text-black" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-black/40">{review.date}</span>
                </div>
                <p className="text-sm text-black/60 leading-relaxed font-medium mb-8 italic">"{review.text}"</p>
                <div className="text-[10px] font-bold tracking-[0.3em]">{review.name}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 60 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-7xl overflow-hidden rounded-[4rem] bg-[#FDFCFB] border border-black/5 shadow-2xl liquid-effect"
            >
              <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
                {/* Left Side: Chart */}
                <div className="lg:basis-[35%] p-16 lg:p-20 bg-white/50 border-r border-black/5">
                  <div className="flex items-center justify-between mb-20">
                    <h3 className="text-5xl font-bold tracking-tight">Size Chart</h3>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-black/40">
                      {product.category === 'Footwear' ? 'Foot Length / MM' : 'Metric / CM'}
                    </span>
                  </div>
                  
                  <div className="overflow-hidden rounded-[3rem] border border-black/5 bg-white shadow-xl shadow-black/[0.02]">
                    <table className="w-full text-left text-[10px]">
                      <thead>
                        <tr className="bg-[#FDFCFB] border-b border-black/5">
                          <th className="p-10 font-bold tracking-[0.4em] text-black/60">Size</th>
                          {product.category === 'Footwear' ? (
                            <>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">EU</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">UK</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">US</th>
                            </>
                          ) : product.name.toLowerCase().includes('watch') ? (
                            <>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Diameter</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Thickness</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Lug Width</th>
                            </>
                          ) : (
                            <>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Chest</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Length</th>
                              <th className="p-10 font-bold tracking-[0.4em] text-black/60">Shoulder</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {product.category === 'Footwear' ? (
                          [
                            { s: '40', eu: '40', uk: '6', us: '7' },
                            { s: '41', eu: '41', uk: '7', us: '8' },
                            { s: '42', eu: '42', uk: '8', us: '9' },
                            { s: '43', eu: '43', uk: '9', us: '10' },
                            { s: '44', eu: '44', uk: '10', us: '11' },
                          ].map((row) => (
                            <tr key={row.s} className={cn("transition-all duration-500", selectedSize === row.s && "bg-black/5")}>
                              <td className="p-10 font-bold text-2xl">{row.s}</td>
                              <td className="p-10 text-black/40 font-medium">{row.eu}</td>
                              <td className="p-10 text-black/40 font-medium">{row.uk}</td>
                              <td className="p-10 text-black/40 font-medium">{row.us}</td>
                            </tr>
                          ))
                        ) : product.name.toLowerCase().includes('watch') ? (
                          [
                            { s: '38mm', d: '38', t: '10', l: '18' },
                            { s: '40mm', d: '40', t: '11', l: '20' },
                            { s: '42mm', d: '42', t: '12', l: '22' },
                          ].map((row) => (
                            <tr key={row.s} className={cn("transition-all duration-500", selectedSize === row.s && "bg-black/5")}>
                              <td className="p-10 font-bold text-2xl">{row.s}</td>
                              <td className="p-10 text-black/40 font-medium">{row.d}mm</td>
                              <td className="p-10 text-black/40 font-medium">{row.t}mm</td>
                              <td className="p-10 text-black/40 font-medium">{row.l}mm</td>
                            </tr>
                          ))
                        ) : (
                          [
                            { s: 'S', c: '112', l: '70', sh: '50' },
                            { s: 'M', c: '118', l: '72', sh: '52' },
                            { s: 'L', c: '124', l: '74', sh: '54' },
                            { s: 'XL', c: '130', l: '76', sh: '56' },
                          ].map((row) => (
                            <tr key={row.s} className={cn("transition-all duration-500", selectedSize === row.s && "bg-black/5")}>
                              <td className="p-10 font-bold text-2xl">{row.s}</td>
                              <td className="p-10 text-black/40 font-medium">{row.c}</td>
                              <td className="p-10 text-black/40 font-medium">{row.l}</td>
                              <td className="p-10 text-black/40 font-medium">{row.sh}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: AI Assistant */}
                <div className="lg:basis-[65%] p-16 lg:p-20 relative overflow-hidden bg-white">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-20">
                      <div className="flex items-center gap-8">
                        <div className="h-16 w-16 rounded-3xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-lg shadow-secondary/10">
                          <Sparkles className="h-8 w-8 text-secondary" />
                        </div>
                        <h3 className="text-5xl font-bold tracking-tight">AI Fit</h3>
                      </div>
                      <button 
                        onClick={() => setIsSizeModalOpen(false)}
                        className="h-16 w-16 flex items-center justify-center hover:bg-[#FDFCFB] rounded-full transition-colors border border-black/5"
                      >
                        <X className="h-8 w-8 text-black/60" />
                      </button>
                    </div>
                    
                    {(product.category === 'Clothing' || product.category === 'Footwear') ? (
                      <div className="max-h-[75vh] overflow-y-auto pr-6 custom-scrollbar pb-12">
                        <p className="text-sm text-black/40 mb-16 leading-relaxed font-medium">Input your physical metrics for a precision fit analysis by Layered AI.</p>
                        
                        <div className="space-y-16">
                          {/* Height & Weight */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <div className="flex justify-between mb-4">
                                <label className="text-[10px] font-bold tracking-[0.4em] text-black/40">Height</label>
                                <span className="text-sm font-bold">{height} cm</span>
                              </div>
                              <input
                                type="range"
                                min="150"
                                max="210"
                                value={height}
                                onChange={(e) => setHeight(parseInt(e.target.value))}
                                className="w-full h-[2px] bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                              />
                            </div>
                            
                            <div className="space-y-6">
                              <div className="flex justify-between mb-4">
                                <label className="text-[10px] font-bold tracking-[0.4em] text-black/40">Weight</label>
                                <span className="text-sm font-bold">{weight} kg</span>
                              </div>
                              <input
                                type="range"
                                min="40"
                                max="150"
                                value={weight}
                                onChange={(e) => setWeight(parseInt(e.target.value))}
                                className="w-full h-[2px] bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-20 space-y-16">
                          <Button 
                            className="w-full h-24 rounded-[2.5rem] bg-black text-white border-none font-bold tracking-[0.4em] text-[10px] shadow-2xl shadow-black/20 liquid-effect" 
                            onClick={handleSizeRec}
                            isLoading={isCalculatingSize}
                          >
                            Analyze Fit
                          </Button>
                          
                          {sizeRec && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-16 rounded-[4rem] bg-[#FDFCFB] border border-black/5 shadow-2xl liquid-effect mb-8"
                            >
                              <div className="flex items-center gap-6 text-[10px] font-bold text-secondary tracking-[0.4em] mb-8">
                                <Sparkles className="h-5 w-5" />
                                Recommended / {sizeRec.recommendedSize}
                              </div>
                              <p className="text-xs text-black/40 leading-relaxed font-medium">{sizeRec.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-20">
                        <Info className="h-12 w-12 text-black/10 mb-8" />
                        <p className="text-sm text-black/40 leading-relaxed font-medium max-w-xs">
                          AI Fit analysis is currently optimized for Clothing and Footwear categories. For accessories, please refer to the size chart.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
