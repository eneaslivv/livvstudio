-- ============================================
-- POLÍTICAS CORREGIDAS - BASADO EN ESTRUCTURA REAL
-- ============================================
-- Solo actualiza policies, NO toca las tablas

-- Limpiar todas las policies viejas
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS POR TABLA
-- ============================================

-- PROFILES
CREATE POLICY "profiles_select_own" ON profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "profiles_insert" ON profiles 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update_own" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- PROJECTS
CREATE POLICY "projects_select_admin" ON projects 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "projects_select_client" ON projects 
  FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "projects_insert_admin" ON projects 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "projects_update_admin" ON projects 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "projects_delete_admin" ON projects 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- TASKS
CREATE POLICY "tasks_select_admin" ON tasks 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "tasks_insert_admin" ON tasks 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "tasks_update_admin" ON tasks 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "tasks_delete_admin" ON tasks 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- QUICK_HITS (sin user_id)
CREATE POLICY "quick_hits_all" ON quick_hits 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- MILESTONES
CREATE POLICY "milestones_select_admin" ON milestones 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "milestones_insert_admin" ON milestones 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "milestones_update_admin" ON milestones 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "milestones_delete_admin" ON milestones 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- IDEAS (sin user_id)
CREATE POLICY "ideas_all" ON ideas 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- MESSAGES (sin sender_id, sin project_id)
CREATE POLICY "messages_select" ON messages 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "messages_insert" ON messages 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "messages_update" ON messages 
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "messages_delete_admin" ON messages 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- DOCUMENTS
CREATE POLICY "documents_select_admin" ON documents 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "documents_insert_admin" ON documents 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "documents_update_admin" ON documents 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "documents_delete_admin" ON documents 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PROJECT_CREDENTIALS
CREATE POLICY "credentials_select_admin" ON project_credentials 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "credentials_insert_admin" ON project_credentials 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "credentials_update_admin" ON project_credentials 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "credentials_delete_admin" ON project_credentials 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- LEADS
CREATE POLICY "leads_select_admin" ON leads 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "leads_insert" ON leads 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_update_admin" ON leads 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "leads_delete_admin" ON leads 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- FINANCES
CREATE POLICY "finances_select_admin" ON finances 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finances_insert_admin" ON finances 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finances_update_admin" ON finances 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finances_delete_admin" ON finances 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- FINANCE_RECORDS
CREATE POLICY "finance_records_select_admin" ON finance_records 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finance_records_insert_admin" ON finance_records 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finance_records_update_admin" ON finance_records 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "finance_records_delete_admin" ON finance_records 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ACTIVITIES
CREATE POLICY "activities_select_admin" ON activities 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "activities_insert" ON activities 
  FOR INSERT WITH CHECK (true);

-- EVENTS
CREATE POLICY "events_select_admin" ON events 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "events_insert_admin" ON events 
  FOR INSERT WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "events_update_admin" ON events 
  FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "events_delete_admin" ON events 
  FOR DELETE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT '✅ Políticas actualizadas!' as status;
SELECT tablename, COUNT(*) as total_policies 
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
