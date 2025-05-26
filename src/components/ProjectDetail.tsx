import React from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose, onUpdate, onDelete }) => {
  return (
    <div className="p-6">
      {/* Project detail implementation */}
    </div>
  );
};

export default ProjectDetail; 