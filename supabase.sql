-- Run this in Supabase SQL editor
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists choices (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  label text not null
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  choice_id uuid references choices(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  score int not null,
  created_at timestamptz default now()
);
