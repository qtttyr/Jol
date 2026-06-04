import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import type { Post, PostType, Platform, ContentLanguage, ContentStyle } from '../types/post';
import { useProjectStore } from '../store/projectStore';
import { toast } from 'sonner';

export function usePosts() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const { activeProject } = useProjectStore();

  const fetchPosts = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('project_id', activeProject.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  const generatePost = async (params: {
    post_type: PostType;
    platform: Platform;
    language: ContentLanguage;
    style: ContentStyle;
  }) => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const response = await api.post(`/content/generate/${activeProject.id}`, params);
      
      await fetchPosts();
      toast.success("Post generated successfully!");
      return response.data;
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
  };

  const generatePosts = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      // Generate with default parameters
      await generatePost({
        post_type: 'data_driven',
        platform: 'linkedin',
        language: 'en',
        style: 'professional',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: string, data: Partial<Post>) => {
    try {
      await api.patch(`/content/posts/${postId}`, data);
      await fetchPosts();
    } catch {
      toast.error("Failed to update post");
    }
  };

  return {
    loading,
    posts,
    fetchPosts,
    generatePost,
    generatePosts,
    updatePost
  };
}
