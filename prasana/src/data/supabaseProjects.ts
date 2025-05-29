import { supabase } from '../supabaseClient';
import { Project } from '../types';
import { createActivity } from './supabaseActivities';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  if (error) throw error;
  if (!data) return [];

  // Map snake_case to camelCase, defaulting arrays to []
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    team: p.team,
    clientName: p.client_name,
    clientLogo: p.client_logo,
    clientDomain: p.client_domain,
    clientCategory: p.client_category,
    status: p.status,
    startDate: p.start_date,
    endDate: p.end_date,
    description: p.description,
    milestones: p.milestones ?? [],
    teamMembers: p.team_members ?? [],
    hasTasksModule: p.has_tasks_module,
    tasks: p.tasks ?? [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    companyLogoUrl: p.company_logo_url,
  }));
}

export async function addProject(project: Project): Promise<Project> {
  const { id, ...projectWithoutId } = project;
  
  // Transform camelCase to snake_case for database
  const dbProject = {
    name: projectWithoutId.name,
    team: projectWithoutId.team,
    client_name: projectWithoutId.clientName,
    client_logo: projectWithoutId.clientLogo,
    client_domain: projectWithoutId.clientDomain,
    client_category: projectWithoutId.clientCategory,
    status: projectWithoutId.status,
    start_date: projectWithoutId.startDate,
    end_date: projectWithoutId.endDate,
    description: projectWithoutId.description,
    milestones: projectWithoutId.milestones,
    team_members: projectWithoutId.teamMembers,
    has_tasks_module: projectWithoutId.hasTasksModule,
    tasks: projectWithoutId.tasks
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([dbProject])
    .select()
    .single();
  if (error) throw error;

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '';

  // Create activity for project creation
  await createActivity(
    'project_created',
    userId,
    'project',
    data.id,
    { name: data.name }
  );

  return data;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  // Transform camelCase to snake_case for database
  const dbUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = value;
    return acc;
  }, {} as Record<string, any>);

  const { data, error } = await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '';

  // Create activity for project update
  await createActivity(
    'project_updated',
    userId,
    'project',
    id,
    { name: data.name, changes: Object.keys(updates) }
  );

  return data;
}

export async function deleteProject(id: string): Promise<void> {
  // Get project name before deletion for activity
  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '';

  // Create activity for project deletion
  await createActivity(
    'project_deleted',
    userId,
    'project',
    id,
    { name: project?.name }
  );
} 