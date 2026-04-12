# MVP Signoff Todos

Technical Product Owner review artifact for the backend domains: Courses, Templates, Import, Export, Media, Scoring, Analytics.

This document converts the implementation review into actionable todos with:
- Intended functional behavior
- Current implementation gap
- Technical work required
- Acceptance criteria
- Severity for MVP signoff

## Gap Matrix

| Domain | Use Case | Intended Functional Behavior | Current Status | Gap Summary | Severity |
|---|---|---|---|---|---|
| Courses | Create, read, update, delete courses | Users can manage persisted courses by public `courseId` with stable validation and consistent payloads | Mostly implemented | CRUD works, but validation model is split between legacy `templates` and newer `pages/components` flows | Medium |
| Courses | Validate course before save/export | Users can validate the same course model they later save or export, with real timestamps and consistent error categories | Partially implemented | Validation endpoint uses a separate pages-based request shape and hardcoded timestamps | Medium |
| Templates | Manage course templates | Users can create, update, reorder, delete templates for a course using the same course identifier model as other endpoints | Partially implemented | Legacy template endpoints use numeric course IDs while other domains use string `courseId` | High |
| Templates | Browse component/template registry | Users can list and inspect component definitions, categories, and searchable metadata | Implemented | Core browse/search/detail endpoints exist, but test coverage is limited | Medium |
| Templates | Manage pages and components | Users can create pages, add components, reorder them, and update page layout/theme/completion settings | Implemented with low verification | CRUD exists, but there is no focused test coverage proving end-to-end behavior | High |
| Import | Analyze uploaded SCORM package | Users can upload a SCORM/legacy package, infer content, extract assets, and stage previewable results | Implemented | Analyze and preview flows exist and strategy-level tests exist | Low |
| Import | Commit analyzed import to persisted course | Users can finalize an analyzed job and get a real persisted course/page/template structure | Not implemented end to end | Commit only marks the job committed and harvests templates; it does not create course records | Critical |
| Export | Export raw course payload | Users can export validated course payloads to a SCORM package with correct structure | Implemented with placeholders | Export API works, but package generation still includes Phase 1 placeholder behavior for assets | High |
| Export | Export persisted course by public ID | Users can export an already-saved course by `courseId` without needing internal DB IDs | Broken/partial | Route accepts string ID but fetches course by numeric primary key | Critical |
| Export | Export authoritative content | Users receive SCORM output derived only from real stored content and valid defaults | Partially implemented | Export adapter injects fallback YouTube URLs and placeholder quiz questions | High |
| Media | Upload, serve, list, delete media | Users can securely manage media assets used by courses and exports | Implemented | Upload/list/serve/delete exist with validation and tests | Low |
| Scoring | Configure course scoring | Users can define passing score, weights, attempts, and reporting settings | Implemented structurally | Config endpoints exist and persistence exists | Medium |
| Scoring | Calculate learner score | Users receive real scores based on stored component/question answers and scoring rules | Not implemented end to end | Score calculation uses placeholder question evaluation and always returns zero score detail | Critical |
| Completion | Track course and page completion | Users and LMS can see real completion states derived from interactions and component criteria | Not implemented end to end | Read endpoints return default incomplete component states instead of evaluated persisted progress | Critical |
| Analytics | View course summary | Product and operations can see meaningful event, structure, and scoring summaries | Implemented at coarse level | Summary exists but is mostly aggregate counts rather than learner-centric analytics | Medium |
| Analytics | View learner/manager insights | Managers can inspect learner-level progress, mastery, and performance | Not implemented for learner-level reporting | Current manager view is structural only, and interaction writes do not persist learner identity, so learner-level reporting is not reliable | High |

## Severity-Ranked Backlog

### Critical

#### TODO-001: Implement real import commit persistence
- Domain: Import
- Intended behavior: When a user commits an analyzed import job, the system must create a persisted course and all related records needed for later retrieval and export.
- Current gap: Commit currently updates job state only and does not create a course record, page records, or template/component records.
- Technical work:
  - Define the target persistence model for imported content.
  - Extend `ImportService.commit_import` to create `CourseRecord` and any dependent page/template/component records.
  - Ensure imported asset references are rewritten into persisted media paths.
  - Return created `courseId` in commit response.
- Acceptance criteria:
  - `POST /api/v1/imports/jobs/{job_id}/commit` creates a persisted course.
  - `GET /api/v1/courses/{courseId}` returns imported course content after commit.
  - Imported course can be exported through the persisted export endpoint.

