import { supabase } from '../supabaseClient';

export interface Activity {
  id: string;
  type: string;
  actor_id: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  created_at: string;
}

export type ActivityType = 
  | 'project_created'
  | 'project_updated'
  | 'project_deleted'
  | 'task_created'
  | 'task_updated'
  | 'task_completed'
  | 'member_added'
  | 'member_removed'
  | 'time_entry_added'
  | 'badge_awarded';

export type EntityType = 'project' | 'task' | 'team' | 'time_entry' | 'badge';

// Fetch recent activities with optional filters
export const fetchActivities = async (
  limit: number = 50,
  entityType?: EntityType,
  entityId?: string
): Promise<Activity[]> => {
  let query = supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  if (entityId) {
    query = query.eq('entity_id', entityId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Create a new activity
export const createActivity = async (
  type: ActivityType,
  actorId: string,
  entityType: EntityType,
  entityId: string,
  details?: Record<string, any>
): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .insert([{
      type,
      actor_id: actorId,
      entity_type: entityType,
      entity_id: entityId,
      details
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete an activity (admin only)
export const deleteActivity = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 