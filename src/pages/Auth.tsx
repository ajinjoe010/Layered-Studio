import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, UserCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../supabaseClient';

type AuthMode = 'selection' | 'user' | 'admin';

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('selection');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'admin') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        login(email, name || 'Admin User', 'admin');
        navigate('/admin-panel');
      } else {
        if (isLogin) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) throw authError;

          login(email, name || data.user?.user_metadata?.full_name || 'User', 'user');
          navigate('/');
        } else {
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
              }
            }
          });

          if (authError) throw authError;

          if (data.user) {
            // Create profile row
            await supabase.from('profiles').insert({
              id: data.user.id,
              full_name: name,
              role: 'user'
            });

            signup(email, name);
            navigate('/');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const SelectionCards = () => (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-4 h-[500px]">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ flex: 1.4 }}
        onClick={() => setMode('user')}
        className="flex-1 group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-white border border-grey-dark/5 shadow-2xl transition-all duration-700 ease-out"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative h-full p-10 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-grey-light flex items-center justify-center text-grey-dark group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm">
              <UserCircle className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black tracking-[0.3em] text-grey-medium group-hover:text-secondary transition-colors">01 / Personal</span>
          </div>

          <div>
            <h3 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4 group-hover:scale-105 transition-transform duration-700 origin-left">
              User<br /><span className="text-secondary">Login</span>
            </h3>
            <p className="max-w-[180px] text-[10px] font-bold tracking-widest text-grey-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              Access your curated collection and AI-powered recommendations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border border-grey-dark/10 flex items-center justify-center group-hover:bg-grey-dark group-hover:text-white transition-all duration-500">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">Enter Dashboard</span>
          </div>
        </div>

        {/* Decorative background text */}
        <span className="absolute -bottom-8 -right-8 text-[12rem] font-black tracking-tighter text-grey-light/50 pointer-events-none select-none group-hover:text-secondary/5 transition-colors duration-700">
          USR
        </span>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ flex: 1.4 }}
        onClick={() => setMode('admin')}
        className="flex-1 group cursor-pointer relative overflow-hidden rounded-[2.5rem] bg-grey-dark border border-white/5 shadow-2xl transition-all duration-700 ease-out"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative h-full p-10 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-secondary transition-all duration-500 shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <span className="text-[9px] font-black tracking-[0.3em] text-white/20 group-hover:text-secondary transition-colors">02 / System</span>
          </div>

          <div>
            <h3 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.8] mb-4 text-white group-hover:scale-105 transition-transform duration-700 origin-left">
              Admin<br /><span className="text-secondary">Login</span>
            </h3>
            <p className="max-w-[180px] text-[10px] font-bold tracking-widest text-white/40 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              Manage inventory, analyze trends, and oversee the Layered ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-grey-dark transition-all duration-500">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all duration-500">Access Control</span>
          </div>
        </div>

        {/* Decorative background text */}
        <span className="absolute -bottom-8 -right-8 text-[12rem] font-black tracking-tighter text-white/[0.02] pointer-events-none select-none group-hover:text-secondary/[0.05] transition-colors duration-700">
          ADM
        </span>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-grey-light pt-32 pb-24 px-6 lg:px-24 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {mode === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full flex justify-center"
          >
            <SelectionCards />
          </motion.div>
        ) : (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full"
          >
            <div className="mb-8">
              <button 
                onClick={() => setMode('selection')}
                className="text-[10px] font-bold tracking-widest text-grey-medium hover:text-secondary flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="h-3 w-3 rotate-180" />
                Back to selection
              </button>
            </div>

            <div className="p-10 rounded-[3rem] border bg-white shadow-2xl border-grey-dark/5">
              <div className="flex items-center gap-4 mb-8">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${mode === 'admin' ? 'bg-grey-dark text-white' : 'bg-secondary text-white'}`}>
                  {mode === 'admin' ? <ShieldCheck className="h-6 w-6" /> : (isLogin ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />)}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter">
                    {mode === 'admin' ? 'Admin Access' : (isLogin ? 'Welcome Back' : 'Join Vantage')}
                  </h2>
                  <p className="text-[10px] font-bold tracking-widest text-grey-medium">
                    {mode === 'admin' ? 'Authorized personnel only' : (isLogin ? 'Login to your account' : 'Create a new account')}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p className="text-[10px] font-bold tracking-widest leading-tight">{error}</p>
                  </motion.div>
                )}

                {mode === 'user' && !isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        disabled={loading}
                        className="w-full rounded-2xl border border-grey-dark/10 p-4 pl-12 outline-none focus:border-secondary bg-grey-light/30 text-grey-dark disabled:opacity-50"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={mode === 'admin' ? 'admin@layered.com' : 'name@example.com'}
                      disabled={loading}
                      className="w-full rounded-2xl border border-grey-dark/10 p-4 pl-12 outline-none focus:border-secondary bg-grey-light/30 text-grey-dark disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-grey-medium ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-medium" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full rounded-2xl border border-grey-dark/10 p-4 pl-12 outline-none focus:border-secondary bg-grey-light/30 text-grey-dark disabled:opacity-50"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full group" 
                  variant={mode === 'admin' ? 'primary' : (isLogin ? 'primary' : 'secondary')}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'admin' ? 'Authenticate' : (isLogin ? 'Sign In' : 'Create Account')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              {mode === 'user' && (
                <div className="mt-8 pt-8 border-t border-grey-dark/5 text-center">
                  <p className="text-xs text-grey-medium font-medium">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-secondary font-black tracking-widest hover:underline"
                    >
                      {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
