export type PostType = 'data_driven' | 'storytelling' | 'hot_take';
export type PostStatus = 'draft' | 'approved' | 'posted';
export type Platform = 'telegram' | 'instagram' | 'threads' | 'medium' | 'linkedin' | 'reddit';
export type ContentLanguage = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'zh' | 'ko' | 'ar' | 'hi';
export type ContentStyle = 'professional' | 'casual' | 'humorous' | 'academic';

export interface Post {
  id: string;
  project_id: string;
  type: PostType;
  platform: Platform;
  language: ContentLanguage;
  style: ContentStyle;
  content: string;
  status: PostStatus;
  user_edited: boolean;
  created_at: string;
}
