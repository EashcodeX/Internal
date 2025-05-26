import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { useLoading } from '../contexts/LoadingContext';

interface TimesheetProps {
  projects: Project[];
}

const Timesheet: React.FC<TimesheetProps> = ({ projects }) => {
  const { showLoading, hideLoading } = useLoading();
  const [timeEntries, setTimeEntries] = useState([]);
  const [viewMode, setViewMode] = useState('daily');
  const [displayMode, setDisplayMode] = useState('grid');

  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = async () => {
    showLoading();
    try {
      // Your time entries loading logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setTimeEntries([]);
    } catch (error) {
      console.error('Error loading time entries:', error);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Timesheet</h2>
        <div className="flex space-x-4">
          {/* View mode toggles */}
          <div className="flex rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'daily'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'weekly'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'monthly'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Display mode toggles */}
          <div className="flex rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`px-4 py-2 text-sm font-medium ${
                displayMode === 'grid'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              className={`px-4 py-2 text-sm font-medium ${
                displayMode === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setDisplayMode('compact')}
              className={`px-4 py-2 text-sm font-medium ${
                displayMode === 'compact'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {timeEntries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No time entries found. Start tracking your time!
          </div>
        ) : (
          <div>{/* Time entries display logic */}</div>
        )}
      </div>
    </div>
  );
};

export default Timesheet; 