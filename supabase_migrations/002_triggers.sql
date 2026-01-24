-- ============================================
-- LIVV STUDIO - MIGRATION 002: TRIGGERS & FUNCTIONS
-- ============================================
-- Execute in: Supabase SQL Editor
-- Order: Run this SECOND (after 001_base_schema.sql)

-- ============================================
-- FUNCIÓN PARA AUTO-UPDATE DE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS PARA TODAS LAS TABLAS
-- ============================================

-- Profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Milestones
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
CREATE TRIGGER update_milestones_updated_at 
  BEFORE UPDATE ON milestones
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Ideas
DROP TRIGGER IF EXISTS update_ideas_updated_at ON ideas;
CREATE TRIGGER update_ideas_updated_at 
  BEFORE UPDATE ON ideas
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Project Credentials
DROP TRIGGER IF EXISTS update_project_credentials_updated_at ON project_credentials;
CREATE TRIGGER update_project_credentials_updated_at 
  BEFORE UPDATE ON project_credentials
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Invoices
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON invoices
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Sales Leads
DROP TRIGGER IF EXISTS update_sales_leads_updated_at ON sales_leads;
CREATE TRIGGER update_sales_leads_updated_at 
  BEFORE UPDATE ON sales_leads
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Triggers created successfully!';
END $$;
