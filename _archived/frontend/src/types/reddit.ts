export type ThreadStatus = 'new' | 'reviewed' | 'posted';

export interface RedditThread {
  id: string;
  project_id: string;
  thread_title: string;
  thread_url: string;
  draft_reply: string;
  status: ThreadStatus;
  found_at: string;
}
