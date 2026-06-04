import type { RedditThread } from '../../types/reddit';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageCircle, ExternalLink, CheckCircle, Clock } from 'lucide-react';

interface ThreadCardProps {
  thread: RedditThread;
  onStatusChange: (id: string, status: 'new' | 'reviewed' | 'posted') => void;
}

export function ThreadCard({ thread, onStatusChange }: ThreadCardProps) {
  const statusConfig = {
    new: { label: 'New', badge: 'orange' as const, icon: Clock },
    reviewed: { label: 'Reviewed', badge: 'indigo' as const, icon: CheckCircle },
    posted: { label: 'Posted', badge: 'green' as const, icon: ExternalLink }
  };

  const currentStatus = statusConfig[thread.status] || statusConfig.new;
  const StatusIcon = currentStatus.icon;

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2" title={thread.thread_title}>
              {thread.thread_title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>Reddit Mention</span>
            </div>
          </div>
          <Badge variant={currentStatus.badge as "default" | "secondary" | "destructive" | "outline" | "green" | "indigo" | "orange"} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 py-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Suggested Reply</p>
          <div className="bg-muted/30 p-3 rounded-md border border-border/50 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
            {thread.draft_reply}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-wrap gap-2 justify-between items-center border-t border-border/50 mt-auto px-6 py-4">
        <a 
          href={thread.thread_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View on Reddit
          <ExternalLink className="w-3 h-3" />
        </a>
        
        <div className="flex gap-2">
          {thread.status === 'new' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStatusChange(thread.id, 'reviewed')}
              className="h-8"
            >
              Mark Reviewed
            </Button>
          )}
          {thread.status !== 'posted' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(thread.id, 'posted')}
              className="h-8 bg-green-600 hover:bg-green-700 text-white"
            >
              Mark Posted
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
