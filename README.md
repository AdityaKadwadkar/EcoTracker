## EcoTrack

EcoTrack is a sustainability management dashboard that follows your environmental footprint across energy, water, and waste. It features Google OAuth authentication backed by an Express + PostgreSQL API. The frontend is a modern Vite + React + shadcn-ui experience, while the backend manages secure sessions, user profiles, and AI-driven efficiency insights.

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Google Cloud project with OAuth 2.0 Web Client credentials

### Environment variables

Create an `.env` file in the project root (for the frontend) with:

```
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Backend secrets live under `server/.env`; see `server/README.md` for the full list.

### Setup

1. Start the backend:

```bash
cd server
npm install
npm run dev   # http://localhost:4000
```

2. Start the frontend:

```bash
npm install
npm run dev   # http://localhost:5173
```

Visit `http://localhost:5173` and sign in with Google to start tracking.

### Tech stack

- React 18 with TypeScript and Vite
- shadcn-ui + Tailwind CSS
- Express 4, Passport.js, Google OAuth 2.0
- PostgreSQL with `connect-pg-simple` session store
- Supabase for data persistence and Edge Functions

### Key features

- Google-based single-click authentication
- Secure session cookies stored in PostgreSQL
- Resource consumption logging (Energy, Water, Waste)
- AI Efficiency Optimization advisor
- Sustainability Analytics dashboard
- Protected routes restricted to signed-in users
