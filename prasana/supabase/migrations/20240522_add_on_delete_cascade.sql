-- Add ON DELETE CASCADE to the project_id foreign key in the time_entries table
ALTER TABLE time_entries
DROP CONSTRAINT IF EXISTS time_entries_project_id_fkey,
ADD CONSTRAINT time_entries_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE; 