# Prompt for Backend AI Developer: Full Integration Analysis & Action Plan

**Date:** 2026-04-12  
**From:** Frontend TPO Team  
**To:** Backend AI Developer  
**Purpose:** Run a deep codebase analysis on backend SCORM/export/runtime APIs, evaluate all integration possibilities, and provide a formal backend action plan + documentation for frontend integration.

---

## 1. Prompt to Backend AI Developer (Copy/Paste)

You are the Backend AI Developer for our e-learning platform.

Please perform a **comprehensive analysis of your backend codebase** and produce a formal integration document for the frontend team.

### Your objectives
1. Analyze all existing backend implementation related to:
   - SCORM export generation
   - Player/runtime contract emission (`index.html`, `course_data.js`, `styles.css`, wrapper)
   - Scoring APIs
   - Completion APIs
   - Interaction event ingestion
   - Template registry/type support
   - Validation and error contracts
2. Compare current implementation against our frontend integration assumptions.
3. Identify all possible integration paths (canonical + compatibility).
4. Recommend a robust backend plan of action with timeline and risk controls.

### Hard requirements for your analysis
1. Do not provide assumptions only. Confirm behavior using actual backend code paths.
2. Explicitly distinguish:
   - Already implemented and production-ready
   - Partially implemented
   - Stub/placeholder behavior
   - Not implemented
3. For each endpoint and payload, state the **single canonical contract** and any backward-compatible alias support.
4. Include exact request/response JSON examples from the implemented code.
5. Include migration strategy for any contract mismatch.

---

## 2. Questions You Must Answer

### A. Scoring Contract
1. Which scoring endpoint is canonical for release?
   - `POST /api/v1/scoring/calculate`
   - or `POST /api/v1/courses/{courseId}/scoring/calculate`
2. What is the canonical request body schema?
3. What is the canonical response schema?
4. Does scoring support:
   - per-question partial credit
   - weighted component scoring
   - attempt tracking and remaining attempts
5. Is current scoring logic real evaluation or placeholder/stub?
6. If both endpoint patterns exist, what deprecation/alias timeline do you propose?

### B. Completion Contract
7. Which completion endpoint is canonical for release?
   - `POST /api/v1/completion/mark`
   - or `POST /api/v1/courses/{courseId}/pages/{pageId}/completion`
8. What is the canonical request body schema?
9. What is the canonical response schema?
10. How is completion computed (`all`, `any`, `percentage`, `custom`) in current code?
11. Is completion state derived from persisted interactions or transient/default placeholders?
12. What is your idempotency strategy for repeated completion submissions?

### C. Exported SCORM Runtime Contract
13. Does generated `index.html` currently implement registry dispatch (`Player.getRenderer(type)`) for all supported template types?
14. If not, what dispatch model is currently in production (if/else chain, map, hybrid)?
15. How many template types are truly emitted and runnable today?
16. Which template types are stubs vs interactive-ready?
17. Can you add `exportContractVersion` in `course_data.js`?
18. Can you add `supportedTemplateTypes[]` to `course_data.js` per package?
19. What is your compatibility strategy when frontend runtime and exported package versions differ?

### D. Template & Data Contracts
20. What is canonical payload shape for exported runtime data?
   - `templates[]` only
   - `pages[].components[]`
   - both
21. What exact schema versioning strategy do you support for template data?
22. Are all template types backed by stable JSON schema on backend?
23. Which template categories are fully validated at save/export time?
24. Which template families are currently best-effort or fallback-only?

### E. Interaction Events & Analytics
25. Is `interactionType` open string or strict enum?
26. If strict, what is full supported set today?
27. Does interaction ingest persist `learnerId`?
28. Which analytics endpoints are production-ready versus structural placeholders?
29. Can analytics provide learner-scoped progress and scoring reliably today?

### F. Validation & Error Standards
30. What is canonical error envelope shape across endpoints?
31. Are validation errors consistent between save-validation and export-validation?
32. Which endpoints currently diverge in error format?
33. What standardization plan do you propose and by when?

### G. Operational Readiness
34. What are rate limits for scoring/completion/event endpoints?
35. What are retry recommendations for frontend on network failure?
36. Which endpoints are safe to retry (idempotent)?
37. Any payload size limits (especially suspend data / large answers)?
38. Any known performance bottlenecks in export generation?

### H. Testing & Evidence
39. Provide current backend test coverage summary by domain: export, scoring, completion, templates, interactions.
40. Which integration tests prove frontend-facing contracts today?
41. Which critical scenarios lack automated tests?
42. Provide your proposed test additions to close those gaps.

---

## 3. Required Backend Deliverables

Please produce a single document named:
`BACKEND_SCORM_INTEGRATION_ACTION_PLAN_2026-04-12.md`

### Required sections
1. Executive summary (what is truly ready now)
2. Canonical API contract table
3. Export runtime contract specification
4. Template support matrix (supported/stub/unsupported)
5. Contract mismatches and compatibility plan
6. Backend action plan (P0/P1/P2) with estimates
7. Risks and mitigations
8. Test coverage report and missing tests
9. Frontend integration checklist
10. Final recommended rollout sequence

### Include these artifacts in your response
1. Endpoint table with method/path/request/response/error shape
2. JSON examples for scoring, completion, export validate, export trigger
3. One sample generated `course_data.js` contract example with version fields
4. One sample generated `index.html` renderer dispatch snippet
5. Evidence references (file paths and key functions in backend codebase)

---

## 4. Expected Output Format (Strict)

Use the following structure exactly:

1. **Canonical Contracts (Release)**
2. **Compatibility Contracts (Temporary)**
3. **Implementation Truth Table (Ready / Partial / Stub / Missing)**
4. **Action Plan by Priority (P0/P1/P2)**
5. **Risk Register**
6. **Test Plan & Coverage Gaps**
7. **Frontend Integration Instructions**
8. **Open Questions / Decisions Needed**

For each action item include:
- owner
- estimate
- dependencies
- acceptance criteria

---

## 5. Constraints & Quality Bar

1. Avoid generic recommendations; tie every statement to current backend implementation.
2. If a feature is not implemented, state so clearly (no ambiguity).
3. Prefer canonical contracts over dual-contract ambiguity.
4. If temporary aliases are required, provide explicit deprecation date/sprint.
5. All recommendations must be production-safe, backward-compatible where possible, and measurable.

---

## 6. Why This Matters

Frontend is implementing a generic, primitive-based runtime that must scale across all template categories. Contract drift in scoring/completion/export will cause major rework. We need a backend truth-source plan with clear contracts, compatibility strategy, and implementation timeline.

---

## 7. Frontend Reference Context (for backend AI)

Current frontend assumptions and implementation:
1. Service-layer API integration is canonical (`src/services/*`).
2. Export runtime module is under `src/export-runtime/*` with registry-based renderer architecture.
3. Scoring currently expects course-scoped calculation endpoint and aggregate answer payload.
4. Completion currently expects page-scoped component-state payload.
5. We can support compatibility aliases short-term if backend confirms mapping behavior.

---

## 8. Send-Back Checklist

Before sending your final backend document, verify:
- [ ] All 42 questions answered
- [ ] Canonical vs compatibility contracts clearly separated
- [ ] Endpoint examples included
- [ ] Versioning strategy included
- [ ] Priority plan with estimates included
- [ ] Risks and mitigations included
- [ ] Frontend integration checklist included

---

**End of Prompt**
