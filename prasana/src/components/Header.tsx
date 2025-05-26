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
  const { currentUser, logout } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  const renderViewToggle = () => {
    switch (currentPage) {
      case 'analytics':
        return (
          <div className="hidden sm:flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
            <button
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('grid')}
              title="Chart View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewMode('list')}
              title="Table View"
            >
              <Table size={18} />
            </button>
          </div>
        );
      case 'timesheet':
        return (
          <div className="hidden sm:flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
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
        return (
          <div className="hidden sm:flex items-center space-x-2 border rounded-lg p-1 bg-gray-50">
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
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
        >
          <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-blue-600 mr-2">Technosprint</span> 
          <span className="hidden sm:inline">Dashboard</span>
        </h1>
      </div>

      <div className="flex-1 max-w-2xl mx-6 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search projects, clients..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="flex items-center space-x-4">
        {showViewToggle && renderViewToggle()}
        {currentUser && (
          <div className="flex items-center space-x-3 ml-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || currentUser.email)}&background=0D8ABC&color=fff`}
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700 text-sm font-medium">{currentUser.name || currentUser.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;