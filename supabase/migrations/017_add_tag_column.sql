-- Fix: Add missing 'tag' column to tasks table
-- The frontend uses 'tag' to store the phase/group name

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tag TEXT;

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';

-- Verify
SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'tag';
