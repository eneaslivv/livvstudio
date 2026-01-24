-- ============================================
-- SETUP COMPLETO - SIN ERRORES
-- ============================================
-- Para base de datos VACÍA (sin tablas previas)
-- Ejecutar TODO de una vez

-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- FUNCIÓN
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TABLAS
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
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

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  tag TEXT,
  priority TEXT DEFAULT 'medium',
  project_id UUID REFERENCES projects(id),
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quick_hits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  company TEXT,
  phone TEXT,
  profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  service_name TEXT NOT NULL,
  username TEXT,
  password TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGERS
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_credentials_updated_at BEFORE UPDATE ON project_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
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

-- POLÍTICAS SIMPLES
CREATE POLICY "p_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "p_select_admin" ON profiles FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "p_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "p_update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "pr_select_admin" ON projects FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "pr_select_client" ON projects FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "pr_all_admin" ON projects FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "t_all_admin" ON tasks FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "qh_all" ON quick_hits FOR ALL USING (true);

CREATE POLICY "m_all_admin" ON milestones FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "i_all" ON ideas FOR ALL USING (true);

CREATE POLICY "c_all_admin" ON clients FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "cred_all_admin" ON project_credentials FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "doc_all_admin" ON documents FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "msg_all_admin" ON messages FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "msg_insert" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- VERIFICACIÓN
SELECT '✅ Setup completado!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
