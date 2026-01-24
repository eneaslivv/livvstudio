-- Fix #2: Update ALL RLS policies to allow anonymous access for development
-- This fixes the systematic persistence failure across all admin pages

-- Tasks
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON tasks;
DROP POLICY IF EXISTS "Allow all operations for anon" ON tasks;
CREATE POLICY "Allow all operations for anon" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Ideas
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ideas;
DROP POLICY IF EXISTS "Allow all operations for anon" ON ideas;
CREATE POLICY "Allow all operations for anon" ON ideas FOR ALL USING (true) WITH CHECK (true);

-- Messages
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON messages;
DROP POLICY IF EXISTS "Allow all operations for anon" ON messages;
CREATE POLICY "Allow all operations for anon" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Leads
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON leads;
DROP POLICY IF EXISTS "Allow all operations for anon" ON leads;
CREATE POLICY "Allow all operations for anon" ON leads FOR ALL USING (true) WITH CHECK (true);

-- Events
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON events;
DROP POLICY IF EXISTS "Allow all operations for anon" ON events;
CREATE POLICY "Allow all operations for anon" ON events FOR ALL USING (true) WITH CHECK (true);

-- Activities
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON activities;
DROP POLICY IF EXISTS "Allow all operations for anon" ON activities;
CREATE POLICY "Allow all operations for anon" ON activities FOR ALL USING (true) WITH CHECK (true);

-- Documents
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON documents;
DROP POLICY IF EXISTS "Allow all operations for anon" ON documents;
CREATE POLICY "Allow all operations for anon" ON documents FOR ALL USING (true) WITH CHECK (true);

