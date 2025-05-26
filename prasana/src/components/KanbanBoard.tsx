import React from 'react';
import { Project, TeamName } from '../types';
import ProjectCard from './ProjectCard';

interface KanbanBoardProps {
  projects: Project[];
}

const teamColorClasses: Record<TeamName, Record<string, string>> = {
  'TITAN': {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    border: 'border-blue-200'
  },
  'NEXUS': {
    bg: 'bg-purple-500',
    light: 'bg-purple-50',
    border: 'border-purple-200'
  },
  'ATHENA': {
    bg: 'bg-green-500',
    light: 'bg-green-50',
    border: 'border-green-200'
  },
  'DYNAMIX': {
    bg: 'bg-amber-500',
    light: 'bg-amber-50',
    border: 'border-amber-200'
  }
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projects }) => {
  const ongoingProjects = projects.filter(project => project.status === 'Ongoing');
  const completedProjects = projects.filter(project => project.status === 'Completed');

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No projects match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <h3 className="font-semibold text-gray-800">Ongoing Projects</h3>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {ongoingProjects.length}
          </span>
        </div>
        
        <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          {ongoingProjects.length === 0 ? (
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">No ongoing projects match your filters.</p>
            </div>
          ) : (
            ongoingProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-semibold text-gray-800">Completed Projects</h3>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {completedProjects.length}
          </span>
        </div>
        
        <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          {completedProjects.length === 0 ? (
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">No completed projects match your filters.</p>
            </div>
          ) : (
            completedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;