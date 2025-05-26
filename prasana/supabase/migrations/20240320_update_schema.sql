-- Add missing columns to projects table if they don't exist
DO $$ 
BEGIN
    -- Add client_category if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'client_category') THEN
        ALTER TABLE projects ADD COLUMN client_category TEXT NOT NULL DEFAULT 'Technology';
    END IF;

    -- Add client_logo if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'client_logo') THEN
        ALTER TABLE projects ADD COLUMN client_logo TEXT;
    END IF;

    -- Add client_domain if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'client_domain') THEN
        ALTER TABLE projects ADD COLUMN client_domain TEXT;
    END IF;

    -- Add has_tasks_module if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'has_tasks_module') THEN
        ALTER TABLE projects ADD COLUMN has_tasks_module BOOLEAN DEFAULT true;
    END IF;

    -- Add tasks if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'tasks') THEN
        ALTER TABLE projects ADD COLUMN tasks JSONB;
    END IF;

    -- Add milestones if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'milestones') THEN
        ALTER TABLE projects ADD COLUMN milestones JSONB;
    END IF;

    -- Add team_members if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'projects' AND column_name = 'team_members') THEN
        ALTER TABLE projects ADD COLUMN team_members JSONB;
    END IF;
END $$;

-- Update RLS policies if they don't exist
DO $$ 
BEGIN
    -- Projects policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects are viewable by everyone') THEN
        CREATE POLICY "Projects are viewable by everyone" ON projects
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects are insertable by authenticated users') THEN
        CREATE POLICY "Projects are insertable by authenticated users" ON projects
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects are updatable by authenticated users') THEN
        CREATE POLICY "Projects are updatable by authenticated users" ON projects
            FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Projects are deletable by authenticated users') THEN
        CREATE POLICY "Projects are deletable by authenticated users" ON projects
            FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
        CREATE TRIGGER update_projects_updated_at
            BEFORE UPDATE ON projects
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$; 