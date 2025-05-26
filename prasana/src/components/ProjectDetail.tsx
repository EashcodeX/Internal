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
      });
      
      // Close the edit form
      setShowEditProject(false);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
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
          <>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${teamColorClasses[project.team || 'TITAN'] || ''}`}>
                {project.team || 'TITAN'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColorClasses[project.status || 'Ongoing'] || ''}`}>
                {project.status || 'Ongoing'}
              </span>
            </div>
            
            <h2 className="font-bold text-2xl mb-4 text-gray-900">{project.name || ''}</h2>
            
            <div className="flex items-center mb-6">
              <img 
                src={project.clientLogo} 
                alt={project.clientName || ''} 
                className="w-12 h-12 object-contain rounded mr-4 bg-gray-50"
              />
              <div>
                <h4 className="font-medium">{project.clientName || ''}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Globe size={14} className="mr-1" />
                  {project.clientDomain || ''}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-2">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full mr-2">
                      {project.clientCategory || ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2" />
                    <span>{project.startDate || ''}</span>
                    <span className="mx-2">→</span>
                    <span>{project.endDate || ''}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {project.description || ''}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm uppercase text-gray-500">Team Members</h3>
                  {isAdmin && (
                    <button 
                      onClick={() => setShowAddTeamMember(!showAddTeamMember)}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      <UserPlus size={14} className="mr-1" />
                      {showAddTeamMember ? 'Cancel' : 'Add Member'}
                    </button>
                  )}
                </div>
                
                {isAdmin && showAddTeamMember && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                    <h4 className="font-medium mb-2 text-sm text-gray-800">Add Team Member</h4>
                    <form onSubmit={handleAddTeamMember} className="space-y-3">
                      <div>
                        <label htmlFor="memberName" className="block text-xs font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <select
                          id="memberName"
                          value={newTeamMemberName || ''}
                          onChange={(e) => setNewTeamMemberName(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select member</option>
                          {teamMemberOptions.map(m => <option key={m.name} value={m.name}>{m.name} ({m.role})</option>)}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="memberRole" className="block text-xs font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <input
                          id="memberRole"
                          type="text"
                          value={newTeamMemberRole}
                          onChange={(e) => setNewTeamMemberRole(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="memberTeam" className="block text-xs font-medium text-gray-700 mb-1">
                          Team *
                        </label>
                        <select
                          id="memberTeam"
                          value={newTeamMemberTeam}
                          onChange={(e) => setNewTeamMemberTeam(e.target.value as TeamName)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="TITAN">TITAN</option>
                          <option value="NEXUS">NEXUS</option>
                          <option value="ATHENA">ATHENA</option>
                          <option value="DYNAMIX">DYNAMIX</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add Member
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="space-y-3">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center">
                      <img 
                        src={member.avatar} 
                        alt={member.name || ''} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-sm">{member.name || ''}</p>
                        <p className="text-xs text-gray-500">{member.role || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm uppercase text-gray-500 mb-3">Milestones</h3>
              <div className="space-y-2">
                {project.milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border text-sm ${
                      milestone.completed 
                        ? 'bg-green-50 border-green-100'
                        : milestone.delayed
                          ? 'bg-red-50 border-red-100'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {milestone.completed ? (
                          <CheckCircle2 size={16} className="text-green-500 mr-2" />
                        ) : milestone.delayed ? (
                          <XCircle size={16} className="text-red-500 mr-2" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2"></div>
                        )}
                        <span className="font-medium">{milestone.title || ''}</span>
                      </div>
                      <span>{milestone.date || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {project.hasTasksModule && (
              <div>
                <div className="mb-4">
                  <h3 className="text-sm uppercase text-gray-500 mb-3">Task Progress</h3>
                  <div className="bg-gray-100 rounded-full h-4 mb-2">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{completionPercentage}% Complete</span>
                    <span>{taskStats.completed}/{taskStats.total} Tasks</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="text-xs text-blue-500 mb-1">To Do</div>
                    <div className="text-2xl font-bold text-blue-700">{taskStats.todo || ''}</div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="text-xs text-amber-500 mb-1">In Progress</div>
                    <div className="text-2xl font-bold text-amber-700">{taskStats.inProgress || ''}</div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="text-xs text-green-500 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-green-700">{taskStats.completed || ''}</div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <div className="text-xs text-red-500 mb-1">Blocked</div>
                    <div className="text-2xl font-bold text-red-700">{taskStats.blocked || ''}</div>
                  </div>
                </div>
                
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-sm uppercase text-gray-500">Tasks</h3>
                  {isAdmin ? (
                    <button 
                      onClick={() => setShowAddTask(!showAddTask)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={16} className="mr-1" />
                      {showAddTask ? 'Cancel' : 'Add Task'}
                    </button>
                  ) : (
                    <div className="flex items-center text-sm text-gray-500">
                      <Lock size={16} className="mr-1" />
                      <span>Admin only</span>
                    </div>
                  )}
                </div>
                
                {isAdmin && showAddTask && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h4 className="font-medium mb-3 text-gray-800">Add New Task</h4>
                    <form onSubmit={handleAddTask}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title *
                          </label>
                          <input
                            id="taskTitle"
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            id="taskDescription"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                              Priority
                            </label>
                            <select
                              id="taskPriority"
                              value={newTaskPriority}
                              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="taskAssignee" className="block text-sm font-medium text-gray-700 mb-1">
                              Assignee
                            </label>
                            <select
                              id="taskAssignee"
                              value={newTaskAssigneeId}
                              onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Unassigned</option>
                              {assignees.map((assignee: { id: string, name: string }) => (
                                <option key={assignee.id} value={assignee.id}>
                                  {assignee.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="taskProgress" className="block text-sm font-medium text-gray-700 mb-1">
                            Progress (%)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              id="taskProgress"
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={newTaskProgress}
                              onChange={(e) => setNewTaskProgress(parseInt(e.target.value))}
                              className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="w-10 text-center text-sm font-medium text-gray-700">{newTaskProgress}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add Task
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
                <TaskList 
                  tasks={tasks} 
                  onTaskStatusChange={handleTaskStatusChange} 
                  onTaskDelete={isAdmin ? handleDeleteTask : undefined}
                  onTaskProgressChange={isAdmin ? handleUpdateTaskProgress : undefined}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 