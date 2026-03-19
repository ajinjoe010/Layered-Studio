import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { Auth } from './pages/Auth';
import { AdminPanel } from './pages/AdminPanel';
import { AILab } from './pages/AILab';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NewArrivals } from './pages/NewArrivals';
import { TrendingNow } from './pages/TrendingNow';
import { Accessories } from './pages/Accessories';
import { Collections } from './pages/Collections';
import { Combos } from './pages/Combos';
import { AIAssistant } from './components/AIAssistant';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'user' | 'admin' }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-grey-light font-sans text-grey-dark antialiased">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ai-lab" element={<AILab />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/trending-now" element={<TrendingNow />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/combos" element={<Combos />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant />
        
        {/* Liquid Effect SVG Filter */}
        <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="liquid-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid-goo" />
              <feComposite in="SourceGraphic" in2="liquid-goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>
    </Router>
  );
}
