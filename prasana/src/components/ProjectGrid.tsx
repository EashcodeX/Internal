import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectClick }) => {
  if (projects.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <div key={project.id} onClick={() => handleProjectClick(project)} className="cursor-pointer">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;