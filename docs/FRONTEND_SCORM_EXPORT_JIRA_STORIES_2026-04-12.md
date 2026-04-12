# Frontend SCORM Export Jira Stories (2026-04-12)

Scope: Jira-ready frontend implementation stories derived from the SCORM export RCA and the frontend-only implementation plan in `docs/FRONTEND_SCORM_EXPORT_IMPLEMENTATION_TODOS_2026-04-12.md`.

## Epic

### FE-EPIC-SCORM-EXPORT-PARITY
- Title: Frontend SCORM Export Runtime Parity
- Goal: Replace the current limited export player with a canonical registry-driven runtime that supports all 84 active template/component types and preserves preview parity for structure, interaction, and styling.
- Success metrics:
  - No supported template renders `Unknown slide type`
  - Export runtime uses typed contracts and registry resolution
  - Export CSS is valid and responsive
  - Category representative tests pass for all active categories

## Story 1

### FE-STORY-001: Create canonical export runtime foundation
- Summary: Build the canonical frontend source tree for the SCORM export runtime.
- Problem:
  - Export runtime logic currently lives in drift-prone static assets.
  - There is no single implementation source of truth.
- Deliverables:
  - `src/export-runtime/core/`
  - `src/export-runtime/contracts/`
  - `src/export-runtime/renderers/`
  - `src/export-runtime/styles/`
  - `src/export-runtime/utils/`
- Acceptance criteria:
  - One canonical export runtime source exists.
  - New export-runtime logic is not added directly to static ZIP-like assets.
  - Runtime foundation compiles and can render a minimal payload.
- Suggested subtasks:
  - Create export runtime folder structure.
  - Add runtime entry point.
  - Add minimal shell renderer.
  - Add documentation/readme for runtime structure.
- Estimate: 3 to 5 days
- Dependencies: none

## Story 2

### FE-STORY-002: Define typed export payload contracts
- Summary: Introduce typed frontend contracts for SCORM export runtime payloads.
- Problem:
  - Runtime currently depends on ad hoc object shapes.
- Deliverables:
  - TypeScript contracts for course, page, component, theme, style, accessibility, interactions, and asset refs.
- Acceptance criteria:
  - Runtime compiles without `any` access for core payloads.
  - Contracts clearly distinguish required vs optional render fields.
- Suggested subtasks:
  - Define `ExportCoursePayload`.
  - Define `ExportPagePayload`.
  - Define `ExportComponentPayload`.
  - Define `ExportThemeTokens` and `ExportStyleConfig`.
  - Add type tests or compile-time fixtures.
- Estimate: 2 to 3 days
- Dependencies: FE-STORY-001

## Story 3

### FE-STORY-003: Replace hardcoded rendering with registry-driven dispatch
- Summary: Replace the current hardcoded export player type chain with a typed renderer registry.
- Problem:
  - Current runtime only supports a few hardcoded component types.
- Deliverables:
  - `rendererRegistry`
  - `ExportRenderer` contract
  - runtime dispatch path using registry only
- Acceptance criteria:
  - No central `if/else` type dispatch remains.
  - Unsupported types produce explicit fallback diagnostics.
  - Registry unit tests validate renderer resolution.
- Suggested subtasks:
  - Define renderer interface.
  - Create registry bootstrap.
  - Wire runtime shell to registry.
  - Add tests for missing renderer behavior.
- Estimate: 2 to 4 days
- Dependencies: FE-STORY-001, FE-STORY-002

## Story 4

### FE-STORY-004: Build shared export rendering primitives
- Summary: Create reusable rendering primitives for the major export component patterns.
- Problem:
  - One-off renderers for 84 template types will be unmaintainable.
- Deliverables:
  - Rich text primitive
  - Accordion primitive
  - Tabs primitive
  - Card/grid primitive
  - Assessment shell
  - Media shell
  - Process shell
  - Navigation shell
  - Report/metric shell
- Acceptance criteria:
  - At least 3 categories share primitives instead of bespoke duplicated logic.
  - Primitive contracts are typed and unit-tested.
- Suggested subtasks:
  - Define primitive interfaces.
  - Implement rich text primitive.
  - Implement navigation/content/assessment primitives.
  - Add focused unit tests.
- Estimate: 5 to 8 days
- Dependencies: FE-STORY-003

## Story 5

### FE-STORY-005: Implement export-safe rich text rendering
- Summary: Render exported HTML content correctly in the SCORM runtime.
- Problem:
  - Current runtime escapes HTML bodies and loses fidelity.
- Acceptance criteria:
  - Paragraphs, lists, emphasis, and inline formatting render correctly.
  - Export runtime does not show literal escaped HTML tags for supported rich text fields.
- Suggested subtasks:
  - Identify all rich text fields used by active templates.
  - Implement export-safe HTML rendering helper.
  - Add tests for tabs/content/accordion body rendering.
- Estimate: 2 to 3 days
- Dependencies: FE-STORY-004

## Story 6

### FE-STORY-006: Implement theme token and scoped style application
- Summary: Support course/page/component styling through payload-driven theme and style config.
- Problem:
  - Export runtime cannot reproduce preview-like styling from persisted state.
- Acceptance criteria:
  - Course theme tokens are applied as CSS variables.
  - Page/component style hooks use deterministic scopes.
  - Component appearance can be driven by payload style config.
- Suggested subtasks:
  - Apply runtime CSS variable layer.
  - Introduce page/component data attribute scoping.
  - Implement style config mapping helper.
  - Add scoped custom CSS support contract on frontend side.
- Estimate: 4 to 6 days
- Dependencies: FE-STORY-002, FE-STORY-004

## Story 7

