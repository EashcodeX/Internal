# TIS - Project Management System

## Overview
TIS is a comprehensive project management system built with React, TypeScript, and Vite. It features a modern UI powered by Tailwind CSS and integrates with Supabase for data management. The application provides various views and tools for managing projects, teams, resources, and analytics.

## Features

### 1. Project Management
- Multiple view modes (Grid, List, Kanban)
- Project creation and editing
- Detailed project information
- Status tracking
- Client management

### 2. Team Collaboration
- Team member management
- Resource allocation
- Leave management system
- Badge management system
- Profile management

### 3. Time Tracking
- Timesheet management
- Time tracking per project
- Resource utilization tracking

### 4. Analytics
- Project performance metrics
- Team productivity analytics
- Resource utilization reports
- Visual data representation using Recharts

### 5. Administrative Features
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

### Backend
- Supabase (Database and Authentication)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Application header
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── ProjectGrid.tsx  # Grid view for projects
│   ├── ProjectList.tsx  # List view for projects
│   ├── KanbanBoard.tsx  # Kanban view for projects
│   └── ...
├── contexts/            # React context providers
├── data/               # Data management and API calls
├── pages/              # Main application pages
├── styles/             # CSS and styling files
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
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
- State management
- User authentication

### Resource Management
- Team allocation
- Resource scheduling
- Capacity planning
- Skill tracking

### Analytics Section
- Project metrics
- Team performance
- Resource utilization
- Custom reports

### Project Views
- Grid view for quick overview
- List view for detailed information
- Kanban board for status tracking
- Detailed project view for comprehensive information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is private and proprietary. All rights reserved.
