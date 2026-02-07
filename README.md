# Decision Maker

Starter webapp to help people make decisions by adding choices and casting numeric votes. Uses React + TypeScript (Vite), Zustand for local state, and Supabase for persistence. Deploy to Vercel.

Quick start

1. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install and run:

```bash
npm install
npm run dev
```

Database (Supabase)

Run the SQL in `supabase.sql` to create `choices` and `votes` tables in your Supabase project.

Deployment

Set the Vercel environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and deploy the project.
