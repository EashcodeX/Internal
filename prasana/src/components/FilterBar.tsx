import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { TeamName, ProjectStatus, ClientCategory, FilterState } from '../types';
import { projects } from '../data/mockData';

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearAllFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, clearAllFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values from projects
  const allTeams: TeamName[] = [...new Set(projects.map(project => project.team))];
  const allStatuses: ProjectStatus[] = ['Ongoing', 'Completed'];
  const allCategories: ClientCategory[] = [...new Set(projects.map(project => project.clientCategory))];
  const allClients = [...new Set(projects.map(project => project.clientName))];

  const toggleTeam = (team: TeamName) => {
    setFilters({
      ...filters,
      teams: filters.teams.includes(team)
        ? filters.teams.filter(t => t !== team)
        : [...filters.teams, team]
    });
  };

  const toggleStatus = (status: ProjectStatus) => {
    setFilters({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status]
    });
  };

  const toggleCategory = (category: ClientCategory) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category]
    });
  };

  const toggleClient = (client: string) => {
    setFilters({
      ...filters,
      clients: filters.clients.includes(client)
        ? filters.clients.filter(c => c !== client)
        : [...filters.clients, client]
    });
  };

  const getActiveFilterCount = () => {
    return filters.teams.length + filters.status.length + filters.categories.length + filters.clients.length;
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Filter size={18} />
          <span className="font-medium">Filters</span>
          <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X size={14} className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Teams Filter */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Teams</h3>
            <div className="space-y-1">
              {allTeams.map(team => (
                <div key={team} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`team-${team}`}
                    checked={filters.teams.includes(team)}
                    onChange={() => toggleTeam(team)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor={`team-${team}`} className="ml-2 text-sm text-gray-700">
                    {team}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Status</h3>
            <div className="space-y-1">
              {allStatuses.map(status => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
            <div className="space-y-1">
              {allCategories.map(category => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clients Filter */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Clients</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allClients.map(client => (
                <div key={client} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`client-${client}`}
                    checked={filters.clients.includes(client)}
                    onChange={() => toggleClient(client)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor={`client-${client}`} className="ml-2 text-sm text-gray-700">
                    {client}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;