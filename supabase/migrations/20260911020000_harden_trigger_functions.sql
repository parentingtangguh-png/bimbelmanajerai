-- Trigger functions never need to be called through the public RPC endpoint.
revoke execute on function public.handle_new_user() from authenticated;
revoke execute on function public.guard_student_update() from authenticated;
