-- ============================================
-- LIVV STUDIO - MIGRATION 003: ROW LEVEL SECURITY
-- ============================================
-- Execute in: Supabase SQL Editor
-- Order: Run this THIRD (after 002_triggers.sql)

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA PROJECTS
-- ============================================
DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Clients can view their projects" ON projects;
CREATE POLICY "Clients can view their projects" ON projects
  FOR SELECT 
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA TASKS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks;
CREATE POLICY "Admins can manage all tasks" ON tasks
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can view tasks in their projects" ON tasks;
CREATE POLICY "Users can view tasks in their projects" ON tasks
  FOR SELECT 
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA QUICK_HITS
-- ============================================
DROP POLICY IF EXISTS "Users can manage own quick hits" ON quick_hits;
CREATE POLICY "Users can manage own quick hits" ON quick_hits
  FOR ALL 
  USING (user_id = auth.uid());

-- ============================================
-- POLÍTICAS PARA MILESTONES
-- ============================================
DROP POLICY IF EXISTS "Admins can manage milestones" ON milestones;
CREATE POLICY "Admins can manage milestones" ON milestones
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Clients can view milestones in their projects" ON milestones;
CREATE POLICY "Clients can view milestones in their projects" ON milestones
  FOR SELECT 
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

-- ============================================
-- POLÍTICAS PARA IDEAS
-- ============================================
DROP POLICY IF EXISTS "Users can manage own ideas" ON ideas;
CREATE POLICY "Users can manage own ideas" ON ideas
  FOR ALL 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all ideas" ON ideas;
CREATE POLICY "Admins can view all ideas" ON ideas
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA CLIENTS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;
CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA PROJECT_CREDENTIALS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage credentials" ON project_credentials;
CREATE POLICY "Admins can manage credentials" ON project_credentials
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA DOCUMENTS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage all documents" ON documents;
CREATE POLICY "Admins can manage all documents" ON documents
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Clients can view documents in their projects" ON documents;
CREATE POLICY "Clients can view documents in their projects" ON documents
  FOR SELECT 
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

-- ============================================
-- POLÍTICAS PARA MESSAGES
-- ============================================
DROP POLICY IF EXISTS "Users can view relevant messages" ON messages;
CREATE POLICY "Users can view relevant messages" ON messages
  FOR SELECT 
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
    OR sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage messages" ON messages;
CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA ACTIVITY_LOG
-- ============================================
DROP POLICY IF EXISTS "Admins can view all activity" ON activity_log;
CREATE POLICY "Admins can view all activity" ON activity_log
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Clients can view activity in their projects" ON activity_log;
CREATE POLICY "Clients can view activity in their projects" ON activity_log
  FOR SELECT 
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

DROP POLICY IF EXISTS "System can insert activity" ON activity_log;
CREATE POLICY "System can insert activity" ON activity_log
  FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS PARA INVOICES
-- ============================================
DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
CREATE POLICY "Admins can manage invoices" ON invoices
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Clients can view their invoices" ON invoices;
CREATE POLICY "Clients can view their invoices" ON invoices
  FOR SELECT 
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())
  );

-- ============================================
-- POLÍTICAS PARA EXPENSES
-- ============================================
DROP POLICY IF EXISTS "Admins can manage expenses" ON expenses;
CREATE POLICY "Admins can manage expenses" ON expenses
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- POLÍTICAS PARA SALES_LEADS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage leads" ON sales_leads;
CREATE POLICY "Admins can manage leads" ON sales_leads
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RLS policies created successfully!';
END $$;
