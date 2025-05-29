-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- e.g., 'project_created', 'task_completed', 'member_added'
    actor_id UUID NOT NULL, -- user who performed the action
    entity_type TEXT NOT NULL, -- e.g., 'project', 'task', 'team'
    entity_id UUID NOT NULL, -- ID of the affected entity
    details JSONB, -- Additional details about the activity
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON activities(actor_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity_type_entity_id ON activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Everyone can view activities
CREATE POLICY "Everyone can view activities" ON activities
    FOR SELECT USING (true);

-- Only authenticated users can insert activities
CREATE POLICY "Authenticated users can insert activities" ON activities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admins can delete activities
CREATE POLICY "Only admins can delete activities" ON activities
    FOR DELETE USING (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

-- Create trigger to update updated_at
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 