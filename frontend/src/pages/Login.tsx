import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Mail, Lock, UserPlus, LogIn, Github } from 'lucide-react';
import heroGif from '../assets/hero.gif';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          throw new Error("This email is already registered");
        }
        toast.success("Check your email for confirmation!");
      }
    } catch (error: unknown) {
      console.error("Auth Error:", error);
      const message = error instanceof Error ? error.message : "An error occurred during authentication";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#0a0a0c] text-foreground flex items-center justify-center p-6 selection:bg-primary">
      {/* Background with GIF and overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={heroGif} 
          alt="" 
          className="w-full h-full object-cover opacity-30 contrast-125 saturate-0 brightness-100"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 hover:opacity-100 transition-opacity mb-12"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to System
        </button>

        <div className="space-y-8">
          <div className="text-left">
            <h1 className="text-4xl font-merriweather tracking-tighter mb-2 flex items-center gap-4">
              {isLogin ? 'Welcome' : 'Join'} <Sparkles className="w-6 h-6 text-primary" />
            </h1>
            <p className="text-muted-foreground text-sm font-light">
              {isLogin ? 'Access your marketing engine.' : 'Create your founder account today.'}
            </p>
          </div>

          <div className="relative p-px rounded-[32px] overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent" />
            <div className="relative bg-[#0d0d0f] rounded-[31px] p-8 md:p-10 border border-white/5">
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1 flex items-center gap-2 group-focus-within/field:text-primary transition-colors">
                      <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <div className="relative">
                      <Input 
                        type="email" 
                        placeholder="founder@ship.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                        className="bg-white/3 border-white/5 rounded-2xl h-12 text-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group/field">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1 flex items-center gap-2 group-focus-within/field:text-primary transition-colors">
                      <Lock className="w-3 h-3" /> Password
                    </label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="bg-white/3 border-white/5 rounded-2xl h-12 text-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-white text-black hover:bg-neutral-200 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                       Wait...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? 'Log In' : 'Sign Up'}
                      {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </span>
                  )}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                  <span className="bg-[#0d0d0f] px-4 text-muted-foreground/30">Or Continue With</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 rounded-2xl border-white/5 bg-white/2 hover:bg-white/5 transition-all flex items-center gap-3 text-xs font-bold"
                onClick={() => {
                   toast.info("GitHub Auth is coming soon!");
                }}
              >
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
                GitHub
              </Button>
            </div>
          </div>

          <div className="text-center font-medium">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs group"
            >
              <span className="opacity-40">
                {isLogin ? "Don't have an account?" : "Already a user?"} 
              </span>
              <span className="ml-2 text-primary group-hover:underline underline-offset-4 decoration-primary/30 transition-all italic font-bold">
                {isLogin ? 'Create Account' : 'Log In'}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-20 opacity-20 text-[9px] text-center uppercase tracking-[0.5em] font-black">
          Jol Automated Growth Engine
        </div>
      </motion.div>
    </div>
  );
}
