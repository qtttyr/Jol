import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-px bg-border -z-10" />
      
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={i} className="flex flex-col items-center gap-3">
             <motion.div 
               initial={false}
               animate={{
                 backgroundColor: isActive || isCompleted ? 'var(--color-primary)' : 'var(--color-muted)',
                 scale: isActive ? 1.1 : 1,
                 borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)'
               }}
               className={cn(
                 "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all border",
                 isActive ? "text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "text-muted-foreground"
               )}
             >
               {isCompleted ? <Check className="w-4 h-4 text-primary-foreground" /> : stepNum}
             </motion.div>
             <span className={cn(
               "text-[10px] uppercase tracking-widest font-black transition-colors",
               isActive ? "text-primary" : "text-muted-foreground/40"
             )}>
               Step {stepNum}
             </span>
         </div>
        );
      })}
    </div>
  );
}
