import React, { useState, useEffect } from 'react';
import { teams } from '../data/teams';
import ProfileAvatar from '../components/ProfileAvatar';
import BadgeManagement from '../components/BadgeManagement';
import BadgeImage from '../components/BadgeImage';
import { Search, Filter, Award } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { fetchUserBadges } from '../data/supabaseBadges';
import { TeamMember, Role } from '../types/team';
import { fetchSkills, fetchLeaves, fetchPerformanceMetrics } from '../../../src/data/supabaseResource';
import { Skill, Leave, TeamMemberPerformance } from '../../../src/types/resource';

// Helper function to generate a deterministic ID from a name
const generateMemberId = (name: string, team: string, role: string) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '_');
  const cleanTeam = team.toLowerCase();
  const cleanRole = role.toLowerCase().replace(/\s+/g, '_');
  return `${cleanTeam}_${cleanName}_${cleanRole}`;
};

interface ExtendedTeamMember extends Omit<TeamMember, 'role'> {
  id: string;
  team: string;
  role: Role;
  isLeadership: boolean;
  designation?: string;
  avatar?: string;
}

function TeamMembers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<ExtendedTeamMember | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const { isAdmin } = useUser();
  const [memberBadges, setMemberBadges] = useState<Record<string, any[]>>({});
  
  // State for detailed profile data
  const [selectedMemberSkills, setSelectedMemberSkills] = useState<Skill[]>([]);
  const [selectedMemberLeaves, setSelectedMemberLeaves] = useState<Leave[]>([]);
  const [selectedMemberPerformance, setSelectedMemberPerformance] = useState<TeamMemberPerformance[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    loadAllMemberBadges();
  }, []);

  // Effect to load detailed profile data when a member is selected
  useEffect(() => {
    const loadMemberProfileData = async () => {
      if (selectedMember && selectedMember.id) {
        setProfileLoading(true);
        setProfileError(null);
        try {
          // Fetch skills
          const skills = await fetchSkills(selectedMember.id);
          setSelectedMemberSkills(skills);

          // Fetch leaves
          const leaves = await fetchLeaves(selectedMember.id);
          setSelectedMemberLeaves(leaves);

          // Fetch performance
          const performance = await fetchPerformanceMetrics(selectedMember.id);
          setSelectedMemberPerformance(performance);

        } catch (err: any) {
          console.error('Failed to fetch member profile data:', err);
          setProfileError('Failed to load profile data.' + (err?.message || JSON.stringify(err)));
        } finally {
          setProfileLoading(false);
        }
      } else {
        // Reset profile data when no member is selected
        setSelectedMemberSkills([]);
        setSelectedMemberLeaves([]);
        setSelectedMemberPerformance([]);
        setProfileError(null);
      }
    };

    loadMemberProfileData();
  }, [selectedMember]); // Re-run effect when selectedMember changes

  // Get all team members with generated IDs
  const allMembers = Object.entries(teams).flatMap(([teamKey, teamData]) => {
    const team = teamKey.toUpperCase();
    return [
      {
        ...teamData.sdm,
        id: teamData.sdm.id || generateMemberId(teamData.sdm.name, team, 'sdm'),
        team,
        role: 'Service Delivery Manager' as Role,
        isLeadership: true
      },
      {
        ...teamData.tdm,
        id: teamData.tdm.id || generateMemberId(teamData.tdm.name, team, 'tdm'),
        team,
        role: 'Technical Account Manager' as Role,
        isLeadership: true
      },
      {
        ...teamData.cxm,
        id: teamData.cxm.id || generateMemberId(teamData.cxm.name, team, 'cxm'),
        team,
        role: 'Client Experience Manager' as Role,
        isLeadership: true
      },
      ...teamData.members.map(member => ({
        ...member,
        id: member.id || generateMemberId(member.name, team, member.role),
        team,
        isLeadership: false
      }))
    ];
  });

  // Load badges for all members
  const loadAllMemberBadges = async () => {
    try {
      console.log('Loading badges for all members...');
      const badgePromises = allMembers.map(async (member) => {
        if (!member.id) {
          console.warn('Member has no ID:', member);
          return { memberId: '', badges: [] };
        }

        try {
          console.log('Fetching badges for member:', member.name, member.id);
          const badges = await fetchUserBadges(member.id);
          return { memberId: member.id, badges };
        } catch (error) {
          console.error(`Error loading badges for ${member.name}:`, error);
          return { memberId: member.id, badges: [] };
        }
      });

      const results = await Promise.all(badgePromises);
      const badgeMap: Record<string, any[]> = {};
      results.forEach(({ memberId, badges }) => {
        if (memberId && badges && Array.isArray(badges)) {
          badgeMap[memberId] = badges;
        } else {
          console.warn(`Invalid badges data for member ${memberId}:`, badges);
          badgeMap[memberId] = [];
        }
      });
      setMemberBadges(badgeMap);
    } catch (error) {
      console.error('Error in loadAllMemberBadges:', error);
    }
  };

  // Calculate days remaining for a badge
  const calculateDaysRemaining = (awardedDate: string, expiryDays: number) => {
    const awarded = new Date(awardedDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - awarded.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, expiryDays - diff);
  };

  // Filter members based on search and filters
  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = !selectedTeam || member.team === selectedTeam;
    const matchesRole = !selectedRole || member.role === selectedRole;
    return matchesSearch && matchesTeam && matchesRole;
  });

  // Get unique roles for filter
  const uniqueRoles = Array.from(new Set(allMembers.map(m => m.role)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-600">View and manage all team members across different teams</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or role..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTeam || ''}
            onChange={(e) => setSelectedTeam(e.target.value || null)}
          >
            <option value="">All Teams</option>
            <option value="TITAN">TITAN</option>
            <option value="NEXUS">NEXUS</option>
            <option value="ATHENA">ATHENA</option>
            <option value="DYNAMIX">DYNAMIX</option>
          </select>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRole || ''}
            onChange={(e) => setSelectedRole(e.target.value || null)}
          >
            <option value="">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer ${
              member.isLeadership ? 'border-blue-200' : 'border-gray-200'
            }`}
            onClick={() => setSelectedMember(member as ExtendedTeamMember)}
          >
            <div className="flex items-start space-x-4">
              <ProfileAvatar
                name={member.name}
                avatar={member.avatar}
                size="lg"
                team={member.team as any}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                {member.designation && (
                  <p className="text-xs text-gray-500 mt-1">{member.designation}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    member.team === 'TITAN' ? 'bg-blue-100 text-blue-800' :
                    member.team === 'NEXUS' ? 'bg-purple-100 text-purple-800' :
                    member.team === 'ATHENA' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {member.team}
                  </span>
                  {member.isLeadership && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Leadership
                    </span>
                  )}
                </div>
                
                {/* Badges Section */}
                {memberBadges[member.id]?.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Badges</span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {memberBadges[member.id].length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {memberBadges[member.id].map((badge: any) => (
                        <BadgeImage
                          key={badge.id}
                          name={badge.name}
                          daysRemaining={calculateDaysRemaining(badge.awarded_date, badge.expiry_days)}
                          awardedDate={badge.awarded_date}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Manage Badges Button (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(member as ExtendedTeamMember);
                      setShowBadgeModal(true);
                    }}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Award size={16} />
                    Manage Badges
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* User Profile Detail Section */}
      {selectedMember && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name} - Profile</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          {profileLoading && <div className="text-center text-gray-600">Loading profile details...</div>}
          {profileError && <div className="text-red-600">Error: {profileError}</div>}

          {!profileLoading && !profileError && (
            <div className="space-y-4">
              <div>
                <p><strong>Role:</strong> {selectedMember.role}</p>
                <p><strong>Team:</strong> {selectedMember.team}</p>
                {/* Add other basic details from selectedMember object if available */}
              </div>

              {/* Skills Section */}
              {selectedMemberSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
                  <ul className="list-disc list-inside">
                    {selectedMemberSkills.map((skill, index) => (
                      <li key={index}>{skill.name}</li> // Assuming skill object has a 'name' property
                    ))}
                  </ul>
                </div>
              )}

              {/* Leaves Section */}
              {selectedMemberLeaves.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave History</h3>
                  {/* Render leave history details here */}
                   <p className="text-sm text-gray-600">Leave history display coming soon...</p>
                </div>
              )}

              {/* Performance Section */}
              {selectedMemberPerformance.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Metrics</h3>
                   {/* Render performance metrics here */}
                  <p className="text-sm text-gray-600">Performance metrics display coming soon...</p>
                </div>
              )}

               {/* Message if no detailed data is available */}
              {selectedMemberSkills.length === 0 && selectedMemberLeaves.length === 0 && selectedMemberPerformance.length === 0 && (
                 <p className="text-gray-600 text-sm italic">No detailed profile data available for this member.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Badge Management Modal */}
      {showBadgeModal && selectedMember && (
        <BadgeManagement
          userId={selectedMember.id}
          userName={selectedMember.name}
          onClose={() => {
            setShowBadgeModal(false);
            setSelectedMember(null);
            loadAllMemberBadges(); // Refresh badges after modal closes
          }}
        />
      )}
    </div>
  );
}

export default TeamMembers; 