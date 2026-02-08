-- Run this in Supabase SQL editor
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  mode text not null check (mode in ('everyone', 'onlyMe')),
  status text not null default 'setup'
    check (status in ('setup', 'collecting', 'ranking', 'revealed')),
  created_at timestamptz default now()
);

create table if not exists choices (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  label text not null,
  created_at timestamptz default now(),
  unique (poll_id, label)
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  choice_id uuid references choices(id) on delete cascade,

  -- either signed-in user OR guest
  user_id uuid references auth.users(id) on delete cascade,
  guest_id uuid,

  rank int not null check (rank > 0),

  created_at timestamptz default now()
);

-- Ensure one ranking per choice per user
create unique index if not exists votes_user_unique 
  on votes(poll_id, choice_id, user_id)
  where user_id is not null;

-- Ensure one ranking per choice per guest
create unique index if not exists votes_guest_unique 
  on votes(poll_id, choice_id, guest_id)
  where guest_id is not null;
