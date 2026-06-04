import { type ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '../ui/Textarea';
import type { Platform } from '../../types/post';

interface PlatformPreviewProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
  platform: Platform;
}

export function PlatformPreview({ content, onChange, isEditing }: PlatformPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[300px] h-full flex flex-col">
        {isEditing ? (
          <Textarea 
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            className="flex-1 min-h-[300px] resize-none font-inter text-base"
          />
        ) : (
          <div className="flex-1 min-h-[300px] p-4 rounded-md border border-border bg-muted/10 font-inter text-sm overflow-y-auto">
            <ReactMarkdown
              components={{
                h3: ({ children, ...props }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2 text-foreground" {...props}>
                    {children}
                  </h3>
                ),
                strong: ({ children, ...props }) => (
                  <strong className="font-semibold text-foreground" {...props}>
                    {children}
                  </strong>
                ),
                p: ({ children, ...props }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed text-muted-foreground" {...props}>
                    {children}
                  </p>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
