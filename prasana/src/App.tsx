import  { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import ProjectGrid from './components/ProjectGrid';
import ProjectList from './components/ProjectList';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsSection from './components/AnalyticsSection';
import ProjectDetail from './components/ProjectDetail';
import TeamCollaborationView from './components/TeamCollaborationView';
import CreateProject from './components/CreateProject';
import Timesheet from './components/Timesheet';
import TeamMembers from './pages/TeamMembers';
import { ActivityFeed } from './components/ActivityFeed';
import { ViewMode, FilterState, TeamName, Project } from './types';
import { UserProvider, useUser } from './contexts/UserContext';
import { Plus } from 'lucide-react';
import { fetchProjects , updateProject, deleteProject } from './data/supabaseProjects';
import AdminLogin from './components/AdminLogin';
import EmployeeManagement from './components/EmployeeManagement';
import { Briefcase, Clock, BarChart3 } from 'lucide-react';

// Define a basic type for activity objects (adjust as needed based on backend)
interface Activity {
  id: number;
  type: string;
  user: string;
  details: any;
  timestamp: Date;
}

function AppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<TeamName | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    teams: [],
    status: [],
    categories: [],
    clients: [],
    searchQuery: '',
  });
  const { isAdmin } = useUser();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // State for activities
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Fetch projects from Supabase on mount
  useEffect(() => {
    async function loadProjects() {
      setLoadingProjects(true);
      try {
        const projects = await fetchProjects();
        setProjectsList(projects);
      } catch (err) {
        console.error('Failed to fetch projects from Supabase:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (currentTeam) {
      setFilters(prev => ({
        ...prev,
        teams: [currentTeam]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        teams: []
      }));
    }
  }, [currentTeam]);

  // Use the projects from Supabase instead of imported mock data
  const supabaseProjects = useMemo(() => {
    return projectsList;
  }, [projectsList]);

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    return supabaseProjects.filter(project => {
      // Check if project matches the team filter
      if (filters.teams.length > 0 && !filters.teams.includes(project.team)) {
        return false;
      }

      // Check if project matches the status filter
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false;
      }

      // Check if project matches the category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(project.clientCategory)
      ) {
        return false;
      }

      // Check if project matches the client filter
      if (
        filters.clients.length > 0 &&
        !filters.clients.includes(project.clientName)
      ) {
        return false;
      }

      // Check if project matches the search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(query) ||
          project.clientName.toLowerCase().includes(query) ||
          project.team.toLowerCase().includes(query) ||
          project.clientCategory.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [filters, supabaseProjects]);

  // Helper function to toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle selecting a project
  const handleProjectClick = (project: Project) => {
    // Find the full project data from the projectsList state
    const fullProject = projectsList.find(p => p.id === project.id);
    if (fullProject) {
      setSelectedProject(fullProject);
    } else {
      // Fallback to the clicked project if not found in the list (shouldn't happen if list is populated)
      setSelectedProject(project);
    }
  };

  // Handle back button from project detail
  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  // Handle search queries
  const setSearchQuery = (query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      teams: currentTeam ? [currentTeam] : [],
      status: [],
      categories: [],
      clients: [],
      searchQuery: '',
    });
  };
  
  // Add project handler
  const handleProjectCreated = async (project: Project) => {
    try {
      // Project is already added in CreateProject component, just refresh the list
      const projects = await fetchProjects();
      setProjectsList(projects);
    } catch (err: any) {
      alert('Failed to refresh projects: ' + (err?.message || JSON.stringify(err)));
    }
  };
  
  // Update project handler
  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await updateProject(id, updates);
      const projects = await fetchProjects();
      setProjectsList(projects);
    } catch (err: any) {
      alert('Failed to update project: ' + (err?.message || JSON.stringify(err)));
    }
  };

  // Delete project handler
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      const projects = await fetchProjects();
      setProjectsList(projects);
      setSelectedProject(null);
      alert('Project deleted successfully');
    } catch (err: any) {
      alert('Failed to delete project: ' + (err?.message || JSON.stringify(err)));
    }
  };

  const renderGridOrList = () => {
    if (selectedProject) {
      return (
        <ProjectDetail 
          project={selectedProject} 
          onBack={handleBackToProjects}
          onDelete={isAdmin ? handleDeleteProject : undefined}
        />
      );
    }

    return (
      <>
        {viewMode === 'grid' && (
          <ProjectGrid 
            projects={filteredProjects} 
            onProjectClick={handleProjectClick} 
          />
        )}
        {viewMode === 'list' && (
          <ProjectList 
            projects={filteredProjects} 
            onProjectClick={handleProjectClick} 
          />
        )}
        {viewMode === 'kanban' && <KanbanBoard projects={filteredProjects} />}
      </>
    );
  };

  const renderContent = () => {
    if (loadingProjects) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'analytics':
        return (
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Analytics Overview</h2>
            <AnalyticsSection projects={projectsList} currentPage={currentPage} />
          </div>
        );
      case 'collaboration':
        return (
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Team Collaboration</h2>
            <TeamCollaborationView projects={supabaseProjects} />
          </div>
        );
      case 'timesheet':
        return (
          <div className="container mx-auto px-4 py-6">
            <Timesheet projects={supabaseProjects} />
          </div>
        );
      case 'team-members':
        return (
          <div className="container mx-auto px-4 py-6">
            <TeamMembers />
          </div>
        );
      case 'projects':
        return (
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                clearAllFilters={clearAllFilters}
              />
              {isAdmin && (
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} className="mr-1" />
                  <span>New Project</span>
                </button>
              )}
            </div>
            <div className="my-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Projects Overview</h2>
              {renderGridOrList()}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Time Tracking</h2>
                <Timesheet projects={supabaseProjects} />
              </div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="container mx-auto px-4 py-6">
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600">Here's an overview of your projects and activities.</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                clearAllFilters={clearAllFilters}
              />
              {isAdmin && (
                <button
                  onClick={() => setIsCreatingProject(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} className="mr-1" />
                  <span>New Project</span>
                </button>
              )}
            </div>
            <div style={{ border: '2px solid red', background: '#fffbe6', marginBottom: 24 }}>
              <EmployeeManagement />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Projects Overview</h2>
                {renderGridOrList()}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Time Tracking</h2>
                <Timesheet projects={supabaseProjects} />
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
                <ActivityFeed limit={10} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentTeam={currentTeam} 
        setCurrentTeam={setCurrentTeam} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onAdminLogin={() => setShowAdminLogin(true)}
      />
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          setSearchQuery={setSearchQuery}
          toggleSidebar={toggleSidebar}
          showViewToggle={true}
          currentPage={currentPage}
        />
        
        <div 
          className="flex-1 overflow-y-auto" 
          onClick={() => setSidebarOpen(false)}
        >
          {renderContent()}
        </div>
      </div>
      
      {isCreatingProject && isAdmin && (
        <CreateProject 
          onClose={() => setIsCreatingProject(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 relative w-full max-w-md transform transition-all">
            <AdminLogin 
              onLoginSuccess={() => setShowAdminLogin(false)} 
              onClose={() => setShowAdminLogin(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;