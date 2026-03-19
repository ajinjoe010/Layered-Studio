import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Truck } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

export const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedShippingId, setSelectedShippingId] = useState('standard');
  const { cart, clearCart, addOrder } = useShopStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 150, time: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 450, time: '1-2 business days' },
  ];

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const selectedMethod = shippingMethods.find(m => m.id === selectedShippingId)!;
  
  // Standard shipping is free over 3000
  const shippingPrice = (selectedShippingId === 'standard' && subtotal > 3000) ? 0 : selectedMethod.price;
  const total = subtotal + shippingPrice;

  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleComplete = () => {
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing' as const,
      total: total,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.images[0]
      })),
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      }
    };

    addOrder(newOrder);
    setLastOrderId(orderId);
    setStep(4);
    setTimeout(() => {
      clearCart();
      navigate('/profile');
    }, 5000);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 bg-grey-light">
        <h2 className="text-3xl font-black tracking-tighter text-grey-dark">Nothing to checkout</h2>
        <Link to="/shop" className="mt-6">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Steps */}
        <div className="flex items-center justify-center mb-16 relative max-w-md mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-grey-dark/10 -translate-y-1/2 z-0" />
          {[
            { id: 1, name: 'Shipping & Delivery', icon: Truck },
            { id: 2, name: 'Payment', icon: CreditCard },
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center px-8 bg-grey-light">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center transition-colors border-4 border-grey-light",
                step >= s.id ? "bg-secondary text-white" : "bg-grey-dark/5 text-grey-medium"
              )}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "mt-2 text-[10px] font-bold tracking-widest",
                step >= s.id ? "text-secondary" : "text-grey-medium"
              )}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {step === 4 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-8">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-grey-dark">Order Confirmed</h2>
            <p className="mt-4 text-grey-medium">Thank you for your purchase. Your order #{lastOrderId} is being processed.</p>
            <p className="mt-2 text-sm text-grey-medium/60">Redirecting to profile in a few seconds...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-grey-dark mb-2">Checkout Details</h3>
                    <p className="text-xs text-grey-medium font-medium">Please provide your contact and shipping information.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-1 w-8 bg-secondary rounded-full" />
                        <h4 className="text-[10px] font-bold tracking-[0.3em] text-grey-medium">Contact Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="alex@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-1 w-8 bg-secondary rounded-full" />
                        <h4 className="text-[10px] font-bold tracking-[0.3em] text-grey-medium">Shipping Address</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">First Name</label>
                          <input 
                            type="text" 
                            placeholder="Alex"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">Last Name</label>
                          <input 
                            type="text" 
                            placeholder="Rivera"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">Address</label>
                          <input 
                            type="text" 
                            placeholder="Street address, Apartment, Suite, etc."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-grey-medium">City</label>
                          <input 
                            type="text" 
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-grey-medium">State</label>
                            <input 
                              type="text" 
                              placeholder="Maharashtra"
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest text-grey-medium">ZIP Code</label>
                            <input 
                              type="text" 
                              placeholder="400001"
                              value={formData.zipCode}
                              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark transition-all" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Method */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-1 w-8 bg-secondary rounded-full" />
                        <h4 className="text-[10px] font-bold tracking-[0.3em] text-grey-medium">Delivery Method</h4>
                      </div>
                      <div className="space-y-4">
                        {shippingMethods.map((method) => {
                          const price = (method.id === 'standard' && subtotal > 3000) ? 0 : method.price;
                          return (
                            <label 
                              key={method.id} 
                              className={cn(
                                "flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all duration-300 bg-white",
                                selectedShippingId === method.id 
                                  ? "border-secondary ring-1 ring-secondary shadow-lg shadow-secondary/5" 
                                  : "border-grey-dark/10 hover:border-grey-dark/20"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <input 
                                  type="radio" 
                                  name="delivery" 
                                  className="accent-secondary h-4 w-4" 
                                  checked={selectedShippingId === method.id}
                                  onChange={() => setSelectedShippingId(method.id)}
                                />
                                <div>
                                  <p className="font-bold tracking-tight text-grey-dark">{method.name}</p>
                                  <p className="text-[10px] text-grey-medium tracking-widest">{method.time}</p>
                                </div>
                              </div>
                              <span className="font-bold text-grey-dark">
                                {price === 0 ? 'FREE' : `₹${price}`}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-16 rounded-2xl text-xs font-black tracking-[0.2em]" onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <h3 className="text-2xl font-black tracking-tighter text-grey-dark">Payment</h3>
                  <div className="p-6 rounded-2xl border border-grey-dark/10 space-y-6 bg-white">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Card Number</label>
                      <div className="relative">
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">CVC</label>
                        <input type="text" placeholder="000" className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1" onClick={handleComplete}>Complete Purchase</Button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-grey-dark/5 p-8 sticky top-32">
                <h3 className="text-xl font-black tracking-tighter mb-8 text-grey-dark">Your Order</h3>
                <div className="space-y-6 mb-8">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                      <div className="h-16 w-12 rounded-lg bg-white overflow-hidden flex-shrink-0">
                        <img src={item.images[0]} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold tracking-tight text-grey-dark">{item.name}</p>
                        <p className="text-[10px] text-grey-medium tracking-widest">{item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-grey-dark">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-grey-dark/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-grey-medium">Subtotal</span>
                    <span className="font-bold text-grey-dark">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-grey-medium">Shipping</span>
                    <span className="font-bold text-grey-dark">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black tracking-tighter pt-4 text-grey-dark">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
