import React, { useState, useEffect } from 'react';
import { Badge } from '../types/team';
import { useUser } from '../contexts/UserContext';
import { useLoading } from '../contexts/LoadingContext';
import { fetchBadges, fetchUserBadges, assignBadge, removeBadge } from '../data/supabaseBadges';

interface BadgeManagementProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onBadgeUpdate?: () => void;
}

const BadgeManagement: React.FC<BadgeManagementProps> = ({ userId, userName, onClose, onBadgeUpdate }) => {
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useUser();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      showLoading();
      const [badges, userBadgeAssignments] = await Promise.all([
        fetchBadges(),
        fetchUserBadges(userId)
      ]);
      setAvailableBadges(badges);
      setUserBadges(userBadgeAssignments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoading();
    }
  };

  const handleAssignBadge = async (badgeId: string) => {
    if (!isAdmin) return;
    try {
      showLoading();
      await assignBadge(userId, badgeId);
      await loadBadges();
      onBadgeUpdate?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoading();
    }
  };

  const handleRemoveBadge = async (assignmentId: string) => {
    if (!isAdmin) return;
    try {
      showLoading();
      await removeBadge(assignmentId);
      await loadBadges();
      onBadgeUpdate?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoading();
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Manage Badges for {userName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Available Badges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                    <button
                      onClick={() => handleAssignBadge(badge.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Assigned Badges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userBadges.map(assignment => (
                  <div
                    key={assignment.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium">{assignment.badge.name}</h4>
                      <p className="text-sm text-gray-500">
                        Awarded: {new Date(assignment.awarded_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveBadge(assignment.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeManagement; 