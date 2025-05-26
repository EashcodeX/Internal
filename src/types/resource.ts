import { TeamName } from './index';
import { TeamMember } from './team';

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
}

export interface Availability {
    memberId: string;
    startDate: string;
    endDate: string;
    status: 'available' | 'unavailable' | 'partial';
    notes?: string;
}

export interface ResourceAllocation {
    memberId: string;
    projectId: string;
    startDate: string;
    endDate: string;
    allocationPercentage: number;
    role: string;
}

export interface Leave {
    id: string;
    memberId: string;
    startDate: string;
    endDate: string;
    type: 'Annual' | 'Sick' | 'Personal' | 'Training' | 'Other';
    status: 'Pending' | 'Approved' | 'Rejected';
    reason?: string;
}

export interface TeamMemberPerformance {
    memberId: string;
    period: string; // e.g., "2024-03" for March 2024
    metrics: {
        projectsCompleted: number;
        tasksCompleted: number;
        onTimeDelivery: number; // percentage
        clientSatisfaction: number; // 1-5
        teamCollaboration: number; // 1-5
        skillProgress: number; // percentage of skill improvement
    };
    feedback: {
        strengths: string[];
        areasForImprovement: string[];
        recommendations: string[];
    };
}

export interface WorkloadMetrics {
    memberId: string;
    currentLoad: number;
    upcomingLoad: number;
    projectCount: number;
    taskCount: number;
    deadlinesPending: number;
} 