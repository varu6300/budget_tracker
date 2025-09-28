# Project1 Frontend (React + Vite)

## Scripts

- `npm install` - install dependencies
- `npm run dev` - start dev server (http://localhost:5173)
- `npm run build` - production build
- `npm run preview` - preview production build

## Environment
Create a `.env` (copy `.env.example`) if you need to point to a non-default backend:
```
VITE_API_BASE=http://localhost:8080
```

## Auth Flow
- POST `/api/auth/login` with `{username,password}` -> store token
- Token automatically attached via axios interceptor
- Protected route `/dashboard` calls `/api/user/summary` to show Current Balance / Income / Expenses
- Sign out clears token & returns to login page

## Folder Structure
```
frontend/
  src/
    auth/            # auth context
    pages/           # Landing, Login, Signup, Dashboard
    services/        # axios instance
    App.jsx
    main.jsx
    styles.css
```

## Landing & Dashboard
Landing page replicates reference hero (gradient, two feature cards). Dashboard shows KPI cards and two panels (Latest Transactions placeholder & Amount Transfer rings). Replace placeholders later with real data & charts.

## Integration Notes
During dev the Vite dev server proxies `/api` to `http://localhost:8080` so CORS isn't an issue.
In production you can build and either:
1. Serve the `dist/` folder with any static server (and configure reverse proxy to backend), or
2. Copy `dist` output into Spring Boot `src/main/resources/static` and let Boot serve it (then remove old static html files).
