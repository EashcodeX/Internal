import React from 'react';
import { TeamName } from '../types';
import { Home, BarChart3, Users, Briefcase, Network, Clock, UserCircle, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const teamColorClasses: Record<TeamName, string> = {
  'TITAN': 'bg-blue-500',
  'NEXUS': 'bg-purple-500',
  'ATHENA': 'bg-green-500',
  'DYNAMIX': 'bg-amber-500'
};

interface SidebarProps {
  currentTeam: TeamName | null;
  setCurrentTeam: (team: TeamName | null) => void;
  currentPage: 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members';
  setCurrentPage: (page: 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members') => void;
  isOpen: boolean;
  onAdminLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentTeam, 
  setCurrentTeam,
  currentPage,
  setCurrentPage,
  isOpen,
  onAdminLogin
}) => {
  const { isAdmin } = useUser();
  const handleTeamClick = (team: TeamName) => {
    setCurrentTeam(currentTeam === team ? null : team);
  };

  const teams: TeamName[] = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'];

  return (
    <aside 
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-20 transition-transform duration-300 ease-in-out w-64 bg-gray-900 text-white transform md:relative md:z-0 flex flex-col`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">Technosprint</h2>
          <p className="text-sm text-gray-400">Project Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="px-4 space-y-1">
            <li>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'analytics' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('projects')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'projects' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Briefcase size={18} />
                <span>Projects</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('team-members')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'team-members' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <UserCircle size={18} />
                <span>Team Members</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('collaboration')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'collaboration' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Network size={18} />
                <span>Team Collaboration</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentPage('timesheet')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'timesheet' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Clock size={18} />
                <span>Timesheet</span>
              </button>
            </li>
          </ul>

          <div className="mt-8 px-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Teams</h3>
            <ul className="space-y-1">
              {teams.map((team) => (
                <li key={team} className="flex items-center">
                  <button
                    onClick={() => handleTeamClick(team)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                      currentTeam === team 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    } transition-all`}
                  >
                    <span className={`w-3 h-3 rounded-full ${teamColorClasses[team]}`}></span>
                    <span>{team}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Admin Login Button - Fixed at bottom */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <button
            onClick={onAdminLogin}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
              isAdmin ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            } transition-colors`}
          >
            <Shield size={18} />
            <span>{isAdmin ? 'Admin Mode' : 'Admin Login'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;