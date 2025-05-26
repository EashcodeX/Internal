-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_logo TEXT,
    client_domain TEXT,
    client_category TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    milestones JSONB,
    team_members JSONB,
    has_tasks_module BOOLEAN DEFAULT true,
    tasks JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create time_entries table
CREATE TABLE time_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    project_id UUID REFERENCES projects(id),
    description TEXT NOT NULL,
    date DATE NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Projects are viewable by everyone" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Projects are insertable by authenticated users" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Projects are updatable by authenticated users" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Projects are deletable by authenticated users" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Time entries policies
CREATE POLICY "Time entries are viewable by their owners" ON time_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Time entries are insertable by their owners" ON time_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Time entries are updatable by their owners" ON time_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Time entries are deletable by their owners" ON time_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for both tables
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 