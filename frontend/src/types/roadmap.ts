export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
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
