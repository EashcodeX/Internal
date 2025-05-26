-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create badge assignments table
CREATE TABLE IF NOT EXISTS badge_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expiry_days INTEGER DEFAULT 90,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_badge_assignments_user_id ON badge_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_assignments_badge_id ON badge_assignments(badge_id);

-- Insert initial badges
INSERT INTO badges (name, description, image) VALUES
('IT Support Professional', 'Skilled in troubleshooting hardware, software, and network issues; proficient in tools like ServiceNow, Active Directory, Outlook, and printer support.', '/badges/it-support.png'),
('Web Development Professional', 'Certified in developing responsive and interactive websites using HTML, CSS, JavaScript, and modern libraries or frameworks like React and Bootstrap.', '/badges/web-dev.png'),
('Office 365 Professional', 'Certified in Microsoft Office 365 suite including Outlook, Word, Excel, PowerPoint, OneDrive, and Teams with expertise in productivity and collaboration tools.', '/badges/office365.png'),
('Full Stack Development', 'Certified in both front-end and back-end technologies, capable of building complete web applications using tools like React, Node.js, Java, and databases.', '/badges/fullstack.png'),
('Client Acquisition', 'Recognized for expertise in identifying leads, nurturing client relationships, converting prospects, and driving business growth through strategic outreach.', '/badges/client-acquisition.png'),
('Digital Marketing Professional', 'Certified in SEO, SEM, social media marketing, email campaigns, and content strategy to boost brand visibility and lead generation.', '/badges/digital-marketing.png'),
('Data Analysis Professional', 'Certified in analyzing data using Excel, PowerBI, or R, with skills in data visualization, statistical analysis, and deriving actionable insights.', '/badges/data-analysis.png'),
('Cloud Deployment Specialist', 'Recognizes ability to deploy web applications on platforms like AWS, Azure or GCP', '/badges/cloud-deployment.png');

-- Add RLS policies
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_assignments ENABLE ROW LEVEL SECURITY;

-- Everyone can view badges
CREATE POLICY "Everyone can view badges" ON badges
    FOR SELECT USING (true);

-- Everyone can view badge assignments
CREATE POLICY "Everyone can view badge assignments" ON badge_assignments
    FOR SELECT USING (true);

-- Only admins can insert/update/delete badges
CREATE POLICY "Only admins can insert badges" ON badges
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

CREATE POLICY "Only admins can update badges" ON badges
    FOR UPDATE USING (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

CREATE POLICY "Only admins can delete badges" ON badges
    FOR DELETE USING (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

-- Only admins can insert/update/delete badge assignments
CREATE POLICY "Only admins can insert badge assignments" ON badge_assignments
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

CREATE POLICY "Only admins can update badge assignments" ON badge_assignments
    FOR UPDATE USING (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    ));

CREATE POLICY "Only admins can delete badge assignments" ON badge_assignments
    FOR DELETE USING (auth.jwt() ->> 'email' IN (
        'admin1@example.com',
        'admin2@example.com'
        -- Add more admin emails here
    )); 