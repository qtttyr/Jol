import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Sparkles, 
  Timer, 
  ArrowUpRight, 
  CircleCheck, 
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { cn } from '../../lib/utils';

const stats = [
  { label: 'Time Saved', value: '124h', icon: Timer, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Content Score', value: '92/100', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Market Reach', value: '+14%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Active Tasks', value: '3', icon: CircleCheck, color: 'text-amber-400', bg: 'bg-amber-400/10' },
];

export default function Overview() {
  const { activeProject } = useProjectStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Header with Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Systems Active</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-merriweather tracking-tighter">
            Welcome back, <span className="italic text-primary">Founder.</span>
          </h1>
          <p className="text-muted-foreground mt-3 md:mt-4 max-w-lg text-sm md:text-base leading-relaxed">
            {activeProject?.name || 'Your project'} is currently in the <span className="text-foreground font-bold">{activeProject?.stage || 'MVP'}</span> stage. 
            Jol has identified <span className="text-primary font-bold">4 new opportunities</span> for your distribution.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard/content')}
          className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-[20px] bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
        >
          <Zap className="w-4 h-4 fill-current" />
          Boost Marketing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 md:p-8 rounded-2xl md:rounded-[40px] border border-white/5 bg-white/1 relative overflow-hidden group hover:bg-white/3 transition-colors"
          >
            <div className={cn("inline-flex p-2 md:p-3 rounded-xl md:rounded-2xl mb-3 md:mb-6 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-4 h-4 md:w-5 md:h-5", stat.color)} />
            </div>
            <p className="text-muted-foreground text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-lg md:text-2xl font-bold tracking-tight">{stat.value}</h4>
            
            <div className="absolute top-0 right-0 p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Automation Card */}
        <div className="lg:col-span-2 p-6 md:p-10 rounded-3xl md:rounded-[48px] border border-white/5 bg-linear-to-br from-white/3 to-transparent relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg md:text-xl font-bold">Marketing Autopilot</h3>
            </div>
            
            <div className="space-y-4 md:space-y-8">
              {[
                { label: 'Weekly intelligence report', status: 'In Progress', progress: 65 },
                { label: 'Tech news monitoring', status: 'Scheduled', progress: 0 },
                { label: 'Social content generation', status: 'Ready', progress: 100 },
              ].map((item) => (
                <div key={item.label} className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                    <span className={cn("font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px]", 
                      item.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 md:w-64 h-40 md:h-64 bg-primary/5 blur-[60px] md:blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors" />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 md:space-y-6">
          <button 
            onClick={() => navigate('/dashboard/roadmap')}
            className="w-full p-6 md:p-8 rounded-2xl md:rounded-[40px] border border-primary/20 bg-primary/5 flex flex-col items-center text-center group transition-all hover:bg-primary/10"
          >
             <div className="w-12 md:w-14 h-12 md:h-14 rounded-[16px] md:rounded-[20px] bg-primary/20 flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <BarChart3 className="w-5 md:w-6 h-5 md:h-6" />
            </div>
            <h4 className="font-bold mb-2 text-sm md:text-base">Generate Roadmap</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Let AI analyze your product & competitors to build a strategy.
            </p>
          </button>

          <button 
            onClick={() => navigate('/dashboard/intelligence')}
            className="w-full p-6 md:p-10 rounded-2xl md:rounded-[40px] border border-white/5 bg-white/1 flex flex-col items-center text-center opacity-60 hover:opacity-100 transition-all border-dashed"
          >
             <div className="w-12 md:w-14 h-12 md:h-14 rounded-full border border-white/10 flex items-center justify-center mb-4 md:mb-6">
              <Zap className="w-5 md:w-6 h-5 md:h-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold mb-1 text-sm md:text-base">Weekly Intelligence</h4>
            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">View Report</p>
          </button>
        </div>
      </div>
    </div>
  );
}
