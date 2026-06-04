import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import type { Roadmap } from '../types/roadmap';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';

export function useRoadmap() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const { activeProject } = useProjectStore();

  const fetchRoadmap = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/roadmap/${activeProject.id}`);
      setRoadmap(data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        toast.error(error.response?.data?.detail || "Failed to fetch roadmap");
      }
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  const refreshRoadmap = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/roadmap/${activeProject.id}/refresh`);
      setRoadmap(data);
      toast.success("Roadmap regenerated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.detail || "Failed to generate roadmap");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStepStatus = async (stepId: string) => {
    if (!roadmap || !activeProject) return;

    const updatedSteps = roadmap.steps.map((step) => {
      if (step.id === stepId) {
        return {
           ...step, 
           status: step.status === 'completed' ? 'pending' as const : 'completed' as const
        };
      }
      return step;
    });

    setRoadmap({ ...roadmap, steps: updatedSteps });

    try {
      // Full save to supabase
      const { error } = await supabase
        .from('roadmaps')
        .update({ steps: updatedSteps })
        .eq('id', roadmap.id);

      if (error) throw error;
    } catch (error: unknown) {
      toast.error("Failed to save step status");
    }
  };

  return {
    roadmap,
    loading,
    fetchRoadmap,
    refreshRoadmap,
    toggleStepStatus
  };
}
