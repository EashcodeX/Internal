export type ViewMode = 'grid' | 'list' | 'kanban';

export type TeamName = 'TITAN' | 'NEXUS' | 'ATHENA' | 'DYNAMIX';

export type PageType = 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members' | 'resource-management';

export interface FilterState {
  teams: TeamName[];
  status: string[];
  categories: string[];
  clients: string[];
  searchQuery: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: TeamName;
  status: string;
  clientCategory: string;
  client: string;
  startDate: string;
  endDate: string;
  clientName?: string;
  clientDomain?: string;
  milestones?: Array<{
    name: string;
    dueDate: string;
  }>;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  companyLogoUrl?: string;
}

// ... rest of the existing code ... 