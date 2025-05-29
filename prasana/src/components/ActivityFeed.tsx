import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, fetchActivities } from '../data/supabaseActivities';
import { Bell, CheckCircle, FileText, Users, Clock, Award, AlertCircle } from 'lucide-react';

interface ActivityFeedProps {
  limit?: number;
  entityType?: 'project' | 'task' | 'team' | 'time_entry' | 'badge';
  entityId?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  limit = 10,
  entityType,
  entityId
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await fetchActivities(limit, entityType, entityId);
      setActivities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [limit, entityType, entityId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadActivities();
    setIsRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created':
      case 'project_updated':
      case 'project_deleted':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'member_added':
      case 'member_removed':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'time_entry_added':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'badge_awarded':
        return <Award className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project_created':
      case 'project_updated':
      case 'project_deleted':
        return 'bg-blue-50 border-blue-100';
      case 'task_created':
      case 'task_updated':
      case 'task_completed':
        return 'bg-green-50 border-green-100';
      case 'member_added':
      case 'member_removed':
        return 'bg-purple-50 border-purple-100';
      case 'time_entry_added':
        return 'bg-amber-50 border-amber-100';
      case 'badge_awarded':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const formatActivityMessage = (activity: Activity) => {
    const details = activity.details || {};

    switch (activity.type) {
      case 'project_created':
        return `Created project "${details.name || 'Unknown'}"`;
      case 'project_updated':
        return `Updated project "${details.name || 'Unknown'}"`;
      case 'project_deleted':
        return `Deleted project "${details.name || 'Unknown'}"`;
      case 'task_created':
        return `Created task "${details.title || 'Unknown'}"`;
      case 'task_updated':
        return `Updated task "${details.title || 'Unknown'}"`;
      case 'task_completed':
        return `Completed task "${details.title || 'Unknown'}"`;
      case 'member_added':
        return `Added ${details.memberName || 'a member'} to the team`;
      case 'member_removed':
        return `Removed ${details.memberName || 'a member'} from the team`;
      case 'time_entry_added':
        return `Logged ${details.duration || 0} minutes`;
      case 'badge_awarded':
        return `Awarded ${details.badgeName || 'a badge'} to ${details.memberName || 'a member'}`;
      default:
        return 'Performed an action';
    }
  };

  if (loading && !isRefreshing) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="bg-gray-50 rounded-lg border border-gray-100 p-8">
          <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No recent activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-500">Recent Activities</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
        >
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`group flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full border shadow-sm">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                {formatActivityMessage(activity)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 