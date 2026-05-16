create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  mode text not null check (mode in ('buyer', 'seller')),
  title text not null,
  status text not null default 'active',
  location text,
  budget_label text,
  checklist jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  detail text not null,
  status text not null check (status in ('done', 'active', 'next')),
  owner_label text,
  deadline_label text,
  checkpoint text,
  blocker text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  owner_id uuid references auth.users (id) on delete set null,
  label text not null,
  source text not null,
  owner_label text,
  status text not null,
  rag_status text not null default 'missing' check (rag_status in ('indexed', 'ready', 'missing')),
  chunk_count integer not null default 0,
  storage_path text,
  summary text,
  next_action text,
  notes jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents (id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_circles (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('buyer', 'seller')),
  title text not null,
  audience text,
  description text not null,
  members_label text,
  activity_label text,
  trust_label text,
  prompt text,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_threads (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.social_circles (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  title text not null,
  author_label text not null,
  role_label text,
  trust_label text,
  excerpt text not null,
  replies_label text,
  last_activity_label text,
  ai_summary text,
  project_link text,
  action_label text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.social_threads (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  body text not null,
  trust_level text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_owner_id_idx on public.projects (owner_id);
create index if not exists project_steps_project_id_idx on public.project_steps (project_id, sort_order);
create index if not exists documents_project_id_idx on public.documents (project_id);
create index if not exists document_chunks_document_id_idx on public.document_chunks (document_id, chunk_index);
create index if not exists social_circles_mode_idx on public.social_circles (mode);
create index if not exists social_threads_circle_id_idx on public.social_threads (circle_id);
create index if not exists social_posts_thread_id_idx on public.social_posts (thread_id);

alter table public.projects enable row level security;
alter table public.project_steps enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.social_circles enable row level security;
alter table public.social_threads enable row level security;
alter table public.social_posts enable row level security;

create policy "project owners can read projects"
on public.projects
for select
using (auth.uid() = owner_id);

create policy "project owners can manage projects"
on public.projects
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "project owners can read steps"
on public.project_steps
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_steps.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "project owners can manage steps"
on public.project_steps
for all
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_steps.project_id
      and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_steps.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "project owners can read documents"
on public.documents
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = documents.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "project owners can manage documents"
on public.documents
for all
using (
  exists (
    select 1
    from public.projects
    where projects.id = documents.project_id
      and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = documents.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "project owners can read document chunks"
on public.document_chunks
for select
using (
  exists (
    select 1
    from public.documents
    join public.projects on projects.id = documents.project_id
    where documents.id = document_chunks.document_id
      and projects.owner_id = auth.uid()
  )
);

create policy "authenticated can read social circles"
on public.social_circles
for select
to authenticated
using (true);

create policy "authenticated can read social threads"
on public.social_threads
for select
to authenticated
using (true);

create policy "authenticated can read social posts"
on public.social_posts
for select
to authenticated
using (true);

create policy "authenticated can write social posts"
on public.social_posts
for insert
to authenticated
with check (auth.uid() = author_id);

insert into storage.buckets (id, name, public)
values ('project-documents', 'project-documents', false)
on conflict (id) do nothing;

create policy "authenticated can upload project documents"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-documents');

create policy "authenticated can read project documents"
on storage.objects
for select
to authenticated
using (bucket_id = 'project-documents');

create policy "authenticated can update project documents"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-documents')
with check (bucket_id = 'project-documents');
