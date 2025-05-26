import React, { useState, useEffect } from 'react';
import { Project, TeamMember } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Users, Briefcase, Award } from 'lucide-react';
import { fetchUserBadges } from '../data/supabaseBadges';
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Extract all unique team members from projects
  const allMembers = projects.reduce((acc: TeamMember[], project) => {
    project.teamMembers.forEach(member => {
      if (!acc.find(m => m.id === member.id)) {
        acc.push(member);
      }
    });
    return acc;
  }, []);

  useEffect(() => {
    // Simulate loading for demo purposes
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Function to refresh analytics data
  const refreshAnalytics = () => {
    setRefreshKey(prev => prev + 1);
    setLoading(true);
  };

  const renderOverviewTab = () => {
    // ... existing code ...
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