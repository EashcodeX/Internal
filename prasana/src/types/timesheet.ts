export interface TimeEntry {
    id: string;
    user_id: string;
    project_id: string | null;
    projectName?: string;
    project_name_text?: string;
    description: string;
    start_time: string;
    end_time: string | null;
    duration: number;
    date: string;
    category?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface TimeEntryForm {
    projectId: string;
    description: string;
    date: string;
    hours: number;
    minutes: number;
    category?: string;
    tags?: string[];
}

export interface TimeEntrySummary {
    totalDuration: number;
    entriesByProject: {
        [key: string]: number;
    };
    entriesByCategory: {
        [key: string]: number;
    };
} 