import { Project, ClientCategory, TeamName, ProjectStatus } from '../types';

const getRandomDate = (start: Date, end: Date): string => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
};

export const avatars = [
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
];

const baseRoles = ['Developer', 'Designer', 'Project Manager', 'QA Tester', 'DevOps Engineer'];
const teams: TeamName[] = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'];

const generateTeamMembers = (count: number, primaryTeam: TeamName) => {
  return Array.from({ length: count }, (_, i) => {
    // Determine if this member is from a different team (for collaborations)
    const isFromDifferentTeam = Math.random() > 0.7;
    let role = baseRoles[Math.floor(Math.random() * baseRoles.length)];
    let memberTeam = primaryTeam;
    
    if (isFromDifferentTeam) {
      // Pick a different team
      const otherTeams = teams.filter(t => t !== primaryTeam);
      memberTeam = otherTeams[Math.floor(Math.random() * otherTeams.length)];
      // Add team affiliation to role
      role = `${role} (${memberTeam})`;
    } else {
      // Add team affiliation to role
      role = `${role} (${primaryTeam})`;
    }
    
    return {
      id: `member-${i + 1}`,
      name: `Team Member ${i + 1}`,
      role,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    };
  });
};

const generateMilestones = (count: number, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return Array.from({ length: count }, (_, i) => {
    const milestoneDate = getRandomDate(start, end);
    return {
      id: `milestone-${i + 1}`,
      title: `Milestone ${i + 1}`,
      date: milestoneDate,
      completed: Math.random() > 0.5,
      delayed: Math.random() > 0.7,
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const clientCategories: ClientCategory[] = [
  'Healthcare', 
  'E-commerce', 
  'Finance', 
  'Education', 
  'Technology', 
  'Manufacturing',
  'Media',
  'Retail',
  'Travel'
];

const statuses: ProjectStatus[] = ['Ongoing', 'Completed'];

// Generate 20 projects with varied data
export const projects: Project[] = Array.from({ length: 20 }, (_, i) => {
  const team = teams[Math.floor(Math.random() * teams.length)];
  const clientCategory = clientCategories[Math.floor(Math.random() * clientCategories.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const startDate = getRandomDate(new Date('2023-01-01'), new Date('2023-12-31'));
  let endDate: string;
  
  if (status === 'Completed') {
    endDate = getRandomDate(new Date(startDate), new Date());
  } else {
    endDate = getRandomDate(new Date(), new Date('2024-12-31'));
  }
  
  const teamMembers = generateTeamMembers(Math.floor(Math.random() * 5) + 3, team);
  const milestones = generateMilestones(Math.floor(Math.random() * 4) + 2, startDate, endDate);

  return {
    id: `project-${i + 1}`,
    name: `Project ${i + 1}`,
    team,
    clientName: `Client ${i + 1}`,
    clientLogo: `https://placehold.co/200x100/random?text=Client+${i + 1}`,
    clientDomain: `client${i + 1}.com`,
    clientCategory,
    status,
    startDate,
    endDate,
    description: `This is a project for Client ${i + 1} focused on ${clientCategory} solutions. The project aims to deliver high-quality results within the specified timeframe.`,
    milestones,
    teamMembers
  };
});