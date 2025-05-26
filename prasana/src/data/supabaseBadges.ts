import { supabase } from '../supabaseClient';
import { Badge } from '../types/team';

interface BadgeAssignment {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_date: string;
  expiry_days: number;
}

// Fetch all available badges
export async function fetchBadges() {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*');
    
    if (error) {
      console.error('Error fetching badges:', error);
      return []; // Return empty array instead of throwing
    }
    return data || [];
  } catch (error) {
    console.error('Exception in fetchBadges:', error);
    return []; // Return empty array instead of throwing
  }
}

// Fetch badges for a specific user
export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const { data: badgeAssignments, error: assignmentError } = await supabase
      .from('badge_assignments')
      .select(`
        id,
        badge_id,
        awarded_date,
        expiry_days,
        badges (
          id,
          code,
          name,
          description,
          image
        )
      `)
      .eq('user_id', userId);

    if (assignmentError) {
      console.error('Error fetching badge assignments:', assignmentError);
      return [];
    }

    return badgeAssignments.map(assignment => ({
      id: assignment.id,
      badge_id: assignment.badges.id,
      code: assignment.badges.code,
      name: assignment.badges.name,
      description: assignment.badges.description,
      image: assignment.badges.image,
      awarded_date: assignment.awarded_date,
      expiry_days: assignment.expiry_days
    }));
  } catch (error) {
    console.error('Error in fetchUserBadges:', error);
    return [];
  }
};

// Assign a badge to a user (admin only)
export async function assignBadge(userId: string, badgeId: string, expiryDays: number = 90) {
  try {
    const { data, error } = await supabase
      .from('badge_assignments')
      .insert([
        {
          user_id: userId,
          badge_id: badgeId,
          awarded_date: new Date().toISOString(),
          expiry_days: expiryDays
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error assigning badge:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Exception in assignBadge:', error);
    throw error;
  }
}

// Remove a badge from a user (admin only)
export async function removeBadge(assignmentId: string) {
  try {
    const { error } = await supabase
      .from('badge_assignments')
      .delete()
      .eq('id', assignmentId);
    
    if (error) {
      console.error('Error removing badge:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in removeBadge:', error);
    throw error;
  }
}

// Add a new badge type (admin only)
export async function createBadge(badge: Omit<Badge, 'id'>) {
  try {
    const id = badge.name.toLowerCase().replace(/\s+/g, '_');
    const { data, error } = await supabase
      .from('badges')
      .insert([{ ...badge, id }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating badge:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Exception in createBadge:', error);
    throw error;
  }
}

// Update a badge type (admin only)
export async function updateBadge(badgeId: string, updates: Partial<Badge>) {
  try {
    const { data, error } = await supabase
      .from('badges')
      .update(updates)
      .eq('id', badgeId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating badge:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Exception in updateBadge:', error);
    throw error;
  }
}

// Delete a badge type (admin only)
export async function deleteBadge(badgeId: string) {
  try {
    const { error } = await supabase
      .from('badges')
      .delete()
      .eq('id', badgeId);
    
    if (error) {
      console.error('Error deleting badge:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in deleteBadge:', error);
    throw error;
  }
} 