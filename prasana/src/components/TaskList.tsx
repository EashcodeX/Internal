import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, Trash2, Percent } from 'lucide-react';

// Define task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  priority: 'low' | 'medium' | 'high';
  progress?: number; // Optional progress percentage (0-100)
}

interface TaskListProps {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskProgressChange?: (taskId: string, progress: number) => void;
}

const priorityClasses = {
  'low': 'bg-blue-50 text-blue-700 border-blue-200',
  'medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'high': 'bg-red-50 text-red-700 border-red-200'
};

const statusIcons = {
  'todo': <Circle size={16} className="text-gray-400" />,
  'in-progress': <Clock size={16} className="text-amber-500" />,
  'completed': <CheckCircle size={16} className="text-green-500" />,
  'blocked': <AlertCircle size={16} className="text-red-500" />
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskStatusChange, onTaskDelete, onTaskProgressChange }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingProgressTaskId, setEditingProgressTaskId] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState<number>(0);

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  const startEditingProgress = (e: React.MouseEvent, taskId: string, currentProgress: number = 0) => {
    e.stopPropagation();
    setEditingProgressTaskId(taskId);
    setProgressValue(currentProgress);
  };

  const handleProgressChange = (taskId: string, progress: number) => {
    if (onTaskProgressChange) {
      onTaskProgressChange(taskId, progress);
      setEditingProgressTaskId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Tasks</h3>
      </div>

      {tasks.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No tasks found for this project.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map(task => (
            <li key={task.id} className="hover:bg-gray-50">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleTaskExpand(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      className="mr-3 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextStatus = {
                          'todo': 'in-progress',
                          'in-progress': 'completed',
                          'completed': 'todo',
                          'blocked': 'todo'
                        }[task.status] as Task['status'];
                        handleStatusChange(task.id, nextStatus);
                      }}
                    >
                      {statusIcons[task.status]}
                    </button>
                    <span className="font-medium text-gray-800">{task.title}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {task.assignee && (
                      <img 
                        src={task.assignee.avatar} 
                        alt={task.assignee.name}
                        className="w-6 h-6 rounded-full"
                        title={task.assignee.name}
                      />
                    )}
                    
                    <span className={`text-xs px-2 py-1 rounded-full border ${priorityClasses[task.priority]}`}>
                      {task.priority}
                    </span>
                    
                    {typeof task.progress === 'number' && (
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                        {task.progress}%
                      </span>
                    )}
                    
                    {onTaskDelete && (
                      <button
                        className="text-gray-400 hover:text-red-500 focus:outline-none p-1"
                        onClick={(e) => handleDeleteTask(e, task.id)}
                        title="Delete Task"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {expandedTaskId === task.id && (
                  <div className="mt-3 pl-8">
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    
                    {onTaskProgressChange && editingProgressTaskId === task.id ? (
                      <div className="flex items-center mb-3 mt-2">
                        <label className="text-xs text-gray-500 mr-2 w-16">Progress:</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={progressValue} 
                          onChange={(e) => setProgressValue(parseInt(e.target.value))}
                          className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-2 text-xs font-medium text-gray-700 w-10">{progressValue}%</span>
                        <button 
                          className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProgressChange(task.id, progressValue);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      onTaskProgressChange && (
                        <div className="flex items-center mb-3 mt-2">
                          <span className="text-xs text-gray-500 mr-2">Progress:</span>
                          <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-700">{task.progress || 0}%</span>
                          <button 
                            className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => startEditingProgress(e, task.id, task.progress || 0)}
                          >
                            <Percent size={14} />
                          </button>
                        </div>
                      )
                    )}
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Due: {task.dueDate}</span>
                      <div className="flex space-x-2">
                        <button 
                          className="hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'todo');
                          }}
                        >
                          To Do
                        </button>
                        <button 
                          className="hover:text-amber-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'in-progress');
                          }}
                        >
                          In Progress
                        </button>
                        <button 
                          className="hover:text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'completed');
                          }}
                        >
                          Completed
                        </button>
                        <button 
                          className="hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(task.id, 'blocked');
                          }}
                        >
                          Blocked
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList; 