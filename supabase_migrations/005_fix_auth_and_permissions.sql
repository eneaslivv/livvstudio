-- ============================================
-- LIVV STUDIO - MIGRATION 005: FIX AUTH & PERMISSIONS
-- ============================================
-- Execute in: Supabase SQL Editor
-- Purpose: Fix login issues by syncing auth users to profiles and ensuring admin access.

-- 1. Create a function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'client' -- Default role is client. Admins must be manually promoted.
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. FIX: Backfill existing users from Auth to Profiles and make them ADMINS
-- This ensures that you (the developer/owner) can log in immediately.
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'System Admin'),
    'admin' -- We force 'admin' for all CURRENT users to unblock you
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 4. Success Message
DO $$
BEGIN
  RAISE NOTICE 'Fixed: Auth trigger created and existing users promoted to ADMIN.';
END $$;
