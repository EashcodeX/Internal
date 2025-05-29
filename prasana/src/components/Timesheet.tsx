import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project } from '../types';
import { timesheetService } from '../services/timesheetService';
import { TimeEntry as TimeEntryType, TimeEntryForm, TimeEntrySummary } from '../types/timesheet';
import { Plus, Clock, Edit2, Trash2, Download, Tag, Filter, Calendar, ChevronLeft, ChevronRight, Grid, List, Layout, X, Bookmark } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  description: string;
  startTime: string;
  endTime: string | null;
  duration: number; // in minutes
  date: string;
  userId: string;
  category?: string;
  tags?: string[];
}

interface FilterState {
  searchQuery: string;
  dateRange: [Date, Date] | null;
  projectFilter: string[];
  categoryFilter: string[];
}

interface TimesheetProps {
  projects: Project[];
}

const CATEGORIES = [
  'Development',
  'Design',
  'Planning',
  'Meeting',
  'Research',
  'Documentation',
  'Testing',
  'Other'
];

type ViewMode = 'daily' | 'weekly' | 'monthly';
type DisplayMode = 'grid' | 'list' | 'compact';

const DEBOUNCE_DELAY = 300;

const Timesheet: React.FC<TimesheetProps> = ({ projects }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [manualEntry, setManualEntry] = useState<TimeEntryForm>({
    projectId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    minutes: 0,
    category: '',
    tags: []
  });
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateRange: null,
    projectFilter: [],
    categoryFilter: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);

  const getDateRange = useCallback(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (viewMode) {
      case 'daily':
        return { start, end };
      case 'weekly':
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        return { start, end };
      case 'monthly':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        return { start, end };
    }
  }, [currentDate, viewMode]);

  const fetchTimeEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange();
      
      const entries = await timesheetService.getTimeEntries(
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      
      // Filter out any invalid entries
      const validEntries = entries.filter(entry => {
        if (!entry || !entry.id || !entry.date) {
          console.warn('Invalid entry found:', entry);
          return false;
        }
        return true;
      });
      
      // Batch state updates
      setTimeEntries(validEntries);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      setTimeEntries([]);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTimeEntries();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [viewMode, currentDate, fetchTimeEntries]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'daily':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const { start, end } = getDateRange();
    switch (viewMode) {
      case 'daily':
        return start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'weekly':
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getViewEntries = useCallback(() => {
    const { start, end } = getDateRange();
    
    // Normalize dates to midnight UTC for comparison
    const startDate = new Date(start);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);
    
    return timeEntries.filter(entry => {
        if (!entry || !entry.date) {
            return false;
        }
        
        // Convert entry date to midnight UTC for comparison
        const entryDate = new Date(entry.date);
        entryDate.setUTCHours(0, 0, 0, 0);
        
        const isInRange = entryDate >= startDate && entryDate <= endDate;
        if (!isInRange) {
            return false;
        }

        // Apply search filter
        if (filters.searchQuery && !entry.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false;
        }

        // Apply project filter
        if (filters.projectFilter.length > 0 && entry.project_id !== null && !filters.projectFilter.includes(entry.project_id)) {
            return false;
        }

        // Apply category filter
        if (filters.categoryFilter.length > 0 && (!entry.category || !filters.categoryFilter.includes(entry.category))) {
            return false;
        }

        return true;
    });
  }, [timeEntries, getDateRange, filters]);

  const renderGridView = (entries: TimeEntryType[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">{entry.project_name_text || 'No Project'}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 flex-grow">{entry.description}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  {entry.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200">
                      {entry.category}
                    </span>
                  )}
                  {entry.tags?.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold text-blue-600">{formatDuration(entry.duration)}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setManualEntry({
                          projectId: entry.project_id || '',
                          description: entry.description,
                          date: entry.date,
                          hours: Math.floor(entry.duration / 60),
                          minutes: entry.duration % 60,
                          category: entry.category || '',
                          tags: entry.tags || []
                        });
                        setShowManualEntry(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTimeEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = (entries: TimeEntryType[]) => {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-blue-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.project_name_text || 'No Project'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {entry.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {entry.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {entry.tags?.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs mr-1 mb-1 hover:bg-gray-200 transition-colors duration-200">
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {formatDuration(entry.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setManualEntry({
                          projectId: entry.project_id || '',
                          description: entry.description,
                          date: entry.date,
                          hours: Math.floor(entry.duration / 60),
                          minutes: entry.duration % 60,
                          category: entry.category || '',
                          tags: entry.tags || []
                        });
                        setShowManualEntry(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTimeEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCompactView = (entries: TimeEntryType[]) => {
    return (
      <div className="space-y-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 w-24">
                {new Date(entry.date).toLocaleDateString()}
              </span>
              <span className="font-medium text-gray-900">{entry.project_name_text || 'No Project'}</span>
              <span className="text-gray-600 truncate max-w-md">{entry.description || 'No description'}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-600">{formatDuration(entry.duration)}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingEntry(entry);
                    setManualEntry({
                      projectId: entry.project_id || '',
                      description: entry.description,
                      date: entry.date,
                      hours: Math.floor(entry.duration / 60),
                      minutes: entry.duration % 60,
                      category: entry.category || '',
                      tags: entry.tags || []
                    });
                    setShowManualEntry(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTimeEntry(entry.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeeklyView = (entries: TimeEntryType[]) => {
    const days: { date: string; entries: TimeEntryType[] }[] = [];
    const startOfWeek = new Date(getDateRange().start);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      days.push({ date: dateString, entries: [] });
    }

    entries.forEach(entry => {
      const dayIndex = days.findIndex(day => day.date === entry.date);
      if (dayIndex !== -1) {
        days[dayIndex].entries.push(entry);
      }
    });

    return (
      <div className="space-y-6">
        {days.map(day => (
          <div key={day.date} className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-3">
              {day.entries.length > 0 ? (
                day.entries.map(entry => (
                  <div key={entry.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{entry.project_name_text || 'No Project'}</h4>
                      <p className="text-xs text-gray-600 truncate">{entry.description || 'No description'}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{formatDuration(entry.duration)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No entries for this day.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthlyView = (entries: TimeEntryType[]) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days: { date: string; entries: TimeEntryType[]; totalDuration: number }[] = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(startOfMonth);
      date.setDate(startOfMonth.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      days.push({ date: dateString, entries: [], totalDuration: 0 });
    }

    entries.forEach(entry => {
      const dayIndex = days.findIndex(day => day.date === entry.date);
      if (dayIndex !== -1) {
        days[dayIndex].entries.push(entry);
        days[dayIndex].totalDuration += entry.duration;
      }
    });

    return (
      <div className="space-y-6">
        {days.map(day => (
          <div key={day.date} className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {day.totalDuration > 0 && (
                <span className="ml-3 text-blue-600">({formatDuration(day.totalDuration)})</span>
              )}
            </h3>
            <div className="space-y-2">
              {day.entries.length > 0 ? (
                day.entries.map(entry => (
                  <div key={entry.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{entry.project_name_text || 'No Project'}</h4>
                      <p className="text-xs text-gray-600 truncate">{entry.description || 'No description'}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{formatDuration(entry.duration)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No entries for this day.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const deleteTimeEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this time entry?')) return;

    try {
      await timesheetService.deleteTimeEntry(id);
      fetchTimeEntries();
    } catch (error) {
      console.error('Error deleting time entry:', error);
      alert('Failed to delete time entry');
    }
  };

  const addManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!projectSearch.trim()) {
        alert('Please enter a project name');
        return;
      }
      if (!manualEntry.description.trim()) {
        alert('Please enter a description');
        return;
      }
      if (!manualEntry.date) {
        alert('Please select a date');
        return;
      }
      if (manualEntry.hours === undefined || manualEntry.minutes === undefined || (manualEntry.hours === 0 && manualEntry.minutes === 0)) { // Check for undefined hours/minutes too
        alert('Please enter a duration (hours or minutes)');
        return;
      }

      // Calculate total duration in minutes
      const totalMinutes = (manualEntry.hours * 60) + manualEntry.minutes;
      
      // Prepare the entry data - entry.projectId holds the user-entered text
      const entryData: TimeEntryForm = { // Explicitly type as TimeEntryForm
        projectId: projectSearch.trim(), // This will be saved to project_name_text in the service
        description: manualEntry.description.trim(),
        date: manualEntry.date,
        hours: manualEntry.hours, // Include hours and minutes in TimeEntryForm
        minutes: manualEntry.minutes, // Include hours and minutes in TimeEntryForm
        category: manualEntry.category || '',
        tags: manualEntry.tags || []
      };

      console.log('Adding time entry with data:', entryData);

      const newEntry = await timesheetService.addTimeEntry(entryData);
      console.log('Time entry added successfully:', newEntry);

      // Update the UI by refetching entries
      fetchTimeEntries(); // Refetch entries to include the new one

      setShowManualEntry(false);
      
      // Reset form
      setManualEntry({
        projectId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        minutes: 0,
        category: '',
        tags: []
      });
      setProjectSearch('');

    } catch (error) {
      console.error('Error adding time entry:', error);
      if (error instanceof Error) {
        alert(`Failed to add time entry: ${error.message}`);
      } else {
        alert('Failed to add time entry. Please check the console for more details.');
      }
    }
  };

  const editTimeEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    try {
      await timesheetService.updateTimeEntry(editingEntry.id, {
        ...manualEntry,
        projectId: projectSearch.trim(), // Use the project name as the ID
        projectName: projectSearch.trim() // Use the project name as the name
      });
      setShowManualEntry(false);
      setEditingEntry(null);
      setManualEntry({
        projectId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        minutes: 0,
        category: '',
        tags: []
      });
      setProjectSearch(''); // Clear the project search
      fetchTimeEntries();
    } catch (error) {
      console.error('Error updating time entry:', error);
      alert('Failed to update time entry');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Project', 'Description', 'Duration', 'Category', 'Tags'];
    const csvData = timeEntries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.project_name_text || '',
      entry.description,
      formatDuration(entry.duration),
      entry.category || '',
      (entry.tags || []).join(', ')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statistics = useMemo(() => {
    const entries = getViewEntries();
    const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const projectHours = entries.reduce((acc, entry) => {
        acc[entry.project_name_text || ''] = (acc[entry.project_name_text || ''] || 0) + entry.duration / 60;
        return acc;
    }, {} as Record<string, number>);
    
    const categoryHours = entries.reduce((acc, entry) => {
        if (entry.category) {
            acc[entry.category] = (acc[entry.category] || 0) + entry.duration / 60;
        }
        return acc;
    }, {} as Record<string, number>);

    const mostActiveProject = Object.entries(projectHours)
        .sort((a, b) => b[1] - a[1])[0];
    
    const mostActiveCategory = Object.entries(categoryHours)
        .sort((a, b) => b[1] - a[1])[0];

    return {
        totalHours,
        mostActiveProject,
        mostActiveCategory,
        entryCount: entries.length
    };
}, [getViewEntries]);

  const getFilteredProjects = () => {
    if (!projects) {
      return [];
    }
    const lowerCaseSearch = projectSearch.toLowerCase();
    return projects.filter(project =>
      project.name.toLowerCase().includes(lowerCaseSearch)
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.project-search-container')) {
      setShowProjectSuggestions(false);
    }
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      // Ensure projectFilter contains only strings, filtering out null or undefined
      if (updatedFilters.projectFilter) {
        updatedFilters.projectFilter = updatedFilters.projectFilter.filter((id): id is string => typeof id === 'string');
      }
      return updatedFilters;
    });
  };

  const renderFilters = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filter Time Entries</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search in descriptions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Projects</label>
              <div className="mt-1 space-y-2">
                {projects.map(project => (
                  <label key={project.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.projectFilter.includes(project.id)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          projectFilter: e.target.checked
                            ? [...prev.projectFilter, project.id]
                            : prev.projectFilter.filter(id => id !== project.id)
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{project.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categories</label>
              <div className="mt-1 space-y-2">
                {['Development', 'Design', 'Planning', 'Meeting', 'Research', 'Documentation', 'Testing', 'Other'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categoryFilter.includes(category)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          categoryFilter: e.target.checked
                            ? [...prev.categoryFilter, category]
                            : prev.categoryFilter.filter(c => c !== category)
                        }));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setFilters({
                  searchQuery: '',
                  dateRange: null,
                  projectFilter: [],
                  categoryFilter: []
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Time Tracking</h2>
          <p className="text-gray-600">Track and manage your work hours</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center hover:bg-gray-600 transition-colors text-sm"
          >
            <Filter size={18} className="mr-1" />
            <span>Filter</span>
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center hover:bg-gray-600 transition-colors text-sm"
          >
            <Download size={18} className="mr-1" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowManualEntry(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
          >
            <Plus size={18} className="mr-1" />
            <span>Add Time Entry</span>
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-blue-900">Total Hours</h3>
            <p className="text-2xl font-bold text-blue-600">{statistics.totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-green-900">Most Active Project</h3>
            <p className="text-xl font-bold text-green-600 truncate">{statistics.mostActiveProject?.[0] || 'N/A'}</p>
            <p className="text-sm text-green-700">{statistics.mostActiveProject?.[1].toFixed(1)}h</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-purple-900">Most Active Category</h3>
            <p className="text-xl font-bold text-purple-600 truncate">{statistics.mostActiveCategory?.[0] || 'N/A'}</p>
            <p className="text-sm text-purple-700">{statistics.mostActiveCategory?.[1].toFixed(1)}h</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-medium text-orange-900">Entries This Period</h3>
            <p className="text-2xl font-bold text-orange-600">{statistics.entryCount}</p>
        </div>
      </div>

      {/* View Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
              viewMode === 'daily' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
              viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
              viewMode === 'monthly' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`p-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                displayMode === 'grid' ? 'bg-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`p-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                displayMode === 'list' ? 'bg-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setDisplayMode('compact')}
              className={`p-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                displayMode === 'compact' ? 'bg-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layout size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">{formatDateRange()}</span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md p-2 bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filter by tags (comma-separated)"
              className="w-full border rounded-md p-2"
              onChange={(e) => setSelectedTags(e.target.value.split(',').map(tag => tag.trim()))}
            />
          </div>
        </div>
      </div>
      
      {/* Manual Time Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingEntry ? 'Edit Time Entry' : 'Add Manual Time Entry'}
              </h3>
              <button
                onClick={() => {
                  setShowManualEntry(false);
                  setEditingEntry(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={editingEntry ? editTimeEntry : addManualEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project *
                </label>
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => {
                    setProjectSearch(e.target.value);
                    // Store the project name directly in the manualEntry
                    setManualEntry(prev => ({ ...prev, projectId: e.target.value }));
                  }}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter project name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={manualEntry.description}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={manualEntry.date}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={manualEntry.hours}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                    className="w-full border rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={manualEntry.minutes}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={manualEntry.category}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={manualEntry.tags.join(', ')}
                  onChange={(e) => setManualEntry(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  }))}
                  className="w-full border rounded-md p-2"
                  placeholder="e.g., frontend, bugfix, feature"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntry(false);
                    setEditingEntry(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Entries View */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading time entries...</span>
          </div>
        ) : timeEntries.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No time entries found for the selected period.
          </div>
        ) : (
          <>
            {viewMode === 'daily' && (
              <>
                {displayMode === 'grid' && renderGridView(getViewEntries())}
                {displayMode === 'list' && renderListView(getViewEntries())}
                {displayMode === 'compact' && renderCompactView(getViewEntries())}
              </>
            )}
            {viewMode === 'weekly' && renderWeeklyView(getViewEntries())}
            {viewMode === 'monthly' && renderMonthlyView(getViewEntries())}
          </>
        )}
      </div>

      {showFilters && renderFilters()}
    </div>
  );
};

export default Timesheet; 