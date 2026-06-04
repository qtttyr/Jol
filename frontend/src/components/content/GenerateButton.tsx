import { useState } from 'react';
import { Button } from '../ui/button';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import { motion, AnimatePresence } from 'framer-motion';

function Sparkle({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ 
        scale: [0, 1, 0], 
        opacity: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 60],
        y: [0, (Math.random() - 0.5) * 60]
      }}
      transition={{ 
        duration: 0.8, 
        delay, 
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 2
      }}
      className="absolute w-1.5 h-1.5 rounded-full bg-white"
      style={{
        boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
      }}
    />
  );
}

export function GenerateButton() {
  const { generatePosts, loading } = usePosts();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {/* Glow effect behind */}
      <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
      </div>
      
      <Button 
        onClick={generatePosts} 
        disabled={loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-12 px-6 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] transition-all duration-500 hover:bg-[100%_0] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25"
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        
        {/* Sparkles effect on hover */}
        <AnimatePresence>
          {isHovered && !loading && (
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {[...Array(8)].map((_, i) => (
                <Sparkle key={i} delay={i * 0.1} />
              ))}
            </div>
          )}
        </AnimatePresence>
        
        <div className="relative flex items-center gap-2.5 z-10">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="font-semibold text-white tracking-wide">Crafting Magic</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary"
              />
            </>
          ) : (
            <>
              <div className="relative">
                <Sparkles className="w-5 h-5 text-white" />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: [0, 1, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -inset-2 bg-white/30 blur-md rounded-full"
                    />
                  )}
                </AnimatePresence>
              </div>
              <span className="font-semibold text-white tracking-wide">Generate Fresh Posts</span>
              <motion.div
                animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            </>
          )}
        </div>
      </Button>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
