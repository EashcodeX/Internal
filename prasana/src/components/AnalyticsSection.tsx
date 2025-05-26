import React, { useState, useEffect } from 'react';
import { Project, TeamMember } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Users, Briefcase, Award } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

interface AnalyticsSectionProps {
  projects: Project[];
  currentPage?: 'dashboard' | 'analytics' | 'projects' | 'collaboration' | 'timesheet' | 'team-members';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ projects, currentPage = 'analytics' }) => {
  // Only render if we're on the analytics page
  if (currentPage !== 'analytics') {
    return null;
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demo purposes
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Extract all unique team members from projects
  const allMembers = projects.reduce((acc: TeamMember[], project) => {
    project.teamMembers.forEach(member => {
      if (!acc.find(m => m.id === member.id)) {
        acc.push(member);
      }
    });
    return acc;
  }, []);

  const renderOverviewTab = () => {
    const teamStats = projects.reduce((acc: { [key: string]: number }, project) => {
      acc[project.team] = (acc[project.team] || 0) + 1;
      return acc;
    }, {});

    const categoryStats = projects.reduce((acc: { [key: string]: number }, project) => {
      acc[project.clientCategory] = (acc[project.clientCategory] || 0) + 1;
      return acc;
    }, {});

    const teamData = Object.entries(teamStats).map(([name, value]) => ({ name, value }));
    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Projects</h3>
              <Briefcase className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
            <p className="text-sm text-gray-500 mt-2">Active and completed projects</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
              <Users className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-green-600">{allMembers.length}</p>
            <p className="text-sm text-gray-500 mt-2">Across all projects</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Avg Team Size</h3>
              <BarChart3 className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(projects.reduce((acc, p) => acc + p.teamMembers.length, 0) / projects.length)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Members per project</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
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

          <div className="bg-white rounded-lg p-6 shadow-sm">
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
      </div>
    );
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${
            activeTab === 'projects'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Project Details
        </button>
      </div>

      <div className="pt-4">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Project Analytics</h3>
            {/* TODO: Add detailed project analytics */}
            <p className="text-gray-500">Project analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSection;