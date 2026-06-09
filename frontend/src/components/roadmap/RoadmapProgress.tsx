import type { Roadmap } from '../../types/roadmap';

interface RoadmapProgressProps {
  roadmap: Roadmap | null;
}

const TIMELINE_ORDER = ['Week 1-2', 'Month 1', 'Month 2-3', 'Quarter 2', 'Quarter 3-4', 'Quarter 5-6'];

function extractTimelineGroup(timeframe: string): string {
  if (!timeframe) return 'Other';
  const t = timeframe.toLowerCase();
  if (t.includes('week') || t.includes('day')) return 'Week 1-2';
  if (t.includes('month 1') || t.includes('first month') || t.includes('month 2') || t.includes('month 3')) return 'Month 1-3';
  if (t.includes('quarter 2') || t.includes('q2') || t.includes('month 4') || t.includes('month 5') || t.includes('month 6')) return 'Quarter 2';
  if (t.includes('quarter 3') || t.includes('q3') || t.includes('month 7') || t.includes('month 8') || t.includes('month 9')) return 'Quarter 3';
  if (t.includes('quarter 4') || t.includes('q4') || t.includes('month 10') || t.includes('month 11') || t.includes('month 12')) return 'Quarter 4';
  return 'Other';
}

const MILESTONE_LABELS: Record<string, { label: string; desc: string }> = {
  'Week 1-2':  { label: 'Launch Sprint',   desc: 'Foundation & validation' },
  'Month 1-3':  { label: 'Early Traction',  desc: 'First users & content' },
  'Quarter 2': { label: 'Scale Up',         desc: 'Distribution & growth' },
  'Quarter 3': { label: 'Expand',           desc: 'Partnerships & paid' },
  'Quarter 4': { label: 'Dominate',         desc: 'Enterprise & scale' },
};

export function RoadmapProgress({ roadmap }: RoadmapProgressProps) {
  if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) return null;

  const total = roadmap.steps.length;
  const completed = roadmap.steps.filter((s) => s.status === 'completed').length;
  const inProgress = roadmap.steps.filter((s) => s.status === 'in_progress').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Group steps by timeframe for milestone visualization
  const grouped: Record<string, typeof roadmap.steps> = {};
  for (const step of roadmap.steps) {
    const group = extractTimelineGroup(step.timeframe);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(step);
  }

  const groupKeys = Object.keys(grouped).sort(
    (a, b) => TIMELINE_ORDER.indexOf(a) - TIMELINE_ORDER.indexOf(b)
  );

  return (
    <div className="space-y-5">
      {/* Main progress bar */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg">Growth Roadmap</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {inProgress > 0
                ? `${inProgress} step${inProgress > 1 ? 's' : ''} in progress`
                : 'Your bespoke strategy for growth'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Done</p>
          </div>
        </div>

        <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          {completed} of {total} steps finished
          {percentage === 100 ? ' — Amazing! 🎉' : ' — keep pushing!'}
        </p>
      </div>

      {/* Timeline milestones */}
      {groupKeys.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {groupKeys.map((key) => {
            const steps = grouped[key];
            const done = steps.filter((s) => s.status === 'completed').length;
            const total = steps.length;
            const milestone = MILESTONE_LABELS[key] || { label: key, desc: `${total} step${total > 1 ? 's' : ''}` };

            return (
              <div
                key={key}
                className={`rounded-xl border p-3 transition-all duration-200 ${
                  done === total && total > 0
                    ? 'bg-primary/5 border-primary/30'
                    : done > 0
                      ? 'bg-muted/30 border-border'
                      : 'bg-card border-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {key}
                  </span>
                  <span className="text-xs font-bold">
                    {done}/{total}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-tight">{milestone.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{milestone.desc}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
