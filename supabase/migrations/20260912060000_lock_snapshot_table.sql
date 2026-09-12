-- Supabase grants the table privileges of schema public to anon and authenticated by default, so
-- session_competency_snapshots came out readable even though the migration that created it granted
-- nothing. Row-level security with no policies already denies every row, but the grant made the
-- intent look accidental. Say it out loud instead: only the security-definer functions touch this
-- table.
revoke all on public.session_competency_snapshots from public,anon,authenticated;
