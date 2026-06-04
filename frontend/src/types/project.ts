export type ProjectStage = 'idea' | 'mvp' | 'growth' | 'scale';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  stage: ProjectStage;
  description: string;
  target_audience: string;
  niche: string;
  brand_voice_examples: string[];
  brand_voice_summary?: string;
  created_at: string;
}
