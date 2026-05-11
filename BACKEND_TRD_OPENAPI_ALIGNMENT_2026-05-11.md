# Backend TRD - OpenAPI 3.1 Alignment for Final Assessment and Core Course APIs

Date: 2026-05-11
Owner: TPO / API Contract Alignment
Scope: `/api/v1/courses` domain, nested pages/components APIs, and scoring request/response contracts used by frontend runtime and authoring preview.

## 1. Executive Summary

The frontend has been updated to interoperate with the latest OpenAPI 3.1 schema while preserving backward compatibility for legacy response shapes. This TRD captures:

- Contract differences between previous frontend assumptions and latest OpenAPI.
- Executed frontend compatibility changes.
- Backend schema hardening recommendations to reduce ambiguity and avoid client-side normalization.

The highest-risk contract area is scoring payload shape for fill-in-blank responses and undefined (`{}`) response schemas on multiple endpoints.

## 2. Current vs Expected API Contract

### 2.1 Courses List

Endpoint: `GET /api/v1/courses`

Current OpenAPI 3.1:
- Returns `CourseOut[]` (array response).

Previous frontend assumption:
- Expected paginated object (`{ items|courses, total, page, limit }`), then mapped to Redux list.

Expected stabilized contract:
- Preferred: keep current array contract for simplicity.
- Optional enhancement: if pagination is needed, introduce a distinct endpoint contract (e.g. `/courses/search`) instead of polymorphic response shapes.

Reasoning:
- A single deterministic response shape reduces frontend branching and QA matrix.

### 2.2 Course Upsert

Endpoint: `PUT /api/v1/courses/{courseId}`

Current OpenAPI 3.1:
- `200` with `CourseOut` for update.
- `201` for create, currently without explicit response body schema.

Previous frontend assumption:
- Always expects response body as `Course`/`CourseOut`.

Expected stabilized contract:
- Return `CourseOut` for both `200` and `201`.

Reasoning:
- Idempotent upsert should return resource representation regardless of create/update branch, minimizing additional GET calls and race conditions.

### 2.3 Pages and Components Response Shapes

Endpoints:
- `GET /api/v1/courses/{courseId}/pages`
- `POST /api/v1/courses/{courseId}/pages`
- `GET /api/v1/courses/{courseId}/pages/{pageId}`
- `GET/POST /api/v1/courses/{courseId}/pages/{pageId}/components`
- `GET/PATCH /api/v1/courses/{courseId}/pages/{pageId}/components/{componentId}`

Current OpenAPI 3.1:
- Many responses are `schema: {}` (untyped object).

Previous frontend assumption:
- Expects typed entities (`Page`, `Component`) or arrays directly.

Expected stabilized contract:
- Explicit DTOs for each success response:
  - list endpoints: arrays or typed list wrappers (choose one pattern consistently).
  - create/update/get endpoints: concrete DTO object schema.

Reasoning:
- `schema: {}` causes generator ambiguity, weakens contract tests, and encourages brittle client normalization.

### 2.4 Scoring Payload (Final Assessment)

Endpoint: `POST /api/v1/courses/{courseId}/scoring/calculate`

Current OpenAPI 3.1:
- Request uses `ScoreCalculateDTO -> ComponentAnswerDTO -> QuestionResponseDTO`.
- `QuestionResponseDTO` contains:
  - `questionId: string`
  - `selectedOptionIds: string[]`
- No `textAnswer` property.

Previous frontend assumption:
- For fill-in-blank, frontend sent `textAnswer` and empty `selectedOptionIds`.

Expected stabilized contract:
- Frontend must send fill-in-blank answer as `selectedOptionIds: ["userInput"]`.
- Backend scoring logic must interpret first selected option value as text answer for fill-in-blank questions.

Reasoning:
- Strict DTO fidelity is required for validation and cross-client consistency.

## 3. Executed Frontend Changes (Implemented)

### 3.1 Service-layer compatibility normalization

Files updated:
- `src/services/CourseService.ts`
- `src/services/PageService.ts`
- `src/services/ComponentService.ts`

Changes:
- `CourseService.listCourses()` now accepts:
  - array (`CourseOut[]`),
  - `{ items: [...] }`,
  - `{ courses: [...] }` legacy.
- `CourseService.upsertCourse()` now handles empty `201` response by fallback `GET /courses/{courseId}`.
- `PageService` and `ComponentService` now safely normalize list/get/create/update responses from object wrappers or raw entities.

### 3.2 Redux course list ingestion fix

File updated:
- `src/store/slices/courseSlice.ts`

Changes:
- `fetchCourses` thunk now safely extracts course arrays from:
  - direct array,
  - `items`,
  - legacy `courses`.
- Prevents storing a non-array object into `state.courses`.

### 3.3 Scoring payload contract alignment

Files updated:
- `src/utils/assessmentUtils.ts`
- `src/components/PreviewV2.tsx`
- `src/types/course.ts`

Changes:
- Removed frontend dependency on `textAnswer` in score payload.
- Fill-in-blank answers now serialized as `selectedOptionIds: [answer]`.
- `QuestionResponse` type aligned to schema (`questionId`, `selectedOptionIds`).

### 3.4 Tests updated and passing

Files updated:
- `src/tests/assessmentContract.test.ts`
- `src/components/PreviewV2.test.tsx`

Validation result:
- Focused test run passed:
  - `src/tests/assessmentContract.test.ts`
  - `src/components/PreviewV2.test.tsx`
  - 31 tests passed.

## 4. Backend Schema Change Recommendations

Priority P0:
- Define explicit response schemas (replace `schema: {}`) for pages/components/scoring endpoints.
- Return `CourseOut` body for `PUT /courses/{courseId}` on both `200` and `201`.

Priority P1:
- Publish scoring semantics for fill-in-blank under current DTO:
  - `selectedOptionIds[0]` interpreted as text input.
- Add OpenAPI examples for `ScoreCalculateDTO` including mcq/multiple-select/true-false/fill-in-blank.

Priority P2:
- If pagination is required for courses list, introduce explicit paginated DTO endpoint; avoid mixed shapes on same endpoint.

## 5. Risks and Mitigations

Risk: Ambiguous response DTOs (`{}`) create integration regressions.
- Mitigation: Explicit schemas + contract tests in backend CI.

Risk: Fill-in-blank scoring interpretation mismatch.
- Mitigation: Backend unit tests for parsing `selectedOptionIds` into free-text answer logic.

Risk: Upsert `201` without body adds extra frontend round-trips.
- Mitigation: Return resource body on creation path.

## 6. Migration and Rollout Plan

1. Backend updates OpenAPI response schemas and upsert response body.
2. Backend deploy behind feature flag or staged environment.
3. Run frontend contract tests + backend API integration tests.
4. Remove temporary frontend compatibility branches once schemas are stable for 2 releases.

## 7. Test and Rollback Plan

Test plan:
- Contract tests for score payload serialization/parsing.
- End-to-end validation of course list, create/update, page/component CRUD, and final assessment scoring.

Rollback:
- Frontend currently supports both latest and legacy shapes; backend rollback should not break frontend.
- If scoring regresses, temporary server-side fallback parser can accept both legacy `textAnswer` and current `selectedOptionIds` until full cutover completes.
