-- ============================================
-- LIVV STUDIO - COMPLETE ADMIN SETUP
-- ============================================
-- Run this in: Supabase SQL Editor
-- Purpose: Create all tables and permissions for the Admin Panel
-- ============================================

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    client TEXT,
    client_id UUID,
    status TEXT DEFAULT 'Active',
    priority TEXT DEFAULT 'Medium',
    progress INTEGER DEFAULT 0,
    next_steps TEXT,
    color TEXT,
    tasks_groups JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'pending',
    tag TEXT,
    start_date DATE,
    end_date DATE,
    start_time TEXT,
    assignee TEXT,
    estimated_hours NUMERIC,
    subtasks JSONB,
    comments JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'new',
    ai_analysis JSONB,
    history JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. IDEAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. EVENTS TABLE (Calendar)
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    start_time TEXT,
    end_time TEXT,
    all_day BOOLEAN DEFAULT false,
    color TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT,
    user_avatar TEXT,
    type TEXT,
    action TEXT,
    target TEXT,
    project_id UUID,
    project_title TEXT,
    details TEXT,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'file', -- 'folder' or 'file'
    name TEXT NOT NULL,
    content TEXT,
    tags TEXT[],
    author_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 8. MESSAGES TABLE (Inbox)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT,
    sender_email TEXT,
    sender_avatar TEXT,
    subject TEXT,
    preview TEXT,
    body TEXT,
    read BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP OLD POLICIES (Clean Slate)
-- ============================================
DROP POLICY IF EXISTS "Allow all for anon" ON projects;
DROP POLICY IF EXISTS "Allow all operations for anon" ON projects;
DROP POLICY IF EXISTS "Allow all for anon" ON tasks;
DROP POLICY IF EXISTS "Allow all operations for anon" ON tasks;
DROP POLICY IF EXISTS "Allow all for anon" ON leads;
DROP POLICY IF EXISTS "Allow all operations for anon" ON leads;
DROP POLICY IF EXISTS "Enable insert for everyone" ON leads;
DROP POLICY IF EXISTS "Enable read for authenticated" ON leads;
DROP POLICY IF EXISTS "Enable all for authenticated" ON leads;
DROP POLICY IF EXISTS "Allow all for anon" ON ideas;
DROP POLICY IF EXISTS "Allow all operations for anon" ON ideas;
DROP POLICY IF EXISTS "Allow all for anon" ON events;
DROP POLICY IF EXISTS "Allow all operations for anon" ON events;
DROP POLICY IF EXISTS "Allow all for anon" ON activities;
DROP POLICY IF EXISTS "Allow all operations for anon" ON activities;
DROP POLICY IF EXISTS "Allow all for anon" ON documents;
DROP POLICY IF EXISTS "Allow all operations for anon" ON documents;
DROP POLICY IF EXISTS "Allow all for anon" ON messages;
DROP POLICY IF EXISTS "Allow all operations for anon" ON messages;

-- ============================================
-- CREATE PERMISSIVE POLICIES (Development)
-- ============================================
CREATE POLICY "Allow all for anon" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON messages FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON public.projects TO anon, authenticated, service_role;
GRANT ALL ON public.tasks TO anon, authenticated, service_role;
GRANT ALL ON public.leads TO anon, authenticated, service_role;
GRANT ALL ON public.ideas TO anon, authenticated, service_role;
GRANT ALL ON public.events TO anon, authenticated, service_role;
GRANT ALL ON public.activities TO anon, authenticated, service_role;
GRANT ALL ON public.documents TO anon, authenticated, service_role;
GRANT ALL ON public.messages TO anon, authenticated, service_role;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_tasks_updated_at ON tasks;
CREATE TRIGGER trigger_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
CREATE TRIGGER trigger_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_documents_updated_at ON documents;
CREATE TRIGGER trigger_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT PROJECT (Optional)
-- ============================================
-- Uncomment below to insert a test project
-- INSERT INTO projects (title, description, client, status, progress, next_steps)
-- VALUES ('Welcome Project', 'Your first project in LIVV Studio!', 'LIVV', 'Active', 0, 'Create your first task');

-- ============================================
-- DONE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Admin Panel setup complete! All tables and permissions configured.';
END $$;
