-- Create activities table for Activity log functionality
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL, -- 'lead_created', 'project_updated', 'task_completed', etc.
    title TEXT NOT NULL,
    description TEXT,
    entity_type TEXT, -- 'lead', 'project', 'task', 'message', etc.
    entity_id UUID,
    user_name TEXT,
    user_avatar TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations for authenticated users" ON activities
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_entity_type ON activities(entity_type);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
