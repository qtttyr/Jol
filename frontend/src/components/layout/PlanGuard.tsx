import { Crown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';

const PRO_FEATURES = new Set([
  'brand_voice',
  'roadmap_full',
]);

interface PlanGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PlanGuard({ feature, children, fallback }: PlanGuardProps) {
  const { user } = useAuthStore();
  useProjectStore();

  const plan = (user?.user_metadata as Record<string, string>)?.plan || 'free';
  const isPro = plan === 'pro' || plan === 'dev';
  const isFree = plan === 'free';

  if (isPro) {
    return <>{children}</>;
  }

  if (isFree && PRO_FEATURES.has(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            Upgrade to unlock this feature and supercharge your marketing.
          </p>
          <button className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-100 transition-colors">
            Upgrade Now
          </button>
        </div>
        <div className="opacity-30 pointer-events-none select-none">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
