import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Menu,
  User,
  X,
  ArrowRight,
  Sparkles,
  PenLine,
  Map
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
}

const QUICK_LINKS = [
  { label: 'Content Pipeline', path: '/dashboard/content', icon: PenLine },
  { label: 'Growth Roadmap', path: '/dashboard/roadmap', icon: Map },
  { label: 'Intelligence', path: '/dashboard/intelligence', icon: Sparkles },
];

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);


  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const filteredLinks = QUICK_LINKS.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchNav = (path: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const NOTIFICATIONS = [
    { id: 1, text: 'Content generation complete', time: '2m ago', read: false },
    { id: 2, text: 'Weekly intelligence ready', time: '1h ago', read: false },
    { id: 3, text: 'Roadmap updated', time: '3h ago', read: true },
  ];

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
        {/* Search */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all group"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground/50">Search...</span>
            <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/40 font-mono border border-border/50">⌘K</kbd>
          </button>

          {searchOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/40"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto">
                  {filteredLinks.length > 0 ? filteredLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleSearchNav(link.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left group"
                    >
                      <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="flex-1 text-sm font-medium">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                    </button>
                  )) : (
                    <p className="px-3 py-6 text-xs text-muted-foreground text-center">No results found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group"
          >
            <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border-2 border-background" />
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-bold">Notifications</p>
                </div>
                <div className="p-2 space-y-0.5 max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors",
                        !n.read ? "bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs", !n.read ? "font-semibold text-foreground" : "text-muted-foreground")}>
                          {n.text}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border">
                  <p className="text-[10px] text-center text-muted-foreground/40 font-medium tracking-wider">
                    Notifications are updated in real-time
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

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
