-- Fix: Create missing tables and columns for Admin Modules
-- Run this in Supabase SQL Editor

-- 1. Create 'quick_hits' table for Dashboard
CREATE TABLE IF NOT EXISTS public.quick_hits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for quick_hits
ALTER TABLE public.quick_hits ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for quick_hits
DROP POLICY IF EXISTS "Allow all for anon" ON quick_hits;
CREATE POLICY "Allow all for anon" ON quick_hits FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.quick_hits TO anon, authenticated, service_role;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trigger_quick_hits_updated_at ON quick_hits;
CREATE TRIGGER trigger_quick_hits_updated_at BEFORE UPDATE ON quick_hits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Verify 'ideas' table matches frontend
-- Frontend expects: text, tags
-- Ensure columns exist (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ideas' AND column_name = 'text') THEN
        ALTER TABLE public.ideas RENAME COLUMN content TO text;
    END IF;
END $$;

-- 3. Verify 'leads' table has correct source/origin handling
-- Frontend uses 'source' (and adapter maps origin -> source), so we are good if 'source' exists.
-- Just in case, we add an 'origin' alias column if needed or ensures 'source' is there.
-- (No action needed if 015 was run, as it created 'source')

-- Force schema reload
NOTIFY pgrst, 'reload schema';
