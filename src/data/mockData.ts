import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'A flagship project for our enterprise clients',
    team: 'TITAN',
    status: 'In Progress',
    clientCategory: 'Enterprise',
    client: 'Acme Corp',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    teamMembers: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Project Lead',
        avatar: '/avatars/john.jpg'
      }
    ]
  }
]; 