import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { useProjects } from '../../hooks/useProjects';
import { cn } from '../../lib/utils';

export default function DashboardLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { activeProject } = useProjectStore();
  const { user, initialized } = useAuthStore();
  const { fetchProjects } = useProjects();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (initialized && !user) navigate('/login');
  }, [user, initialized, navigate]);

  useEffect(() => {
    if (user && !activeProject) fetchProjects();
  }, [user, activeProject, fetchProjects]);

  if (!initialized || !user) return null;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#060608] text-foreground flex">
        <aside className={cn(
          "fixed inset-y-0 left-0 h-full z-50 border-r border-white/5 bg-[#08080a] transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-72" : "w-0"
        )}>
          <Sidebar onNavigate={toggleSidebar} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={toggleSidebar} />
        )}

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-[#08080a]/50 backdrop-blur-md">
            <Topbar onMenuClick={toggleSidebar} />
          </header>
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] text-foreground flex">
      {/* Spacer — controls layout width, pushes content */}
      <div className={cn(
        "shrink-0 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-0"
      )} />

      {/* Sidebar — fixed over the spacer */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-50 border-r border-white/5 bg-[#08080a] transition-all duration-300 overflow-hidden",
        sidebarOpen ? "w-64" : "w-0"
      )}>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-[#08080a]/50 backdrop-blur-md">
          <Topbar onMenuClick={toggleSidebar} />
        </header>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
