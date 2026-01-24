-- Fix #1: Add missing 'client' column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;

-- Fix #2: Ensure projects table exists with all required columns
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client TEXT,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'medium',
    description TEXT,
    start_date DATE,
    end_date DATE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop old policy
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Allow all operations for anon" ON projects;

-- Create permissive policy for development
CREATE POLICY "Allow all operations for anon" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Update trigger
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_projects_updated_at ON projects;

CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();
