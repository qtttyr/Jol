export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  how_to: string[];
  resources: string[];
  timeframe: string;
  kpi: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Roadmap {
  id: string;
  project_id: string;
  steps: RoadmapStep[];
  generated_at: string;
  expires_at?: string;
}
