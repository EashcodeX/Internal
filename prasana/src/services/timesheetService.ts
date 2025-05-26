import { supabase } from '../supabaseClient';
import { TimeEntry, TimeEntryForm, TimeEntrySummary } from '../types/timesheet';

export const timesheetService = {
    // Fetch time entries for the current user
    async getTimeEntries(startDate: string, endDate: string): Promise<TimeEntry[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log('No authenticated user found');
                return [];
            }

            console.log('Fetching entries for user:', user.id, 'date range:', { startDate, endDate });

            const { data, error } = await supabase
                .from('time_entries')
                .select(`
                    id,
                    user_id,
                    project_id,
                    project_name_text,
                    description,
                    start_time,
                    end_time,
                    duration,
                    date,
                    category,
                    tags,
                    created_at,
                    updated_at
                `)
                .eq('user_id', user.id)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            if (error) {
                console.error('Supabase query error:', error);
                throw error;
            }

            console.log('Raw data from Supabase:', data);

            // Transform the data to match the TimeEntry interface
            const transformedEntries: TimeEntry[] = (data || []).map(entry => {
                if (!entry) {
                    console.warn('Null entry found in data');
                    return null;
                }
                
                if (!('id' in entry) || !('user_id' in entry) || !('date' in entry)) {
                     console.warn('Entry missing required minimal fields:', entry);
                     return null;
                }

                const transformed = {
                    id: entry.id,
                    user_id: entry.user_id,
                    project_id: entry.project_id,
                    projectName: entry.project_name_text || (entry.project_id ? `Project ID: ${entry.project_id}` : 'Unknown Project'),
                    project_name_text: entry.project_name_text,
                    description: entry.description,
                    start_time: entry.start_time,
                    end_time: entry.end_time,
                    duration: entry.duration,
                    date: entry.date,
                    category: entry.category,
                    tags: entry.tags || [],
                    created_at: entry.created_at,
                    updated_at: entry.updated_at,
                } as TimeEntry;

                return transformed;
            }).filter((entry): entry is TimeEntry => entry !== null);

            console.log('Transformed entries:', transformedEntries);
            return transformedEntries;
        } catch (error) {
            console.error('Error in getTimeEntries:', error);
            return [];
        }
    },

    // Add a new time entry
    async addTimeEntry(entry: TimeEntryForm): Promise<TimeEntry> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            console.log('Creating time entry for user:', user.id);
            console.log('User-entered project name:', entry.projectId); // entry.projectId now holds the text name

            // --- Removed project lookup and creation logic ---
            // We will set project_id to null and save the text name.
            const projectIdToLink = null; // Always set project_id to null

            // Calculate start and end times based on duration
            const durationMinutes = entry.duration !== undefined ? entry.duration : (entry.hours * 60) + entry.minutes;
            const startTime = new Date(`${entry.date}T00:00:00Z`);
            const endTime = new Date(startTime.getTime() + durationMinutes * 60000); // Convert minutes to milliseconds

            // Format the data for Supabase
            const timeEntryData = {
                user_id: user.id,
                project_id: projectIdToLink, // Explicitly set to null
                project_name_text: entry.projectId, // Save the user-entered text here
                description: entry.description,
                date: entry.date,
                duration: durationMinutes,
                category: entry.category || null,
                tags: entry.tags || [],
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                created_at: new Date().toISOString()
            };

            console.log('Sending time entry data to Supabase:', timeEntryData);

            const { data, error } = await supabase
                .from('time_entries')
                .insert([timeEntryData])
                .select(`
                    id,
                    user_id,
                    project_id,
                    project_name_text,
                    description,
                    start_time,
                    end_time,
                    duration,
                    date,
                    category,
                    tags,
                    created_at,
                    updated_at
                `)
                .single();

            if (error) {
                console.error('Supabase error:', error);
                throw new Error(`Failed to create time entry: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned from Supabase');
            }

            // Transform the response to match TimeEntry interface
            const transformedEntry: TimeEntry = {
                id: data.id,
                user_id: data.user_id,
                project_id: data.project_id, // This will be null
                projectName: data.project_name_text || 'Unknown Project', // Use text name for frontend display
                project_name_text: data.project_name_text,
                description: data.description,
                start_time: data.start_time,
                end_time: data.end_time,
                duration: data.duration,
                date: data.date,
                category: data.category,
                tags: data.tags || [],
                created_at: data.created_at,
                updated_at: data.updated_at,
            };

            console.log('Time entry created successfully:', transformedEntry);
            return transformedEntry;
        } catch (error) {
            console.error('Error in addTimeEntry:', error);
            throw error;
        }
    },

    // Update an existing time entry
    async updateTimeEntry(id: string, entry: TimeEntryForm): Promise<TimeEntry> {
        try {
            const durationMinutes = (entry.hours * 60) + entry.minutes;
            const startTime = new Date(`${entry.date}T00:00:00Z`);
            const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

            const { data, error } = await supabase
                .from('time_entries')
                .update({
                    project_id: entry.projectId,
                    description: entry.description,
                    start_time: startTime.toISOString(),
                    end_time: endTime.toISOString(),
                    duration: durationMinutes,
                    date: entry.date,
                    category: entry.category || null,
                    tags: entry.tags || []
                })
                .eq('id', id)
                .select(`
                    *,
                    projects (
                        name
                    )
                `)
                .single();

            if (error) throw error;

            return {
                id: data.id,
                projectId: data.project_id,
                projectName: data.projects?.name || 'Unknown Project',
                description: data.description,
                startTime: data.start_time,
                endTime: data.end_time,
                duration: data.duration,
                date: data.date,
                userId: data.user_id,
                category: data.category,
                tags: data.tags || []
            };
        } catch (error) {
            console.error('Error in updateTimeEntry:', error);
            throw error;
        }
    },

    // Delete a time entry
    async deleteTimeEntry(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('time_entries')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error in deleteTimeEntry:', error);
            throw error;
        }
    },

    // Get time entry summary
    async getTimeEntrySummary(startDate: string, endDate: string): Promise<TimeEntrySummary> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
                .from('time_entries')
                .select('duration, project_id, category')
                .eq('user_id', user.id)
                .gte('date', startDate)
                .lte('date', endDate);

            if (error) throw error;

            const summary: TimeEntrySummary = {
                totalDuration: 0,
                entriesByProject: {},
                entriesByCategory: {}
            };

            data.forEach(entry => {
                summary.totalDuration += entry.duration;
                
                if (entry.project_id) {
                    summary.entriesByProject[entry.project_id] = 
                        (summary.entriesByProject[entry.project_id] || 0) + entry.duration;
                }
                
                if (entry.category) {
                    summary.entriesByCategory[entry.category] = 
                        (summary.entriesByCategory[entry.category] || 0) + entry.duration;
                }
            });

            return summary;
        } catch (error) {
            console.error('Error in getTimeEntrySummary:', error);
            throw error;
        }
    }
}; 