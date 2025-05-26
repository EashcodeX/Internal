import React, { useState, useEffect } from 'react';
import { Badge } from '../types/team';
import { useUser } from '../contexts/UserContext';
import {
  fetchBadges,
  createBadge,
  assignBadge,
  removeBadge,
  fetchUserBadges
} from '../data/supabaseBadges';
import { Plus, X } from 'lucide-react';

interface BadgeManagementProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

const BadgeManagement: React.FC<BadgeManagementProps> = ({ userId, userName, onClose }) => {
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useUser();

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const [badges, userBadgeAssignments] = await Promise.all([
        fetchBadges(),
        fetchUserBadges(userId)
      ]);
      setAvailableBadges(badges);
      setUserBadges(userBadgeAssignments);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBadge = async (badgeId: string) => {
    if (!isAdmin) return;
    try {
      await assignBadge(userId, badgeId);
      await loadBadges(); // Refresh the badges
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveBadge = async (assignmentId: string) => {
    if (!isAdmin) return;
    try {
      await removeBadge(assignmentId);
      await loadBadges(); // Refresh the badges
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateDaysRemaining = (awardedDate: string, expiryDays: number) => {
    const awarded = new Date(awardedDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - awarded.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, expiryDays - diff);
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Badges - {userName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Current Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userBadges.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={assignment.image}
                        alt={assignment.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{assignment.name}</h4>
                        <p className="text-sm text-gray-500">
                          {calculateDaysRemaining(assignment.awarded_date, assignment.expiry_days)} days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveBadge(assignment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Available Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                    <button
                      onClick={() => handleAssignBadge(badge.id)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                      disabled={userBadges.some(ub => ub.badge_id === badge.id)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeManagement; 