### FE-STORY-007: Deliver content-presentation export coverage
- Summary: Implement export runtime support for all content-presentation templates.
- In scope:
  - `tabs`
  - `accordion`
  - `click-reveal`
  - `timeline`
  - `image-hotspots`
  - `layered-content`
  - `text-with-media`
- Acceptance criteria:
  - All active content-presentation templates render in export runtime.
  - Accordion and tabs behavior matches preview semantics at a representative level.
- Estimate: 5 to 8 days
- Dependencies: FE-STORY-004, FE-STORY-005, FE-STORY-006

## Story 8

### FE-STORY-008: Deliver assessment export coverage
- Summary: Implement export runtime support for all assessment templates.
- In scope:
  - `mcq`
  - `multiple-select`
  - `true-false`
  - `fill-blanks`
  - `matching`
  - `knowledge-check`
  - `final-assessment`
  - `scenario-question`
- Acceptance criteria:
  - Assessment templates render and collect answers in runtime state.
  - Shared assessment shell handles common prompt/feedback patterns.
- Estimate: 6 to 9 days
- Dependencies: FE-STORY-004, FE-STORY-006

## Story 9

### FE-STORY-009: Deliver navigation and process-flow export coverage
- Summary: Implement export runtime support for navigation and process-flow templates.
- In scope:
  - Navigation: `course-menu`, `resources-downloads`, `module-overview`, `learning-roadmap`, `summary-takeaways`
  - Process-flow: `step-by-step`, `cycle-diagram`, `flowchart`, `decision-tree`, `process-map`
- Acceptance criteria:
  - All in-scope templates render without type failures.
  - Navigation/progress shells are reusable and typed.
- Estimate: 6 to 8 days
- Dependencies: FE-STORY-004, FE-STORY-006

## Story 10

### FE-STORY-010: Deliver media-rich, comparison, and interaction export coverage
- Summary: Implement export runtime support for media-rich, comparison, and interaction categories.
- In scope:
  - Media-rich: `animated-explainer`, `audio-slide`, `infographic`, `video-slide`
  - Comparison: `before-after`, `comparison-table`, `matrix-grid`, `pros-cons`
  - Interaction: `carousel`, `clickable-icons`, `drag-and-drop`, `flip-cards`, `slider`
- Acceptance criteria:
  - All in-scope templates have export renderers.
  - Shared interaction primitives are used where applicable.
- Estimate: 8 to 12 days
- Dependencies: FE-STORY-004, FE-STORY-006

## Story 11

### FE-STORY-011: Deliver remaining category coverage
- Summary: Implement export runtime support for remaining categories.
- In scope:
  - Accessibility
  - Analytics
  - Compliance
  - Diagnostic
  - Feedback
  - Gamification
  - Microlearning
  - Practice
  - Scenario
  - Social
- Acceptance criteria:
  - All active template types have a renderer status of supported or explicitly documented partial support with approved fallback.
  - No type in active registry is untracked.
- Estimate: 10 to 15 days
- Dependencies: FE-STORY-004, FE-STORY-006

## Story 12

### FE-STORY-012: Build canonical export CSS bundle and responsive validation
- Summary: Replace malformed export CSS with a canonical validated bundle.
- Problem:
  - Current export CSS contains syntax defects and is not managed as first-class frontend code.
- Acceptance criteria:
  - CSS syntax validates.
  - Responsive layouts behave at desktop/tablet/mobile breakpoints.
  - Component styles are separated from shell styles.
- Suggested subtasks:
  - Create export runtime base CSS.
  - Create component CSS bundle strategy.
  - Add CSS validation test.
  - Add responsive smoke test.
- Estimate: 3 to 5 days
- Dependencies: FE-STORY-001, FE-STORY-006

## Story 13

### FE-STORY-013: Standardize export interaction and accessibility semantics
- Summary: Ensure runtime behavior aligns with preview-level interaction and accessibility semantics.
- Acceptance criteria:
  - Interactive templates use shared interaction hooks.
  - Focus, keyboard, ARIA labels, and expanded/collapsed semantics are present where applicable.
- Estimate: 4 to 6 days
- Dependencies: FE-STORY-004, FE-STORY-006

## Story 14

### FE-STORY-014: Add export runtime unit, integration, and browser tests
- Summary: Build a full frontend test suite for the export runtime.
- Acceptance criteria:
  - Registry resolution tests exist.
  - Representative category tests exist.
  - High-risk template behavior tests exist.
  - Browser-based smoke tests assert no `Unknown slide type` for supported types.
- Suggested subtasks:
  - Add registry unit tests.
  - Add primitive unit tests.
  - Add category representative DOM tests.
  - Add browser smoke harness with payload fixtures.
- Estimate: 5 to 8 days
- Dependencies: FE-STORY-003 through FE-STORY-013

## Story 15

### FE-STORY-015: Publish export support matrix and readiness dashboard
- Summary: Keep a checked-in support matrix for all 84 template types and their export status.
- Acceptance criteria:
  - Matrix tracks every active type.
  - Status values are current and visible to product and engineering.
- Estimate: 1 to 2 days
- Dependencies: FE-STORY-003

## Recommended Sprint Grouping

### Sprint A
- FE-STORY-001
- FE-STORY-002
- FE-STORY-003
- FE-STORY-005

### Sprint B
- FE-STORY-004
- FE-STORY-006
- FE-STORY-012

### Sprint C
- FE-STORY-007
- FE-STORY-008
- FE-STORY-009

### Sprint D
- FE-STORY-010
- FE-STORY-011
- FE-STORY-013
- FE-STORY-015

### Sprint E
- FE-STORY-014
- parity hardening and bug backlog

## TPO Notes

- Accordion should be treated as the proving bug, not the entire scope.
- Frontend should not accept a one-off patch to the current legacy export player as the final solution.
- A story is only complete when export-runtime tests cover the behavior, not when preview alone works.