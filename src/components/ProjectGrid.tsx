import React from 'react';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Project grid implementation */}
    </div>
  );
};

export default ProjectGrid; 