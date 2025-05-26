import React from 'react';
import { Project } from '../types';

interface CreateProjectProps {
  onClose: () => void;
  onProjectCreated: (project: Omit<Project, 'id'>) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onClose, onProjectCreated }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 relative w-full max-w-md">
        {/* Create project form implementation */}
      </div>
    </div>
  );
};

export default CreateProject; 