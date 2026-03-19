import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-secondary mb-4 block">Get in Touch</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-grey-dark leading-none">
            We're here to help.
          </h1>
          <p className="mt-8 text-grey-medium max-w-xl mx-auto leading-relaxed">
            Have a question about an order, a product, or just want to say hello? Our team is always ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {[
              { icon: Mail, title: "Email Us", desc: "hello@layered.studio", sub: "Available 24/7" },
              { icon: Phone, title: "Call Us", desc: "+1 (555) 123-4567", sub: "Mon-Fri, 9am-6pm EST" },
              { icon: MapPin, title: "Visit Us", desc: "123 Fashion Ave, New York, NY 10001", sub: "Flagship Store" }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-grey-dark/5 shadow-sm"
              >
                <div className="p-4 rounded-2xl bg-secondary/10 text-secondary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-grey-medium mb-1">{item.title}</h3>
                  <p className="text-lg font-black uppercase tracking-tight text-grey-dark">{item.desc}</p>
                  <p className="text-xs text-grey-medium mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7 bg-white rounded-[40px] p-12 border border-grey-dark/5 shadow-sm"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-grey-medium">Full Name</label>
                  <input type="text" className="w-full bg-grey-light/50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-grey-medium">Email Address</label>
                  <input type="email" className="w-full bg-grey-light/50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-grey-medium">Subject</label>
                <select className="w-full bg-grey-light/50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary transition-all">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Partnerships</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-grey-medium">Message</label>
                <textarea rows={5} className="w-full bg-grey-light/50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary transition-all resize-none" placeholder="How can we help you?" />
              </div>
              <Button className="w-full" size="lg">
                Send Message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Live Chat CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Need faster help? Try our Live Chat</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
