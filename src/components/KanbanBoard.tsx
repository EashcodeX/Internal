import React from 'react';
import { Project } from '../types';

interface KanbanBoardProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {/* Kanban board implementation */}
    </div>
  );
};

export default KanbanBoard; 