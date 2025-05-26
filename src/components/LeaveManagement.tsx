import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Leave } from '../types/resource';
import { TeamMember } from '../types/team';
import { fetchLeaves, updateLeave } from '../data/supabaseResource';
import ProfileAvatar from './ProfileAvatar';
import { useUser } from '../contexts/UserContext';

interface LeaveManagementProps {
  teamMembers: TeamMember[];
  currentTeam?: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ teamMembers, currentTeam }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const { isAdmin, currentUser } = useUser();

  const [newLeave, setNewLeave] = useState<Partial<Leave>>({
    startDate: '',
    endDate: '',
    type: 'Annual',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const data = await fetchLeaves();
      setLeaves(data);
    } catch (error) {
      console.error('Error loading leaves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      const leaveData: Leave = {
        id: crypto.randomUUID(),
        memberId: currentUser.id,
        status: 'Pending',
        ...newLeave as Omit<Leave, 'id' | 'memberId' | 'status'>
      };

      await updateLeave(leaveData);
      await loadLeaves();
      setShowNewLeaveForm(false);
      setNewLeave({
        startDate: '',
        endDate: '',
        type: 'Annual',
        reason: ''
      });
    } catch (error) {
      console.error('Error submitting leave:', error);
    }
  };

  const handleApproveLeave = async (leave: Leave) => {
    try {
      await updateLeave({ ...leave, status: 'Approved' });
      await loadLeaves();
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (leave: Leave) => {
    try {
      await updateLeave({ ...leave, status: 'Rejected' });
      await loadLeaves();
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Leave Management</h3>
        <button
          onClick={() => setShowNewLeaveForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Request Leave
        </button>
      </div>

      {showNewLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Request Leave</h4>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  required
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as Leave['type'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal Leave</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  required
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewLeaveForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Employee</th>
                  <th className="py-3 px-4 text-left">Leave Type</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  {isAdmin && <th className="py-3 px-4 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => {
                  const member = teamMembers.find(m => m.id === leave.memberId);
                  return (
                    <tr key={leave.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <ProfileAvatar
                            name={member?.name || 'Unknown'}
                            avatar={member?.avatar}
                            size="sm"
                            team={currentTeam as any}
                          />
                          <span>{member?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{leave.type}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} className="text-gray-500" />
                          <span>
                            {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600 truncate max-w-xs" title={leave.reason}>
                          {leave.reason}
                        </p>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4">
                          {leave.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveLeave(leave)}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(leave)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement; 