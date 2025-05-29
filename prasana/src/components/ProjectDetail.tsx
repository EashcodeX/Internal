import React, { useState, useEffect } from 'react';
import { Calendar, Globe, Users, ChevronLeft, CheckCircle2, XCircle, Plus, Lock, Percent, UserPlus, Edit, Trash2 } from 'lucide-react';
import { Project, TeamName, ClientCategory, ProjectStatus } from '../types';
import { Teams } from '../types/team';
import TaskList, { Task } from './TaskList';
import { assignees } from '../data/taskData';
import { useUser } from '../contexts/UserContext';
import { updateProject } from '../data/supabaseProjects';
import { teams as staticTeams } from '../data/teams';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onDelete?: (projectId: string) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const teamColorClasses: Record<TeamName, string> = {
  'TITAN': 'bg-blue-100 text-blue-800',
  'NEXUS': 'bg-purple-100 text-purple-800',
  'ATHENA': 'bg-green-100 text-green-800',
  'DYNAMIX': 'bg-amber-100 text-amber-800'
};

const statusColorClasses = {
  'Ongoing': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200'
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onDelete }) => {
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<string>('');
  const [newTaskProgress, setNewTaskProgress] = useState<number>(0);
  const [newTeamMemberName, setNewTeamMemberName] = useState('');
  const [newTeamMemberRole, setNewTeamMemberRole] = useState('');
  const [newTeamMemberTeam, setNewTeamMemberTeam] = useState<TeamName>(project.team || 'TITAN');
  const [teamMemberOptions, setTeamMemberOptions] = useState<TeamMember[]>([]);
  
  // Edit project state
  const [editProjectName, setEditProjectName] = useState(project.name || '');
  const [editClientName, setEditClientName] = useState(project.clientName || '');
  const [editClientDomain, setEditClientDomain] = useState(project.clientDomain || '');
  const [editTeam, setEditTeam] = useState<TeamName>(project.team || 'TITAN');
  const [editDescription, setEditDescription] = useState(project.description || '');
  const [editClientCategory, setEditClientCategory] = useState<ClientCategory>(project.clientCategory || 'Healthcare');
  const [editStatus, setEditStatus] = useState<ProjectStatus>(project.status || 'Ongoing');
  const [editStartDate, setEditStartDate] = useState(project.startDate || '');
  const [editEndDate, setEditEndDate] = useState(project.endDate || '');
  const [editCompanyLogoUrl, setEditCompanyLogoUrl] = useState(project.companyLogoUrl || '');
  
  const { isAdmin } = useUser();
  
  // Available options for dropdowns
  const clientCategories: ClientCategory[] = [
    'Healthcare', 
    'E-commerce', 
    'Finance', 
    'Education', 
    'Technology', 
    'Manufacturing',
    'Media',
    'Retail',
    'Travel'
  ];
  
  const teams: TeamName[] = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'];
  
  // Load tasks from project prop
  useEffect(() => {
    setTasks(project.tasks || []);
  }, [project.tasks]);
  
  // Update team member options when team changes
  useEffect(() => {
    const teamKey = newTeamMemberTeam.toLowerCase() as keyof Teams;
    const teamData = staticTeams[teamKey];
    if (teamData) {
      // Add a generated id if missing for static team members
      const withIds = [teamData.sdm, teamData.tdm, teamData.cxm, ...(teamData.members || [])].map((m, idx) => ({
        id: m.name ? m.name.replace(/\s+/g, '_').toLowerCase() + '_' + idx : 'member_' + idx,
        ...m,
        name: m.name || '',
        role: m.role || '',
        avatar: m.avatar || ''
      }));
      setTeamMemberOptions(withIds);
    } else {
      setTeamMemberOptions([]);
    }
  }, [newTeamMemberTeam]);
  
  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    if (!isAdmin) return;
    
    // Update task status in local state
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
    // Update in Supabase
    try {
      await updateProject(project.id || '', { tasks: updatedTasks });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert local state on error
      setTasks(tasks);
    }
  };
  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    // Set the due date to 7 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateString = dueDate.toISOString().split('T')[0];
    // Find the assignee object based on ID
    const assignee = newTaskAssigneeId 
      ? assignees.find((a: { id: string }) => a.id === newTaskAssigneeId) || null 
      : null;
    // Generate a unique ID for the new task
    const newTaskId = `task-${project.id || ''}-${Date.now()}`;
    // Create the new task
    const newTask: Task = {
      id: newTaskId,
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      dueDate: dueDateString,
      assignee,
      priority: newTaskPriority,
      progress: newTaskProgress
    };
    // Update the tasks state to include the new task
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    // Update the tasks field in Supabase
    await updateProject(project.id || '', { tasks: updatedTasks });
    // Reset the form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskAssigneeId('');
    setNewTaskProgress(0);
    setShowAddTask(false);
  };
  
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    // Find the selected member from the dropdown
    const selectedMember = teamMemberOptions.find(m => m.name === newTeamMemberName);
    let newTeamMember;
    if (selectedMember) {
      newTeamMember = {
        id: `member-${Date.now()}`,
        name: selectedMember.name,
        role: selectedMember.role,
        avatar: selectedMember.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random&color=fff`
      };
    } else {
      newTeamMember = {
        id: `member-${Date.now()}`,
        name: newTeamMemberName,
        role: `${newTeamMemberRole} (${newTeamMemberTeam})`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeamMemberName)}&background=random&color=fff`
      };
    }

    // Update the project in Supabase
    const updatedTeamMembers = [...(project.teamMembers || []), newTeamMember];
    await updateProject(project.id || '', { teamMembers: updatedTeamMembers });
    project.teamMembers = updatedTeamMembers;

    setNewTeamMemberName('');
    setNewTeamMemberRole('');
    setNewTeamMemberTeam(project.team || 'TITAN');
    setShowAddTeamMember(false);
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (!isAdmin) return;
    
    // Update local state
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    // Update in Supabase
    try {
      await updateProject(project.id || '', { tasks: updatedTasks });
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Revert local state on error
      setTasks(tasks);
    }
  };
  
  const handleUpdateTaskProgress = async (taskId: string, progress: number) => {
    if (!isAdmin) return;
    
    // Update local state
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    );
    setTasks(updatedTasks);
    
    // Update in Supabase
    try {
      await updateProject(project.id || '', { tasks: updatedTasks });
    } catch (error) {
      console.error('Failed to update task progress:', error);
      // Revert local state on error
      setTasks(tasks);
    }
  };
  
  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    todo: tasks.filter(task => task.status === 'todo').length,
    blocked: tasks.filter(task => task.status === 'blocked').length,
  };
  
  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;
  
  const handleDeleteProject = () => {
    if (!isAdmin || !onDelete) return; // Only admins can delete projects
    
    // Create a more detailed confirmation message
    const confirmMessage = 
      `Are you sure you want to delete the project "${project.name || ''}"?\n\n` +
      `This will permanently delete:\n` +
      `- All project information\n` +
      `- ${tasks.length} task(s)\n` +
      `- Team member assignments\n\n` +
      `This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      // Delete the project
      onDelete(project.id || '');
    }
  };
  
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) return;
    
    try {
      // Update in Supabase
      await updateProject(project.id || '', {
        name: editProjectName,
        clientName: editClientName,
        clientDomain: editClientDomain,
        team: editTeam,
        description: editDescription,
        clientCategory: editClientCategory,
        status: editStatus,
        startDate: editStartDate,
        endDate: editEndDate,
        companyLogoUrl: editCompanyLogoUrl,
      });
      
      // Update local state
      Object.assign(project, {
        name: editProjectName,
        clientName: editClientName,
        clientDomain: editClientDomain,
        team: editTeam,
        description: editDescription,
        clientCategory: editClientCategory,
        status: editStatus,
        startDate: editStartDate,
        endDate: editEndDate,
        companyLogoUrl: editCompanyLogoUrl,
      });
      
      // Close the edit form
      setShowEditProject(false);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    }
  };
  
  // Add handleRemoveTeamMember function
  const handleRemoveTeamMember = async (memberId: string) => {
    if (!isAdmin) return;

    // Confirm before removing
    if (!confirm('Are you sure you want to remove this team member from the project?')) {
      return;
    }

    // Update local state
    const updatedTeamMembers = (project.teamMembers || []).filter(
      (member) => member.id !== memberId
    );

    // Update the project in Supabase
    try {
      await updateProject(project.id || '', { teamMembers: updatedTeamMembers });
      // Update local project state to reflect the change immediately
      project.teamMembers = updatedTeamMembers;
      console.log('Team member removed successfully.');
    } catch (error) {
      console.error('Failed to remove team member:', error);
      alert('Failed to remove team member. Please try again.');
      // Optionally, revert local state on error
      // Object.assign(project, { teamMembers: project.teamMembers }); // Use original teamMembers
    }
  };
  
  // DEBUG LOGGING
  useEffect(() => {
    console.log('DEBUG: ProjectDetail project prop:', project);
    console.log('DEBUG: ProjectDetail project.tasks:', project.tasks);
    console.log('DEBUG: ProjectDetail local tasks state:', tasks);
  }, [project, tasks]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to projects
          </button>
          
          {isAdmin && (
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowEditProject(!showEditProject)}
                className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded"
              >
                <Edit size={16} className="mr-1" />
                <span>{showEditProject ? 'Cancel' : 'Edit'}</span>
              </button>
              
              <button 
                onClick={handleDeleteProject}
                className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
              >
                <Trash2 size={16} className="mr-1" />
                <span>Delete Project</span>
              </button>
            </div>
          )}
        </div>
        
        {isAdmin && showEditProject ? (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-medium mb-4 text-gray-800">Edit Project</h3>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    id="editProjectName"
                    type="text"
                    value={editProjectName}
                    onChange={(e) => setEditProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="editTeam" className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <select
                    id="editTeam"
                    value={editTeam}
                    onChange={(e) => setEditTeam(e.target.value as TeamName)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {teams.map(teamName => (
                      <option key={teamName} value={teamName}>
                        {teamName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="editClientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </label>
                  <input
                    id="editClientName"
                    type="text"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="editClientDomain" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Domain
                  </label>
                  <input
                    id="editClientDomain"
                    type="text"
                    value={editClientDomain}
                    onChange={(e) => setEditClientDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="editClientCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Category
                  </label>
                  <select
                    id="editClientCategory"
                    value={editClientCategory}
                    onChange={(e) => setEditClientCategory(e.target.value as ClientCategory)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {clientCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="editStatus"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="editStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="editStartDate"
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="editEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id="editEndDate"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="editCompanyLogoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo URL
                </label>
                <input
                  id="editCompanyLogoUrl"
                  type="text"
                  value={editCompanyLogoUrl}
                  onChange={(e) => setEditCompanyLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter logo URL"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-6">
            {/* Company Logo - Placeholder for now */}
            {project.companyLogoUrl && (
              <img 
                src={project.companyLogoUrl}
                alt={`${project.clientName || 'Company'} Logo`}
                className="w-16 h-16 object-contain mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name || 'Untitled Project'}</h1>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Globe size={16} className="mr-1 text-gray-500" />
              <span>{project.clientName || 'N/A'} ({project.clientDomain || 'N/A'})</span>
            </div>
            <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${teamColorClasses[project.team || 'TITAN'] || 'bg-gray-200 text-gray-800'} mb-4`}>
              {project.team || 'No Team'}
            </div>

            <div className="flex flex-wrap items-center text-sm text-gray-700 mb-4">
              <Calendar size={16} className="mr-1 text-gray-500" />
              <span>{project.startDate || 'N/A'} - {project.endDate || 'N/A'}</span>
              {project.clientCategory && (
                <span className="ml-4 flex items-center">
                  <Users size={16} className="mr-1 text-gray-500" />
                  {project.clientCategory}
                </span>
              )}
               {project.status && (
                <span className={`ml-4 flex items-center px-2 py-0.5 border rounded-full text-xs ${statusColorClasses[project.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                  {project.status}
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-gray-800 mb-4">{project.description}</p>
            )}

            {/* Task Progress */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Task Progress</h3>
                 <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>{completionPercentage}% Complete</span>
                    <span>{taskStats.completed}/{taskStats.total} Tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
                 <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <div className="font-bold text-blue-800 text-xl">{taskStats.todo}</div>
                        <div className="text-blue-700 text-sm">To Do</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                        <div className="font-bold text-yellow-800 text-xl">{taskStats.inProgress}</div>
                        <div className="text-yellow-700 text-sm">In Progress</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                        <div className="font-bold text-green-800 text-xl">{taskStats.completed}</div>
                        <div className="text-green-700 text-sm">Completed</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                        <div className="font-bold text-red-800 text-xl">{taskStats.blocked}</div>
                        <div className="text-red-700 text-sm">Blocked</div>
                    </div>
                </div>
            </div>

            {/* Team Members */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
                {isAdmin && (
                    <button 
                      onClick={() => setShowAddTeamMember(!showAddTeamMember)}
                      className="flex items-center px-3 py-1.5 mb-4 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                    >
                      <UserPlus size={16} className="mr-1" />
                      <span>{showAddTeamMember ? 'Cancel' : 'Add Team Member'}</span>
                    </button>
                )}

                {isAdmin && showAddTeamMember && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <h4 className="font-medium mb-3 text-gray-800">Add New Team Member</h4>
                        <form onSubmit={handleAddTeamMember} className="space-y-3">
                            <div>
                                <label htmlFor="teamMemberName" className="block text-sm font-medium text-gray-700 mb-1">Select Member</label>
                                <select
                                    id="teamMemberName"
                                    value={newTeamMemberName}
                                    onChange={(e) => setNewTeamMemberName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">-- Select a member --</option>
                                    {teamMemberOptions.map(member => (
                                        <option key={member.id} value={member.name}>
                                            {member.name} ({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="teamMemberTeam" className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                                <select
                                    id="teamMemberTeam"
                                    value={newTeamMemberTeam}
                                    onChange={(e) => setNewTeamMemberTeam(e.target.value as TeamName)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {teams.map(teamName => (
                                        <option key={teamName} value={teamName}>
                                            {teamName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                Add Member
                            </button>
                        </form>
                    </div>
                )}
                
                {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.teamMembers.map(member => (
                            <div key={member.id || member.name} className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <img 
                                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`}
                                    alt={member.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div className="flex-grow">
                                    <div className="font-medium text-gray-800">{member.name}</div>
                                    <div className="text-sm text-gray-600">{member.role}</div>
                                </div>
                                {isAdmin && member.id && ( // Show remove button only for admins and if member has an ID
                                  <button 
                                    onClick={() => handleRemoveTeamMember(member.id)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                    title="Remove member"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No team members assigned yet.</p>
                )}
            </div>

            {/* Tasks Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tasks</h3>
                 {isAdmin && (
                    <button 
                      onClick={() => setShowAddTask(!showAddTask)}
                      className="flex items-center px-3 py-1.5 mb-4 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                    >
                      <Plus size={16} className="mr-1" />
                      <span>{showAddTask ? 'Cancel' : 'Add Task'}</span>
                    </button>
                )}

                {isAdmin && showAddTask && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <h4 className="font-medium mb-3 text-gray-800">Add New Task</h4>
                        <form onSubmit={handleAddTask} className="space-y-3">
                            <div>
                                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    id="taskTitle"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="e.g., Implement user authentication"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    id="taskDescription"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Details about the task..."
                                ></textarea>
                            </div>
                             <div>
                                <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    id="taskPriority"
                                    value={newTaskPriority}
                                    onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="taskAssignee" className="block text-sm font-medium text-gray-700 mb-1">Assignee (Optional)</label>
                                <select
                                    id="taskAssignee"
                                    value={newTaskAssigneeId}
                                    onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Unassigned</option>
                                    {project.teamMembers?.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    id="taskDueDate"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="taskProgress" className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                                <input
                                    type="number"
                                    id="taskProgress"
                                    value={newTaskProgress}
                                    onChange={(e) => setNewTaskProgress(Number(e.target.value))}
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                                Add Task
                            </button>
                        </form>
                    </div>
                )}

                <TaskList tasks={tasks} onTaskStatusChange={handleTaskStatusChange} isAdmin={isAdmin} onDeleteTask={handleDeleteTask} onUpdateTaskProgress={handleUpdateTaskProgress} />

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 