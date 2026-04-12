# Frontend SCORM Export Implementation Todos (2026-04-12)

Scope: Frontend-only implementation plan for fixing SCORM export rendering parity across the active 84 template/component types. Backend-owned persistence, packaging, validation, and schema work is intentionally excluded from this document.

## Executive Summary

The current SCORM player is a limited legacy runtime that only renders a small subset of authored component types. The frontend preview/editor supports a much larger registry-driven component set, but the exported runtime does not reuse that capability model. As a result, exported packages can contain valid component data that the player cannot render.

Frontend must deliver a registry-driven export runtime that:
- supports all active template/component types through shared rendering primitives
- preserves preview-like structure, interactions, and styling
- consumes backend-provided export payloads without hardcoded per-export assumptions
- provides deterministic fallback behavior only when explicitly defined
- is covered by export-runtime tests, not just editor/preview tests

## Non-Goals

The following are backend-owned and out of scope for this plan:
- DB schema changes
- persisted export payload generation
- media packaging and manifest generation
- export API validation and blocking unsupported payloads
- canonical ZIP assembly

Frontend may define the contracts it needs, but backend implementation is not part of this document.

## Current Frontend Gaps

1. The exported player uses a hardcoded renderer chain instead of a registry.
2. Export runtime supports only a few types and silently fails on the rest.
3. Export runtime rendering logic is duplicated from preview logic and has already drifted.
4. Rich HTML bodies are escaped instead of rendered.
5. Export CSS is not treated as first-class frontend code and contains syntax defects.
6. There is no export-runtime test suite proving supported templates render correctly after ZIP generation.

## Frontend Delivery Goals

1. Build one canonical export runtime source in the frontend codebase.
2. Support all 84 active template types through a registry-driven architecture.
3. Reuse shared rendering primitives instead of maintaining 84 isolated bespoke renderers where possible.
4. Preserve preview parity for structure, interaction semantics, and theme application.
5. Support component-scoped and page-scoped styling via backend-provided style payloads.
6. Ensure exported runtime is valid on desktop and mobile.
7. Prevent regressions through automated export-runtime tests.

## Delivery Phases

### Phase 0: Stabilize the Export Runtime Foundation

#### FE-EXPORT-001: Create canonical export runtime module
- Problem: Export player assets are duplicated and drifting.
- TODO:
  - Create a dedicated frontend runtime source tree for SCORM export, for example:
    - `src/export-runtime/core/`
    - `src/export-runtime/renderers/`
    - `src/export-runtime/styles/`
    - `src/export-runtime/contracts/`
    - `src/export-runtime/utils/`
  - Make this the only frontend-owned source for exported player HTML/CSS/JS generation.
  - Stop treating checked-in static export artifacts as the implementation source of truth.
- Acceptance:
  - There is exactly one canonical export runtime source in the frontend codebase.
  - No new rendering logic is added directly to static checked-in ZIP-like assets.

#### FE-EXPORT-002: Define the frontend export payload contract
- Problem: Export runtime has no typed contract for component, styling, and interaction payloads.
- TODO:
  - Define TypeScript interfaces for the runtime payload:
    - `ExportCoursePayload`
    - `ExportPagePayload`
    - `ExportComponentPayload`
    - `ExportThemeTokens`
    - `ExportStyleConfig`
    - `ExportAccessibilityConfig`
    - `ExportInteractionConfig`
  - Ensure render-time fields exist for:
    - `componentType`
    - `componentId`
    - `pageId`
    - `title`
    - `data`
    - `themeTokens`
    - `styleConfig`
    - `customCss`
    - `assetRefs`
  - Document which fields are required by frontend and which are optional.
- Acceptance:
  - Export runtime compiles against a typed payload contract.
  - Renderer implementations do not rely on untyped `any` payload access.

#### FE-EXPORT-003: Build registry-driven renderer resolution
- Problem: Runtime currently uses hardcoded `if/else` rendering.
- TODO:
  - Create `rendererRegistry: Record<string, ExportRenderer>`.
  - Replace all hardcoded `slide.type` branching with registry lookup.
  - Add explicit error/fallback handling for unsupported renderer IDs.
  - Emit useful diagnostics in development mode for missing renderers.
