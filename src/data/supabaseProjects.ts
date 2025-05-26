import { Project } from '../types';

export const fetchProjects = async (): Promise<Project[]> => {
  // Mock implementation - replace with actual Supabase call
  return [];
};

export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  // Mock implementation - replace with actual Supabase call
  return {
    id: Date.now().toString(),
    ...project
  };
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  // Mock implementation - replace with actual Supabase call
  return {
    id,
    name: '',
    description: '',
    team: 'TITAN',
    status: '',
    clientCategory: '',
    client: '',
    startDate: '',
    endDate: '',
    teamMembers: [],
    ...updates
  };
};

export const deleteProject = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual Supabase call
}; 