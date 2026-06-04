import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Content from './pages/dashboard/Content';
import Roadmap from './pages/dashboard/Roadmap';
import Intelligence from './pages/dashboard/Intelligence';
import Settings from './pages/dashboard/Settings';

// Auth wrapper to handle redirects and initialization
function AuthHandler({ children }: { children: React.ReactNode }) {
  const { initialize, initialized, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;

    let mounted = true;

    const checkUserRouting = async (currentUser: any) => {
      if (currentUser) {
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', currentUser.id)
          .limit(1);

        if (!mounted) return;

        const currentPath = window.location.pathname;
        const hasProject = projects && projects.length > 0;

        if (!hasProject && currentPath !== '/onboarding') {
          navigate('/onboarding', { replace: true });
        } else if (hasProject && (currentPath === '/' || currentPath === '/login' || currentPath === '/onboarding')) {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    // Check routing after initialization if user exists
    if (user) {
      checkUserRouting(user);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        checkUserRouting(session?.user);
      } else if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized, user, navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthHandler>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="content" element={<Content />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="intelligence" element={<Intelligence />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthHandler>
    </BrowserRouter>
  );
}

export default App;