#### TODO-002: Fix persisted export lookup by public course ID
- Domain: Export
- Intended behavior: The persisted export endpoint must export a course identified by public `courseId`, not internal numeric PK.
- Current gap: The route accepts string `courseId` but calls repository `get(pk)`.
- Technical work:
  - Change persisted export route to use `get_by_course_id`.
  - Add tests for success and 404 behavior using public course IDs.
- Acceptance criteria:
  - `POST /api/v1/export/scorm/{courseId}` works with public course IDs.
  - Export succeeds for existing persisted courses and returns 404 for missing IDs.

#### TODO-003: Replace placeholder scoring logic with real answer evaluation
- Domain: Scoring
- Intended behavior: Score calculation must evaluate actual component data and return correct per-question and total scores.
- Current gap: The scoring endpoint builds placeholder question results and never validates answers against real stored component/question definitions.
- Technical work:
  - Load referenced component definitions from persisted course/page/component data.
  - Implement per-type scoring rules for MCQ and any supported scored interactions.
  - Apply weighted scoring using stored configuration.
  - Persist attempt results if learner tracking is part of MVP.
- Acceptance criteria:
  - Submitted correct answers produce non-zero scores.
  - Incorrect answers reduce score as configured.
  - Weighted totals and passing threshold behavior are verifiable through tests.

#### TODO-004: Implement real completion state evaluation
- Domain: Completion
- Intended behavior: Course and page completion endpoints must reflect actual learner/component progress, not default placeholders.
- Current gap: Read endpoints currently return static incomplete component states and infer minimal completion without interaction replay or persisted evaluation.
- Technical work:
  - Define completion state source of truth from interaction events and/or explicit completion records.
  - Persist page completion submissions or derive them deterministically from stored learner events.
  - Evaluate page completion strategies (`all`, `any`, `percentage`, `custom`) against real component state.
  - Aggregate page completion into course completion.
- Acceptance criteria:
  - Recording interactions and page completion updates the read endpoints.
  - Completion responses change predictably after learner activity.
  - End-to-end tests cover at least one scored page and one interaction-based page.

### High

#### TODO-005: Remove fake export fallbacks and placeholder content generation
- Domain: Export
- Intended behavior: Exported packages should reflect real stored content or fail with explicit validation errors.
- Current gap: Persisted export injects fallback YouTube URLs and placeholder quiz questions; package generation still creates placeholder assets.
- Technical work:
  - Remove hardcoded fallback media URLs.
  - Remove fabricated quiz payload defaults from persisted export mapping.
  - Replace placeholder asset generation with real asset inclusion or explicit missing-asset validation failures.
- Acceptance criteria:
  - Export never invents quiz questions or media URLs.
  - Missing required content causes clear validation errors.
  - Asset files inside SCORM package are real source files or the export is rejected.

#### TODO-006: Standardize course identifier strategy across templates and page APIs
- Domain: Courses, Templates
- Intended behavior: All course-scoped endpoints should use the same public `courseId` contract.
- Current gap: Legacy template routes use numeric IDs while most other domains use string `courseId`.
- Technical work:
  - Decide on canonical public identifier for all course-scoped routes.
  - Refactor template CRUD endpoints and repository calls accordingly.
  - Add compatibility layer or migration plan if frontend currently uses numeric IDs.
- Acceptance criteria:
  - All course-scoped routes use a consistent ID format.
  - API documentation and tests reflect one contract.

#### TODO-007: Add end-to-end tests for page/component CRUD
- Domain: Templates
- Intended behavior: Page/component authoring behavior is verified at the API level.
- Current gap: Routes exist, but there are no focused tests proving create, update, reorder, and delete flows.
- Technical work:
  - Add tests for page CRUD.
  - Add tests for component CRUD.
  - Add tests for reorder and page completion configuration persistence.
- Acceptance criteria:
  - Test suite covers the full authoring lifecycle for page/components.

#### TODO-008: Implement learner-scoped analytics data capture
- Domain: Analytics, Completion
- Intended behavior: Analytics and completion reporting must support reliable per-learner views.
- Current gap: Interaction model supports learner identity, but the interaction write path does not populate it, and manager analytics currently returns structural data rather than learner progress.
- Technical work:
  - Extend interaction write endpoint to accept or derive learner identity.
  - Persist learner identity on interaction creation.
  - Update analytics endpoints to compute learner-level progress and support learner-level filters where needed.
