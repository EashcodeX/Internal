import React, { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Users, Briefcase, Award, Clock } from 'lucide-react';
import { TeamMember } from '../types/team';
import { Availability, ResourceAllocation, WorkloadMetrics, Skill } from '../types/resource';
import ProfileAvatar from './ProfileAvatar';
import LeaveManagement from './LeaveManagement';
import { fetchAvailabilities, fetchAllocations } from '../data/supabaseResource';
import { useLoading } from '../contexts/LoadingContext';

interface ResourceManagementProps {
  teamMembers: TeamMember[];
  currentTeam?: string;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ teamMembers, currentTeam }) => {
  const [selectedView, setSelectedView] = useState<'calendar' | 'allocation' | 'skills' | 'leave'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();
  
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [workloadMetrics, setWorkloadMetrics] = useState<WorkloadMetrics[]>([]);
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});

  useEffect(() => {
    const loadData = async () => {
      showLoading();
      try {
        const [availabilitiesData, allocationsData] = await Promise.all([
          fetchAvailabilities(currentTeam || undefined),
          fetchAllocations(currentTeam || undefined)
        ]);
        
        setAvailabilities(availabilitiesData);
        setAllocations(allocationsData);
        
        // Calculate workload metrics from allocations
        const metrics: WorkloadMetrics[] = teamMembers.map(member => {
          const memberAllocations = allocationsData.filter(a => a.memberId === member.id);
          const currentLoad = memberAllocations.reduce((sum, a) => sum + a.allocationPercentage, 0);
          const upcomingLoad = memberAllocations
            .filter(a => new Date(a.startDate) > new Date())
            .reduce((sum, a) => sum + a.allocationPercentage, 0);
          
          return {
            memberId: member.id,
            currentLoad,
            upcomingLoad,
            projectCount: memberAllocations.length,
            taskCount: 0, // This would need to be fetched from a tasks table
            deadlinesPending: 0 // This would need to be calculated from tasks
          };
        });
        
        setWorkloadMetrics(metrics);
      } catch (error) {
        console.error('Error loading resource management data:', error);
      } finally {
        hideLoading();
      }
    };
    
    loadData();
  }, [currentTeam, teamMembers]);

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  const renderAvailabilityCalendar = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Team Availability Calendar</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Team Member</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Current Project</th>
                <th className="py-2 px-4 text-left">Availability</th>
                <th className="py-2 px-4 text-left">Workload</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => {
                const memberWorkload = workloadMetrics.find(w => w.memberId === member.id);
                return (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar
                          name={member.name}
                          avatar={member.avatar}
                          size="sm"
                          team={currentTeam as any}
                        />
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{member.role}</td>
                    <td className="py-3 px-4">
                      {allocations
                        .filter(a => a.memberId === member.id)
                        .map(a => a.projectId)
                        .join(', ') || 'Not Assigned'}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getAvailabilityColor(
                          availabilities.find(a => 
                            a.memberId === member.id && 
                            new Date(a.startDate) <= new Date() && 
                            new Date(a.endDate) >= new Date()
                          )?.status
                        )}`}>
                        {getAvailabilityStatus(member.id)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${getWorkloadColor(memberWorkload?.currentLoad || 0)}`}
                          style={{ width: `${memberWorkload?.currentLoad || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">
                        {memberWorkload?.currentLoad || 0}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderResourceAllocation = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Resource Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => {
            const memberWorkload = workloadMetrics.find(w => w.memberId === member.id);
            const memberAllocations = allocations.filter(a => a.memberId === member.id);
            
            return (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <ProfileAvatar
                    name={member.name}
                    avatar={member.avatar}
                    size="md"
                    team={currentTeam as any}
                  />
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Workload</span>
                      <span className="font-medium">{memberWorkload?.currentLoad || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getWorkloadColor(memberWorkload?.currentLoad || 0)}`}
                        style={{ width: `${memberWorkload?.currentLoad || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Upcoming Workload</span>
                      <span className="font-medium">{memberWorkload?.upcomingLoad || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getWorkloadColor(memberWorkload?.upcomingLoad || 0)}`}
                        style={{ width: `${memberWorkload?.upcomingLoad || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h5 className="text-sm font-medium mb-2">Current Projects</h5>
                    {memberAllocations.length > 0 ? (
                      <div className="space-y-2">
                        {memberAllocations.map((allocation, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between">
                              <span>{allocation.projectId}</span>
                              <span>{allocation.allocationPercentage}%</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(allocation.startDate), 'MMM d')} - {format(new Date(allocation.endDate), 'MMM d, yyyy')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No current project allocations</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSkillMatrix = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Team Skills Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Team Member</th>
                <th className="py-2 px-4 text-left">Technical Skills</th>
                <th className="py-2 px-4 text-left">Soft Skills</th>
                <th className="py-2 px-4 text-left">Domain Knowledge</th>
                <th className="py-2 px-4 text-left">Tools & Technologies</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => {
                const memberSkills = skills[member.id] || [];
                const getSkillsByCategory = (category: string) => 
                  memberSkills
                    .filter(skill => skill.category === category)
                    .map(skill => (
                      <div key={skill.id} className="mb-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{skill.name}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full mx-0.5 ${
                                  i < skill.level ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ));

                return (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar
                          name={member.name}
                          avatar={member.avatar}
                          size="sm"
                          team={currentTeam as any}
                        />
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getSkillsByCategory('Technical')}</td>
                    <td className="py-3 px-4">{getSkillsByCategory('Soft')}</td>
                    <td className="py-3 px-4">{getSkillsByCategory('Domain')}</td>
                    <td className="py-3 px-4">{getSkillsByCategory('Tools')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper functions
  const getAvailabilityStatus = (memberId: string) => {
    const currentAvailability = availabilities.find(a => 
      a.memberId === memberId && 
      new Date(a.startDate) <= new Date() && 
      new Date(a.endDate) >= new Date()
    );
    return currentAvailability?.status || 'Available';
  };

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Partially Available':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkloadColor = (load: number) => {
    if (load >= 90) return 'bg-red-500';
    if (load >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setSelectedView('calendar')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedView === 'calendar' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar size={20} />
          <span>Availability Calendar</span>
        </button>
        <button
          onClick={() => setSelectedView('allocation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedView === 'allocation'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Briefcase size={20} />
          <span>Resource Allocation</span>
        </button>
        <button
          onClick={() => setSelectedView('skills')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedView === 'skills'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Award size={20} />
          <span>Skills Matrix</span>
        </button>
        <button
          onClick={() => setSelectedView('leave')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedView === 'leave'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock size={20} />
          <span>Leave Management</span>
        </button>
      </div>

      {selectedView === 'calendar' && renderAvailabilityCalendar()}
      {selectedView === 'allocation' && renderResourceAllocation()}
      {selectedView === 'skills' && renderSkillMatrix()}
      {selectedView === 'leave' && (
        <LeaveManagement 
          teamMembers={teamMembers}
          currentTeam={currentTeam}
        />
      )}
    </div>
  );
};

export default ResourceManagement; 