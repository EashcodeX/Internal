import React, { useState } from 'react';
import { MenuIcon, Search, LayoutGrid, List, Kanban, Calendar, Table } from 'lucide-react';
import { ViewMode, PageType } from '../types';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  onMenuClick: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onCreateProject: () => void;
  isAdmin: boolean;
  currentUser: any;
  onLogout: () => void;
  onAdminLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  viewMode, 
  setViewMode, 
  onCreateProject, 
  isAdmin, 
  currentUser, 
  onLogout, 
  onAdminLogin 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <MenuIcon size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={onCreateProject}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Project
              </button>
            )}
            {currentUser ? (
              <button
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onAdminLogin}
                className="text-gray-500 hover:text-gray-600"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 