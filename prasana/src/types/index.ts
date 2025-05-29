import { Task } from '../components/TaskList';

export type TeamName = 'TITAN' | 'NEXUS' | 'ATHENA' | 'DYNAMIX';

export type ClientCategory = 
  | 'Healthcare' 
  | 'E-commerce' 
  | 'Finance' 
  | 'Education' 
  | 'Technology' 
  | 'Manufacturing'
  | 'Media'
  | 'Retail'
  | 'Travel';

export type ProjectStatus = 'Ongoing' | 'Completed';

export type UserRole = 'CEO' | 'Team Lead' | 'Developer';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  delayed?: boolean;
}

export interface Project {
  id?: string;
  name: string;
  team: TeamName;
  clientName: string;
  clientLogo?: string;
  clientDomain: string;
  clientCategory: ClientCategory;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  description: string;
  milestones: Milestone[];
  teamMembers: TeamMember[];
  hasTasksModule?: boolean;
  tasks?: Task[];
  companyLogoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  team?: TeamName;
}

export interface TeamStats {
  name: TeamName;
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
}

export interface CategoryStats {
  name: ClientCategory;
  count: number;
}

export type ViewMode = 'grid' | 'list' | 'kanban' | 'calendar';

export interface FilterState {
  teams: TeamName[];
  status: ProjectStatus[];
  categories: ClientCategory[];
  clients: string[];
  searchQuery: string;
}