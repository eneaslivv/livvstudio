-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    source TEXT, -- 'Contact Form', 'Pricing Calculator', 'Vision Section', etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy for Authenticated Users (Admins usually) to do everything
CREATE POLICY "Allow all operations for authenticated users" ON leads
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy for Public (Anon) Users to INSERT only (for the contact forms)
CREATE POLICY "Allow public insert" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_active_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_leads_updated_at ON leads;
CREATE TRIGGER trigger_update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_active_leads_updated_at();
