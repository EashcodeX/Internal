import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import { teams } from '../data/teams';
import { TeamMember } from '../types/team';
import { timesheetService } from '../services/timesheetService';
import { TimeEntry } from '../types/timesheet';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../supabaseClient';

// Helper to get Monday of the current week
function getMonday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}
// Helper to get Sunday of the current week
function getSunday(d: Date) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + 7;
  return new Date(d.setDate(diff));
}

// Flatten all team members (sdm, tdm, cxm, members) from all teams
const getAllTeamMembers = (): TeamMember[] => {
  const all: TeamMember[] = [];
  Object.values(teams).forEach(team => {
    if (team.sdm) all.push({ ...team.sdm, team: team.name });
    if (team.tdm) all.push({ ...team.tdm, team: team.name });
    if (team.cxm) all.push({ ...team.cxm, team: team.name });
    if (team.members && Array.isArray(team.members)) {
      team.members.forEach(m => all.push({ ...m, team: team.name }));
    }
  });
  return all;
};

const EmployeeManagement: React.FC = () => {
  const [memberHours, setMemberHours] = useState<{ [uuid: string]: number }>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [nameFilter, setNameFilter] = useState<string>('');
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allMembers = getAllTeamMembers();
      setTeamMembers(allMembers);
      // Get current week's Monday and Sunday
      const now = new Date();
      const monday = getMonday(now);
      const sunday = getSunday(now);
      const startDate = monday.toISOString().slice(0, 10);
      const endDate = sunday.toISOString().slice(0, 10);
      setWeekRange({ start: startDate, end: endDate });
      // Fetch ALL time entries for this week (all users)
      const entries: TimeEntry[] = await timesheetService.getAllTimeEntries(startDate, endDate);
      // Debug logs
      console.log('Fetched time entries:', entries);
      console.log('Team members:', allMembers);
      // Aggregate hours for each member by user_id (UUID)
      const hours: { [uuid: string]: number } = {};
      entries.forEach(entry => {
        hours[entry.user_id] = (hours[entry.user_id] || 0) + entry.duration;
      });
      console.log('Aggregated hours:', hours);
      setMemberHours(hours);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update the filteredMembers logic to include the new filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesTeam = !teamFilter || member.team === teamFilter;
    const matchesName = !nameFilter || member.name.toLowerCase().includes(nameFilter.toLowerCase());
    return matchesTeam && matchesName;
  });

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Management</h2>
      <div className="mb-6 text-sm text-gray-600 border-b pb-4">
        Showing <span className="font-semibold text-blue-700">current week</span> hours: <span className="font-mono">{weekRange.start}</span> to <span className="font-mono">{weekRange.end}</span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mb-8 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Team</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="">All Teams</option>
              {Array.from(new Set(teamMembers.map(m => m.team))).map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map(member => {
            const key = member.uuid || member.name;
            return (
              <div
                key={member.name + member.team}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transition-all duration-500 ease-in-out hover:shadow-xl border border-gray-100 hover:border-blue-200"
              >
                <ProfileAvatar name={member.name} avatar={member.avatar} size="lg" />
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                    {member.name}
                    {member.team && (
                      <img 
                        src={`/profiles/${member.team.toLowerCase()}.png`}
                        alt={`${member.team} Logo`}
                        className="w-5 h-5 ml-2 object-contain"
                      />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{member.role}</div>
                  <div className="mt-2">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-base shadow-sm">
                      {((memberHours[key] || 0) / 60).toFixed(1)} hrs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Performance & Analytics</h2>
        <div className="mb-6 text-sm text-gray-600">
          Showing total hours per user for the current week: <span className="font-mono">{weekRange.start}</span> to <span className="font-mono">{weekRange.end}</span>
        </div>
        <div className="h-64 flex items-end justify-around border-b border-l border-gray-300 py-2">
          {filteredMembers.map(member => {
            const key = member.uuid || member.name;
            const hours = (memberHours[key] || 0) / 60;
            const maxHours = Math.max(...filteredMembers.map(m => (memberHours[m.uuid || m.name] || 0) / 60));
            const barHeight = maxHours > 0 ? (hours / maxHours) * 100 : 0;
            return (
              <div key={member.name + member.team} className="flex flex-col items-center mx-2 w-12 group cursor-help">
                <div
                  className="w-full rounded-t-lg bg-blue-600 flex items-end justify-center transition-all duration-300 group-hover:bg-blue-700"
                  style={{ height: `${barHeight}%`, minHeight: '4px' }}
                  title={`${hours.toFixed(1)} hrs`}
                >
                  {hours > 0 && (
                    <span className="text-xs text-white font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{hours.toFixed(1)}</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-700 text-center truncate w-full" title={member.name}>{member.name}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          Top Performer: {(() => {
            const topUser = Object.entries(memberHours).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0]);
            const topMember = filteredMembers.find(m => (m.uuid || m.name) === topUser[0]);
            return topMember ? `${topMember.name} (${(topUser[1] / 60).toFixed(1)} hrs)` : 'None';
          })()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement; 