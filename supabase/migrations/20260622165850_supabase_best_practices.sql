-- Supabase best practices fixes

-- CHECK constraint on type
alter table quiz_attempts add constraint quiz_attempts_type_check check (type in ('quiz', 'retry', 'mixed'));

-- Missing indexes
create index if not exists idx_question_results_user_question on question_results(user_id, question_id);
create index if not exists idx_quiz_attempts_topic on quiz_attempts(topic);

-- Drop unused table (feature removed)
drop table if exists spaced_repetition cascade;

-- RLS: add TO authenticated, drop old policies first
drop policy if exists "Users can view own attempts" on quiz_attempts;
drop policy if exists "Users can insert own attempts" on quiz_attempts;

create policy "Users can view own attempts" on quiz_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own attempts" on quiz_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own question results" on question_results;
drop policy if exists "Users can insert own question results" on question_results;

create policy "Users can view own question results" on question_results for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own question results" on question_results for insert
  to authenticated
  with check (auth.uid() = user_id);