- Acceptance:
  - Runtime resolves components via registry only.
  - No central renderer chain remains for component type dispatch.

### Phase 1: Shared Rendering Primitives

#### FE-EXPORT-004: Build reusable export-safe rendering primitives
- Problem: Supporting 84 templates with one-off renderers will be slow and brittle.
- TODO:
  - Implement shared primitives for common categories:
    - rich text block
    - tabs
    - accordion
    - card grid
    - timeline/process stepper
    - resource/download list
    - media block
    - question/assessment shell
    - metric/report shell
    - branching/scenario shell
    - navigation shell
  - Define common prop contracts for these primitives.
  - Reuse them across template renderers.
- Acceptance:
  - Multiple template renderers share primitives instead of duplicating layout logic.
  - Primitive contracts are typed and unit-tested.

#### FE-EXPORT-005: Implement export-safe rich text rendering
- Problem: Current export runtime escapes rich HTML, causing content fidelity loss.
- TODO:
  - Replace string escaping of trusted exported HTML bodies with a controlled HTML rendering strategy.
  - Support content fields used across templates:
    - `content`
    - `body`
    - `description`
    - `instructions`
    - explanation/feedback blocks where applicable
  - Sanitize only where needed based on trusted export contract, not by flattening all markup into text.
- Acceptance:
  - Exported paragraphs, lists, emphasis, and inline formatting render correctly.
  - Rich text does not appear as literal escaped tags in SCORM player.

#### FE-EXPORT-006: Implement theme token application and scoped styling hooks
- Problem: Export runtime cannot reliably match preview styling.
- TODO:
  - Apply course theme tokens through CSS variables at runtime root.
  - Apply page- and component-scoped data attributes.
  - Support component/page style overrides from payload.
  - Define how `customCss` attaches safely to course/page/component scopes.
- Acceptance:
  - Export runtime consumes theme/style payloads without hardcoded colors.
  - Component/page selectors can be scoped deterministically.

### Phase 2: Template Category Coverage

#### FE-EXPORT-007: Implement content-presentation category coverage
- Template types:
  - `tabs`
  - `accordion`
  - `click-reveal`
  - `timeline`
  - `image-hotspots`
  - `layered-content`
  - `text-with-media`
- TODO:
  - Build renderer coverage using shared content primitives.
  - Match preview interaction semantics where applicable.
- Acceptance:
  - All active content-presentation templates render in export runtime.

#### FE-EXPORT-008: Implement navigation category coverage
- Template types:
  - `course-menu`
  - `resources-downloads`
  - `module-overview`
  - `learning-roadmap`
  - `summary-takeaways`
- TODO:
  - Build navigation-specific renderer shells.
  - Support progress-state visuals where payload provides the data.
- Acceptance:
  - All navigation templates render without runtime type failures.

#### FE-EXPORT-009: Implement assessment category coverage
- Template types:
  - `mcq`
  - `multiple-select`
  - `true-false`
  - `fill-blanks`
  - `matching`
  - `knowledge-check`
  - `final-assessment`
  - `scenario-question`
- TODO:
  - Create a shared assessment engine shell for prompt/options/feedback/state.
  - Keep SCORM-friendly interaction recording hooks abstracted behind the runtime layer.
- Acceptance:
  - Assessment templates render interactively and consistently.

#### FE-EXPORT-010: Implement media-rich category coverage
- Template types:
  - `animated-explainer`
  - `audio-slide`
  - `infographic`
  - `video-slide`
- TODO:
  - Support media display shells and payload-driven metadata.
  - Respect asset refs and fallback placeholders only when explicitly defined.
- Acceptance:
  - Media-rich templates render structure correctly pending backend asset delivery.

#### FE-EXPORT-011: Implement process-flow category coverage
- Template types:
  - `step-by-step`
  - `cycle-diagram`
  - `flowchart`
  - `decision-tree`
  - `process-map`
- TODO:
  - Reuse process-step and node-edge primitives where possible.
- Acceptance:
  - Process-flow templates render distinct structures without custom ad hoc runtime logic.

