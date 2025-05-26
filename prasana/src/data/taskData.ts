import { Task } from '../components/TaskList';
import { avatars } from './mockData';

// Generate random due dates between today and 30 days from now
const getRandomDueDate = (): string => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
  return futureDate.toISOString().split('T')[0];
};

// Sample assignees
export const assignees = [
  {
    id: 'user-1',
    name: 'Eashwar',
    avatar: avatars[0] || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'user-2',
    name: 'Yuvaraj',
    avatar: avatars[1] || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'user-3',
    name: 'Aamina',
    avatar: avatars[2] || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 'user-4',
    name: 'SriRam',
    avatar: avatars[3] || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Create mock tasks for each project
export const generateProjectTasks = (projectId: string, count: number = 5): Task[] => {
  const statuses: Task['status'][] = ['todo', 'in-progress', 'completed', 'blocked'];
  const priorities: Task['priority'][] = ['low', 'medium', 'high'];
  
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignee = Math.random() > 0.2 
      ? assignees[Math.floor(Math.random() * assignees.length)] 
      : null;
    
    return {
      id: `task-${projectId}-${i + 1}`,
      title: `Task ${i + 1} for Project ${projectId.replace('project-', '')}`,
      description: `This is a detailed description for task ${i + 1}. It explains what needs to be done and any specific requirements or considerations.`,
      status,
      dueDate: getRandomDueDate(),
      assignee,
      priority
    };
  });
};

// Create a map of project tasks
const projectTasksMap: Record<string, Task[]> = {};

// Generate 3-7 tasks for each project
export const getTasksForProject = (projectId: string): Task[] => {
  if (!projectTasksMap[projectId]) {
    const taskCount = Math.floor(Math.random() * 5) + 3; // 3-7 tasks
    projectTasksMap[projectId] = generateProjectTasks(projectId, taskCount);
  }
  
  return projectTasksMap[projectId];
};

// Provide an update function to change task status
export const updateTaskStatus = (
  projectId: string, 
  taskId: string, 
  newStatus: Task['status']
): void => {
  if (projectTasksMap[projectId]) {
    const taskIndex = projectTasksMap[projectId].findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      projectTasksMap[projectId][taskIndex].status = newStatus;
    }
  }
};

// Add a new task to a project
export const addTask = (
  projectId: string,
  taskData: Omit<Task, 'id'>
): Task => {
  if (!projectTasksMap[projectId]) {
    projectTasksMap[projectId] = [];
  }
  
  // Create a new task ID based on the number of existing tasks
  const newTaskId = `task-${projectId}-${projectTasksMap[projectId].length + 1}`;
  
  // Create the new task with the generated ID
  const newTask: Task = {
    ...taskData,
    id: newTaskId,
  };
  
  // Add the task to the project's task list
  projectTasksMap[projectId].push(newTask);
  
  return newTask;
}; 