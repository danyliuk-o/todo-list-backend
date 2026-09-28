-- Creates the blog `posts` table and seeds it with sample posts.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null default '',
  created_at timestamptz not null default now()
);

insert into posts (title, excerpt, created_at) values
  ('Hello, Blog!', 'This is the first post on our new blog.', now() - interval '4 days'),
  ('Learning Next.js', 'Every folder in src/app with a page.tsx becomes a route.', now() - interval '3 days'),
  ('Tailwind Grid', 'grid-cols-* decides how many columns fit in each row.', now() - interval '2 days'),
  ('Server Components', 'Pages without state are rendered on the server by default.', now() - interval '1 day'),
  ('What''s Next', 'These posts now come from the backend and Supabase.', now());
