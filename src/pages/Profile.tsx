import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Ruler, Heart, Star, Palette, X, ShoppingBag } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useShopStore, Order } from '../store/useShopStore';
import { cn } from '../utils/cn';
import { AnimatePresence } from 'motion/react';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const { user, logout, updateMeasurements } = useAuthStore();
  const { orders, wishlist, toggleWishlist, products } = useShopStore();
  const navigate = useNavigate();

  const userOrders = orders.filter(o => o.customerEmail === user?.email);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Measurements State
  const [measurements, setMeasurements] = useState({
    height: user?.measurements?.height || 180,
    weight: user?.measurements?.weight || 75,
    chest: user?.measurements?.chest || 102,
    waist: user?.measurements?.waist || 84,
    fitPreference: user?.measurements?.fitPreference || 'Regular'
  });

  // Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      street: '123 Street Name',
      city: 'City, State 12345',
      country: 'United States',
      isDefault: true
    }
  ]);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: '',
    name: '',
    street: '',
    city: '',
    country: ''
  });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleUpdateMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    updateMeasurements(measurements);
    
    setTimeout(() => {
      setIsUpdating(false);
      showSuccess('Measurements updated successfully');
    }, 800);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setAddressForm({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      country: address.country
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      if (editingAddressId) {
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddressId ? { ...addr, ...addressForm } : addr
        ));
        setEditingAddressId(null);
      } else {
        const newAddr = {
          id: Date.now(),
          ...addressForm,
          isDefault: addresses.length === 0
        };
        setAddresses(prev => [...prev, newAddr]);
      }
      setIsUpdating(false);
      showSuccess('Address saved successfully');
    }, 800);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    showSuccess('Address removed');
  };

  const tabs = [
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'measurements', name: 'Measurements', icon: Ruler },
    { id: 'style', name: 'Style Profile', icon: Palette },
    { id: 'loyalty', name: 'Vantage Club', icon: Star },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-grey-light pt-24 pb-24 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-16 w-16 rounded-full bg-grey-dark/5 flex items-center justify-center text-2xl font-black text-grey-dark">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
              </div>
              <div>
                <h2 className="font-black tracking-tight text-grey-dark">{user?.name || 'John Doe'}</h2>
                <p className="text-xs text-grey-medium font-medium">Member since 2024</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-widest transition-all",
                    activeTab === tab.id ? "bg-secondary text-white" : "text-grey-medium hover:bg-grey-dark/5 hover:text-grey-dark"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-widest text-secondary hover:bg-secondary/5 transition-all mt-8"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Order History</h3>
                
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => { setViewingOrder(order); setIsOrderModalOpen(true); }}
                      className="p-6 rounded-2xl border border-grey-dark/10 flex items-center justify-between hover:border-secondary transition-colors cursor-pointer group bg-white"
                    >
                      <div>
                        <p className="text-xs font-bold text-grey-medium tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                        <p className="font-bold tracking-tight text-grey-dark">{order.date}</p>
                      </div>
                      <div className="text-right flex items-center gap-8">
                        <div>
                          <p className="text-xs font-bold text-grey-medium tracking-widest mb-1">Status</p>
                          <p className={cn(
                            "text-xs font-black tracking-widest",
                            order.status === 'Processing' ? "text-secondary" : 
                            order.status === 'Delivered' ? "text-emerald-500" : "text-grey-medium"
                          )}>{order.status}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-xs font-bold text-grey-medium tracking-widest mb-1">Total</p>
                          <p className="font-bold text-grey-dark">₹{order.total.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-grey-dark/20 group-hover:text-secondary transition-colors" />
                      </div>
                    </div>
                  ))}
                  {userOrders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-grey-dark/5">
                      <Package className="h-12 w-12 text-grey-light mx-auto mb-4" />
                      <p className="text-xs font-bold tracking-widest text-grey-medium">You haven't placed any orders yet.</p>
                      <Button variant="outline" className="mt-6" onClick={() => navigate('/shop')}>Start Shopping</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'measurements' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Body Measurements</h3>
                  {successMessage && activeTab === 'measurements' && (
                    <span className="text-xs font-bold text-secondary tracking-widest animate-pulse">{successMessage}</span>
                  )}
                </div>
                <p className="text-sm text-grey-medium font-medium">Keep your measurements updated for better AI Lab recommendations.</p>
                
                <form onSubmit={handleUpdateMeasurements} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Height (cm)</label>
                      <input 
                        type="number" 
                        value={measurements.height} 
                        onChange={(e) => setMeasurements({...measurements, height: parseInt(e.target.value)})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Weight (kg)</label>
                      <input 
                        type="number" 
                        value={measurements.weight} 
                        onChange={(e) => setMeasurements({...measurements, weight: parseInt(e.target.value)})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Chest (cm)</label>
                      <input 
                        type="number" 
                        value={measurements.chest} 
                        onChange={(e) => setMeasurements({...measurements, chest: parseInt(e.target.value)})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Waist (cm)</label>
                      <input 
                        type="number" 
                        value={measurements.waist} 
                        onChange={(e) => setMeasurements({...measurements, waist: parseInt(e.target.value)})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Fit Preference</label>
                      <select 
                        value={measurements.fitPreference} 
                        onChange={(e) => setMeasurements({...measurements, fitPreference: e.target.value as any})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark font-bold text-xs"
                      >
                        <option value="Slim">Slim</option>
                        <option value="Regular">Regular</option>
                        <option value="Oversized">Oversized</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Measurements'}
                  </Button>
                </form>
              </motion.div>
            )}

            {activeTab === 'style' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Style Profile</h3>
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest text-grey-dark">Preferred Styles</h4>
                    <div className="flex flex-wrap gap-3">
                      {['Minimalist', 'Streetwear', 'Classic', 'Avant-Garde', 'Techwear'].map(style => (
                        <button key={style} className={cn(
                          "px-6 py-2 rounded-full border text-[10px] font-bold tracking-widest transition-all",
                          style === 'Minimalist' || style === 'Streetwear' ? "bg-grey-dark text-white border-grey-dark" : "border-grey-dark/10 text-grey-medium hover:border-grey-dark/30"
                        )}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest text-grey-dark">Favorite Colors</h4>
                    <div className="flex gap-4">
                      {['#000000', '#FFFFFF', '#4B5563', '#1F2937', '#065F46'].map(color => (
                        <div key={color} className="h-10 w-10 rounded-full border border-grey-dark/10 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest text-grey-dark">Fit Preference</h4>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                      {['Slim', 'Regular', 'Oversized'].map(fit => (
                        <button key={fit} className={cn(
                          "py-4 rounded-xl border text-[10px] font-bold tracking-widest transition-all",
                          fit === 'Oversized' ? "bg-secondary text-white border-secondary" : "border-grey-dark/10 text-grey-medium hover:border-grey-dark/30"
                        )}>
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Wishlist</h3>
                
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[3rem] border border-grey-dark/5">
                    <div className="h-20 w-20 rounded-full bg-grey-dark/5 flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-10 w-10 text-grey-medium" />
                    </div>
                    <h4 className="text-xl font-black tracking-tight text-grey-dark mb-2">Your wishlist is empty</h4>
                    <p className="text-sm text-grey-medium font-medium mb-8">Save items you love to find them easily later.</p>
                    <Button onClick={() => navigate('/shop')}>Start Exploring</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistProducts.map((product) => (
                      <div key={product.id} className="group relative bg-white rounded-[2rem] overflow-hidden border border-grey-dark/5 transition-all hover:shadow-2xl hover:shadow-grey-dark/5">
                        <div className="aspect-[3/4] overflow-hidden relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-secondary shadow-lg transition-transform hover:scale-110 active:scale-95"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                          </button>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <Button className="w-full" onClick={() => navigate(`/product/${product.id}`)}>View Product</Button>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold tracking-tight text-grey-dark mb-1">{product.name}</h4>
                          <p className="text-xs text-grey-medium font-medium mb-3">{product.category}</p>
                          <p className="font-black text-grey-dark">₹{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'loyalty' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="p-10 rounded-[3rem] bg-grey-dark text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Star className="h-40 w-40" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold tracking-[0.3em] text-secondary mb-4">Vantage Club Status</p>
                    <h3 className="text-5xl font-black tracking-tighter mb-2">Platinum Member</h3>
                    <p className="text-sm text-white/60 font-medium mb-8">You are in the top 5% of our style community.</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold tracking-widest mb-2">
                        <span>Points: 2,450</span>
                        <span>Next Tier: 3,000</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[80%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Early Access', desc: 'Shop new collections 24h before launch', icon: Star },
                    { name: 'Free Shipping', desc: 'Always free express delivery', icon: Package },
                    { name: 'Style Concierge', desc: 'Priority AI Lab generation', icon: User },
                  ].map(benefit => (
                    <div key={benefit.name} className="p-8 rounded-[2rem] bg-white border border-grey-dark/5 space-y-4">
                      <div className="h-10 w-10 rounded-xl bg-grey-dark/5 flex items-center justify-center">
                        <benefit.icon className="h-5 w-5 text-grey-dark" />
                      </div>
                      <h4 className="font-bold tracking-tight text-grey-dark">{benefit.name}</h4>
                      <p className="text-xs text-grey-medium font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Addresses</h3>
                  {!editingAddressId && (
                    <Button size="sm" onClick={() => {
                      setEditingAddressId(-1); // -1 for new address
                      setAddressForm({ type: '', name: '', street: '', city: '', country: '' });
                    }}>Add New</Button>
                  )}
                </div>

                {successMessage && activeTab === 'addresses' && (
                  <p className="text-xs font-bold text-secondary tracking-widest animate-pulse">{successMessage}</p>
                )}
                
                {(editingAddressId !== null) ? (
                  <form onSubmit={handleSaveAddress} className="bg-white p-8 rounded-[2rem] border border-grey-dark/10 space-y-6 max-w-2xl">
                    <h4 className="font-black tracking-tight text-grey-dark">
                      {editingAddressId === -1 ? 'Add New Address' : 'Edit Address'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">Label (e.g. Home)</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.type}
                          onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                          className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-grey-light/30" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                          className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-grey-light/30" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-grey-medium">Street Address</label>
                      <input 
                        type="text" 
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                        className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-grey-light/30" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">City, State Zip</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-grey-light/30" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest text-grey-medium">Country</label>
                        <input 
                          type="text" 
                          required
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                          className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-grey-light/30" 
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Address'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingAddressId(null)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={cn(
                        "p-6 rounded-2xl border-2 relative bg-white transition-all",
                        addr.isDefault ? "border-secondary" : "border-grey-dark/5"
                      )}>
                        {addr.isDefault && (
                          <span className="absolute top-6 right-6 text-[10px] font-black tracking-widest bg-secondary text-white px-2 py-1 rounded">Default</span>
                        )}
                        <h4 className="font-bold tracking-tight mb-4 text-grey-dark">{addr.type}</h4>
                        <p className="text-sm text-grey-medium leading-relaxed">
                          {addr.name}<br />
                          {addr.street}<br />
                          {addr.city}<br />
                          {addr.country}
                        </p>
                        <div className="mt-6 flex gap-4">
                          <button 
                            onClick={() => handleEditAddress(addr)}
                            className="text-xs font-bold tracking-widest hover:text-secondary transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs font-bold tracking-widest text-grey-medium hover:text-secondary transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h3 className="text-3xl font-black tracking-tighter text-grey-dark">Settings</h3>
                
                <div className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium">Email Address</label>
                    <input type="email" defaultValue="john@example.com" className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium">Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-grey-dark/10 p-4 outline-none focus:border-secondary bg-white text-grey-dark" />
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {/* Order Details Modal */}
      <AnimatePresence>
        {isOrderModalOpen && viewingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-grey-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-grey-dark/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">Order Details</h3>
                  <p className="text-[10px] font-bold tracking-widest text-grey-medium uppercase">Order #{viewingOrder.id.slice(0, 8)} • {viewingOrder.date}</p>
                </div>
                <button 
                  onClick={() => setIsOrderModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-grey-light flex items-center justify-center text-grey-dark hover:bg-secondary hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Status Tracker */}
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-grey-light -translate-y-1/2 z-0" />
                  {['Processing', 'Shipped', 'Delivered'].map((step, i) => {
                    const isCompleted = ['Processing', 'Shipped', 'Delivered'].indexOf(viewingOrder.status) >= i;
                    const isCancelled = viewingOrder.status === 'Cancelled';
                    
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500",
                          isCancelled ? "bg-rose-500 text-white" :
                          isCompleted ? "bg-secondary text-white" : "bg-grey-light text-grey-medium"
                        )}>
                          {isCancelled ? <X className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                        </div>
                        <p className={cn(
                          "text-[8px] font-black uppercase tracking-widest mt-2",
                          isCancelled ? "text-rose-500" :
                          isCompleted ? "text-secondary" : "text-grey-medium"
                        )}>{isCancelled ? 'Cancelled' : step}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium">Items Ordered</h4>
                  <div className="space-y-3">
                    {viewingOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-grey-dark/5">
                        <div className="h-16 w-16 rounded-xl bg-grey-light overflow-hidden border border-grey-dark/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-grey-medium">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-grey-medium">
                            {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black tracking-tight">₹{item.price.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-grey-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium mb-4">Shipping Address</h4>
                  {viewingOrder.shippingAddress ? (
                    <div className="text-xs font-bold text-grey-dark leading-relaxed">
                      <p className="font-black">{viewingOrder.shippingAddress.fullName}</p>
                      <p>{viewingOrder.shippingAddress.address}</p>
                      <p>{viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} {viewingOrder.shippingAddress.zipCode}</p>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-grey-medium italic">Standard Shipping</p>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-grey-medium">
                    <span>Subtotal</span>
                    <span>₹{viewingOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-grey-medium">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="h-px bg-grey-dark/5 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-black tracking-tighter">₹{viewingOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-grey-dark/5">
                <Button className="w-full" onClick={() => setIsOrderModalOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
