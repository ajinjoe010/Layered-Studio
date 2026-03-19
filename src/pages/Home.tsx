import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, Play, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { useShopStore } from '../store/useShopStore';
import { cn } from '../utils/cn';

export const Home = () => {
  const { products } = useShopStore();
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 3);
  const newArrivals = products.filter(p => p.isNew).slice(0, 3);
  const dealProducts = products.filter(p => p.discount && p.discount > 0);

  return (
    <div className="flex flex-col bg-grey-light">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full px-6 pt-16 pb-12">
        <div className="relative h-[85vh] w-full overflow-hidden rounded-[40px] bg-grey-dark">
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop"
            alt="Hero"
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-sm font-bold tracking-[0.3em] mb-4"
            >
              Layered Collective
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[15vw] font-black text-white leading-[0.8]"
            >
              Layered
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-lg text-white/80 text-sm font-medium leading-relaxed"
            >
              Your destination for premium minimal streetwear. We offer a wide range of curated pieces shipped directly from our studio to yours.
            </motion.p>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <Link to="/shop">
                <motion.div
                  whileHover="hover"
                  initial="initial"
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Button className="bg-white text-grey-dark px-10 py-5 text-xs font-black tracking-[0.2em] rounded-full transition-all duration-500 border-none flex items-center gap-0 hover:gap-3 hover:bg-secondary hover:text-white">
                    <span className="relative">Get Started</span>
                    <motion.div
                      variants={{
                        initial: { width: 0, opacity: 0, x: -10 },
                        hover: { width: 'auto', opacity: 1, x: 0 }
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowRight className="h-4 w-4 transition-colors" />
                    </motion.div>
                  </Button>
                  <motion.div
                    variants={{
                      initial: { opacity: 0, scale: 0.8 },
                      hover: { opacity: 1, scale: 1 }
                    }}
                    className="absolute inset-0 rounded-full bg-secondary/20 blur-xl -z-10"
                  />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Drops Carousel - Clean & Minimal Redesign */}
      <section className="py-32 px-6 lg:px-24 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] font-bold tracking-[0.5em] text-secondary block mb-6 italic"
              >
                Limited Availability
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-8xl font-bold tracking-tighter leading-[0.8]"
              >
                Daily <br /> <span className="text-black/20">Drops</span>
              </motion.h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-10 pb-2"
            >
              <div className="text-right">
                <div className="text-3xl font-bold tracking-tighter tabular-nums">23:59:59</div>
                <div className="text-[9px] font-bold tracking-[0.2em] text-black/40">Reset Timer</div>
              </div>
              <div className="h-12 w-px bg-black/5 hidden md:block" />
              <Link to="/shop" className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] text-black/30 hover:text-black transition-all">
                View All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="relative">
            <div className="flex gap-8 lg:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12">
              {dealProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="min-w-[85%] md:min-w-[45%] lg:min-w-[30%] snap-start group"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-grey-light mb-8">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6">
                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold tracking-widest shadow-sm">
                          -{product.discount}% OFF
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                    
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold tracking-tight text-grey-dark">{product.name}</h3>
                        <div className="text-right">
                          <span className="text-[10px] line-through text-black/20 mr-2 font-medium">₹{product.price}</span>
                          <span className="text-lg font-bold text-secondary">₹{Math.round(product.price * (1 - (product.discount || 0) / 100))}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold tracking-[0.3em] text-black/30">{product.category}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Minimal Scroll Progress Bar */}
            <div className="w-full h-px bg-black/5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-secondary w-1/4"
                animate={{ x: ['0%', '300%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[40px] p-12 flex flex-col justify-between aspect-video md:aspect-auto">
            <h2 className="text-4xl font-display leading-none">Style for the <br /> People</h2>
            <p className="text-grey-dark/60 text-sm max-w-xs mt-4">We want our community to be inspired to express their true selves through minimal design.</p>
            <div className="mt-8 h-32 w-full rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
          </div>
          <div className="bg-grey-dark text-white rounded-[40px] p-12 flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium leading-tight">Each piece is curated by our <br /> fashion experts, so they are as <br /> premium as they look.</p>
            </div>
            <div className="mt-12 flex items-center justify-between">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 w-16 rounded-full border-4 border-grey-dark overflow-hidden">
                    <img src={`https://picsum.photos/seed/style${i}/200/200`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 px-6 lg:px-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['Clothing', 'Footwear', 'Accessories'].map((cat, i) => (
              <Link 
                key={cat} 
                to={`/shop?category=${cat}`}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-colors whitespace-nowrap",
                  i === 0 ? "bg-grey-dark text-white" : "bg-white text-grey-dark border border-grey-dark/10 hover:bg-grey-dark/5"
                )}
              >
                {cat}
              </Link>
            ))}
          </div>
          <Link to="/shop" className="px-6 py-3 rounded-full border border-grey-dark/10 text-xs font-bold tracking-widest hover:bg-grey-dark/5 whitespace-nowrap">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'The Combo Series', desc: 'AI-curated outfits for any occasion.', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop', path: '/combos' },
            { name: 'Footwear Lab', desc: 'Technical pieces for any terrain.', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop', path: '/shop?category=Footwear' },
            { name: 'Accessories', desc: 'The finishing touches.', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', path: '/accessories' }
          ].map((item) => (
            <Link key={item.name} to={item.path} className="group relative aspect-[4/5] overflow-hidden rounded-[40px] bg-grey-dark">
              <img src={item.img} className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-display leading-none">{item.name}</h3>
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-white/60 max-w-[200px]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-6 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-[8vw] font-display leading-[0.8]">New <br /> Arrivals</h2>
          <p className="max-w-md text-grey-dark/60 text-sm">Bring style into your daily life with our latest selections, including technical outerwear, premium basics, and one-of-a-kind pieces.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Goods Section */}
      <section className="py-24 px-6 lg:px-24 text-center">
        <h2 className="text-[8vw] font-display leading-[0.8] mb-12">Quality Style & <br /> Curated Goods</h2>
        <p className="max-w-2xl mx-auto text-grey-dark/60 text-sm mb-16">We offer a carefully curated selection of minimal streetwear, hand-crafted essentials that put quality ahead of quantity. Each piece is designed to last.</p>
        
        <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-[60px] overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
            >
              <Play className="h-10 w-10 text-white fill-current" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* FAQ / Info Accordion */}
      <section className="py-24 px-6 lg:px-24 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {[
            'Ordering for Delivery?',
            'Personal Styling Services',
            'Do we ship internationally?',
            'Ordering for Pick up?'
          ].map((item) => (
            <div key={item} className="p-8 rounded-[32px] border border-grey-dark/10 flex items-center justify-between hover:bg-grey-dark/5 transition-colors cursor-pointer group">
              <h3 className="text-xl font-bold tracking-tight">{item}</h3>
              <div className="h-10 w-10 rounded-full border border-grey-dark/10 flex items-center justify-center group-hover:bg-grey-dark group-hover:text-white transition-all">
                <ArrowRight className="h-5 w-5 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community / Newsletter */}
      <section className="px-6 pb-12">
        <div className="bg-grey-dark rounded-[60px] p-24 text-center text-white relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative z-10">
            <h2 className="text-[8vw] font-display leading-[0.8] mb-8">Join the <br /> Community!</h2>
            <p className="text-white/60 text-sm mb-12">Subscribe to Layered to receive monthly style tips, <br /> store updates, promotions & more</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['Instagram', 'Twitter', 'LinkedIn', 'Telegram', 'Pinterest'].map(social => (
                <button key={social} className="px-8 py-3 rounded-full border border-white/20 text-xs font-bold tracking-widest hover:bg-white hover:text-grey-dark transition-all">
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
