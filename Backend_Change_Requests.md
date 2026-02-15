# Template Engine - Backend Change Requests
**Version**: 1.0 | **Date**: February 2026 | **Status**: Draft

## 1. Summary
Frontend requirements and implementation plan depend on backend support for the component-based architecture (pages + components), registry-driven schemas, theming, audio, completion, and scoring. This document lists required API changes and additions for the backend team.

---

## 2. Required API Additions or Changes

### 2.1 Interaction Event Types
**Issue:** The frontend needs an extensible set of interaction event types across 89+ components.

**Request:**
- Make `InteractionEvent.interactionType` an open string (not a closed enum), or
- Expand the enum to include at minimum: `flip`, `reveal`, `drag-sort`, `text-input`, `rating`, `acknowledge`, `download`.
**Issue:** Scenario and diagnostic templates require backend-supported branching logic.

### 2.2 Branching and Adaptive Navigation

**Requests:**
- Add endpoints or schema support to define branching rules and adaptive path selection.
- Persist user branch path taken for reporting and resume.

**Suggested endpoints (examples):**
- `POST /courses/{courseId}/branches` (define branching rules)
- `GET /courses/{courseId}/branches` (fetch rules)
- `POST /courses/{courseId}/branches/{branchId}/events` (record branch decisions)

### 2.3 Social and Collaborative Templates
**Issue:** Templates like discussion, peer review, poll/vote, and team challenge require multi-user data.

**Requests:**
- Discussion threads and replies
- Peer review submissions and rubrics
- Poll vote submission and tally
- Team challenge membership and scoring

**Suggested endpoints (examples):**
- `POST /courses/{courseId}/discussions` and `GET /courses/{courseId}/discussions`
- `POST /courses/{courseId}/peer-reviews` and `GET /courses/{courseId}/peer-reviews`
- `POST /courses/{courseId}/polls/{pollId}/votes` and `GET /courses/{courseId}/polls/{pollId}/results`
- `POST /courses/{courseId}/teams` and `GET /courses/{courseId}/teams`

### 2.4 Analytics and Reporting
**Issue:** Analytics templates require aggregated reporting beyond per-page completion.

**Requests:**
- Course-level performance summaries (score distributions, mastery)
- Skill mastery rollups
- Manager-facing views of learner progress

**Suggested endpoints (examples):**
- `GET /courses/{courseId}/analytics/summary`
- `GET /courses/{courseId}/analytics/skills`
- `GET /courses/{courseId}/analytics/manager-view`

### 2.5 Component Registry Schemas
**Issue:** Frontend requires stable JSON Schemas for each component type for validation and editor generation.

**Requests:**
- Ensure `ComponentTypeDetail.schema` is populated for each component.
- Provide `schemaVersion` in registry responses for cache invalidation.
- Add `updatedAt` and `etag` support for efficient client caching.

### 2.6 Legacy Template Migration
**Issue:** Frontend still supports `templates[]` while migrating to `pages[].components[]`.

**Requests:**
- Keep legacy format supported until Phase 2 is complete.
- Document backend conversion behavior and fields added during migration (page IDs, component IDs, default completion, layout, theme).

---

## 3. Validation and Error Standards

### 3.1 Error Shapes
**Request:** Keep validation errors consistent across endpoints using the existing `ValidationErrorResponse` schema.

### 3.2 Completion Events
**Request:** Confirm `PageCompletionEvent` payload shape and any required fields for audio and interaction tracking.

---

## 4. Backend Readiness Gates (Frontend Dependencies)

- Component Registry: `/components`, `/components/categories`, `/components/search`
- Themes: `/themes`, `/courses/{courseId}/theme`, `/courses/{courseId}/pages/{pageId}/theme`
- Pages: `/courses/{courseId}/pages`, `/courses/{courseId}/pages/reorder`
- Components: `/courses/{courseId}/pages/{pageId}/components`, `/reorder`
- Audio: `/assets/audio`, `/courses/{courseId}/narration`
- Completion: `/courses/{courseId}/completion`, `/courses/{courseId}/pages/{pageId}/completion`
- Scoring: `/courses/{courseId}/scoring`, `/calculate`, `/validate`
- Branching/Adaptive: new endpoints (see 2.2)
- Social/Collaborative: new endpoints (see 2.3)
- Analytics: new endpoints (see 2.4)
