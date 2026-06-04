import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { PenLine, Map, Sparkles, MessageSquare, ArrowRight, Play, Zap } from 'lucide-react';
import heroGif from '../assets/hero.gif';

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [0.8, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);

  return (
    <div className="relative min-h-screen bg-[#08080a] text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden antialiased font-inter">
      {/* Dynamic Background */}
      <section className="relative h-dvh w-full overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="fixed inset-0 z-0"
        >
          <img 
            src={heroGif} 
            alt="Product Atmosphere" 
            className="w-full h-full object-cover mix-blend-screen opacity-80 brightness-125 contrast-125"
          />
          {/* Layered Overlays for depth */}
          <div className="absolute inset-0 bg-linear-to-tr from-[#08080a] via-transparent to-transparent opacity-40" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#08080a]/10 to-[#08080a]" />
          <div className="absolute inset-0 bg-[#08080a]/5 backdrop-blur-[1px]" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </motion.div>

        {/* Top Navigation: Ghost-style */}
        <nav className="relative z-50 flex justify-between items-start w-full p-4 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-1"
          >
            <div className="mb-2">
              <span className="px-2 py-0.5 text-[7px] md:text-[8px] font-black tracking-[0.3em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-sm">
                Beta v1.0
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-merriweather tracking-tighter leading-none">
              Jol<span className="text-primary italic">.</span>
            </h1>
            <span className="text-[8px] md:text-[10px] md:text-[11px] uppercase tracking-[0.5em] opacity-30 font-bold ml-1">
              Co-Founder
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center gap-4 md:gap-8"
          >
            <button 
              onClick={() => navigate('/login')}
              className="group text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black flex items-center gap-3 transition-all"
            >
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">Sign In</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </button>
          </motion.div>
        </nav>

        {/* Main Hero Content: Bottom-Right Cinematic Alignment */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-8 lg:p-16 xl:p-24 flex flex-col items-end text-right">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.15 } }
            }}
            className="max-w-xs md:max-sm lg:max-xl space-y-6 md:space-y-12"
          >
            <div className="space-y-2 md:space-y-4">
              <motion.div variants={fadeIn}>
                <div className="text-sm md:text-lg lg:text-xl xl:text-2xl font-light leading-snug tracking-tight text-foreground/90">
                  Jol knows your product, style, and niche. 
                  <br className="hidden md:block" />
                  Automate strategy and distribution on 
                  <span className="ml-1 md:ml-3 text-primary italic font-medium relative inline-block">
                    autopilot.
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: "100%" }}
                       transition={{ delay: 1.5, duration: 1 }}
                       className="absolute -bottom-1 left-0 h-px bg-primary/30" 
                    />
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-6"
            >
              <Button 
                variant="ghost" 
                size="lg"
                className="group h-12 md:h-14 px-6 md:px-8 rounded-full border border-white/5 bg-white/2 backdrop-blur-xl hover:bg-white/5 hover:border-white/10 transition-all duration-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-3 md:gap-4"
                onClick={() => navigate('/login')}
              >
                <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <Play className="w-2 md:w-2.5 h-2 md:h-2.5 fill-current ml-0.5" />
                </div>
                The Flow
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="group h-12 md:h-14 px-8 md:px-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold"
                onClick={() => navigate('/login')}
              >
                Get Started
                <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Trust Line: Hyper-minimalist */}
      <div className="relative z-20 py-10 bg-background border-y border-white/5">
        <div className="max-w-7xl mx-auto flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap gap-24 items-center opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
            {[
              "Y Combinator Spirit", "PLG Native", "Brand voice adaptation", 
              "Market Intelligence", "Autonomous strategy", "Founder-led scale",
              "Y Combinator Spirit", "PLG Native", "Brand voice adaptation"
            ].map((text, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-[0.6em] flex items-center gap-4">
                <Zap className="w-2 h-2 fill-current" /> {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Section: High-End Editorial Style */}
      <section className="relative z-20 py-40 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-32">
            <div className="space-y-6">
              <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-black">Architecture</span>
              <h2 className="text-4xl md:text-6xl font-merriweather tracking-tighter leading-none max-w-2xl">
                Scale your vision. <br />
                <span className="opacity-20 italic">We ship the voice.</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm font-light leading-relaxed border-l border-white/5 pl-8 py-2">
              Marketing is a data problem. We solved it with an autonomous growth engine built for engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
            <FeatureCard 
              icon={<Map className="w-5 h-5" />}
              title="Execution Map"
              description="Daily mission-critical tasks to keep your product front and center."
            />
            <FeatureCard 
              icon={<PenLine className="w-5 h-5" />}
              title="Perfect Echo"
              description="A content engine that learns your unique syntax and perspectives."
            />
            <FeatureCard 
              icon={<Sparkles className="w-5 h-5" />}
              title="Signal Detection"
              description="Auto-scan tech news for organic market entry points."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-5 h-5" />}
              title="Intelligence"
              description="Weekly reports on what your niche is obsessing over right now."
            />
          </div>
        </div>
      </section>

      {/* Pricing / CTA: The Glass Monolith */}
      <section className="relative z-20 py-40 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div 
             whileInView={{ opacity: 1, y: 0 }}
             initial={{ opacity: 0, y: 40 }}
             viewport={{ once: true }}
             className="relative p-12 md:p-24 rounded-[60px] border border-white/5 bg-white/1 backdrop-blur-2xl overflow-hidden group"
          >
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full group-hover:bg-primary/10 transition-colors duration-1000" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-30">The Final Step</span>
                <h2 className="text-4xl md:text-7xl font-merriweather tracking-tighter">Initialization.</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
                <Button 
                   className="flex-1 h-16 rounded-3xl bg-white text-black hover:bg-neutral-100 font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                   onClick={() => navigate('/login')}
                >
                  Join the Beta
                </Button>
                <Button 
                   variant="outline"
                   className="flex-1 h-16 rounded-3xl border-white/10 hover:border-white/20 bg-transparent uppercase tracking-widest text-[11px] font-bold transition-all"
                   onClick={() => navigate('/login')}
                >
                  Pro Access
                </Button>
              </div>

              <div className="pt-8 flex items-center gap-12 opacity-20">
                {["Limited Access", "GPT-4o Trained", "Privacy First"].map(t => (
                  <span key={t} className="text-[9px] font-black uppercase tracking-[0.3em]">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-20 py-20 px-8 border-t border-white/5 bg-[#08080a] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <h2 className="text-2xl font-merriweather tracking-tighter opacity-80">Jol<span className="text-primary italic">.</span></h2>
          
          <div className="flex gap-16 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
            <a href="#" className="hover:text-primary hover:opacity-100 transition-all">Support</a>
            <a href="#" className="hover:text-primary hover:opacity-100 transition-all">Twitter</a>
            <a href="#" className="hover:text-primary hover:opacity-100 transition-all">Founders</a>
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-10">
            &copy; 2026 Jol AI Engineering
          </p>
        </div>
      </footer>

      {/* Custom Styles for Marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-10 rounded-[40px] border border-white/5 bg-white/1 transition-all duration-500 hover:bg-white/3 group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.05)] border border-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed opacity-50 group-hover:opacity-100 transition-opacity font-light">
        {description}
      </p>
    </motion.div>
  );
}
