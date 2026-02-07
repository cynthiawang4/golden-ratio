-- Run this in Supabase SQL editor
create table if not exists choices (
  id uuid primary key default gen_random_uuid(),
  label text not null
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  choice_id uuid references choices(id) on delete cascade,
  score int not null,
  created_at timestamptz default now()
);
