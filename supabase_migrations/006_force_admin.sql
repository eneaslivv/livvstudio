-- FORCE SPECIFIC USER TO ADMIN
-- Run this in Supabase SQL Editor

-- 1. Force update the role for livvadm@gmail.com
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'livvadm@gmail.com';

-- 2. Safety Net: If the profile doesn't exist yet, create it from auth.users
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'System Admin', 'admin'
FROM auth.users
WHERE email = 'livvadm@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 3. Verify the result (Run this to see if it worked)
-- You should see 'admin' in the role column
SELECT email, role FROM public.profiles WHERE email = 'livvadm@gmail.com';