#### FE-EXPORT-012: Implement comparison category coverage
- Template types:
  - `before-after`
  - `comparison-table`
  - `matrix-grid`
  - `pros-cons`
- Acceptance:
  - Comparison templates render correct table/grid/card semantics.

#### FE-EXPORT-013: Implement feedback category coverage
- Template types:
  - `action-planning`
  - `confidence-rating`
  - `learner-journal`
  - `reflective-question`
  - `self-assessment`
- Acceptance:
  - Feedback templates render using a shared reflection/input shell where applicable.

#### FE-EXPORT-014: Implement diagnostic category coverage
- Template types:
  - `adaptive-learning-path`
  - `diagnostic-quiz`
  - `pre-assessment`
  - `recommendation-card`
  - `skill-gap-analysis`
- Acceptance:
  - Diagnostic templates render correctly with payload-driven recommendation and branching views.

#### FE-EXPORT-015: Implement analytics category coverage
- Template types:
  - `completion-certificate`
  - `manager-review`
  - `performance-dashboard`
  - `progress-summary`
  - `skill-mastery-report`
- Acceptance:
  - Analytics templates render their visual/report shells when export payload contains the necessary summary data.

#### FE-EXPORT-016: Implement accessibility category coverage
- Template types:
  - `accessibility-tip`
  - `keyboard-nav-guide`
  - `language-selector`
  - `screen-reader-guide`
  - `transcript-caption`
- Acceptance:
  - Accessibility templates render with correct semantics and keyboard/focus behavior.

#### FE-EXPORT-017: Implement compliance category coverage
- Template types:
  - `audit-checklist`
  - `code-of-conduct`
  - `dos-donts`
  - `policy-acknowledgement`
  - `regulatory-scenario`

#### FE-EXPORT-018: Implement practice category coverage
- Template types:
  - `error-identification`
  - `guided-practice`
  - `sandbox-practice`
  - `software-simulation`
  - `try-it-simulation`

#### FE-EXPORT-019: Implement scenario category coverage
- Template types:
  - `branching-scenario`
  - `case-study`
  - `role-play-simulation`
  - `scenario`

#### FE-EXPORT-020: Implement social category coverage
- Template types:
  - `discussion-prompt`
  - `peer-review`
  - `poll-vote`
  - `scenario-debate`
  - `team-challenge`

#### FE-EXPORT-021: Implement gamification category coverage
- Template types:
  - `level-learning`
  - `points-badges`
  - `progress-tracker`
  - `quiz-game`

#### FE-EXPORT-022: Implement microlearning category coverage
- Template types:
  - `flashcards`
  - `microlearning-cards`
  - `quick-tips`

#### FE-EXPORT-023: Implement interaction category coverage
- Template types:
  - `carousel`
  - `clickable-icons`
  - `drag-and-drop`
  - `flip-cards`
  - `slider`

#### FE-EXPORT-024: Add category completion matrix
- TODO:
  - Maintain a checked-in support matrix documenting renderer status for all 84 active template types.
  - Track one of: `not-started`, `primitive-ready`, `renderer-ready`, `tested`.
- Acceptance:
  - Team can see exact export readiness by type without re-auditing the codebase.

### Phase 3: Styling Fidelity and CSS Parity

#### FE-EXPORT-025: Build canonical export CSS bundle
- Problem: Export CSS is currently hand-maintained and malformed.
- TODO:
  - Generate runtime CSS from canonical frontend sources.
  - Fix all malformed syntax patterns.
  - Separate base shell styles from component styles.
  - Support responsive rules for desktop, tablet, and mobile.
- Acceptance:
  - Export CSS validates.
  - No malformed media queries remain.

#### FE-EXPORT-026: Support component-scoped styleConfig application
- TODO:
  - Define mapping from `styleConfig` payload into classes, CSS vars, or inline computed styles.
  - Support spacing, alignment, typography, colors, borders, radius, elevation, and icon placement where relevant.
- Acceptance:
  - Component appearance can be reconstructed from payload-driven styling.

#### FE-EXPORT-027: Support custom CSS injection with scope guards
- TODO:
  - Apply custom CSS only within course/page/component scope.
  - Prevent custom CSS from leaking globally across runtime shell.
