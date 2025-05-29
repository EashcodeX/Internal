import { supabase } from '../../prasana/src/supabaseClient';
import { 
  Availability, 
  ResourceAllocation, 
  Skill, 
  Leave, 
  TeamMemberPerformance, 
  WorkloadMetrics 
} from '../types/resource';

// Fetch team member availabilities
export const fetchAvailabilities = async (team?: string): Promise<Availability[]> => {
  // Mock implementation - replace with actual Supabase call
  return [
    {
      memberId: '1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'available',
      notes: 'Fully available'
    }
  ];
};

// Update team member availability
export const updateAvailability = async (availability: Availability) => {
  const { data, error } = await supabase
    .from('availabilities')
    .upsert(availability)
    .select();
  
  if (error) throw error;
  return data[0] as Availability;
};

// Fetch resource allocations
export const fetchAllocations = async (team?: string): Promise<ResourceAllocation[]> => {
  // Mock implementation - replace with actual Supabase call
  return [
    {
      memberId: '1',
      projectId: '1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      allocationPercentage: 75,
      role: 'Developer'
    }
  ];
};

// Update resource allocation
export const updateAllocation = async (allocation: ResourceAllocation) => {
  const { data, error } = await supabase
    .from('resource_allocations')
    .upsert(allocation)
    .select();
  
  if (error) throw error;
  return data[0] as ResourceAllocation;
};

// Fetch team member skills
export const fetchSkills = async (memberId?: string) => {
  let query = supabase
    .from('skills')
    .select('*');
  
  if (memberId) {
    query = query.eq('member_id', memberId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Skill[];
};

// Update team member skill
export const updateSkill = async (skill: Skill) => {
  const { data, error } = await supabase
    .from('skills')
    .upsert(skill)
    .select();
  
  if (error) throw error;
  return data[0] as Skill;
};

// Fetch leave requests
export const fetchLeaves = async (memberId?: string, status?: string) => {
  let query = supabase
    .from('leaves')
    .select('*');
  
  if (memberId) {
    query = query.eq('member_id', memberId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as Leave[];
};

// Create/Update leave request
export const updateLeave = async (leave: Leave) => {
  const { data, error } = await supabase
    .from('leaves')
    .upsert(leave)
    .select();
  
  if (error) throw error;
  return data[0] as Leave;
};

// Fetch team member performance metrics
export const fetchPerformanceMetrics = async (memberId: string, period?: string) => {
  let query = supabase
    .from('performance_metrics')
    .select('*')
    .eq('member_id', memberId);
  
  if (period) {
    query = query.eq('period', period);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as TeamMemberPerformance[];
};

// Update performance metrics
export const updatePerformanceMetrics = async (metrics: TeamMemberPerformance) => {
  const { data, error } = await supabase
    .from('performance_metrics')
    .upsert(metrics)
    .select();
  
  if (error) throw error;
  return data[0] as TeamMemberPerformance;
};

// Calculate and fetch workload metrics
export const fetchWorkloadMetrics = async (memberId?: string) => {
  let query = supabase
    .from('workload_metrics')
    .select('*');
  
  if (memberId) {
    query = query.eq('member_id', memberId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as WorkloadMetrics[];
};

// Update workload metrics
export const updateWorkloadMetrics = async (metrics: WorkloadMetrics) => {
  const { data, error } = await supabase
    .from('workload_metrics')
    .upsert(metrics)
    .select();
  
  if (error) throw error;
  return data[0] as WorkloadMetrics;
}; 