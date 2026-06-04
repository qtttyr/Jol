import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { RedditThread, ThreadStatus } from '../types/reddit';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';
import axios from 'axios';

export function useReddit() {
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<RedditThread[]>([]);
  const { activeProject } = useProjectStore();

  const fetchThreads = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/reddit/threads/${activeProject.id}`);
      setThreads(data || []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        toast.error("Failed to fetch Reddit threads");
      }
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  const updateThreadStatus = async (threadId: string, status: ThreadStatus) => {
    try {
      await api.patch(`/reddit/threads/${threadId}`, { status });
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, status } : t));
      toast.success("Thread status updated");
    } catch (error) {
      toast.error("Failed to update thread status");
    }
  };

  const syncThreads = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      await api.post(`/reddit/sync/${activeProject.id}`);
      await fetchThreads();
      toast.success("Reddit threads synced!");
    } catch (error) {
      toast.error("Failed to sync threads");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    threads,
    fetchThreads,
    updateThreadStatus,
    syncThreads
  };
}
