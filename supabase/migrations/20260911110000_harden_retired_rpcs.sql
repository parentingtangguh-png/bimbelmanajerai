-- Retire endpoints from the former single-grade flow and make trigger-only
-- functions explicitly unavailable through PostgREST.
revoke execute on function public.finalize_evaluation(uuid,text,text) from public,anon,authenticated;
revoke execute on function public.finalize_competency_evaluation(uuid,jsonb,text) from public,anon,authenticated;
revoke execute on function public.initialize_student_competencies() from public,anon,authenticated;
revoke execute on function public.sync_core_competency_targets() from public,anon,authenticated;

-- Student creation is intentionally available only to signed-in members; the
-- function still verifies membership and assigns teacher ownership itself.
revoke execute on function public.create_student(jsonb) from public,anon;
grant execute on function public.create_student(jsonb) to authenticated;
