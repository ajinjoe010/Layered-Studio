import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

export const TrackOrder = () => {
  const { id } = useParams();

  const steps = [
    { id: 1, name: 'Order Placed', date: 'March 2, 2024, 10:30 AM', status: 'completed', icon: Clock },
    { id: 2, name: 'Processing', date: 'March 2, 2024, 02:15 PM', status: 'current', icon: Package },
    { id: 3, name: 'Shipped', date: 'Pending', status: 'upcoming', icon: Truck },
    { id: 4, name: 'Delivered', date: 'Pending', status: 'upcoming', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Link to="/profile" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-grey-medium hover:text-secondary transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Profile
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-grey-dark mb-4">Track Order</h1>
          <p className="text-grey-medium font-medium">Order ID: <span className="text-grey-dark font-black">{id || 'VNTG-8829'}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-8 rounded-[2.5rem] bg-white border border-grey-dark/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-grey-medium mb-2 uppercase">Status</p>
            <p className="text-xl font-black text-secondary">In Transit</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white border border-grey-dark/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-grey-medium mb-2 uppercase">Est. Delivery</p>
            <p className="text-xl font-black text-grey-dark">March 5, 2024</p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-white border border-grey-dark/5 shadow-sm">
            <p className="text-[10px] font-bold tracking-widest text-grey-medium mb-2 uppercase">Carrier</p>
            <p className="text-xl font-black text-grey-dark">Vantage Express</p>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-white border border-grey-dark/5 shadow-xl mb-12">
          <h2 className="text-2xl font-black tracking-tighter mb-10">Tracking Timeline</h2>
          <div className="space-y-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-2 bottom-2 w-px bg-grey-dark/10" />

            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-6 relative z-10"
              >
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  step.status === 'completed' ? "bg-grey-dark text-white" :
                  step.status === 'current' ? "bg-secondary text-white shadow-secondary/20" :
                  "bg-grey-light text-grey-medium"
                )}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={cn(
                    "font-black tracking-tight",
                    step.status === 'upcoming' ? "text-grey-medium" : "text-grey-dark"
                  )}>
                    {step.name}
                  </h3>
                  <p className="text-xs font-medium text-grey-medium mt-1">{step.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-grey-dark text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-black tracking-tighter">Shipping Address</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              John Doe<br />
              123 Street Name<br />
              City, State 12345<br />
              United States
            </p>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 bg-secondary/10 skew-x-12 translate-x-12" />
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" onClick={() => window.print()}>Download Invoice</Button>
        </div>
      </div>
    </div>
  );
};
