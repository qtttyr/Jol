import { useState, useEffect } from 'react';
import type { Post } from '../../types/post';
import { PlatformPreview } from './PlatformPreview';
import { QuickPost } from './QuickPost';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Save, CheckCircle, PenLine, Linkedin, Send, Globe, Hash, PenTool, Briefcase, MessageSquare, Zap } from 'lucide-react';
import { api } from '../../lib/api';
import { toast } from 'sonner';

interface PostEditorProps {
  post: Post | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function PostEditor({ post, onClose, onUpdate }: PostEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setIsEditing(false);
    }
  }, [post]);

  if (!post) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/content/posts/${post.id}`, {
        content: content,
        status: 'approved',
        user_edited: true
      });
      toast.success("Post updated and approved!");
      onUpdate();
      onClose();
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (val: string) => {
    setContent(val);
  };

  return (
    <div className="flex flex-col h-full sm:h-[60vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-merriweather">Review Post</h2>
          <p className="text-muted-foreground text-sm">Review, edit, and approve your generated content.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              Save & Approve
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <PenLine className="w-4 h-4 mr-2" />
              Edit Content
            </Button>
          )}
          {!isEditing && post.status !== 'approved' && post.status !== 'posted' && (
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve As Is
            </Button>
          )}
          {!isEditing && (
            <QuickPost platform={post.platform} content={post.content || ''} />
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border">
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
          {post.type === 'data_driven' && <Briefcase className="w-3 h-3" />}
          {post.type === 'storytelling' && <MessageSquare className="w-3 h-3" />}
          {post.type === 'hot_take' && <Zap className="w-3 h-3" />}
          <span className="capitalize">{post.type.replace('_', ' ')}</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
          {post.platform === 'linkedin' && <Linkedin className="w-3 h-3 text-[#0A66C2]" />}
          {post.platform === 'threads' && <Hash className="w-3 h-3 text-gray-400" />}
          {post.platform === 'instagram' && <PenTool className="w-3 h-3 text-pink-500" />}
          {post.platform === 'telegram' && <Send className="w-3 h-3 text-[#2AABEE]" />}
          {post.platform === 'medium' && <Globe className="w-3 h-3 text-green-600" />}
          {post.platform === 'reddit' && <MessageSquare className="w-3 h-3 text-[#FF4500]" />}
          <span className="capitalize">{post.platform}</span>
        </Badge>
        <Badge variant="outline" className="px-3 py-1 capitalize">{post.language}</Badge>
        <Badge variant="outline" className="px-3 py-1 capitalize">{post.style}</Badge>
      </div>

      <div className="flex-1 overflow-hidden">
        <PlatformPreview 
          content={content}
          onChange={handleChange} 
          isEditing={isEditing}
          platform={post.platform}
        />
      </div>
    </div>
  );
}
