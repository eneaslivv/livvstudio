-- Create finances table for financial project tracking
CREATE TABLE IF NOT EXISTS finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    model TEXT DEFAULT 'fixed', -- 'fixed', 'monthly', 'milestones', 'variable', 'hourly'
    health TEXT DEFAULT 'profitable', -- 'profitable', 'at-risk', 'loss'
    total_agreed NUMERIC DEFAULT 0,
    total_collected NUMERIC DEFAULT 0,
    direct_expenses NUMERIC DEFAULT 0,
    imputed_expenses NUMERIC DEFAULT 0,
    hours_worked NUMERIC,
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON finances
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_finances_project_id ON finances(project_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_finances_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_finances_updated_at
    BEFORE UPDATE ON finances
    FOR EACH ROW
    EXECUTE FUNCTION update_finances_updated_at();
