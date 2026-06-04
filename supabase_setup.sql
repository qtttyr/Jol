-- JOL SUPABASE INITIALIZATION SCRIPT
-- Version: 1.0
-- Description: Full schema setup with RLS, Enums, and AI-ready tables.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 2. ENUMS
create type user_plan as enum ('free', 'pro');
create type project_stage as enum ('idea', 'mvp', 'growth', 'scale');
create type post_type as enum ('data_driven', 'storytelling', 'hot_take');
create type post_status as enum ('draft', 'approved', 'posted');
create type reddit_thread_status as enum ('new', 'reviewed', 'posted');

-- 3. TABLES

-- Profiles/Users table (syncs with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  plan user_plan default 'free',
  posts_generated integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  stage project_stage default 'idea',
  description text,
  target_audience text,
  niche text,
  brand_voice_examples text[],
  brand_voice_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  type post_type not null,
  content_linkedin text,
  content_telegram text,
  status post_status default 'draft',
  user_edited boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Roadmaps table
create table public.roadmaps (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  steps jsonb not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Weekly Digests table (Shared across users in the same niche)
create table public.weekly_digests (
  id uuid primary key default uuid_generate_v4(),
  niche text not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reddit/HN threads table
create table public.reddit_threads (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  thread_url text not null,
  thread_title text,
  draft_reply text,
  status reddit_thread_status default 'new',
  found_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.roadmaps enable row level security;
alter table public.weekly_digests enable row level security;
alter table public.reddit_threads enable row level security;

-- Policies for Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Policies for Projects
create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

-- Policies for Posts
create policy "Users can view own project posts" on public.posts for select 
  using (exists (select 1 from public.projects where projects.id = posts.project_id and projects.user_id = auth.uid()));
create policy "Users can manage own project posts" on public.posts for all 
  using (exists (select 1 from public.projects where projects.id = posts.project_id and projects.user_id = auth.uid()));

-- Policies for Roadmaps
create policy "Users can view own roadmaps" on public.roadmaps for select 
  using (exists (select 1 from public.projects where projects.id = roadmaps.project_id and projects.user_id = auth.uid()));

-- Policies for Reddit Threads
create policy "Users can manage own reddit threads" on public.reddit_threads for all 
  using (exists (select 1 from public.projects where projects.id = reddit_threads.project_id and projects.user_id = auth.uid()));

-- Policies for Weekly Digests (Publicly readable by authenticated users)
create policy "Authenticated users can view digests" on public.weekly_digests for select 
  to authenticated using (true);

-- 5. FUNCTIONS & TRIGGERS

-- Automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, plan)
  values (new.id, new.email, 'free');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment post count
create function public.increment_post_count(user_uuid uuid)
returns void as $$
begin
  update public.profiles
  set posts_generated = posts_generated + 1
  where id = user_uuid;
end;
$$ language plpgsql security definer;
