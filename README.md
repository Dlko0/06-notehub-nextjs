# NoteHub Next.js

NoteHub is a notes application built with the Next.js App Router, TypeScript, CSS Modules, Axios, and TanStack Query. The notes list and note details are server-prefetched and hydrated into their client components.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_NOTEHUB_TOKEN` to your NoteHub API token.
3. Run `npm run dev` and open `http://localhost:3000`.

Run `npm run build` to create a production build and `npm start` to serve it locally.

## Vercel

Import the `06-notehub-nextjs` repository into Vercel. Add `NEXT_PUBLIC_NOTEHUB_TOKEN` in the project's environment variables for the Production, Preview, and Development environments, then deploy. Confirm the home page, notes list, note creation, search, deletion, and note details work on the deployed URL.
