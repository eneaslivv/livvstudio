-- ============================================
-- RESET COMPLETO + SETUP FRESH
-- ============================================
-- Este script BORRA TODO y lo crea de nuevo
-- ADVERTENCIA: Perderás todos los datos existentes

-- ============================================
-- PASO 1: BORRAR TODO (DESCOMENTAR SI QUERÉS RESET TOTAL)
-- ============================================
/*
DROP TABLE IF EXISTS sales_leads CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS project_credentials CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS quick_hits CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
*/

-- ============================================
-- PASO 2: EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PASO 3: FUNCIÓN
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PASO 4: TABLAS
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  budget_total NUMERIC(10,2),
  budget_paid NUMERIC(10,2) DEFAULT 0,
  start_date DATE,
  eta_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  tag TEXT,
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
  estimated_hours NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quick_hits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASO 5: TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASO 6: RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Limpiar policies viejas
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- PROFILES
CREATE POLICY "p_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "p_select_admin" ON profiles FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "p_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "p_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- PROJECTS  
CREATE POLICY "pr_select_admin" ON projects FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "pr_all_admin" ON projects FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- TASKS
CREATE POLICY "t_all_admin" ON tasks FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- QUICK HITS
CREATE POLICY "qh_all_own" ON quick_hits FOR ALL USING (user_id = auth.uid());

-- MILESTONES
CREATE POLICY "m_all_admin" ON milestones FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- IDEAS
CREATE POLICY "i_all_own" ON ideas FOR ALL USING (user_id = auth.uid());
CREATE POLICY "i_select_admin" ON ideas FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- CLIENTS
CREATE POLICY "c_all_admin" ON clients FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Setup completado!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
SELECT COUNT(*) as total_policies FROM pg_policies WHERE schemaname = 'public';
