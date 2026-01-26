# Development Guide: Co-Pilot

Welcome to the Co-Pilot development team! This guide will help you get your local environment set up and explain the core development patterns.

## Prerequisites
- **Node.js**: v18 or later (v20+ recommended)
- **Database**: PostgreSQL instance (local or remote)
- **API Keys**: (Required for full functionality)
  - Google Cloud Console (Sheets API)
  - JobAdder API Credentials
  - Google Gemini API Key

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   DATABASE_URL=postgres://user:pass@localhost:5432/co-pilot
   GOOGLE_SHEETS_ID=your_id
   GOOGLE_CLIENT_EMAIL=your_email
   GOOGLE_PRIVATE_KEY=your_key
   GEMINI_API_KEY=your_key
   ```

3. **Database Migration**:
   ```bash
   npx drizzle-kit push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Common Development Commands
- `npm run dev`: Start Next.js in development mode.
- `npm run build`: Build the production application.
- `npm run lint`: Run ESLint for code quality checks.
- `npx drizzle-kit studio`: Visual explorer for your local database.

## Development Patterns

### 1. Adding a New Component
Place reusable components in `/components`. Use the "use client" directive if the component requires state, effects, or browser APIs (like Leaflet).

### 2. Modifying the Database
1. Update `lib/db/schema.ts`.
2. Run `npx drizzle-kit push` to sync changes to your local DB.
3. Update relevant services in `/services`.

### 3. Creating a New API Endpoint
Add a `route.js` (or `route.ts`) file within a subfolder of `app/api/`. Use the Next.js `NextResponse` for consistency.

### 4. Working with Maps
Use the components in `components/` that utilize `react-leaflet`. Ensure you are familiar with the Leaflet API for custom marker or layer logic.

## Testing
Currently, the project focuses on manual verification and integration testing via scripts in `/scripts`. Unit testing framework setup is pending.