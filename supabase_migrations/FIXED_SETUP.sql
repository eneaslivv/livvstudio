-- ============================================
-- AGREGAR TABLAS FALTANTES + POLICIES CORRECTAS
-- ============================================
-- Basado en tu estructura REAL existente
-- Ejecutar TODO de una vez

-- Limpiar policies viejas primero
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Crear tablas que FALTAN (si no existen)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  company TEXT,
  phone TEXT,
  profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  service_name TEXT NOT NULL,
  username TEXT,
  password TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  phone TEXT,
  status TEXT DEFAULT 'new',
  estimated_value NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  action_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
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
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS BASADAS EN TU ESTRUCTURA REAL
-- (sin referenciar columnas que no existen como user_id)

-- PROFILES
CREATE POLICY "profiles_select_own" ON profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "profiles_insert" ON profiles 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- PROJECTS
CREATE POLICY "projects_select_admin" ON projects 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "projects_select_client" ON projects 
  FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "projects_all_admin" ON projects 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- TASKS
CREATE POLICY "tasks_all_admin" ON tasks 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- QUICK_HITS (sin user_id, acceso abierto para todos los autenticados)
CREATE POLICY "quick_hits_all_authenticated" ON quick_hits 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- MILESTONES
CREATE POLICY "milestones_all_admin" ON milestones 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- IDEAS (sin user_id, acceso abierto para todos los autenticados)
CREATE POLICY "ideas_all_authenticated" ON ideas 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- CLIENTS
CREATE POLICY "clients_all_admin" ON clients 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PROJECT_CREDENTIALS
CREATE POLICY "credentials_all_admin" ON project_credentials 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- DOCUMENTS
CREATE POLICY "documents_all_admin" ON documents 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- MESSAGES
CREATE POLICY "messages_all_admin" ON messages 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "messages_insert" ON messages 
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- INVOICES
CREATE POLICY "invoices_all_admin" ON invoices 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- EXPENSES
CREATE POLICY "expenses_all_admin" ON expenses 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- SALES_LEADS
CREATE POLICY "leads_all_admin" ON sales_leads 
  FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ACTIVITY_LOG
CREATE POLICY "activity_insert" ON activity_log 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "activity_select_admin" ON activity_log 
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- VERIFICACIÓN
SELECT '✅ Setup completado!' as status;
SELECT table_name, COUNT(*) as columns 
FROM information_schema.columns 
WHERE table_schema = 'public' 
GROUP BY table_name 
ORDER BY table_name;
