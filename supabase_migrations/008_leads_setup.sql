-- ============================================
-- LIVV STUDIO - MIGRATION 008: LEADS & PUBLIC FORM
-- ============================================
-- Execute in: Supabase SQL Editor
-- Purpose: Ensure 'leads' table exists and allows public submissions from the landing page.

-- 1. Ensure Table Exists (consolidating with 'sales_leads' if needed, but keeping 'leads' for code compatibility)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT,
    company TEXT,
    phone TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Clear old policies to avoid conflicts
DROP POLICY IF EXISTS "products_insert_public" ON leads; -- cleanup
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
DROP POLICY IF EXISTS "Admins can view leads" ON leads;
DROP POLICY IF EXISTS "leads_insert" ON leads;
DROP POLICY IF EXISTS "leads_select_admin" ON leads;

-- Policy: Allow ANYONE (including anonymous) to insert
CREATE POLICY "Public can insert leads" ON leads
    FOR INSERT 
    WITH CHECK (true);

-- Policy: Allow Admins to view/manage everything
CREATE POLICY "Admins can manage leads" ON leads
    FOR ALL 
    USING (is_admin());

-- 4. Permissions (CRITICAL for Anon Access)
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO service_role;

-- 5. Notify
DO $$
BEGIN
  RAISE NOTICE 'Fixed: Leads table created/secured. Public submissions enabled.';
END $$;
