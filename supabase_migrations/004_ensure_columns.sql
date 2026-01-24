-- Ensure 'tasks' table has all necessary columns for Admin Calendar and Project Board
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee JSONB;

-- Ensure 'projects' table has all necessary columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'bg-zinc-400';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS next_steps TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_total NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_paid NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS eta_date DATE;

-- Ensure 'leads' table (if used by Sales) matched expectations
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company TEXT;

-- Ensure RLS is enabled for these tables (just in case)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
