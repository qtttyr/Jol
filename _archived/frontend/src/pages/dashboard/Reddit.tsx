import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../../store/projectStore';
import { ThreadCard } from '../../components/reddit/ThreadCard';
import { Button } from '../../components/ui/button';
import { Loader2, MessageSquare, Search, Filter } from 'lucide-react';
import type { RedditThread } from '../../types/reddit';

const mockThreads: RedditThread[] = [
  {
    id: '1',
    project_id: 'mock',
    thread_title: 'What tools are you using for B2B lead generation in 2025?',
    thread_url: 'https://reddit.com/r/startups/comments/example1',
    draft_reply: "We've been using a combination of Apollo for data and Clay for enrichment. The integration has been game-changing. For cold outreach, I'd recommend focusing on LinkedIn with personalized sequences rather than email - higher response rates in my experience.",
    status: 'new',
    found_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    project_id: 'mock',
    thread_title: 'Building an AI agent for sales - worth the investment?',
    thread_url: 'https://reddit.com/r/B2B/comments/example2',
    draft_reply: "Just shipped this in December. Key learnings: start with a narrow use case (we did meeting scheduling) before expanding. The ROI took 3 months to materialize but now we're seeing 40% reduction in manual follow-ups. Happy to share our tech stack if helpful.",
    status: 'reviewed',
    found_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    project_id: 'mock',
    thread_title: 'How to validate B2B SaaS pricing before launch?',
    thread_url: 'https://reddit.com/r/entrepreneur/comments/example3',
    draft_reply: "We did 50+ customer interviews before launching. The key was asking about their current spend, not what they'd hypothetically pay. Found that our ideal customer segment was actually willing to pay 2x what we initially planned. Always test with real money on the table.",
    status: 'posted',
    found_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    project_id: 'mock',
    thread_title: 'Best CRM for early stage startups?',
    thread_url: 'https://reddit.com/r/startups/comments/example4',
    draft_reply: "Stick with HubSpot free for as long as possible. We made the mistake of upgrading too early. Pipedrive is great if you want something simpler. For SaaS specifically, I hear good things about Attio but haven't tried it myself yet.",
    status: 'new',
    found_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function Reddit() {
  const { activeProject } = useProjectStore();
  const [threads, setThreads] = useState<RedditThread[]>(mockThreads);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'posted'>('all');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (id: string, status: 'new' | 'reviewed' | 'posted') => {
    setThreads(prev => prev.map(t => 
      t.id === id ? { ...t, status } : t
    ));
  };

  const filteredThreads = threads.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  const statusCounts = {
    all: threads.length,
    new: threads.filter(t => t.status === 'new').length,
    reviewed: threads.filter(t => t.status === 'reviewed').length,
    posted: threads.filter(t => t.status === 'posted').length
  };

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Please select or create a project first.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-merriweather tracking-tight">Reddit Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Discover relevant discussions and craft authentic responses.
          </p>
        </div>
        <Button 
          onClick={() => setLoading(true)}
          disabled={loading}
          className="bg-white text-black hover:bg-neutral-100"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Scan for Threads
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'new', 'reviewed', 'posted'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f 
                ? 'bg-primary text-white' 
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {f} ({statusCounts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Scanning Reddit for relevant discussions...</p>
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl border-border bg-muted/10 flex flex-col items-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Threads Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Click "Scan for Threads" to discover relevant discussions in your niche.
          </p>
          <Button onClick={() => setLoading(true)} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Scan Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThreadCard 
                thread={thread} 
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pro CTA */}
      {threads.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Filter className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold">Unlock More Threads</h3>
              <p className="text-sm text-muted-foreground">
                Pro gives you 10 threads per week vs 3 on Free.
              </p>
            </div>
          </div>
          <Button variant="outline" className="border-primary/20">
            Upgrade to Pro
          </Button>
        </motion.div>
      )}
    </div>
  );
}