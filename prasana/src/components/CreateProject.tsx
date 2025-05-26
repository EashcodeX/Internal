import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Project, TeamName, ClientCategory, ProjectStatus } from '../types';
import { defaultTasks } from '../data/defaultTasks';
import { addProject } from '../data/supabaseProjects';

interface CreateProjectProps {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onClose, onProjectCreated }) => {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientDomain, setClientDomain] = useState('');
  const [team, setTeam] = useState<TeamName>('TITAN');
  const [description, setDescription] = useState('');
  const [clientCategory, setClientCategory] = useState<ClientCategory>('Technology');
  const [status, setStatus] = useState<ProjectStatus>('Ongoing');
  
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
  
  const teams: TeamName[] = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate start and end dates
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0];
    
    // Create default team members
    const teamMembers = [
      {
        id: `member-${Date.now()}-1`,
        name: 'Project Manager',
        role: `Project Manager (${team})`,
        avatar: `https://ui-avatars.com/api/?name=PM&background=random&color=fff`
      },
      {
        id: `member-${Date.now()}-2`,
        name: 'Team Lead',
        role: `Team Lead (${team})`,
        avatar: `https://ui-avatars.com/api/?name=TL&background=random&color=fff`
      }
    ];
    
    // Create default milestones
    const milestones = [
      {
        id: `milestone-${Date.now()}-1`,
        title: 'Project Kickoff',
        date: startDate,
        completed: true,
        delayed: false
      },
      {
        id: `milestone-${Date.now()}-2`,
        title: 'Planning Phase',
        date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        completed: false,
        delayed: false
      },
      {
        id: `milestone-${Date.now()}-3`,
        title: 'Project Completion',
        date: endDate,
        completed: false,
        delayed: false
      }
    ];
    
    // Create the new project (do NOT set id, let Supabase generate it)
    const tasksWithIds = defaultTasks.map((task, idx) => ({
      ...task,
      id: `task-${Date.now()}-${idx}`,
      dueDate: startDate,
    }));
    
    const newProject: Project = {
      name: projectName,
      team,
      clientName,
      clientLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=random&color=fff`,
      clientDomain,
      clientCategory,
      status,
      startDate,
      endDate,
      description,
      milestones,
      teamMembers,
      hasTasksModule: true,
      tasks: tasksWithIds
    };
    
    try {
      // Add the project to Supabase
      const createdProject = await addProject(newProject);
      
      // Notify the parent component
      onProjectCreated(createdProject);
      
      // Close the form
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                Team *
              </label>
              <select
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value as TeamName)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {teams.map(teamName => (
                  <option key={teamName} value={teamName}>
                    {teamName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="clientDomain" className="block text-sm font-medium text-gray-700 mb-1">
                Client Domain *
              </label>
              <input
                id="clientDomain"
                type="text"
                value={clientDomain}
                onChange={(e) => setClientDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="clientCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Client Category *
              </label>
              <select
                id="clientCategory"
                value={clientCategory}
                onChange={(e) => setClientCategory(e.target.value as ClientCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {clientCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject; 