- Acceptance:
  - Custom CSS can restyle components without breaking unrelated parts of the export runtime.

### Phase 4: Interaction and Accessibility Parity

#### FE-EXPORT-028: Standardize export interaction hooks
- TODO:
  - Define a shared interaction event interface used by runtime renderers.
  - Support click, reveal, selection, toggle, navigation, and assessment events.
  - Keep the runtime decoupled from direct SCORM field manipulation inside each renderer.
- Acceptance:
  - Renderers call shared runtime hooks rather than bespoke SCORM code paths.

#### FE-EXPORT-029: Match preview accessibility semantics
- TODO:
  - Ensure export runtime preserves roles, labels, focus management, keyboard interaction, and visible focus states.
  - Use existing preview implementations as behavior references.
- Acceptance:
  - Exported interactive components remain keyboard-usable and semantically labeled.

### Phase 5: Testing and Release Gates

#### FE-EXPORT-030: Add renderer registry unit tests
- TODO:
  - Verify every active type resolves to a renderer.
  - Verify unsupported types return explicit fallback diagnostics.
- Acceptance:
  - Tests fail if a registered active type has no export renderer.

#### FE-EXPORT-031: Add representative render tests for all categories
- TODO:
  - Add runtime rendering tests covering at least one template from each category.
  - Add deeper coverage for shared primitives used across categories.
- Acceptance:
  - CI catches visual/DOM regressions in export runtime.

#### FE-EXPORT-032: Add template fidelity tests for high-risk templates
- High-risk templates:
  - `accordion`
  - `tabs`
  - `image-hotspots`
  - `drag-and-drop`
  - `course-menu`
  - `learning-roadmap`
  - `multiple-select`
  - `transcript-caption`
- Acceptance:
  - High-risk interactive components have explicit behavior assertions.

#### FE-EXPORT-033: Add CSS validity and responsive smoke tests
- TODO:
  - Validate exported CSS syntax.
  - Add runtime smoke tests for tablet/mobile layout.
- Acceptance:
  - CSS defects like malformed braces fail CI.

#### FE-EXPORT-034: Add end-to-end export runtime smoke suite
- TODO:
  - Load exported runtime payload fixtures in browser-based tests.
  - Assert no visible `Unknown slide type` error for supported templates.
  - Verify representative components render and respond.
- Acceptance:
  - Export runtime is tested as a runtime, not only as isolated functions.

## Frontend Release Gates

- [ ] Canonical export runtime source exists.
- [ ] Renderer registry exists and is the only dispatch mechanism.
- [ ] Rich HTML content renders correctly.
- [ ] Theme/style payloads are applied through canonical runtime hooks.
- [ ] CSS bundle is valid and responsive.
- [ ] All 84 active template types have export renderer status tracked.
- [ ] All active template types are either supported or explicitly blocked upstream by backend validation.
- [ ] No supported template renders `Unknown slide type`.
- [ ] Category representative tests pass.
- [ ] High-risk interactive export tests pass.

## Recommended Implementation Order

1. Create canonical export runtime source and typed contracts.
2. Replace hardcoded renderer branching with registry resolution.
3. Implement export-safe rich text and theme/style application.
4. Deliver content-presentation, navigation, assessment, and media-rich category support first.
5. Expand to remaining categories using shared primitives.
6. Build CSS parity and scoped custom CSS support.
7. Add registry, renderer, CSS, and export-runtime browser tests.

## Suggested Frontend Ownership Breakdown

### Workstream A: Runtime Core
- export contracts
- registry
- runtime shell
- interaction hooks
- theme/style application

### Workstream B: Renderer Coverage
- category-by-category renderer implementation
- shared primitives
- accessibility semantics

### Workstream C: Styling Fidelity
- canonical CSS bundle
- responsive support
- scoped custom CSS
- preview parity review

### Workstream D: Quality Gates
- registry tests
- primitive tests
- category representative tests
- browser/runtime export smoke tests

## TPO Frontend Priority

Priority should remain on generic architecture, not one-off accordion repair.

Accordion should be fixed first only as the proving case for the new runtime design. A patch that adds `renderAccordion()` to the current legacy export player without delivering registry, shared contracts, and CSS parity will not address the real product risk.