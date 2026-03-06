
-- Clear user roles first (foreign key dependency)
DELETE FROM public.user_roles;

-- Clear profiles
DELETE FROM public.profiles;
