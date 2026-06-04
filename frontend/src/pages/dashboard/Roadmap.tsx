import { useEffect } from 'react';
import { useRoadmap } from '../../hooks/useRoadmap';
import { RoadmapStep } from '../../components/roadmap/RoadmapStep';
import { RoadmapProgress } from '../../components/roadmap/RoadmapProgress';
import { Button } from '../../components/ui/button';
import { Loader2, RefreshCw, Target } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';

export default function Roadmap() {
  const { activeProject } = useProjectStore();
  const { roadmap, loading, fetchRoadmap, refreshRoadmap, toggleStepStatus } = useRoadmap();

  useEffect(() => {
    if (activeProject) {
      fetchRoadmap();
    }
  }, [activeProject, fetchRoadmap]);

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Please select or create a project first.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-merriweather tracking-tight">Growth Roadmap</h1>
          <p className="text-muted-foreground mt-1">AI-generated step-by-step plan to scale your startup.</p>
        </div>
        
        <Button 
          onClick={refreshRoadmap} 
          disabled={loading}
          className="bg-transparent border border-primary/20 hover:bg-primary/5 text-primary"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Regenerate Strategy
        </Button>
      </div>

      {loading && !roadmap ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Analyzing market and drafting roadmap...</p>
        </div>
      ) : !roadmap || !roadmap.steps || roadmap.steps.length === 0 ? (
        <div className="text-center py-24 border border-dashed rounded-xl border-border bg-muted/10 flex flex-col items-center">
          <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Roadmap Generated</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Click the button below to generate a tailored step-by-step marketing strategy.
          </p>
          <Button onClick={refreshRoadmap} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Generate Now
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <RoadmapProgress roadmap={roadmap} />
          
          <div className="bg-card border border-border rounded-xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative">
              {roadmap.steps.map((step, index) => (
                <RoadmapStep 
                  key={step.id} 
                  step={step} 
                  index={index} 
                  isLast={index === roadmap.steps.length - 1}
                  onToggle={toggleStepStatus}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
