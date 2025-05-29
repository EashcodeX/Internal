import React from 'react';
import { Briefcase, Users } from 'lucide-react'; // Removed BarChart3 icon as it's not needed for Avg Team Size card
import { Project } from '../types'; // Only import Project type from ../types
import { teams } from '../data/teams'; // Correct import path
// Do not import Teams or TeamMember from ../types/team here

// Import recharts components
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6384', '#36A2EB', '#FFCE56'];

// Define a new type that matches the structure of team members in teams.ts
interface CompanyTeamMember {
  name: string;
  role: string;
  designation?: string; // Optional property based on teams.ts structure
  avatar?: string;
  uuid?: string; // uuid is optional in teams.ts
}

interface AnalyticsSectionProps {
  projects: Project[]; // Use the specific Project type
  currentPage: string; // Use PageType if imported
}

// Helper to flatten all team members from the teams data
const getAllCompanyTeamMembers = (): CompanyTeamMember[] => {
  const all: CompanyTeamMember[] = [];
  Object.values(teams).forEach(team => {
    // Cast team members to the new CompanyTeamMember type during extraction
    if (team.sdm) all.push(team.sdm as CompanyTeamMember);
    if (team.tdm) all.push(team.tdm as CompanyTeamMember);
    if (team.cxm) all.push(team.cxm as CompanyTeamMember);
    if (team.members && Array.isArray(team.members)) {
      team.members.forEach(m => all.push(m as CompanyTeamMember));
    }
  });
  // Filter out duplicates by uuid if available, otherwise by name
  const uniqueMembers = all.reduce((acc: CompanyTeamMember[], currentMember) => {
    const isDuplicate = acc.some(member => 
      (member.uuid && currentMember.uuid && member.uuid === currentMember.uuid) ||
      (!member.uuid && !currentMember.uuid && member.name === currentMember.name)
    );
    if (!isDuplicate) {
      acc.push(currentMember);
    }
    return acc;
  }, []);
  return uniqueMembers;
};

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ projects, currentPage }) => {
  
  const totalProjects = projects.length;

  // Use the total unique members from the company teams data
  const allCompanyMembers = getAllCompanyTeamMembers();
  const totalUniqueMembers = allCompanyMembers.length;

  // Calculate data for Projects by Team chart
  const teamStats = projects.reduce((acc: { [key: string]: number }, project) => {
    acc[project.team] = (acc[project.team] || 0) + 1;
    return acc;
  }, {});
  const teamData = Object.entries(teamStats).map(([name, value]) => ({ name, value }));

  // Calculate data for Projects by Category chart
  const categoryStats = projects.reduce((acc: { [key: string]: number }, project) => {
    acc[project.clientCategory] = (acc[project.clientCategory] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Analytics Overview</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Total Projects Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Projects</h3>
            <Briefcase className="text-blue-600" size={28} />
          </div>
          <p className="text-4xl font-bold text-blue-700">{totalProjects}</p>
          <p className="text-sm text-gray-600 mt-2">Active and completed projects</p>
        </div>

        {/* Team Members Card (Company-wide) */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Company Members</h3>
            <Users className="text-green-600" size={28} />
          </div>
          <p className="text-4xl font-bold text-green-700">{totalUniqueMembers}</p>
          <p className="text-sm text-gray-600 mt-2">Across all teams</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Projects by Team Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"> {/* Chart container styling */}
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Projects by Team</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {teamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Category Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"> {/* Chart container styling */}
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Projects by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Removed Placeholder for more analytics */}
    </div>
  );
};

export default AnalyticsSection; 