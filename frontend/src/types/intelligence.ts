export interface Trend {
  title: string;
  growth_percentage: number;
  forecast: string;
  keywords: string[];
  sources: string[];
}

export interface CompetitiveMove {
  company: string;
  move: string;
  date: string;
  relevance: number;
}

export interface AdvancedIntelligence {
  id?: string;
  niche: string;
  week: number;
  trends: Trend[];
  insights: string;
  competitive_moves: CompetitiveMove[];
  actionable_advice: string;
  sentiment: 'positive' | 'cautious' | 'negative';
  data_summary: Record<string, string>;
  created_at: string;
}
