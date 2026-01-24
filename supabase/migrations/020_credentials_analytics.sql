-- ============================================
-- LIVV STUDIO - PHASE 1B: CREDENTIALS & ANALYTICS
-- Migration: 020_credentials_analytics.sql
-- ============================================

-- 1. PROJECT CREDENTIALS TABLE (Secure storage)
CREATE TABLE IF NOT EXISTS public.project_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  username TEXT,
  password_encrypted TEXT, -- Consider using pgcrypto for encryption
  url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ANALYTICS METRICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL, -- 'page_view', 'conversion', 'lead_source', etc.
  metric_value JSONB NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_credentials_project_id ON project_credentials(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_metrics(metric_type);

-- 4. ENABLE RLS
ALTER TABLE public.project_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES (Permissive for dev)
DROP POLICY IF EXISTS "Allow all for anon" ON project_credentials;
DROP POLICY IF EXISTS "Allow all for anon" ON analytics_metrics;

CREATE POLICY "Allow all for anon" ON project_credentials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON analytics_metrics FOR ALL USING (true) WITH CHECK (true);

-- 6. GRANTS
GRANT ALL ON public.project_credentials TO anon, authenticated, service_role;
GRANT ALL ON public.analytics_metrics TO anon, authenticated, service_role;

-- 7. TRIGGER
DROP TRIGGER IF EXISTS trigger_credentials_updated_at ON project_credentials;
CREATE TRIGGER trigger_credentials_updated_at BEFORE UPDATE ON project_credentials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done
NOTIFY pgrst, 'reload schema';
