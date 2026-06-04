import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenLine, 
  Map, 
  Sparkles, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: PenLine, label: 'Content', path: '/dashboard/content' },
  { icon: Map, label: 'Roadmap', path: '/dashboard/roadmap' },
  { icon: Sparkles, label: 'Intelligence', path: '/dashboard/intelligence' },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuthStore();

  const handleNav = (path: string) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  return (
    <div className={cn(
      "h-full flex flex-col border-r border-white/5 bg-[#08080a]/50 backdrop-blur-xl transition-all duration-300",
      "w-full",
      "outline-none [-webkit-tap-highlight-color:transparent]"
    )}>
      <div className="p-6 md:p-8 flex items-center justify-between">
        <h1 className="font-merriweather tracking-tighter text-xl transition-opacity">
          Jol<span className="text-primary italic">.</span>
        </h1>
        <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
      </div>

      <nav className="flex-1 px-3 md:px-4 space-y-1.5 md:space-y-2 mt-2 md:mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all group overflow-hidden relative",
                isActive 
                  ? "bg-muted text-primary border border-border" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
              <span className="text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 md:h-8 bg-primary rounded-full blur-[2px]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 space-y-2 mb-4">
        <button
          onClick={() => handleNav('/dashboard/settings')}
          className={cn(
            "w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all group",
            location.pathname === '/dashboard/settings' && "bg-muted text-foreground border border-border"
          )}
        >
          <Settings className="w-4 h-5 group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all">
            Settings
          </span>
        </button>

        <button
          onClick={() => signOut().then(() => navigate('/'))}
          className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="w-4 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all">
            Sign Out
          </span>
        </button>

        <div className={cn(
          "mt-6 md:mt-8 p-3 md:p-4 rounded-2xl md:rounded-3xl bg-primary/5 border border-primary/10 transition-all"
        )}>
          <div className="flex items-center gap-2 mb-2 md:mb-3">
             <Zap className="w-3 h-3 text-primary" />
             <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary">Pro Status</span>
          </div>
          <p className="text-[9px] md:text-[10px] text-muted-foreground leading-relaxed mb-3 md:mb-4">
            Unlock AI Brand Voice and advanced market intelligence.
          </p>
          <button className="w-full py-2 bg-white text-black text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-neutral-100 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}