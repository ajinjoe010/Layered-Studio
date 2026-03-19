import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useShopStore, Product, Customer, Order } from '../store/useShopStore';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  X,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/Button';

type AdminTab = 'dashboard' | 'users' | 'products' | 'orders' | 'settings';

export const AdminPanel = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { 
    products, addProduct, removeProduct, updateProduct,
    customers, removeCustomer,
    orders, updateOrderStatus
  } = useShopStore();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingUser, setViewingUser] = useState<Customer | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  const stats = [
    { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Active Users', value: customers.length.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'bg-amber-500' },
    { label: 'Products', value: products.length.toString(), icon: Package, color: 'bg-rose-500' },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DashboardView = () => (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="p-8 bg-white rounded-[2.5rem] border border-grey-dark/5 shadow-sm">
            <div className={`h-12 w-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-grey-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tighter text-grey-dark">{stat.value}</h3>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-10 bg-white rounded-[3rem] border border-grey-dark/5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black tracking-tighter">Recent Orders</h3>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
        </div>
        
        <div className="space-y-6">
          {orders.slice(0, 5).map((order) => (
            <div 
              key={order.id} 
              onClick={() => { setViewingOrder(order); setIsOrderModalOpen(true); }}
              className="flex items-center justify-between p-4 rounded-2xl border border-grey-dark/5 hover:bg-grey-light/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-grey-light flex items-center justify-center text-grey-dark group-hover:bg-secondary group-hover:text-white transition-all">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-tight">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-[10px] font-bold tracking-widest text-grey-medium">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black tracking-tighter text-emerald-500">+₹{order.total.toFixed(2)}</p>
                <p className="text-[8px] font-black tracking-widest text-grey-medium">{order.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xs font-bold tracking-widest text-grey-medium">No recent orders found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const ProductsView = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-grey-dark/5 outline-none focus:border-secondary transition-all text-xs font-bold tracking-widest"
          />
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-[3rem] border border-grey-dark/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-grey-dark/5">
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Product</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Category</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Price</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Stock</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-dark/5">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-grey-light/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover border border-grey-dark/5"
                    />
                    <div>
                      <p className="text-xs font-black tracking-tight">{product.name}</p>
                      <p className="text-[10px] font-bold tracking-widest text-grey-medium">{product.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 rounded-full bg-grey-light text-[9px] font-black tracking-widest text-grey-dark uppercase">
                    {product.category}
                  </span>
                </td>
                <td className="p-6 text-xs font-black tracking-tighter">₹{product.price.toLocaleString()}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-[10px] font-bold tracking-widest text-grey-medium">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                      className="p-2 rounded-xl hover:bg-grey-dark hover:text-white transition-all text-grey-medium"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="p-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-grey-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center">
            <ShoppingBag className="h-12 w-12 text-grey-light mx-auto mb-4" />
            <p className="text-xs font-bold tracking-widest text-grey-medium">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
        <input 
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-grey-dark/5 outline-none focus:border-secondary transition-all text-xs font-bold tracking-widest"
        />
      </div>

      <div className="bg-white rounded-[3rem] border border-grey-dark/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-grey-dark/5">
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">User</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Role</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Joined</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Orders</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Spent</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-dark/5">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-grey-light/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-grey-light flex items-center justify-center text-grey-dark font-black text-xs">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-tight">{customer.name}</p>
                      <p className="text-[10px] font-bold tracking-widest text-grey-medium">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                    customer.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-grey-light text-grey-dark'
                  }`}>
                    {customer.role}
                  </span>
                </td>
                <td className="p-6 text-[10px] font-bold tracking-widest text-grey-medium">{customer.joinDate}</td>
                <td className="p-6 text-xs font-black tracking-tight">{customer.totalOrders}</td>
                <td className="p-6 text-xs font-black tracking-tight">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setViewingUser(customer); setIsUserModalOpen(true); }}
                      className="p-2 rounded-xl hover:bg-grey-dark hover:text-white transition-all text-grey-medium"
                      title="View Details"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => removeCustomer(customer.id)}
                      className="p-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-grey-medium"
                      disabled={customer.role === 'admin'}
                      title="Remove User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="p-20 text-center">
            <Users className="h-12 w-12 text-grey-light mx-auto mb-4" />
            <p className="text-xs font-bold tracking-widest text-grey-medium">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
        <input 
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-grey-dark/5 outline-none focus:border-secondary transition-all text-xs font-bold tracking-widest"
        />
      </div>

      <div className="bg-white rounded-[3rem] border border-grey-dark/5 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-grey-dark/5">
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Order ID</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Customer</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Date</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Status</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Total</th>
              <th className="p-6 text-[10px] font-black tracking-[0.2em] text-grey-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-dark/5">
            {orders.filter(o => o.id.includes(searchQuery) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
              <tr key={order.id} className="hover:bg-grey-light/30 transition-colors group">
                <td className="p-6 text-xs font-black tracking-tight">#{order.id.slice(0, 8)}</td>
                <td className="p-6">
                  <div>
                    <p className="text-xs font-black tracking-tight">{order.customerName}</p>
                    <p className="text-[10px] font-bold tracking-widest text-grey-medium">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="p-6 text-[10px] font-bold tracking-widest text-grey-medium">{order.date}</td>
                <td className="p-6">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase outline-none cursor-pointer ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                      order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-6 text-xs font-black tracking-tight">₹{order.total.toLocaleString()}</td>
                <td className="p-6">
                  <button 
                    onClick={() => { setViewingOrder(order); setIsOrderModalOpen(true); }}
                    className="p-2 rounded-xl hover:bg-grey-dark hover:text-white transition-all text-grey-medium"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 space-y-2"
          >
            <div className="p-6 bg-white rounded-[2rem] border border-grey-dark/5 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white font-black">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tighter">{user?.name}</h2>
                  <p className="text-[10px] font-bold tracking-widest text-secondary">Administrator</p>
                </div>
              </div>
            </div>

            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'products', name: 'Products', icon: ShoppingBag },
              { id: 'orders', name: 'Orders', icon: Package },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as AdminTab); setSearchQuery(''); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-grey-dark text-white shadow-lg' 
                    : 'bg-white text-grey-dark/60 hover:bg-grey-dark/5 border border-grey-dark/5'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-black tracking-widest">{item.name}</span>
              </button>
            ))}

            <Button 
              variant="outline" 
              onClick={logout}
              className="w-full mt-8 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'products' && <ProductsView />}
                {activeTab === 'users' && <UsersView />}
                {activeTab === 'orders' && <OrdersView />}
                {activeTab === 'settings' && (
                  <div className="p-20 text-center bg-white rounded-[3rem] border border-grey-dark/5 shadow-sm">
                    <Settings className="h-12 w-12 text-grey-light mx-auto mb-4" />
                    <h3 className="text-xl font-black tracking-tighter mb-2">System Settings</h3>
                    <p className="text-xs font-bold tracking-widest text-grey-medium">Configuration options coming soon.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
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
                  <h3 className="text-2xl font-black tracking-tighter">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-[10px] font-bold tracking-widest text-grey-medium">
                    {editingProduct ? 'Update existing inventory details' : 'Create a new item in your catalog'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-grey-light flex items-center justify-center text-grey-dark hover:bg-secondary hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const productData: any = {
                    id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
                    name: formData.get('name'),
                    price: parseFloat(formData.get('price') as string),
                    category: formData.get('category'),
                    description: formData.get('description'),
                    images: [formData.get('image') as string],
                    sizes: (formData.get('sizes') as string).split(',').map(s => s.trim()),
                    colors: (formData.get('colors') as string).split(',').map(c => c.trim()),
                    inStock: formData.get('inStock') === 'on',
                  };

                  if (editingProduct) {
                    updateProduct(productData);
                  } else {
                    addProduct(productData);
                  }
                  setIsProductModalOpen(false);
                }}
                className="p-8 space-y-6 max-h-[70vh] overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Product Name</label>
                    <input 
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Price (₹)</label>
                    <input 
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Category</label>
                    <select 
                      name="category"
                      defaultValue={editingProduct?.category}
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    >
                      <option value="Outerwear">Outerwear</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Image URL</label>
                    <input 
                      name="image"
                      defaultValue={editingProduct?.images[0]}
                      required
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Description</label>
                  <textarea 
                    name="description"
                    defaultValue={editingProduct?.description}
                    required
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Sizes (comma separated)</label>
                    <input 
                      name="sizes"
                      defaultValue={editingProduct?.sizes.join(', ')}
                      placeholder="S, M, L, XL"
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Colors (comma separated)</label>
                    <input 
                      name="colors"
                      defaultValue={editingProduct?.colors.join(', ')}
                      placeholder="Black, White, Grey"
                      className="w-full p-4 rounded-2xl bg-grey-light/50 border border-grey-dark/5 outline-none focus:border-secondary text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                  <input 
                    type="checkbox" 
                    name="inStock"
                    id="inStock"
                    defaultChecked={editingProduct?.inStock ?? true}
                    className="h-5 w-5 rounded-lg border-grey-dark/10 text-secondary focus:ring-secondary"
                  />
                  <label htmlFor="inStock" className="text-xs font-black tracking-widest cursor-pointer">Product is in stock and available for purchase</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {isUserModalOpen && viewingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
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
                  <h3 className="text-2xl font-black tracking-tighter">User Profile</h3>
                  <p className="text-[10px] font-bold tracking-widest text-grey-medium uppercase">Customer Details & History</p>
                </div>
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="h-10 w-10 rounded-full bg-grey-light flex items-center justify-center text-grey-dark hover:bg-secondary hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-grey-light flex items-center justify-center text-grey-dark font-black text-2xl">
                    {viewingUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tighter">{viewingUser.name}</h4>
                    <p className="text-sm font-bold text-grey-medium">{viewingUser.email}</p>
                    <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[9px] font-black tracking-widest uppercase">
                      {viewingUser.role}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-grey-medium mb-1">Join Date</p>
                    <p className="text-sm font-black tracking-tight">{viewingUser.joinDate}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-grey-medium mb-1">Total Orders</p>
                    <p className="text-sm font-black tracking-tight">{viewingUser.totalOrders}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-grey-medium mb-1">Total Spent</p>
                    <p className="text-sm font-black tracking-tight text-emerald-500">₹{viewingUser.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-widest">Order History</h5>
                  <div className="space-y-3">
                    {orders.filter(o => o.customerEmail === viewingUser.email).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-grey-dark/5">
                        <div>
                          <p className="text-xs font-black tracking-tight">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-[10px] font-bold text-grey-medium">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black tracking-tight">₹{order.total.toLocaleString()}</p>
                          <p className={`text-[8px] font-black tracking-widest uppercase ${
                            order.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>{order.status}</p>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => o.customerEmail === viewingUser.email).length === 0 && (
                      <p className="text-center py-6 text-[10px] font-bold tracking-widest text-grey-medium italic">No orders found for this user.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-grey-dark/5">
                <Button className="w-full" onClick={() => setIsUserModalOpen(false)}>Close Profile</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium">Customer Information</h4>
                    <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                      <p className="text-sm font-black tracking-tight">{viewingOrder.customerName}</p>
                      <p className="text-xs font-bold text-grey-medium">{viewingOrder.customerEmail}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium">Shipping Address</h4>
                    <div className="p-6 rounded-2xl bg-grey-light/30 border border-grey-dark/5">
                      {viewingOrder.shippingAddress ? (
                        <>
                          <p className="text-sm font-black tracking-tight">{viewingOrder.shippingAddress.fullName}</p>
                          <p className="text-xs font-bold text-grey-medium">{viewingOrder.shippingAddress.address}</p>
                          <p className="text-xs font-bold text-grey-medium">
                            {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} {viewingOrder.shippingAddress.zipCode}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs font-bold text-grey-medium italic">No address provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium">Order Items</h4>
                  <div className="space-y-3">
                    {viewingOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-grey-dark/5">
                        <div className="h-16 w-16 rounded-xl bg-grey-light overflow-hidden border border-grey-dark/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-grey-medium">
                              <ShoppingBag className="h-6 w-6" />
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

                {/* Order Summary */}
                <div className="p-6 rounded-2xl bg-grey-dark text-white space-y-3">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase opacity-60">
                    <span>Subtotal</span>
                    <span>₹{viewingOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase opacity-60">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                    <span className="text-2xl font-black tracking-tighter">₹{viewingOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-grey-medium">Update Status</h4>
                  <div className="flex gap-2">
                    {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(viewingOrder.id, status as Order['status'])}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                          viewingOrder.status === status
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                            : 'bg-grey-light text-grey-dark hover:bg-grey-dark/5'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-grey-dark/5">
                <Button className="w-full" onClick={() => setIsOrderModalOpen(false)}>Close Order Details</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
