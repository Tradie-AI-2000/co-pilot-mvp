# Project Overview: Co-Pilot

Co-Pilot is a comprehensive labour hire management platform built with Next.js 16. It serves as a centralized hub for managing recruitment consultants, clients, candidates, and projects, specifically tailored for the construction and labour hire industry.

## Executive Summary
Co-Pilot integrates multiple data sources into a unified, visually rich dashboard. It provides consultants with actionable insights through a "Nudge Engine," geospatial mapping for candidate placement, and structured workflow management for construction projects.

## Tech Stack Summary
| Category | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | 16.0.8 |
| **Library** | React | 19.2.1 |
| **Language** | JavaScript/TypeScript | ESNext / TS |
| **Database** | Postgres (via Drizzle ORM) | 3.4.7 / 0.45.1 |
| **Mapping** | Leaflet / React Leaflet | 1.9.4 / 5.0.0 |
| **State** | React Context API | N/A |
| **Styling** | Tailwind CSS | 3.4.17 |
| **AI** | Google Generative AI | 0.24.1 |

## Architecture Type
Co-Pilot follows a **Monolithic Layered Architecture** using the Next.js App Router. It separates concerns into:
- **UI Layer**: React components and pages in the `app/` and `components/` directories.
- **State Layer**: React Context providers in `context/`.
- **Logic Layer**: Business logic and data manipulation in `services/`.
- **Data Layer**: API routes in `app/api/` and database schema/access in `lib/db/`.

## Key Features
- **Nudge Engine**: Proactive alerts for consultants (Churn Interceptor, Zombie Hunter, etc.).
- **Geospatial Mapping**: Visualizing project locations and candidate proximity using Leaflet.
- **Client & Project Management**: Tier-based client boards and detailed project timelines.
- **External Integration**: Bi-directional sync with Google Sheets and JobAdder API.
- **Agent Integration**: Built-in support for AI agents to interact with the platform.

## Documentation Navigation
- For a complete list of all documentation, please refer to the [Master Documentation Index](./index.md).

---
*Generated on: 2026-01-26*
