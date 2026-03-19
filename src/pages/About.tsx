import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { ArrowRight, Globe, Users, Heart } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold tracking-[0.4em] text-secondary mb-4 block">Our Story</span>
          <h1 className="text-6xl font-black tracking-tighter text-grey-dark leading-none mb-12">
            Crafting the future of <br /> digital fashion.
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-grey-medium leading-relaxed">
            <p>
              Founded in 2024, Layered Studio was born from a simple idea: that fashion should be as dynamic as the people who wear it. We combine cutting-edge AI technology with timeless design principles to create a shopping experience that is truly personal.
            </p>
            <p>
              Our team of designers and engineers work tirelessly to ensure every piece in our collection meets the highest standards of quality and style. We believe in transparency, sustainability, and the power of technology to make the world a more beautiful place.
            </p>
          </div>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: "Global Vision", desc: "Shipping to over 50 countries worldwide with carbon-neutral delivery." },
            { icon: Users, title: "Community First", desc: "Join thousands of fashion enthusiasts in our exclusive digital lab." },
            { icon: Heart, title: "Ethical Design", desc: "Every piece is crafted with respect for both people and the planet." }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-8 rounded-3xl bg-white border border-grey-dark/5 shadow-sm"
            >
              <item.icon className="h-8 w-8 text-secondary mb-6" />
              <h3 className="text-lg font-bold tracking-tight text-grey-dark mb-2">{item.title}</h3>
              <p className="text-sm text-grey-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-32 p-12 rounded-[48px] bg-grey-dark text-white text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tighter mb-6">Join the Revolution</h2>
            <p className="text-grey-light/60 max-w-xl mx-auto mb-10">
              Be the first to know about new drops, exclusive AI-generated collections, and special events.
            </p>
            <Button variant="secondary" size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary/20 to-transparent opacity-50" />
        </motion.div>
      </div>
    </div>
  );
};
