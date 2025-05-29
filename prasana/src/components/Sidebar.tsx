import React from 'react';
import { TeamName } from '../types';
import { 
  Home, 
  BarChart3, 
  Users, 
  Briefcase, 
  Network, 
  Clock, 
  UserCircle, 
  Shield,
  LayoutDashboard,
  BarChart2,
  FolderKanban,
  Users2,
  Menu,
  X
} from 'lucide-react';
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

  const handlePageClick = (page: 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members') => {
    setCurrentPage(page);
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) { // Tailwind's md breakpoint is 768px
      const appContent = document.getElementById('app-content');
      if (appContent) {
        appContent.click(); // Trigger the click handler on the content to close sidebar
      }
    }
  };

  const handleTeamClick = (team: TeamName) => {
    setCurrentTeam(currentTeam === team ? null : team);
    // Optional: Close sidebar on mobile after clicking a team filter
    // if (window.innerWidth < 768) {
    //   const appContent = document.getElementById('app-content');
    //   if (appContent) {
    //     appContent.click();
    //   }
    // }
  };

  const teams: TeamName[] = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'];

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      page: 'dashboard' as 'dashboard'
    },
    {
      name: 'Analytics',
      icon: <BarChart2 size={18} />,
      page: 'analytics' as 'analytics'
    },
    {
      name: 'Projects',
      icon: <FolderKanban size={18} />,
      page: 'projects' as 'projects'
    },
  ];

  return (
    <aside 
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-20 transition-transform duration-300 ease-in-out w-64 bg-primary text-neutral-100 transform md:relative md:z-0 flex flex-col`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">Technosprint</h2>
          <p className="text-sm text-neutral-400">Project Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="px-4 space-y-1">
            {navigationItems.map((item) => (
              <li key={item.page}>
                <button 
                  onClick={() => handlePageClick(item.page)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    currentPage === item.page ? 'bg-primary-dark text-white' : 'text-neutral-200 hover:bg-primary-dark hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={() => handlePageClick('team-members')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'team-members' ? 'bg-primary-dark text-white' : 'text-neutral-200 hover:bg-primary-dark hover:text-white'
                }`}
              >
                <UserCircle size={18} />
                <span>Team Members</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handlePageClick('collaboration')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'collaboration' ? 'bg-primary-dark text-white' : 'text-neutral-200 hover:bg-primary-dark hover:text-white'
                }`}
              >
                <Network size={18} />
                <span>Team Collaboration</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handlePageClick('timesheet')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  currentPage === 'timesheet' ? 'bg-primary-dark text-white' : 'text-neutral-200 hover:bg-primary-dark hover:text-white'
                }`}
              >
                <Clock size={18} />
                <span>Timesheet</span>
              </button>
            </li>
          </ul>

          <div className="mt-8 px-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-4">Teams</h3>
            <ul className="space-y-1">
              {teams.map((team) => (
                <li key={team} className="flex items-center">
                  <button
                    onClick={() => handleTeamClick(team)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg ${
                      currentTeam === team 
                        ? 'bg-primary-dark text-white' 
                        : 'text-neutral-200 hover:bg-primary-dark hover:text-white'
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
        <div className="mt-auto p-4 border-t border-neutral-800">
          <button
            onClick={onAdminLogin}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-neutral-200 hover:text-white border border-neutral-700 ${
              isAdmin ? 'bg-success-dark hover:bg-success' : 'bg-primary-dark hover:bg-primary'
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