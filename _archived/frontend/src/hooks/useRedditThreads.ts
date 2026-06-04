import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import axios from 'axios';
import type { RedditThread } from '../types/reddit';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';

export function useRedditThreads() {
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<RedditThread[]>([]);
  const { activeProject } = useProjectStore();

  const fetchThreads = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const response = await api.get(`/reddit/${activeProject.id}/threads`);
      setThreads(response.data);
    } catch (error: unknown) {
      let message = "An error occurred";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  return { loading, threads, fetchThreads };
}
