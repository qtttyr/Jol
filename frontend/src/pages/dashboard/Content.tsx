import { useState, useEffect } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { PostCard } from '../../components/content/PostCard';
import { GenerationModal } from '../../components/content/GenerationModal';
import { PostEditor } from '../../components/content/PostEditor';
import { Modal } from '../../components/ui/Modal';
import type { Post, PostType, Platform, ContentLanguage, ContentStyle } from '../../types/post';
import { useProjectStore } from '../../store/projectStore';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Content() {
  const { posts, loading, fetchPosts, generatePost } = usePosts();
  const { activeProject } = useProjectStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerationOpen, setIsGenerationOpen] = useState(false);

  useEffect(() => {
    if (activeProject) {
      fetchPosts();
    }
  }, [activeProject, fetchPosts]);

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Please select or create a project first.
      </div>
    );
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 200);
  };

  const handleGenerate = async (params: {
    post_type: PostType;
    platform: Platform;
    language: ContentLanguage;
    style: ContentStyle;
  }) => {
    await generatePost(params);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-merriweather tracking-tight">Content Pipeline</h1>
          <p className="text-muted-foreground mt-1">Generate, review, and manage your AI-crafted posts with custom parameters.</p>
        </div>
        <div className="relative group w-fit">
          {/* Glow effect behind */}
          <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
          </div>
          
          <Button
            onClick={() => setIsGenerationOpen(true)}
            disabled={loading}
            className="relative h-12 px-6 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] transition-all duration-500 hover:bg-[100%_0] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <div className="relative flex items-center gap-2.5 z-10">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-semibold text-white tracking-wide">
                {loading ? 'Generating...' : 'Generate New Post'}
              </span>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          </Button>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl border-border bg-muted/10">
          <h3 className="text-lg font-semibold mb-2">No content yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Click the generate button above to create your first post with custom parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
             <PostCard key={post.id} post={post} onClick={handlePostClick} />
          ))}
        </div>
      )}

      <GenerationModal
        isOpen={isGenerationOpen}
        onClose={() => setIsGenerationOpen(false)}
        onGenerate={handleGenerate}
        loading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <PostEditor 
          post={selectedPost} 
          onClose={handleCloseModal} 
          onUpdate={fetchPosts} 
        />
      </Modal>
    </div>
  );
}
