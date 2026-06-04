import type { Roadmap } from '../../types/roadmap';

interface RoadmapProgressProps {
  roadmap: Roadmap | null;
}

export function RoadmapProgress({ roadmap }: RoadmapProgressProps) {
  if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) return null;

  const total = roadmap.steps.length;
  const completed = roadmap.steps.filter(s => s.status === 'completed').length;
  // Prevent division by zero
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-8 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="font-bold text-foreground">Marketing Master Plan</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Your bespoke strategy for growth</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed</p>
        </div>
      </div>
      
      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 text-center">
        {completed} of {total} core tasks finished. {percentage === 100 ? "Amazing work! 🎉" : "Keep going!"}
      </p>
    </div>
  );
}
