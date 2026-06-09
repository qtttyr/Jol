import { useState, useRef, useEffect } from 'react';
import type { Platform } from '../../types/post';
import { toast } from 'sonner';

interface QuickPostProps {
  platform: Platform;
  content: string;
}

const PLATFORM_META: Record<Platform, { name: string; url: string; canPreFill: boolean; color: string }> = {
  linkedin: { name: 'LinkedIn', url: 'https://www.linkedin.com/feed/?shareActive=true', canPreFill: false, color: '#0A66C2' },
  reddit:   { name: 'Reddit',   url: 'https://www.reddit.com/submit?title=&text=',            canPreFill: true,  color: '#FF4500' },
  medium:   { name: 'Medium',   url: 'https://medium.com/new-story',                          canPreFill: false, color: '#00AB6C' },
  telegram: { name: 'Telegram', url: 'https://web.telegram.org',                              canPreFill: false, color: '#2AABEE' },
  threads:  { name: 'Threads',  url: 'https://www.threads.net',                               canPreFill: false, color: '#8A8A8A' },
  instagram:{ name: 'Instagram',url: 'https://www.instagram.com',                             canPreFill: false, color: '#E4405F' },
};

const ICONS: Record<string, string> = {
  linkedin:  'in',
  reddit:    'rd',
  medium:    'Md',
  telegram:  'Tg',
  threads:   'Th',
  instagram: 'Ig',
};

export function QuickPost({ platform, content }: QuickPostProps) {
  const [open, setOpen] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const meta = PLATFORM_META[platform] ?? { name: 'Platform', url: '', canPreFill: false, color: '#888' };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  };

  const doQuickPost = async () => {
    const ok = await handleCopy(content);
    if (!ok) {
      toast.error('Could not copy to clipboard');
      return;
    }
    toast.success('Content copied  —  pasting in ' + meta.name);
    if (meta.canPreFill) {
      window.open(meta.url + encodeURIComponent(content), '_blank');
    } else if (meta.url) {
      window.open(meta.url, '_blank');
    }
    setOpen(false);
  };

  // If the content is empty, render nothing
  if (!content) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border"
        style={{
          backgroundColor: meta.color + '12',
          borderColor: meta.color + '30',
          color: meta.color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = meta.color + '20';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = meta.color + '12';
        }}
      >
        {/* Platform monogram */}
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white"
          style={{ backgroundColor: meta.color }}
        >
          {ICONS[platform] ?? '?'}
        </span>
        Quick Post
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Invisible backdrop to capture clicks */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border bg-card shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Main quick-post action */}
            <button
              onClick={doQuickPost}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-muted transition-colors text-left border-b border-border"
            >
              <span
                className="flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: meta.color }}
              >
                {ICONS[platform] ?? '?'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Post to {meta.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {meta.url
                    ? 'Copy content & open ' + meta.name
                    : 'Copy content to clipboard'
                  }
                </div>
              </div>
              {justCopied ? (
                <span className="text-xs font-medium text-green-500 shrink-0">Copied!</span>
              ) : (
                <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>

            {/* Copy-only actions */}
            <div className="py-1">
              <CopyAction
                label="Copy Content (Markdown)"
                value={content}
                onCopy={handleCopy}
              />
              <CopyAction
                label="Copy as Plain Text"
                value={content.replace(/[#*`_~>|\[\]]/g, '').replace(/\n{3,}/g, '\n\n').trim()}
                onCopy={handleCopy}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CopyAction({ label, value, onCopy }: { label: string; value: string; onCopy: (t: string) => Promise<boolean> }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        const ok = await onCopy(value);
        if (ok) {
          setDone(true);
          toast.success(label + ' — copied!');
          setTimeout(() => setDone(false), 2000);
        } else {
          toast.error('Could not copy to clipboard');
        }
      }}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
    >
      <svg
        className={`w-4 h-4 shrink-0 ${done ? 'text-green-500' : 'text-muted-foreground'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        {done ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </>
        )}
      </svg>
      <span className={`text-sm ${done ? 'text-green-500 font-medium' : ''}`}>{done ? 'Copied!' : label}</span>
    </button>
  );
}
