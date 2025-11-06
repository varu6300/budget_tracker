# Budget Tracker - Personal Finance Management Application

## Overview
Budget Tracker is a full-stack personal finance management application built with React (Vite) frontend and Spring Boot backend, connected to PostgreSQL database. The application helps users track income, expenses, budgets, and visualize their financial data.

**Current State**: Fully functional with improved professional UI, real data integration, and feature-complete implementation of all four phases of the roadmap.

## Recent Changes (November 2025)

### Major Updates
- **UI/UX Overhaul**: Completely redesigned all pages with clean, professional styling
- **Layout Component**: Created unified Layout.jsx with consistent sidebar navigation and header across all authenticated pages
- **Dashboard Enhancement**: Added real-time data integration with summary cards (total balance, income, expenses), recent transactions, and budget status
- **Income/Expenses Pages**: Improved forms with categorized inputs, better validation, and history display
- **Budget Page**: Added progress bars, budget alerts (over budget warnings), and improved visual tracking
- **Analytics Page**: New page with monthly income vs expenses comparison charts and category-wise spending breakdown
- **Critical Bug Fixes**: 
  - Fixed Vite ESM imports requiring `.js` extensions for all API service imports
  - Fixed Spring Boot Page object handling (accessing `.content` property for paginated responses)
  - Configured Vite with `allowedHosts: true` for Replit proxy compatibility

### Architecture
- Frontend runs on port 5000 (required for Replit webview)
- Backend runs on port 8080
- PostgreSQL database configured via Replit environment variables

## Project Architecture

### Frontend Structure (`/frontend`)
```
src/
├── components/
│   └── Layout.jsx           # Unified layout with sidebar navigation
├── pages/
│   ├── Dashboard.jsx        # Main dashboard with summary cards
│   ├── Income.jsx           # Income tracking and history
│   ├── Expenses.jsx         # Expense tracking and history
│   ├── Budget.jsx           # Budget management with progress tracking
│   ├── Analytics.jsx        # Monthly comparisons & category breakdown
│   ├── Login.jsx            # User authentication
│   └── Signup.jsx           # User registration
├── services/
│   └── api.js              # Axios API client configuration
└── App.jsx                 # Main routing configuration
```

### Backend Structure (`/project1`)
- Spring Boot application with RESTful API
- Controllers for transactions, budgets, users
- JPA repositories for database operations
- PostgreSQL database integration

### Key Technologies
- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Spring Boot, JPA/Hibernate
- **Database**: PostgreSQL (Replit managed)
- **Styling**: Custom CSS with modern gradients and responsive design

## Technical Decisions & Implementation Details

### Vite Configuration
- **Critical**: `allowedHosts: true` required for Replit proxy
- Binding to `0.0.0.0:5000` for external accessibility
- ESM imports require explicit `.js` file extensions

### API Response Handling
- Backend returns Spring Page objects for paginated data
- Format: `{ content: [...], totalPages: N, totalElements: N }`
- Frontend must access `.content` property for array data
- Example: `response.data.content || []`

### Navigation Structure
- Dashboard: Summary overview with cards and recent activity
- Income: Add income transactions with categories
- Expenses: Add expense transactions with categories
- Budget: Set and track budgets by category
- Analytics: Visualize spending patterns and trends

### Data Flow
1. User interacts with forms in UI
2. API calls through axios client (`/frontend/src/services/api.js`)
3. Spring Boot backend processes requests
4. PostgreSQL stores/retrieves data
5. Frontend updates with real-time data

## User Preferences
- **Style**: Clean, professional UI with consistent styling
- **Approach**: Real data integration over mock data
- **Features**: Focus on practical financial management tools
- **Design**: Modern gradients, clear typography, intuitive layouts

## Project Roadmap Implementation Status

### Phase 1: User Authentication & Basic Setup ✅
- User registration and login
- JWT-based authentication
- Protected routes

### Phase 2: Transaction Tracking ✅
- Income and expense entry with categories
- Transaction history display
- Edit/delete functionality
- Real-time balance calculations

### Phase 3: Budgeting & Savings Goals ✅
- Budget creation by category
- Progress tracking with visual indicators
- Budget alerts (over budget, approaching limit)
- Monthly budget management

### Phase 4: Visualization & Analytics ✅
- Monthly income vs expenses comparison charts
- Category-wise spending breakdown
- Trend analysis with visual charts
- Financial insights dashboard

## Database Configuration
Uses Replit-managed PostgreSQL with environment variables:
- `DATABASE_URL`: Full connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Individual connection parameters

## Known Issues & Future Enhancements

### Recommended Improvements (from Architect Review)
1. Add defensive UI messaging for API errors/timeouts on analytics and budget pages
2. Test with large transaction datasets for performance
3. Implement user-friendly error messages when backend is unavailable

### Potential Enhancements
- Savings goals tracking
- Recurring transaction templates
- Export data to CSV/PDF
- Mobile responsive improvements
- Dark mode theme

## Development Notes

### Running the Application
1. Frontend: Configured in workflow to run `cd frontend && npm run dev`
2. Backend: Spring Boot application (requires manual start if not configured)
3. Database: Automatically connected via Replit environment variables

### Important Files
- `frontend/vite.config.js`: Vite configuration with allowedHosts
- `frontend/src/App.jsx`: Main routing configuration
- `frontend/src/components/Layout.jsx`: Unified layout component
- `project1/src/main/resources/application.properties`: Backend database config

### Code Conventions
- Use explicit `.js` extensions for all ES module imports
- Handle Spring Page objects by accessing `.content` property
- Consistent styling with gradient backgrounds and modern color palette
- Responsive design principles throughout

## Deployment Considerations
- Frontend must run on port 5000 for Replit webview
- Backend uses standard Spring Boot port configuration
- Database credentials managed through Replit environment
- Vite production build requires allowedHosts configuration

---

**Last Updated**: November 6, 2025
**Status**: Production-ready with professional UI and complete feature implementation
