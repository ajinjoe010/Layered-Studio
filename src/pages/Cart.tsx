import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShopStore } from '../store/useShopStore';
import { Button } from '../components/Button';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useShopStore();
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 bg-grey-light">
        <div className="rounded-full bg-grey-dark/5 p-8">
          <ShoppingBag className="h-12 w-12 text-grey-medium/40" />
        </div>
        <h2 className="mt-8 text-3xl font-black tracking-tighter text-grey-dark">Your cart is empty</h2>
        <p className="mt-4 text-grey-medium">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="mt-10">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-light pt-24 pb-24 px-6 lg:px-24">
      <h1 className="text-5xl font-black tracking-tighter mb-12 text-grey-dark">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item) => (
            <motion.div
              layout
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-6 border-b border-grey-dark/10 pb-8"
            >
              <Link to={`/product/${item.id}`} className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-grey-dark/5">
                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </Link>
              
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold tracking-tight text-grey-dark">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="mt-1 text-xs font-medium text-grey-medium tracking-widest">
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                  </div>
                  <span className="font-bold text-grey-dark">₹{item.price * item.quantity}</span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4 rounded-full border border-grey-dark/10 px-4 py-2">
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}>
                      <Minus className="h-3 w-3 text-grey-dark" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-grey-dark">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}>
                      <Plus className="h-3 w-3 text-grey-dark" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                    className="text-grey-medium hover:text-secondary transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl bg-grey-dark/5 p-8">
            <h2 className="text-xl font-black tracking-tighter mb-6 text-grey-dark">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-grey-medium">Subtotal</span>
                <span className="font-bold text-grey-dark">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-grey-medium">Shipping</span>
                <span className="font-bold text-grey-dark">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <hr className="border-grey-dark/10" />
              <div className="flex justify-between text-lg font-black tracking-tighter text-grey-dark">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Link to="/checkout" className="mt-8 block">
              <Button size="lg" className="w-full">
                Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-grey-medium tracking-widest font-bold">
              <span className="flex h-1.5 w-1.5 rounded-full bg-secondary" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
