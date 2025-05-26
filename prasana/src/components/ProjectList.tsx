import React, { useState, useEffect } from 'react';
import { Calendar, Users, Globe } from 'lucide-react';
import { Project, TeamName, ProjectStatus } from '../types';
import { fetchProjects, deleteProject } from '../data/supabaseProjects';
import CreateProject from './CreateProject';
import ProjectDetail from './ProjectDetail';
import { Plus, Search, Filter, X } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const teamColorClasses: Record<TeamName, string> = {
  'TITAN': 'bg-blue-100 text-blue-800',
  'NEXUS': 'bg-purple-100 text-purple-800',
  'ATHENA': 'bg-green-100 text-green-800',
  'DYNAMIX': 'bg-amber-100 text-amber-800'
};

const statusColorClasses = {
  'Ongoing': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200'
};

const ProjectList: React.FC<ProjectListProps> = ({ projects: initialProjects, onProjectClick }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamName | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (project: Project) => {
    setProjects((prev: Project[]) => [...prev, project]);
    setIsCreating(false);
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects((prev: Project[]) => prev.filter(p => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prev: Project[]) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (selectedProject?.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'ALL' || project.team === selectedTeam;
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No projects match your filters.</p>
      </div>
    );
  }

  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Team
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Timeline
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <tr 
              key={project.id} 
              className="hover:bg-gray-50 cursor-pointer" 
              onClick={() => handleProjectClick(project)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{project.name}</div>
                <div className="text-xs text-gray-500 hidden sm:block">{project.description.substring(0, 50)}...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full bg-gray-100 mr-3" src={project.clientLogo} alt="" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{project.clientName}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Globe size={12} className="mr-1" />
                      {project.clientDomain}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${teamColorClasses[project.team]}`}>
                  {project.team}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                {project.clientCategory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  <span>
                    {project.startDate} — {project.endDate}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColorClasses[project.status]}`}>
                  {project.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;