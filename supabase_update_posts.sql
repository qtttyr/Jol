-- Update posts table schema to support parametrized content generation
-- This migration adds support for platform, language, and style fields
-- and converts from separate content_linkedin/content_telegram to unified content field

-- First, let's add the new columns
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'linkedin',
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS style text DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS content text;

-- Migrate existing data from content_linkedin to content if content is null
UPDATE public.posts 
SET content = COALESCE(content_linkedin, content_telegram, '')
WHERE content IS NULL OR content = '';

-- You can keep content_linkedin and content_telegram for backward compatibility
-- or drop them after verifying the migration:
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS content_linkedin;
-- ALTER TABLE public.posts DROP COLUMN IF EXISTS content_telegram;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS posts_platform_idx ON public.posts(platform);
CREATE INDEX IF NOT EXISTS posts_language_idx ON public.posts(language);
CREATE INDEX IF NOT EXISTS posts_style_idx ON public.posts(style);

-- Update the posts table comment
COMMENT ON TABLE public.posts IS 'User-generated posts created by AI content generation. Supports multiple platforms, languages, and styles.';
COMMENT ON COLUMN public.posts.content IS 'The generated content, formatted for the target platform';
COMMENT ON COLUMN public.posts.platform IS 'Target platform (linkedin, reddit, threads, instagram, telegram, medium)';
COMMENT ON COLUMN public.posts.language IS 'Content language (ISO 639-1 code)';
COMMENT ON COLUMN public.posts.style IS 'Writing style (professional, casual, humorous, academic)';
