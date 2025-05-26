import React, { useState, useEffect, useMemo } from 'react';
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
import ResourceManagement from './components/ResourceManagement';
import { ViewMode, FilterState, TeamName, Project, PageType } from './types';
import { projects } from './data/mockData';
import { UserProvider, useUser } from './contexts/UserContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { getTasksForProject } from './data/taskData';
import { Plus, Briefcase, Clock, BarChart3 } from 'lucide-react';
import { fetchProjects, addProject, updateProject, deleteProject } from './data/supabaseProjects';
import AdminLogin from './components/AdminLogin';

function AppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<TeamName | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const { isAdmin, currentUser, logout } = useUser();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [filters, setFilters] = useState<FilterState>({
    teams: [],
    status: [],
    categories: [],
    clients: [],
    searchQuery: '',
  });
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      showLoading();
      try {
        const projects = await fetchProjects();
        setProjectsList(projects);
      } catch (err) {
        console.error('Failed to fetch projects from Supabase:', err);
      } finally {
        hideLoading();
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (currentTeam) {
      setFilters((prev: FilterState) => ({
        ...prev,
        teams: [currentTeam]
      }));
    } else {
      setFilters((prev: FilterState) => ({
        ...prev,
        teams: []
      }));
    }
  }, [currentTeam]);

  const supabaseProjects = useMemo(() => {
    return projectsList;
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    return supabaseProjects.filter(project => {
      if (filters.teams.length && !filters.teams.includes(project.team)) return false;
      if (filters.status.length && !filters.status.includes(project.status)) return false;
      if (filters.categories.length && !filters.categories.includes(project.clientCategory)) return false;
      if (filters.clients.length && !filters.clients.includes(project.client)) return false;
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(searchLower) ||
          project.client.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [supabaseProjects, filters]);

  const clearAllFilters = () => {
    setFilters({
      teams: [],
      status: [],
      categories: [],
      clients: [],
      searchQuery: '',
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const newProject = await addProject(projectData);
      setProjectsList(prev => [...prev, newProject]);
      setIsCreatingProject(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await updateProject(projectId, updates);
      setProjectsList(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjectsList(prev => prev.filter(p => p.id !== projectId));
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Add effect for view mode transitions
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
    }, 250); // Shorter delay for view changes
    
    return () => {
      clearTimeout(timer);
      hideLoading();
    };
  }, [viewMode, showLoading, hideLoading]);

  // Add effect for page transitions
  useEffect(() => {
    showLoading();
    const timer = setTimeout(() => {
      hideLoading();
    }, 550); // Adjusted to 550ms for page transitions
    
    return () => {
      clearTimeout(timer);
      hideLoading();
    };
  }, [currentPage, showLoading, hideLoading]);

  const renderGridOrList = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No projects found.</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'grid':
        return (
          <ProjectGrid
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        );
      case 'list':
        return (
          <ProjectList
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        );
      case 'kanban':
        return (
          <KanbanBoard
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (loadingProjects) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (selectedProject) {
      return (
        <ProjectDetail
          project={selectedProject}
          onClose={handleCloseProjectDetail}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
        />
      );
    }

    if (isCreatingProject) {
      return (
        <CreateProject
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreatingProject(false)}
        />
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
        return <TeamMembers />;
      case 'resource-management':
        return (
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Resource Management</h2>
            <ResourceManagement 
              teamMembers={projectsList.flatMap(p => p.teamMembers)}
              currentTeam={currentTeam || undefined}
            />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  <Briefcase className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-blue-600">{projectsList.length}</p>
                <p className="text-sm text-gray-500 mt-2">Total active projects</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tasks</h3>
                  <Clock className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-green-600">--</p>
                <p className="text-sm text-gray-500 mt-2">Pending tasks</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
                  <BarChart3 className="text-purple-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-purple-600">--</p>
                <p className="text-sm text-gray-500 mt-2">Overall completion</p>
              </div>
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
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentTeam={currentTeam}
        setCurrentTeam={setCurrentTeam}
        onAdminLogin={() => setShowAdminLogin(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateProject={() => setIsCreatingProject(true)}
          isAdmin={isAdmin}
          currentUser={currentUser}
          onLogout={logout}
          onAdminLogin={() => setShowAdminLogin(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
      {isCreatingProject && (
        <CreateProject
          onClose={() => setIsCreatingProject(false)}
          onProjectCreated={handleCreateProject}
        />
      )}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </UserProvider>
  );
} 