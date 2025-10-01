-- Update the user with email admin@gmail.com to have admin role
-- This should be run AFTER signing up with admin@gmail.com on the /auth page

UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@gmail.com';

-- Verify the update
SELECT id, email, role, full_name 
FROM public.profiles 
WHERE email = 'admin@gmail.com';
