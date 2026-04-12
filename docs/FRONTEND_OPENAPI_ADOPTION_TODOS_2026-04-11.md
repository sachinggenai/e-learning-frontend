# Frontend OpenAPI Adoption Todos (2026-04-11)

Scope: Frontend TPO review against backend contract at `GET /api/v1/openapi.json` and backend review outcomes in `docs/MVP_SIGNOFF_TODOS.md`.

## Executive Summary

Frontend is partly aligned to backend MVP fixes, but there were several contract drifts in legacy and mixed integration paths.

Immediate code-level contract fixes were implemented for:
- Course validation endpoint/payload alignment
- Media upload/delete endpoint alignment
- Enhanced custom template endpoint alignment
- Completion submission payload shape
- Learner-scoped interaction typing
- Export service payload shape for `/export` and `/export/validate`

## Architecture Review (Frontend)

Current architecture is functionally split across two integration paths:
- Modern path: domain services via `httpClient` (`CourseService`, `PageService`, `ComponentService`, `ScoringService`, `CompletionService`)
- Legacy path: monolithic `apiService` + `CourseContext`

Key architecture risk:
- API contract changes must currently be updated in multiple places, increasing drift risk and regression probability.

## Findings and Todos

### Critical

1. Duplicate API integration surfaces (legacy + modern)
- Finding: Backend contract drift appeared in both `apiService` and feature components using direct HTTP calls.
- Impact: High probability of hidden runtime regressions after backend changes.
- TODO:
  - Consolidate all API calls behind domain services in `src/services/*`.
  - Deprecate/remove `src/services/api.ts` and `src/context/CourseContext.tsx` once callers are migrated.
- Acceptance:
  - No production component imports `apiService`.
  - No component calls `httpClient` directly for business APIs outside service layer.

### High

2. Missing frontend analytics service adoption
- Finding: Backend exposes `/courses/{courseId}/analytics/summary`, `/manager-view`, `/skills`; no dedicated frontend service integration was found.
- TODO:
  - Add `AnalyticsService` with typed methods and optional `learnerId` filtering.
  - Add Redux slice/thunks for analytics read models used by manager/product dashboards.
- Acceptance:
  - Analytics endpoints consumed through service + typed store flow.
  - Learner filter is usable in manager view.

3. Completion submit payload coupling gap
- Finding: Backend requires `componentStates[]` in page completion submit payload.
- Status: Fixed in service + slice thunk signature.
- Follow-up TODO:
  - Update all dispatch sites to pass concrete per-component completion state snapshots.
- Acceptance:
  - No submit requests with empty or missing `componentStates`.

4. Enhanced custom template request normalization
- Finding: Editor previously posted to legacy `/templates` routes with mismatched payload shape.
- Status: Endpoint + payload fixed.
- Follow-up TODO:
  - Add response mapping/normalization from `CustomTemplateResponse` to frontend `EnhancedTemplate` model.
- Acceptance:
  - Create/edit flows persist and reload template metadata consistently.

### Medium

5. Validation model split remains in frontend
- Finding: Course validation exists in multiple models (`AJV local`, `/courses/validate`, `/export/validate`) with differing error semantics.
- Status: Course endpoint alignment fixed.
- TODO:
  - Introduce unified validation adapter that merges local + backend validation into one canonical UI model.
  - Surface backend warning channel (`warnings[]`) in UI.
- Acceptance:
  - Validation UI displays deterministic ordering and category with warnings visible.

6. Type strictness gaps (`any` response surfaces)
- Finding: Several services still return `any` from endpoints where backend now has stable DTOs.
- TODO:
  - Add typed DTOs for interactions, completion events, analytics summaries, and custom template operations.
- Acceptance:
  - No `any` return types in core service methods for MVP domain APIs.

7. Contract test coverage gaps
- Finding: No frontend automated contract smoke suite validating request shapes against backend routes.
- TODO:
  - Add API contract smoke tests for: validation, completion submit, scoring calculate, analytics summary/manager, custom templates, media upload/delete.
- Acceptance:
  - CI contract suite passes against backend OpenAPI-compatible server.

## Implemented in This Pass

1. Validation endpoint contract fixed
- `src/services/api.ts`: switched to `POST /courses/validate` with `{ courseData }`.
- `src/services/CourseService.ts`: switched to `POST /courses/validate` with `{ courseData }`.

2. Media endpoint contract fixed
- `src/services/api.ts`: upload now `POST /media/upload`.
- `src/services/api.ts`: delete now `DELETE /media/files/{file_id}`.

3. Enhanced template endpoint contract fixed
- `src/services/api.ts`: moved to `/templates/enhanced/custom` routes.
- `src/components/CustomTemplateEditor.tsx`: create/update now use `/templates/enhanced/custom` with OpenAPI-aligned request payload.

4. Completion/interaction DTO alignment
- `src/types/course.ts`: added `learnerId` to interaction event.
- `src/types/course.ts`: added `PageCompletionEventRequest` and component state DTO.
- `src/services/CompletionService.ts`: submit now requires payload; list supports query filters.
- `src/store/slices/completionSlice.ts`: submit thunk now passes required payload.

5. Export request normalization
- `src/services/ExportService.ts`: `exportCourse`/`validateForExport` now send `{ course: JSON.stringify(courseData) }` for backend compatibility.

## Recommended Execution Order

1. Migrate remaining direct/legacy API usage to service layer and remove duplicate API clients.
2. Implement AnalyticsService + Redux integration.
3. Complete completion-submit callsite migration with real component-state snapshots.
4. Introduce unified validation adapter and warning UX.
5. Add contract smoke tests for MVP-critical endpoints.
