-- CCNA Theory Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor for a fresh project.
-- For existing projects, apply via supabase migration instead.

-- Table: quiz_attempts
create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  topic text not null,
  type text not null default 'quiz' check (type in ('quiz', 'retry', 'mixed')),
  score int not null,
  total int not null,
  completed_at timestamptz not null default now()
);

alter table quiz_attempts enable row level security;

create policy "Users can view own attempts" on quiz_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own attempts" on quiz_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Table: question_results
create table if not exists question_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  attempt_id uuid references quiz_attempts(id) on delete cascade not null,
  question_id text not null,
  selected_answers text[] not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

alter table question_results enable row level security;

create policy "Users can view own question results" on question_results for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own question results" on question_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_quiz_attempts_user on quiz_attempts(user_id, completed_at desc);
create index if not exists idx_quiz_attempts_topic on quiz_attempts(topic);
create index if not exists idx_question_results_attempt on question_results(attempt_id);
create index if not exists idx_question_results_user_question on question_results(user_id, question_id);
