import type { Post } from '../../types/post';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, MessageSquare, Briefcase, Zap } from 'lucide-react';

function stripMarkdown(text: string): string {
  return text
    .replace(/###\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    .trim();
}

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const typeConfig = {
    data_driven: { icon: Briefcase, label: 'Data Driven', badge: 'indigo' as const, bg: 'bg-indigo-500/10 text-indigo-500' },
    storytelling: { icon: MessageSquare, label: 'Storytelling', badge: 'green' as const, bg: 'bg-green-500/10 text-green-500' },
    hot_take: { icon: Zap, label: 'Hot Take', badge: 'orange' as const, bg: 'bg-orange-500/10 text-orange-500' }
  };

  const statusConfig = {
    draft: { label: 'Draft', badge: 'default' as const },
    approved: { label: 'Approved', badge: 'indigo' as const },
    posted: { label: 'Posted', badge: 'green' as const }
  };

  const typeData = typeConfig[post.type] || typeConfig.data_driven;
  const statusData = statusConfig[post.status] || statusConfig.draft;
  const TypeIcon = typeData.icon;

  const previewText = stripMarkdown(post.content || "No content generated.");

  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all duration-200 group"
      onClick={() => onClick(post)}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${typeData.bg} group-hover:bg-primary/20 group-hover:text-primary transition-colors`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{typeData.label}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-0.5 space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
            </div>
          </div>
          <Badge variant={statusData.badge}>{statusData.label}</Badge>
        </div>

        
        <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed grow">
          {previewText}
        </div>
      </CardContent>
    </Card>
  );
}
