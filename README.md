# Technosprint Project Dashboard

## Overview
Technosprint Project Dashboard is a comprehensive project management system built with React, TypeScript, and Vite. It features a modern UI powered by Tailwind CSS with a refined premium color palette and integrates with Supabase for data management. The application provides various views and tools for managing projects, teams, resources, and analytics.

## Features

### 1. Project Management
- Multiple view modes (Grid, List, Kanban)
- Project creation and editing
- Detailed project information (including company logo)
- Status tracking
- Client management
- Team member assignment and removal

### 2. Employee Management
- Track hours worked (aggregated weekly)
- View team members from company data
- Basic employee overview

### 3. Team Collaboration
- Resource allocation (partially implemented)
- Leave management system (fetching logic exists)
- Badge management system (fetching logic exists)
- Detailed user profiles (in progress, enhancing TeamMembers page)

### 4. Time Tracking
- Timesheet management
- Time tracking per project
- Resource utilization tracking (basic aggregation)

### 5. Analytics
- Project metrics (Total Projects, Projects by Team/Category)
- Company-wide team metrics (Total Team Members)
- Visual data representation using Recharts
- Note: Some analytics features are in progress or have been adjusted based on requirements.

### 6. Notifications and Activity Feed
- Displays recent activities (project created, updated, deleted)
- Backend table and fetching logic implemented
- Frontend component with basic formatting and real-time (polling) updates

### 7. Administrative Features
- Admin dashboard
- User role management
- Project access control
- System configuration

## Tech Stack

### Frontend
- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- Tailwind CSS 4.1.7
- Lucide React (for icons)
- Recharts (for analytics visualizations)
- date-fns (for date formatting)

### Backend
- Supabase (Database and Authentication)
- Custom SQL triggers and functions for data synchronization

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Application header
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── ProjectGrid.tsx  # Grid view for projects
│   ├── ProjectList.tsx  # List view for projects
│   ├── KanbanBoard.tsx  # Kanban view for projects
│   ├── ActivityFeed.tsx # Displays recent activities
│   └── ...
├── contexts/            # React context providers
├── data/               # Data management and API calls (e.g., supabaseProjects.ts, supabaseActivities.ts)
├── pages/              # Main application pages (e.g., TeamMembers.tsx)
├── services/           # Service layer for backend interactions (e.g., timesheetService.ts)
├── styles/             # CSS and styling files
├── types/              # TypeScript type definitions (e.g., types/timesheet.ts)
└── App.tsx             # Main application component (handles routing and state)
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase configuration:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Key Components

### App.tsx
The main application component that handles:
- View mode management (Grid/List/Kanban)
- Project filtering
- Page routing
- Global state management
- User authentication
- Integrates key sections like Employee Management, Projects, Timesheet, Analytics, and Activity Feed.

### Employee Management (EmployeeManagement.tsx)
- Component for viewing and tracking employee hours.
- Fetches aggregated time entries from Supabase.
- Displays team members based on company data.

### Analytics Section (AnalyticsSection.tsx)
- Displays key metrics and charts for projects and team members.
- Uses Recharts for visualizations.
- Metrics include Total Projects, Projects by Team/Category, and Total Team Members.

### Project Views (ProjectGrid.tsx, ProjectList.tsx, KanbanBoard.tsx, ProjectDetail.tsx)
- Components for displaying projects in different layouts.
- ProjectDetail.tsx shows comprehensive information, including team members.
- Milestones feature has been removed from these views.

### Timesheet (Timesheet.tsx)
- Component for managing time entries.
- Allows adding, editing, and deleting time entries.
- Provides daily, weekly, and monthly views.
- Includes filtering and export functionality.

### Team Members (pages/TeamMembers.tsx)
- Page for viewing team members.
- Work in progress to enhance this page with detailed user profiles (skills, leave, performance).

### Activity Feed (ActivityFeed.tsx)
- Component for displaying recent system activities.
- Fetches data from the new `activities` Supabase table.
- Provides a real-time view of project and other key actions.

## Ongoing UI/UX Refinement

- Applying a refined premium color palette using Tailwind CSS.
- Enhancing navigation and layout consistency across the application.
- Improving mobile responsiveness.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is private and proprietary. All rights reserved.
