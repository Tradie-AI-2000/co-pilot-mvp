# Story 1.1: Database Schema Migration

Status: done

## Story

As a Backend Developer,
I want to create the `crew_templates` and `placement_groups` tables,
so that we can persist the "Split Crew" data model.

## Acceptance Criteria

1. `crew_templates`, `crew_template_members`, `placement_groups`, and `placements` tables are defined in `lib/db/schema.ts`.
2. Tables use `snake_case` naming conventions for database fields.
3. Enums `placement_status` and `candidate_status` are correctly initialized.
4. Foreign keys correctly reference `candidates` and `projects` tables.
5. Inferred types from the Drizzle schema are exported from `@/types/db.ts`.

## Tasks / Subtasks

- [ ] Define `placement_status` and `candidate_status` enums (AC: 3)
- [ ] Implement `crew_templates` and `crew_template_members` tables (AC: 1, 2, 4)
- [ ] Implement `placement_groups` and `placements` tables (AC: 1, 2, 4)
- [ ] Create `@/types/db.ts` and export inferred Drizzle types (AC: 5)
- [ ] Visual verification of the generated schema.

## Dev Notes

- **Architecture Patterns**: Use Drizzle ORM with Supabase PostgreSQL. Follow the "Split Crew" model: `CrewTemplate` as the blueprint, `PlacementGroup` as the active record.
- **Naming Conventions**: DB: `snake_case`, Code: `camelCase`.
- **Component Boundaries**: Do not import database schemas directly into UI components; use exported types instead.

### Project Structure Notes

- **New Files**:
    - `lib/db/schema.ts`: Database definitions.
    - `types/db.ts`: Type exports.

### References

- [Source: docs/epics.md#Story 1.1: Database Schema Migration](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/epics.md#L98)
- [Source: docs/implementation-artifacts/tech-spec-epic-1.md#Detailed Design](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/implementation-artifacts/tech-spec-epic-1.md#L30)

## Dev Agent Record

### Context Reference

- [1-1-database-schema-migration.context.xml](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/implementation-artifacts/1-1-database-schema-migration.context.xml)

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

### File List
