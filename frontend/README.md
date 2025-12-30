# PrepAI Simplified

PrepAI is a lightweight, frontend-only mock interview companion. It focuses on repeatable drills, instant feedback, and polished UI without any backend dependencies.

## Tech Stack

- React 18 + TypeScript (Vite)
- Tailwind CSS
- React Router DOM
- Lucide React icons
- Recharts for the dashboard chart
- localStorage for persistence (`prepai_user`, `prepai_history`)

## Getting Started

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`) in a browser. Use the signup form to create a mock account; everything is stored locally so you can refresh without losing progress.

To create a production build:

```bash
npm run build
npm run preview
```

## Feature Overview

- **Mock authentication** with signup/login, guarded routes, and logout that clears localStorage.
- **Dashboard hub** showing key stats, last five scores bar chart, and quick actions.
- **Step-based mock interview** flow (select type → answer 5 questions → instant results + feedback + automatic history save).
- **History timeline** that lists every interview with detail view for feedback.
- **Resource library** of 15 curated cards with category filter.
- **Profile page** to edit name, inspect totals, and log out.

All screens are responsive down to 375 px, use consistent spacing, and pass basic form validation (required inputs, email format, minimum password length).

## Testing Checklist

- Sign up and log in with any email/password (stored locally).
- Complete an interview to see score + feedback and confirm it appears in History.
- Confirm dashboard stats/chart update once history exists.
- Filter Resources by category and reset to “All”.
- Update your name on the Profile page and log out to verify redirects.

There are no external APIs or background services; clearing browser storage resets the experience. Enjoy smooth drills! 
