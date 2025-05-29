import React, { useState } from 'react';
import { MenuIcon, Search, LayoutGrid, List, Kanban, Calendar, Table } from 'lucide-react';
import { ViewMode } from '../types';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  showViewToggle?: boolean;
  currentPage?: 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members';
}

const Header: React.FC<HeaderProps> = ({ 
  viewMode, 
  setViewMode, 
  setSearchQuery,
  toggleSidebar,
  showViewToggle = true,
  currentPage = 'dashboard'
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { currentUser, logout } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
    if (isMobileSearchOpen) {
      setIsMobileSearchOpen(false);
    }
  };

  const getPageTitle = (page: typeof currentPage) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'analytics':
        return 'Analytics';
      case 'projects':
        return 'Projects';
      case 'collaboration':
        return 'Team Collaboration';
      case 'timesheet':
        return 'Timesheet';
      case 'team-members':
        return 'Team Members';
      default:
        return 'Dashboard';
    }
  };

  const renderViewToggle = () => {
    switch (currentPage) {
      case 'projects':
        return (
          <div className="flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
            <button
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <Kanban size={18} />
            </button>
          </div>
        );
      case 'timesheet':
        return (
          <div className="flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
            <button
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('calendar')}
              title="Calendar View"
            >
              <Calendar size={18} />
            </button>
          </div>
        );
      default:
        return null; // Hide toggles on other pages for now
    }
  };

  return (
    <header className="bg-neutral-50 border-b border-neutral-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 text-neutral-500 hover:text-neutral-700 md:hidden"
        >
          <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-bold text-neutral-800 flex items-center">
          <span className="text-primary mr-2">Technosprint</span> 
          <span>{getPageTitle(currentPage)}</span>
        </h1>
      </div>

      <div className="flex-1 max-w-2xl mx-6 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search projects, clients..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-neutral-100 border border-transparent rounded-lg focus:outline-none focus:border-primary focus:bg-white"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute left-3 top-2.5 text-neutral-400">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="flex items-center space-x-4 md:hidden">
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="text-neutral-500 hover:text-neutral-700 mr-4"
        >
          <Search size={24} />
        </button>
        {showViewToggle && renderViewToggle()}
      </div>

      <div className="flex items-center space-x-4">
        {currentUser && (
          <div className="flex items-center space-x-3 ml-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || currentUser.email)}&background=0D8ABC&color=fff`}
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-neutral-700 text-sm font-medium">{currentUser.name || currentUser.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-danger text-white rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search projects, clients..."
              className="w-full py-2 pl-10 pr-4 text-sm bg-neutral-100 border border-transparent rounded-lg focus:outline-none focus:border-primary focus:bg-white"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
            <button type="submit" className="absolute left-3 top-2.5 text-neutral-400">
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;