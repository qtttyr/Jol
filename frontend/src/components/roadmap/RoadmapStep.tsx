import { CheckCircle2, Circle } from 'lucide-react';
import type { RoadmapStep as StepType } from '../../types/roadmap';
import { cn } from '../../lib/utils';

interface RoadmapStepProps {
  step: StepType;
  index: number;
  onToggle: (id: string) => void;
  isLast: boolean;
}

export function RoadmapStep({ step, index, onToggle, isLast }: RoadmapStepProps) {
  const isCompleted = step.status === 'completed';

  const priorityConfig = {
    low: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
    medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700' }
  };

  return (
    <div className="relative flex gap-6 group">
      {!isLast && (
        <div className={cn(
          "absolute left-[15px] top-10 bottom-0 w-0.5 -ml-px transition-colors duration-300",
          isCompleted ? "bg-primary" : "bg-border"
        )} />
      )}

      <button 
        onClick={() => onToggle(step.id)}
        className="relative z-10 shrink-0 mt-1 transition-transform active:scale-95"
      >
        {isCompleted ? (
          <CheckCircle2 className="w-8 h-8 text-primary bg-background rounded-full" />
        ) : (
          <Circle className="w-8 h-8 text-muted-foreground bg-background rounded-full hover:text-primary transition-colors" />
        )}
      </button>

      <div className={cn(
        "flex-1 pb-10 mt-1 transition-opacity duration-300",
        isCompleted ? "opacity-60" : "opacity-100"
      )}>
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="font-semibold text-lg text-foreground tracking-tight">
            {index + 1}. {step.title}
          </span>
          <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full select-none", priorityConfig[step.priority]?.color || priorityConfig.medium.color)}>
             {priorityConfig[step.priority]?.label || 'Medium'}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {step.description}
        </p>
      </div>
    </div>
  );
}
