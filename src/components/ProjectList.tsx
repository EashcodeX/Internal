import React from 'react';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="space-y-4">
      {/* Project list implementation */}
    </div>
  );
};

export default ProjectList; 