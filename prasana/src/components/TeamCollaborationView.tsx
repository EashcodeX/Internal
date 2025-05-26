import React, { useState } from 'react';
import { Project, TeamName } from '../types';
import { Calendar, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { teams } from '../data/teams';
import ProfileAvatar from './ProfileAvatar';

interface TeamCollaborationProps {
  projects: Project[];
}

const teamColorClasses: Record<TeamName, string> = {
  'TITAN': 'bg-blue-100 text-blue-800 border-blue-200',
  'NEXUS': 'bg-purple-100 text-purple-800 border-purple-200',
  'ATHENA': 'bg-green-100 text-green-800 border-green-200',
  'DYNAMIX': 'bg-amber-100 text-amber-800 border-amber-200'
};

// Helper function to extract team from role string
const extractTeamFromRole = (role: string): TeamName | null => {
  if (role.includes('TITAN')) return 'TITAN';
  if (role.includes('NEXUS')) return 'NEXUS';
  if (role.includes('ATHENA')) return 'ATHENA';
  if (role.includes('DYNAMIX')) return 'DYNAMIX';
  return null;
};

const TeamCollaborationView: React.FC<TeamCollaborationProps> = ({ projects }) => {
  const [expandedTeam, setExpandedTeam] = useState<TeamName | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const teamNames = ['TITAN', 'NEXUS', 'ATHENA', 'DYNAMIX'] as TeamName[];
  
  // Group projects by team
  const teamProjects = new Map<TeamName, Project[]>();
  
  // Initialize team projects map
  teamNames.forEach(team => {
    teamProjects.set(team, []);
  });
  
  // Sort projects by each team - both led and participated
  projects.forEach(project => {
    // Add to lead team
    const leadTeamProjects = teamProjects.get(project.team) || [];
    leadTeamProjects.push(project);
    teamProjects.set(project.team, leadTeamProjects);
    
    // Check if members from other teams participated
    project.teamMembers.forEach(member => {
      const memberTeam = extractTeamFromRole(member.role);
      if (memberTeam && memberTeam !== project.team) {
        const participatedProjects = teamProjects.get(memberTeam) || [];
        if (!participatedProjects.find(p => p.id === project.id)) {
          participatedProjects.push(project);
          teamProjects.set(memberTeam, participatedProjects);
        }
      }
    });
  });

  const toggleTeam = (team: TeamName) => {
    setExpandedTeam(expandedTeam === team ? null : team);
  };

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };
  
  return (
    <div className="space-y-8">
      {teamNames.map(team => {
        const teamData = teams[team.toLowerCase() as keyof typeof teams];
        const isTeamExpanded = expandedTeam === team;
        
        return (
          <div key={team} className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="flex items-center mb-6 cursor-pointer"
              onClick={() => toggleTeam(team)}
            >
              <div className="relative w-12 h-12 mr-4">
                <img
                  src={`/profiles/${team.toLowerCase()}.png`}
                  alt={`${team} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{team} Team</h2>
                <div className="text-sm text-gray-600">
                  {teamData.sdm.name} (SDM) • {teamData.tdm.name} (TDM) • {teamData.cxm.name} (CXM)
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {teamProjects.get(team)?.length || 0} Projects
                </div>
                <button className="text-gray-400">
                  {isTeamExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            
            {isTeamExpanded && (
              <>
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <h3 className="text-sm uppercase text-gray-500 mb-4">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Leadership */}
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-4 bg-white border rounded-lg flex items-start space-x-3">
                        <ProfileAvatar name={teamData.sdm.name} avatar={teamData.sdm.avatar} size="md" team={team} />
                        <div>
                          <div className="font-medium">{teamData.sdm.name}</div>
                          <div className="text-sm text-gray-600">Service Delivery Manager</div>
                          {teamData.sdm.designation && (
                            <div className="text-xs text-gray-500">{teamData.sdm.designation}</div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white border rounded-lg flex items-start space-x-3">
                        <ProfileAvatar name={teamData.tdm.name} avatar={teamData.tdm.avatar} size="md" team={team} />
                        <div>
                          <div className="font-medium">{teamData.tdm.name}</div>
                          <div className="text-sm text-gray-600">Technical Account Manager</div>
                          {teamData.tdm.designation && (
                            <div className="text-xs text-gray-500">{teamData.tdm.designation}</div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white border rounded-lg flex items-start space-x-3">
                        <ProfileAvatar name={teamData.cxm.name} avatar={teamData.cxm.avatar} size="md" team={team} />
                        <div>
                          <div className="font-medium">{teamData.cxm.name}</div>
                          <div className="text-sm text-gray-600">Client Experience Manager</div>
                          {teamData.cxm.designation && (
                            <div className="text-xs text-gray-500">{teamData.cxm.designation}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Members */}
                    {teamData.members.map((member, idx) => (
                      <div key={idx} className="p-4 bg-white border rounded-lg flex items-start space-x-3">
                        <ProfileAvatar name={member.name} avatar={member.avatar} size="md" team={team} />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                          {member.designation && (
                            <div className="text-xs text-gray-500">{member.designation}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm uppercase text-gray-500 mb-4">Projects</h3>
                  
                  {(teamProjects.get(team)?.length || 0) === 0 ? (
                    <p className="text-gray-500 text-sm">No projects found for this team.</p>
                  ) : (
                    <div className="space-y-4">
                      {(teamProjects.get(team) || []).map(project => {
                        const isExpanded = expandedProject === project.id;
                        const isLeadTeam = project.team === team;
                        
                        // Count team members from this team
                        const teamMembersCount = project.teamMembers.filter(
                          member => extractTeamFromRole(member.role) === team
                        ).length;
                        
                        return (
                          <div key={project.id} className="border rounded-lg overflow-hidden">
                            <div 
                              className={`p-4 cursor-pointer hover:bg-gray-50 ${isLeadTeam ? 'border-l-4 border-l-blue-500' : ''}`}
                              onClick={() => toggleProject(project.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{project.name}</div>
                                  <div className="text-sm text-gray-600">{project.clientName}</div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  {isLeadTeam ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Lead Team</span>
                                  ) : (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Supporting Team</span>
                                  )}
                                  
                                  <span className="text-sm text-gray-500">{teamMembersCount} team members</span>
                                  
                                  <button className="text-gray-400">
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="p-4 bg-gray-50 border-t">
                                <div className="mb-4">
                                  <div className="flex items-center mb-2">
                                    <Calendar size={14} className="text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-600">
                                      {project.startDate} to {project.endDate}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{project.description}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Project Team</h4>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${teamColorClasses[project.team]}`}>
                                      {project.team} (Lead)
                                    </span>
                                    {Array.from(new Set(project.teamMembers
                                      .map(m => extractTeamFromRole(m.role))
                                      .filter(t => t && t !== project.team) as TeamName[]))
                                      .map(team => (
                                        <span key={team} className={`px-2 py-1 text-xs rounded-full ${teamColorClasses[team]}`}>
                                          {team}
                                        </span>
                                      ))
                                    }
                                  </div>
                                  
                                  <h4 className="text-sm font-medium mb-2">Team Members from {team}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {project.teamMembers
                                      .filter(member => extractTeamFromRole(member.role) === team)
                                      .map((member, idx) => {
                                        const baseRole = member.role.split('(')[0].trim();
                                        return (
                                          <div key={idx} className="flex items-center p-2 bg-white rounded border">
                                            <ProfileAvatar name={member.name} avatar={member.avatar} size="sm" team={team} />
                                            <div className="ml-3">
                                              <div className="font-medium text-sm">{member.name}</div>
                                              <div className="text-xs text-gray-500">{baseRole}</div>
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamCollaborationView;