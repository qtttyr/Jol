import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import axios from 'axios';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';

export function useProjects() {
  const [loading, setLoading] = useState(false);
  const { setProjects, setActiveProject } = useProjectStore();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
      if (data && data.length > 0) {
        setActiveProject(data[0]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [setProjects, setActiveProject]);

  const createProject = async (projectData: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const response = await api.post('/projects', projectData);

      if (!response.data) throw new Error("Failed to create project");
      
      const createdProject = response.data;
      
      await fetchProjects();
      return createdProject;
    } catch (error: unknown) {
      let message = "An error occurred";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId: string, updates: Record<string, unknown>) => {
    setLoading(true);
    try {
      const response = await api.patch(`/projects/${projectId}`, updates);
      if (response.data) {
        await fetchProjects();
        return response.data;
      }
    } catch (error: unknown) {
      let message = "An error occurred";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchProjects,
    createProject,
    updateProject
  };
}
