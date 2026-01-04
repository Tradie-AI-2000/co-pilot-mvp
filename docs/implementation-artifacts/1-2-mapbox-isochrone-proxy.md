# Story 1.2: Mapbox Isochrone Proxy

Status: done

## Story

As a System,
I want a secure API route `/api/geo/isochrone`,
so that I can proxy requests to Mapbox without exposing API keys.

## Acceptance Criteria

1. API route `/api/geo/isochrone` exists and accepts `lat`, `lng`, and `minutes` query parameters.
2. The route proxies requests to the Mapbox Isochrone API.
3. The `MAPBOX_ACCESS_TOKEN` is retrieved from environment variables on the server.
4. Response is returned as a GeoJSON FeatureCollection.
5. Basic error handling for missing parameters or Mapbox API failures.
6. [Optional] Basic caching logic (can be simple in-memory for MVP if Redis/KV is not yet set up).

## Tasks / Subtasks

- [ ] Create `app/api/geo/isochrone/route.ts` (AC: 1)
- [ ] Implement GET handler with parameter validation (AC: 1, 5)
- [ ] Implement Mapbox API fetch logic (AC: 2, 3)
- [ ] Return GeoJSON response (AC: 4)
- [ ] Add basic caching (AC: 6)

## Dev Notes

- **Architecture**: Next.js App Router Route Handler.
- **Security**: Environment variable protection.
- **Performance**: Caching is critical for map performance and cost control.

### References

- [Source: docs/epics.md#Story 1.2: Mapbox Isochrone Proxy](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/epics.md#L113)
- [Source: docs/project-context.md#Critical Implementation Rules](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/project-context.md#L58)

## Dev Agent Record

### Context Reference

- [1-2-mapbox-isochrone-proxy.context.xml](file:///Users/joeward/Antigravity%20Projects/Co-Pilot/docs/implementation-artifacts/1-2-mapbox-isochrone-proxy.context.xml)

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

### File List
