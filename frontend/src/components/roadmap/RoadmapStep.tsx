import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Lightbulb,
  ExternalLink,
  Target,
  Clock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { RoadmapStep as StepType } from '../../types/roadmap';
import { cn } from '../../lib/utils';

interface RoadmapStepProps {
  step: StepType;
  index: number;
  isLast: boolean;
  onToggle: (id: string) => void;
}

const PRIORITY_STYLES = {
  high: {
    label: 'High',
    dot: 'bg-red-500',
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400',
    border: 'border-l-red-500',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-500',
  },
  low: {
    label: 'Low',
    dot: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    border: 'border-l-blue-500',
  },
};

function statusIcon(step: StepType) {
  if (step.status === 'completed') return <CheckCircle2 className="w-6 h-6 text-primary" />;
  if (step.status === 'in_progress') return <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />;
  return <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />;
}

function statusHint(step: StepType) {
  if (step.status === 'completed') return 'Mark as pending';
  if (step.status === 'in_progress') return 'Mark as completed';
  return 'Start this step';
}

export function RoadmapStep({ step, index, isLast, onToggle }: RoadmapStepProps) {
  const [expanded, setExpanded] = useState(false);
  const ps = PRIORITY_STYLES[step.priority] || PRIORITY_STYLES.medium;

  const isComplete = step.status === 'completed';
  const isInProgress = step.status === 'in_progress';

  return (
    <div className={cn('relative flex gap-5 group', !isLast && 'pb-2')}>
      {/* Connector line */}
      {!isLast && (
        <div
          className={cn(
            'absolute left-[13px] top-10 bottom-0 w-0.5 transition-colors duration-300',
            isComplete ? 'bg-primary/40' : 'bg-border'
          )}
        />
      )}

      {/* Status toggle */}
      <button
        onClick={() => onToggle(step.id)}
        title={statusHint(step)}
        className="relative z-10 shrink-0 mt-1.5 transition-transform active:scale-90 focus:outline-none"
      >
        {statusIcon(step)}
      </button>

      {/* Content card */}
      <div
        className={cn(
          'flex-1 pb-6 min-w-0 rounded-xl border bg-card transition-all duration-200',
          'border-l-4',
          ps.border,
          isComplete && 'opacity-70',
          isInProgress && 'ring-1 ring-amber-500/30'
        )}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground font-mono font-bold">
                #{index + 1}
              </span>
              <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full', ps.badge)}>
                {ps.label}
              </span>
              {step.timeframe && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {step.timeframe}
                </span>
              )}
              {isInProgress && (
                <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  In Progress
                </span>
              )}
              {isComplete && (
                <span className="text-[10px] uppercase font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                  Done
                </span>
              )}
            </div>
            <h3
              className={cn(
                'font-bold text-base leading-snug transition-colors',
                isComplete ? 'text-muted-foreground line-through decoration-primary/40' : 'text-foreground'
              )}
            >
              {step.title}
            </h3>
          </div>

          {/* Expand / collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors mt-0.5"
            title={expanded ? 'Collapse' : 'Show tips'}
          >
            <ChevronDown
              className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', expanded && 'rotate-180')}
            />
          </button>
        </div>

        {/* Description */}
        <p className={cn('px-4 pb-3 text-sm leading-relaxed', isComplete ? 'text-muted-foreground/70' : 'text-muted-foreground')}>
          {step.description}
        </p>

        {/* KPI badge */}
        {step.kpi && (
          <div className="px-4 pb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              <Target className="w-3 h-3" />
              {step.kpi}
            </span>
          </div>
        )}

        {/* Expanded: How To + Resources */}
        {expanded && (
          <div className="border-t border-border px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* How To */}
            {step.how_to && step.how_to.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">How to do this</span>
                </div>
                <ul className="space-y-2">
                  {step.how_to.map((tip, ti) => (
                    <li key={ti} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {step.resources && step.resources.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Resources & Links</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {step.resources.map((res, ri) => {
                    const isUrl = res.startsWith('http://') || res.startsWith('https://');
                    return (
                      <span
                        key={ri}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-muted border border-border"
                      >
                        {isUrl ? (
                          <a
                            href={res}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            {res.replace(/https?:\/\//, '').split('/')[0]}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>{res}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand hint when collapsed */}
        {!expanded && (step.how_to?.length > 0 || step.resources?.length > 0) && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors rounded-b-xl border-t border-border/50"
          >
            <Lightbulb className="w-3 h-3" />
            View tips & resources
            <ChevronDown className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
