import React, { useState } from 'react';
import { Calendar, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Project, TeamName } from '../types';

interface ProjectCardProps {
  project: Project;
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

// Helper function to extract team from role string
const extractTeamFromRole = (role: string): TeamName | null => {
  if (role.includes('TITAN')) return 'TITAN';
  if (role.includes('NEXUS')) return 'NEXUS';
  if (role.includes('ATHENA')) return 'ATHENA';
  if (role.includes('DYNAMIX')) return 'DYNAMIX';
  return null;
};

const getTeamsInProject = (project: Project) => {
  if (!project || !project.teams) {
    return [];
  }
  return project.teams.map(team => team.name);
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!project) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700">No project data available</h3>
      </div>
    );
  }

  const teams = project.teams || [];
  const teamMembers = project.teamMembers || [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${teamColorClasses[project.team]}`}>
              {project.team} (Lead)
            </span>
            {teams.length > 1 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                + {teams.length - 1} teams
              </span>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColorClasses[project.status]}`}>
            {project.status}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{project.name}</h3>
        
        <div className="flex items-center mb-4">
          <img 
            src={project.clientLogo} 
            alt={project.clientName} 
            className="w-10 h-10 object-contain rounded mr-3 bg-gray-50"
          />
          <div>
            <h4 className="font-medium text-sm">{project.clientName}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <Globe size={12} className="mr-1" />
              {project.clientDomain}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full mr-2">
            {project.clientCategory}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar size={14} className="mr-2" />
          <span>{project.startDate}</span>
          <span className="mx-2">→</span>
          <span>{project.endDate}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      </div>
      
      <div className="px-5 pb-3 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member, index) => {
              const memberTeam = extractTeamFromRole(member.role);
              const borderClass = memberTeam && memberTeam !== project.team 
                ? `border-2 ${teamColorClasses[memberTeam].replace('bg-', 'border-')}` 
                : 'border-2 border-white';
              
              return (
                <img 
                  key={index} 
                  src={member.avatar} 
                  alt={member.name} 
                  className={`w-8 h-8 rounded-full ${borderClass}`}
                  title={`${member.name} - ${member.role}`}
                />
              );
            })}
            {teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          {teams.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">Teams</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {teams.map(team => (
                  <span key={team} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {team}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <h4 className="font-medium text-sm mb-2">Milestones</h4>
          <div className="space-y-2">
            {(project.milestones || []).map((milestone, index) => (
              <div 
                key={index} 
                className={`text-xs p-2 rounded ${
                  milestone.completed 
                    ? 'bg-green-50 border border-green-100'
                    : milestone.delayed
                      ? 'bg-red-50 border border-red-100'
                      : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{milestone.title}</span>
                  <span>{milestone.date}</span>
                </div>
                <div className="mt-1">
                  {milestone.completed && <span className="text-green-700">Completed</span>}
                  {milestone.delayed && <span className="text-red-700">Delayed</span>}
                  {!milestone.completed && !milestone.delayed && <span className="text-gray-600">Pending</span>}
                </div>
              </div>
            ))}
          </div>
          
          <h4 className="font-medium text-sm mt-4 mb-2">Team Members</h4>
          <div className="space-y-2">
            {teamMembers.map((member, index) => {
              const memberTeam = extractTeamFromRole(member.role);
              const baseRole = member.role.split('(')[0].trim();
              
              return (
                <div key={index} className="flex items-center text-xs">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="font-medium">{member.name}</span>
                  <span className="ml-2 text-gray-500">{baseRole}</span>
                  {memberTeam && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${teamColorClasses[memberTeam]}`}>
                      {memberTeam}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;