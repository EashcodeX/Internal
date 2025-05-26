-- Drop existing tables if they exist
DROP TABLE IF EXISTS badge_assignments;
DROP TABLE IF EXISTS badges;

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the badges table with UUID
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the badge_assignments table
CREATE TABLE IF NOT EXISTS badge_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    badge_id UUID REFERENCES badges(id),
    awarded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_days INTEGER DEFAULT 90,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Insert initial badge data
INSERT INTO badges (id, code, name, description, image) VALUES
(uuid_generate_v4(), 'cloud_computing', 'Cloud Computing', 'Expertise in cloud platforms and services', '/profiles/cloud.jpg'),
(uuid_generate_v4(), 'web_development', 'Web Development', 'Proficiency in web technologies and frameworks', '/profiles/web dev.jpg'),
(uuid_generate_v4(), 'full_stack', 'Full Stack Development', 'Full stack development capabilities', '/profiles/full stack.jpg'),
(uuid_generate_v4(), 'data_analytics', 'Data Analytics', 'Data analysis and visualization skills', '/profiles/data analytics.jpg'),
(uuid_generate_v4(), 'digital_marketing', 'Digital Marketing', 'Digital marketing and strategy expertise', '/profiles/digital marketing.jpg'),
(uuid_generate_v4(), 'it_support', 'IT Support', 'IT support and troubleshooting skills', '/profiles/it support.jpg'),
(uuid_generate_v4(), 'office_365', 'Office 365', 'Microsoft Office 365 proficiency', '/profiles/office 365.jpg'),
(uuid_generate_v4(), 'client_acquisition', 'Client Acquisition', 'Client acquisition and relationship management', '/profiles/client acquisition.jpg')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image; 