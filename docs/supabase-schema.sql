-- CCNA Theory Supabase Schema
-- Chạy SQL này trong Supabase Dashboard > SQL Editor
--
-- Nếu đã có bảng cũ, chạy thêm:
-- alter table quiz_attempts add column if not exists type text not null default 'quiz';

-- Table: quiz_attempts
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  topic text not null,
  type text not null default 'quiz',
  score int not null,
  total int not null,
  completed_at timestamptz not null default now()
);

alter table quiz_attempts enable row level security;

create policy "Users can view own attempts"
  on quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on quiz_attempts for insert
  with check (auth.uid() = user_id);

-- Table: question_results
create table question_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  attempt_id uuid references quiz_attempts(id) on delete cascade not null,
  question_id text not null,
  selected_answers text[] not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

alter table question_results enable row level security;

create policy "Users can view own question results"
  on question_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own question results"
  on question_results for insert
  with check (auth.uid() = user_id);

-- Table: spaced_repetition
create table spaced_repetition (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  question_id text not null,
  ease_factor real not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  unique(user_id, question_id)
);

alter table spaced_repetition enable row level security;

create policy "Users can view own spaced repetition"
  on spaced_repetition for select
  using (auth.uid() = user_id);

create policy "Users can insert own spaced repetition"
  on spaced_repetition for insert
  with check (auth.uid() = user_id);

create policy "Users can update own spaced repetition"
  on spaced_repetition for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index idx_quiz_attempts_user on quiz_attempts(user_id, completed_at desc);
create index idx_question_results_attempt on question_results(attempt_id);
create index idx_spaced_repetition_user on spaced_repetition(user_id, next_review_at);
