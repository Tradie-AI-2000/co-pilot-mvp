# Development Guide - Stellar Co-Pilot

## Prerequisites
- Node.js (Recommended: v18 or later)
- npm or yarn

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Start Production Server**
   ```bash
   npm run start
   ```

## Key Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts development server with hot-reloading |
| `npm run build` | Builds the application for production deployment |
| `npm run start` | Runs the built application |
| `npm run lint` | Runs ESLint to check for code quality issues |

## Project Standards
- **Framework**: Next.js (App Router)
- **Styling**: CSS Modules (e.g., `page.module.css`) and global CSS
- **State**: React Context API
- **Icons**: Lucide React
- **Maps**: Leaflet (via react-leaflet)
