-- Fix permissions for Public Leads Form
-- 1. Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2. Grant permissions on leads table
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- 3. Ensure Policy allows Insert for Public
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
CREATE POLICY "Enable insert for everyone" ON public.leads FOR INSERT WITH CHECK (true);

-- 4. Ensure Policy allows Select for Authenticated (Admin)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
CREATE POLICY "Enable read for authenticated" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all for authenticated" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