- Acceptance criteria:
  - Interactions can be recorded per learner.
  - Analytics can distinguish multiple learners on the same course.
  - Manager-facing analytics exposes learner progress, not only structural counts.

#### TODO-008A: Add automated tests for persisted export, scoring, and completion
- Domain: Export, Scoring, Completion
- Intended behavior: MVP-critical workflows are protected by automated tests, not only manual validation.
- Current gap: No focused tests were found for persisted export by `courseId`, scoring calculation, completion reads, or completion writes.
- Technical work:
  - Add API tests for `POST /api/v1/export/scorm/{courseId}`.
  - Add API tests for `POST /api/v1/courses/{courseId}/scoring/calculate`.
  - Add API tests for `GET/POST /api/v1/courses/{courseId}/completion` and page completion endpoints.
- Acceptance criteria:
  - CI fails if persisted export lookup regresses.
  - CI fails if score calculation or completion semantics regress.

### Medium

#### TODO-009: Unify course validation flows
- Domain: Courses, Export
- Intended behavior: The same course semantics should be validated before save and before export.
- Current gap: Course validation endpoint and export validation operate on related but not identical representations.
- Technical work:
  - Decide canonical course payload shapes for legacy and component-based authoring.
  - Centralize validation logic or provide a consistent adapter layer.
  - Replace hardcoded timestamps with real request-time timestamps.
- Acceptance criteria:
  - Validation errors are consistent across save and export use cases.
  - Validation response timestamps are real.

#### TODO-010: Strengthen analytics semantics beyond aggregate counts
- Domain: Analytics
- Intended behavior: Analytics should expose meaningful outcomes such as completion trends, score distributions, and mastery quality.
- Current gap: Existing summary endpoints are mostly structural counts and interaction totals.
- Technical work:
  - Define MVP analytics KPIs.
  - Compute score and completion rollups from persisted learner events.
  - Formalize skill tagging rather than defaulting to component type.
- Acceptance criteria:
  - Analytics endpoints provide product-meaningful KPIs rather than only counts.

#### TODO-011: Add tests for component registry behavior
- Domain: Templates
- Intended behavior: Registry browse, category listing, search, and detail endpoints are verified.
- Current gap: The component registry is implemented but not directly tested.
- Technical work:
  - Add API tests for listing, categories, search, and detail/etag behavior.
- Acceptance criteria:
  - Registry API is covered in automated tests.

#### TODO-012: Add full import endpoint tests
- Domain: Import
- Intended behavior: Analyze, preview, and commit flows are verified via public APIs, not just strategy internals.
- Current gap: Strategy and harvest internals have tests, but the end-to-end import HTTP flow is under-tested, and one import test file is empty.
- Technical work:
  - Add test coverage for analyze, status, preview, and commit endpoints.
  - Populate or remove empty import discovery test file.
- Acceptance criteria:
  - Import public API lifecycle is covered in CI.

## MVP Release-Readiness Checklist

### Must Pass Before MVP Signoff

- [ ] Import commit creates real persisted courses and related records.
- [ ] Persisted export works with public `courseId` and exports the saved course.
- [ ] Persisted export path is covered by automated tests.
- [ ] Export package contains real assets or fails explicitly when assets are missing.
- [ ] Scoring returns real evaluated results for supported scored component types.
- [ ] Scoring calculation is covered by automated tests.
- [ ] Completion endpoints reflect actual learner/interactions state.
- [ ] Completion read/write flows are covered by automated tests.
- [ ] All course-scoped APIs use a consistent course identifier contract.
- [ ] Page/component CRUD is covered by automated tests.
- [ ] Interaction writes capture learner identity when analytics is learner-scoped.
- [ ] Import endpoint lifecycle is covered by automated tests.
- [ ] Component registry behavior is covered by automated tests.

### Nice to Have After MVP

- [ ] Richer analytics KPIs beyond counts.
- [ ] Async export job tracking beyond current synchronous placeholder status.
- [ ] Unified validation adapter for legacy templates and page/component authoring.

## Recommended Implementation Order

1. Fix persisted export lookup and remove fake export fallbacks.
2. Implement import commit persistence.
3. Implement real scoring evaluation.
4. Implement real completion aggregation.
5. Standardize course identifier contracts.
6. Add missing tests for pages/components, component registry, and import endpoints.
7. Improve learner-aware analytics.
