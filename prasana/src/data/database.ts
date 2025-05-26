import { Task } from '../components/TaskList';
import { Project } from '../types';

// Type definition for our database collections
interface DatabaseCollections {
  tasks: Record<string, Task[]>;  // projectId -> tasks
  projects: Project[];
  // Add more collections as needed
}

// Default database state, useful if localStorage doesn't have data yet
const defaultDB: DatabaseCollections = {
  tasks: {},
  projects: []
};

class SimpleDatabase {
  private db: DatabaseCollections;
  private readonly storageKey = 'technosprint_db';

  constructor() {
    this.db = this.loadFromStorage() || { ...defaultDB };
    console.log('[Database] Initialized with data:', this.db);
  }

  // Load data from localStorage
  private loadFromStorage(): DatabaseCollections | null {
    try {
      console.log('[Database] Attempting to load from localStorage');
      const data = localStorage.getItem(this.storageKey);
      console.log('[Database] Raw data from localStorage:', data);
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[Database] Parsed data:', parsed);
        return parsed;
      }
      console.log('[Database] No data found in localStorage');
      return null;
    } catch (error) {
      console.error('[Database] Failed to load database from localStorage:', error);
      return null;
    }
  }

  // Save current state to localStorage
  private saveToStorage(): void {
    try {
      console.log('[Database] Saving to localStorage:', this.db);
      localStorage.setItem(this.storageKey, JSON.stringify(this.db));
      
      // Verify the save was successful by immediately reading back
      const savedData = localStorage.getItem(this.storageKey);
      const parsed = savedData ? JSON.parse(savedData) : null;
      console.log('[Database] Verification - Data saved to localStorage:', {
        projectsCount: parsed?.projects?.length || 0,
        hasData: !!savedData
      });
      
      console.log('[Database] Save successful');
    } catch (error) {
      console.error('[Database] Failed to save database to localStorage:', error);
    }
  }

  // Initialize database with initial data
  public initializeWithData(initialData: Partial<DatabaseCollections>): void {
    console.log('[Database] Initializing with data:', initialData);
    this.db = {
      ...defaultDB,
      ...initialData
    };
    this.saveToStorage();
  }

  // TASK OPERATIONS

  // Get all tasks for a project
  public getTasks(projectId: string): Task[] {
    return this.db.tasks[projectId] || [];
  }

  // Add a task to a project
  public addTask(projectId: string, task: Task): Task {
    console.log('[Database] Adding task to project:', projectId, task);
    if (!this.db.tasks[projectId]) {
      this.db.tasks[projectId] = [];
    }
    
    this.db.tasks[projectId].push(task);
    this.saveToStorage();
    return task;
  }

  // Update a task
  public updateTask(projectId: string, taskId: string, updates: Partial<Task>): Task | null {
    const tasks = this.db.tasks[projectId];
    if (!tasks) return null;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    this.saveToStorage();
    
    return updatedTask;
  }

  // Delete a task
  public deleteTask(projectId: string, taskId: string): boolean {
    const tasks = this.db.tasks[projectId];
    if (!tasks) return false;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;
    
    tasks.splice(taskIndex, 1);
    this.saveToStorage();
    
    return true;
  }

  // PROJECT OPERATIONS

  // Get all projects
  public getProjects(): Project[] {
    console.log('[Database] Getting all projects, count:', this.db.projects.length);
    return this.db.projects;
  }

  // Add a project
  public addProject(project: Project): Project {
    console.log('[Database] Adding project:', project);
    this.db.projects.push(project);
    this.saveToStorage();
    console.log('[Database] Project added, new count:', this.db.projects.length);
    return project;
  }

  // Update a project
  public updateProject(projectId: string, updates: Partial<Project>): Project | null {
    const projectIndex = this.db.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return null;
    
    const updatedProject = { ...this.db.projects[projectIndex], ...updates };
    this.db.projects[projectIndex] = updatedProject;
    this.saveToStorage();
    
    return updatedProject;
  }

  // Delete a project and its tasks
  public deleteProject(projectId: string): boolean {
    try {
      console.log('[Database] Attempting to delete project:', projectId);
      
      // Get current projects
      const currentProjects = [...this.db.projects];
      
      // Find the project to delete
      const projectIndex = currentProjects.findIndex(p => p.id === projectId);
      console.log('[Database] Found project at index:', projectIndex);
      
      if (projectIndex === -1) {
        console.log('[Database] Project not found with ID:', projectId);
        return false;
      }
      
      const projectToDelete = currentProjects[projectIndex];
      console.log('[Database] About to delete project:', projectToDelete.name);
      
      // Create a new projects array without the deleted project
      const updatedProjects = currentProjects.filter(p => p.id !== projectId);
      
      // Update database with new projects array
      this.db.projects = updatedProjects;
      
      console.log('[Database] Projects after deletion:', this.db.projects.length);
      
      // Clean up related tasks
      if (this.db.tasks[projectId]) {
        delete this.db.tasks[projectId];
        console.log('[Database] Related tasks removed');
      }
      
      // Save changes to localStorage
      this.saveToStorage();
      
      // Double-check that the project was removed
      const verifyDeletedProject = this.db.projects.find(p => p.id === projectId);
      if (verifyDeletedProject) {
        console.error('[Database] Failed to delete project - still found in database');
        return false;
      }
      
      console.log('[Database] Project deletion complete');
      return true;
    } catch (error) {
      console.error('[Database] Error in deleteProject:', error);
      return false;
    }
  }

  // UTILITY METHODS

  // Force refresh from localStorage (for recovery purposes)
  public forceRefresh(): void {
    try {
      console.log('[Database] Forcing refresh from localStorage');
      const data = localStorage.getItem(this.storageKey);
      
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[Database] Refreshed data from localStorage:', {
          projectsCount: parsed.projects.length,
          tasksCount: Object.keys(parsed.tasks).length
        });
        this.db = parsed;
      } else {
        console.log('[Database] No data found in localStorage during force refresh');
      }
    } catch (error) {
      console.error('[Database] Error during force refresh:', error);
    }
  }

  // Clear the entire database
  public clearDatabase(): void {
    console.log('[Database] Clearing database');
    this.db = { ...defaultDB };
    this.saveToStorage();
  }

  // Debug function to check localStorage directly
  public debugCheckStorage(): { raw: string | null, parsed: any | null } {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : null;
      console.log('[Database Debug] Direct localStorage check:', { raw, parsed });
      return { raw, parsed };
    } catch (error) {
      console.error('[Database Debug] Error checking localStorage:', error);
      return { raw: null, parsed: null };
    }
  }

  // Get database statistics
  public getStats(): { projectCount: number; taskCount: number } {
    const taskCount = Object.values(this.db.tasks).reduce((acc, tasks) => acc + tasks.length, 0);
    return {
      projectCount: this.db.projects.length,
      taskCount
    };
  }

  // Get full database state for debugging
  public getFullState(): DatabaseCollections {
    return this.db;
  }
}

// Create a single instance for the application
const database = new SimpleDatabase();

export default database; 