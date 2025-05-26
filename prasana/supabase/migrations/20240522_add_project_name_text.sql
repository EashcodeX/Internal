-- Add a text column to store the user-entered project name
ALTER TABLE time_entries
ADD COLUMN project_name_text TEXT; 