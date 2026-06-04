import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { AdvancedIntelligence } from '../types/intelligence';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';

export function useIntelligence() {
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<AdvancedIntelligence | null>(null);
  const { activeProject } = useProjectStore();

  const fetchDigest = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/intelligence/${activeProject.id}`);
      setDigest(data);
    } catch {
      setDigest(null);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  const refreshDigest = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/intelligence/${activeProject.id}/refresh`);
      setDigest(data);
    } catch {
      toast.error("Failed to generate intelligence");
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  return {
    loading,
    digest,
    fetchDigest,
    refreshDigest,
  };
}
