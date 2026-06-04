import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="h-full flex items-center justify-between px-4 md:px-8 bg-transparent">
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground/50 hidden sm:inline">Service</span>
          <h2 className="text-sm font-bold tracking-tight">{getPageTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted border border-border text-muted-foreground focus-within:text-foreground transition-all focus-within:bg-muted/80 group">
          <Search className="w-4 h-4 transition-transform group-focus-within:scale-110" />
          <input 
            type="text" 
            placeholder="Search strategy..." 
            className="bg-transparent border-none outline-none text-[11px] font-bold tracking-wider placeholder:text-muted-foreground/50 w-40 lg:w-48"
          />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group">
          <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="h-6 md:h-8 w-px bg-border mx-1 md:mx-2" />

        <button className="flex items-center gap-2 md:gap-3 p-1.5 pr-3 rounded-2xl hover:bg-muted transition-all group border border-transparent hover:border-border">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden">
            {user?.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
              {user?.email?.split('@')[0] || 'Founder'}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground/50 tracking-tighter">
              Free Plan
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}