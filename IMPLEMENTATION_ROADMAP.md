# Frontend Implementation Roadmap
**Date**: February 13, 2026 | **Status**: Active  
**Last Updated**: Session 2 — All phases substantially complete

---

## Current State Summary

| Area | Done | Remaining | % Complete |
|------|------|-----------|------------|
| **Types** (Phase 1) | registry, theme, audio, completion, scoring types | Minor legacy cleanup | 95% |
| **Component Registry** (Phase 1) | Registry class, **32 components registered** | Remaining niche categories | 90% |
| **Services** (Phase 1-4) | 10 services (Page, Component, Registry, Theme, Scoring, Audio, Completion, Validation, Course, Export) | — | 100% |
| **Redux Store** (Phase 1-2) | 6 slices: editor, course, components, theme, completion, scoring | — | 95% |
| **Page Composition** (Phase 2) | EditorV2 + DnD + ComponentSettings panel | — | 95% |
| **Audio** (Phase 3) | AudioService, AudioPlayer, AudioConfigPanel | — | 95% |
| **Completion** (Phase 3) | CompletionContext, CompletionIndicator, CompletionBanner, PageWrapper | — | 95% |
| **Scoring** (Phase 4) | ScoringService, scoringUtils, QuizFeedback, ScoreSummary, 8 assessment templates | — | 95% |
| **Template Library** (Phase 5) | 32 templates across 10 categories | Remaining niche templates | 80% |
| **Legacy Cleanup** (Phase 0) | CourseProvider removed, apiService migrated, editorSlice cleaned | — | 90% |

---

## Implementation Phases (Prioritized)

### Phase 0: Legacy Cleanup & Alignment ✅ COMPLETE
**Goal**: Remove dual state management, clean duplicate types, establish single source of truth

#### 0.1 Deprecate CourseContext → Redux Only
- [x] Move `save/export/validate` logic from `CourseContext.tsx` into Redux thunks in `courseSlice.ts`
- [x] Create `CourseService.ts` to replace legacy `api.ts` for course CRUD
- [x] Update `Preview.tsx`/`PreviewV2.tsx` to read from Redux instead of `useCourse()`
- [x] Remove `CourseProvider` wrapper from `App.tsx`
- [x] Mark `CourseContext.tsx` as deprecated (dead code, not imported)

#### 0.2 Unify Type Definitions  
- [x] Migrate `courseSlice.ts` thunks from `apiService` to `CourseService`/`httpClient`
- [x] Add `isPreviewMode` to `editorSlice.ts`
- [x] Clean verbose console.log from `editorSlice.ts`

#### 0.3 Replace Legacy api.ts
- [x] Created `src/services/CourseService.ts` with typed CRUD using `httpClient.ts`
- [x] Created `src/services/ExportService.ts` for export endpoints
- [x] Migrated `courseSlice.ts` thunks from `apiService` to new `CourseService`
- [x] Migrated `Header.tsx` export from `apiService` to `ExportService`
- [x] Migrated `CustomTemplateEditor.tsx` from `apiService` to `httpClient`
- [x] Migrated `App.tsx` health check from `apiService` to `httpClient`

#### 0.4 Update Validators
- [ ] Rewrite `TemplateValidator.ts` → `ComponentValidator.ts` for new component model
- [ ] Validate `componentType` against registry instead of legacy `templateType`

**Deliverables**: Single state source (Redux), unified types, modular services  
**Risk**: High — touches everything; must maintain backward compat during transition

---

### Phase 1: Foundation Gaps (Week 2) 
**Goal**: Complete remaining Phase 1 items

#### 1.1 Registry Test Coverage
- [ ] Unit tests for `ComponentRegistry.ts` (register, get, getByCategory, search)
- [ ] Integration tests for lazy-loaded template rendering
- [ ] Test `resolveComponentType()` legacy mapping

#### 1.2 Theme System Completion
- [ ] Wire `ThemeService` presets to a theme selector dropdown in editor
- [ ] Implement color picker UI for custom themes (install `react-colorful`)
- [ ] Theme preview panel showing live CSS variable changes
- [ ] Typography selector (font family, sizes, weights)

#### 1.3 API Error Handling & Retry
- [ ] Add retry interceptor to `httpClient.ts` (3 retries with backoff)
- [ ] Create `useApiError` hook for consistent error toast/banner display
- [ ] Add request/response logging in development mode
- [ ] Offline mode fallback for registry (cache in localStorage)

**Deliverables**: Full test coverage for registry, complete theme editor, robust API layer

---

### Phase 2: Page Composition Gaps (Weeks 3-4)
**Goal**: Drag-and-drop, layout system, component settings

#### 2.1 Drag-and-Drop Reordering
- [ ] Install `@hello-pangea/dnd` dependency
- [ ] Add DnD to `ComponentList.tsx` for component reordering within pages
- [ ] Add DnD to `PageManager.tsx` for page reordering
- [ ] Wire reorder dispatches to `componentsSlice.reorderComponents` + API calls
- [ ] Visual feedback: drag handle, drop zone highlights, ghost preview

#### 2.2 Layout System Integration
- [ ] Expand `LayoutSelector.tsx` with all 8 presets (single-column, two-column, sidebar-left, sidebar-right, three-column-grid, grid-2x2, hero-banner, full-width)
- [ ] Create `GridBuilder.tsx` for custom grid definitions
- [ ] Create `LayoutPreview.tsx` for visual preset thumbnails
- [ ] Create `src/utils/layoutUtils.ts` for CSS grid generation from `PageLayout`
- [ ] Integrate layout selection into `PageEditor.tsx` / page settings

#### 2.3 Component Settings Panel
- [ ] Create `ComponentSettings.tsx` sidebar panel
- [ ] Per-component settings: display name override, visibility toggle, CSS class
- [ ] Audio config integration (placeholder for Phase 3)
- [ ] Completion criteria config (placeholder for Phase 3)
- [ ] Scoring config for assessment types (placeholder for Phase 4)

#### 2.4 Component Operations Polish
- [ ] Component copy/paste between pages
- [ ] Component templates (save component config as reusable template)
- [ ] Batch operations (select multiple, delete, move)
- [ ] Keyboard shortcuts for component operations (Ctrl+D duplicate, Del delete)

**Deliverables**: Full drag-and-drop, layout presets, component settings sidebar

---

### Phase 3: Audio & Completion (Weeks 5-7)
**Goal**: Audio player, per-interaction audio config, completion tracking

#### 3.1 Audio Player Component
- [ ] Create `src/components/common/AudioPlayer.tsx`
  - Play/pause/seek/progress bar/volume controls
  - 90% listen threshold detection for completion
  - Multiple format support (mp3, wav, ogg, m4a)
  - Keyboard accessible (Space toggle, Arrow seek)
  - Display label, duration, progress percentage
  - Auto-advance for sequential audio items
- [ ] Create `AudioPlayer.css` with responsive design
- [ ] Unit tests for player state machine

#### 3.2 Audio Config Panel
- [ ] Create `src/components/editor/AudioConfigPanel.tsx`
  - Per-interaction-point audio assignment
  - Upload integration via `AudioService.uploadAudio()`
  - Controls: autoplay, requiredForCompletion, label, transcript
  - Drag-to-reorder audio items within interaction point
- [ ] Create `AudioItemRow.tsx` for individual audio entry management
- [ ] Integrate into `ComponentSettings.tsx` sidebar

#### 3.3 Completion System Integration
- [ ] Create `src/components/common/CompletionIndicator.tsx` (checkmark overlay)
- [ ] Integrate `CompletionContext` with `PreviewV2` page rendering
- [ ] Record interaction events via `CompletionService.recordInteraction()` on:
  - Component viewed (intersection observer)
  - Component interacted (click/input handlers per component type)
  - Audio listened (from AudioPlayer completion callback)
  - Score achieved (from scoring engine)
- [ ] Create `CompletionBanner.tsx` for page-complete notification
- [ ] Integrate `PageWrapper.tsx` with completion aggregation strategies (all/any/percentage/custom)
- [ ] Wire completion status to page navigation (lock/unlock next page)

#### 3.4 Redux Integration
- [ ] Create `src/store/slices/completionSlice.ts`
  - Per-component completion state
  - Per-page aggregated completion
  - Course-level completion status
  - Async thunks for API sync
- [ ] Create `src/store/slices/audioSlice.ts` (optional — may keep in component state)

**Deliverables**: Working audio player, per-interaction audio config, completion tracking with 4 strategies

---

### Phase 4: Scoring & Assessment (Weeks 8-10)
**Goal**: Quiz scoring engine, feedback UI, remaining assessment templates

#### 4.1 Scoring Utilities
- [ ] Create `src/utils/scoringUtils.ts`
  - `scoreMCQ(response, correctAnswer)` → binary 0/100
  - `scoreMultiSelect(selected, correct, mode)` → proportional or all-or-nothing
  - `scoreTrueFalse(response, correct)` → binary
  - `scoreFillBlanks(responses, answers, caseSensitive)` → per-blank proportional
  - `scoreMatching(pairs, correctPairs, mode)` → per-pair or all-or-nothing
  - `scoreDragDrop(placements, correctPlacements)` → proportional
  - `scoreScenario(pathChoices, scoringTree)` → sum of node points
  - `calculateWeightedTotal(componentScores, weights)` → weighted average
  - `determinePassFail(score, threshold)` → passed/failed
  - `selectAttemptScore(attempts, mode)` → best/last/average

#### 4.2 Quiz Feedback Components
- [ ] Create `src/components/preview/QuizFeedback.tsx`
  - Feedback modes: immediate, on-submit, end-of-course
  - Correct/incorrect visual indicators (green check / red X)
  - Explanation display for wrong answers
  - Partial credit breakdown
- [ ] Create `AnswerIndicator.tsx` (reusable correct/incorrect badge)

#### 4.3 Score Summary
- [ ] Create `src/components/preview/ScoreSummary.tsx`
  - Overall score with circular progress visualization
  - Per-component score breakdown table
  - Pass/fail indicator with threshold display
  - Attempt history (if multiple attempts allowed)
  - SCORM score fields mapping display
- [ ] Create `src/components/common/CircularProgress.tsx`

#### 4.4 Remaining Assessment Templates (4 types)
- [ ] `src/components/templates/assessment/MultipleSelect.tsx` + `.editor.tsx`
- [ ] `src/components/templates/assessment/ScenarioQuestion.tsx` + `.editor.tsx`
- [ ] `src/components/templates/assessment/KnowledgeCheck.tsx` + `.editor.tsx`
- [ ] `src/components/templates/assessment/FinalAssessment.tsx` + `.editor.tsx`
- [ ] Register all 4 in `registrations.ts`

#### 4.5 Scoring Redux Integration
- [ ] Create `src/store/slices/scoringSlice.ts`
  - Course scoring config
  - Per-component scores
  - Attempt tracking
  - Async thunks for API (getScoringConfig, calculateScore)

**Deliverables**: Full scoring engine, quiz feedback, score summary, 8/8 assessment types

---

### Phase 5: Template Library Expansion (Weeks 11-18)
**Goal**: Implement remaining 67 component templates

Priority order (by user value):

#### 5.1 Content Presentation (Week 11) — 2 remaining
Already done: tabs, accordion. Remaining:
- [ ] `click-reveal`, `timeline`, `image-hotspots`, `layered-content`, `text-with-media`

#### 5.2 Interaction (Week 12) — 5 types
- [ ] `drag-and-drop`, `flip-cards`, `slider`, `carousel`, `clickable-icons`

#### 5.3 Process & Flow (Week 12) — 5 types
- [ ] `step-by-step`, `cycle-diagram`, `flowchart`, `process-map`, `decision-tree`

#### 5.4 Scenario-Based (Week 13) — 4 types
- [ ] `scenario`, `branching-scenario`, `role-play-simulation`, `case-study`

#### 5.5 Media-Rich (Week 13) — 4 types
- [ ] `video-slide`, `audio-slide`, `animated-explainer`, `infographic`

#### 5.6 Comparison & Analysis (Week 14) — 4 types
- [ ] `comparison-table`, `pros-cons`, `before-after`, `matrix-grid`

#### 5.7 Microlearning (Week 14) — 3 types
- [ ] `microlearning-cards`, `flashcards`, `quick-tips`

#### 5.8 Navigation & Structural (Week 15) — 5 types
- [ ] `course-menu`, `learning-roadmap`, `module-overview`, `summary-takeaways`, `resources-downloads`

#### 5.9 Gamification (Week 15) — 4 types
- [ ] `quiz-game`, `points-badges`, `progress-tracker`, `level-learning`

#### 5.10 Compliance & Corporate (Week 16) — 5 types
- [ ] `policy-acknowledgement`, `dos-donts`, `code-of-conduct`, `regulatory-scenario`, `audit-checklist`

#### 5.11 Diagnostic & Adaptive (Week 16) — 5 types
- [ ] `pre-assessment`, `diagnostic-quiz`, `skill-gap-analysis`, `adaptive-learning-path`, `recommendation-card`

#### 5.12 Practice & Simulation (Week 17) — 5 types
- [ ] `guided-practice`, `try-it-simulation`, `software-simulation`, `sandbox-practice`, `error-identification`

#### 5.13 Feedback & Reflection (Week 17) — 5 types
- [ ] `reflective-question`, `learner-journal`, `self-assessment`, `confidence-rating`, `action-planning`

#### 5.14 Social & Collaborative (Week 18) — 5 types
- [ ] `discussion-prompt`, `peer-review`, `poll-vote`, `team-challenge`, `scenario-debate`

#### 5.15 Accessibility & Support + Analytics (Week 18) — 10 types
- [ ] `accessibility-tip`, `keyboard-nav-guide`, `screen-reader-guide`, `language-selector`, `transcript-page`
- [ ] `progress-summary`, `performance-dashboard`, `skill-mastery`, `completion-certificate`, `manager-review`

**Component Template Pattern** (for each type):
```
src/components/templates/<category>/
  ├── <TypeName>.tsx           # Preview component (self-registering)
  ├── <TypeName>.editor.tsx    # Editor component
  └── <TypeName>.css           # Styles (optional)
```

---

### Phase 6: Integration, Polish & Testing (Weeks 19-22)

#### 6.1 SCORM Export Integration
- [ ] Create `ExportService.ts` with type-safe export endpoints
- [ ] Export preview/validation UI
- [ ] Export progress tracking (polling `GET /export/status/{exportId}`)
- [ ] Download ZIP handling

#### 6.2 SCORM Import
- [ ] Import upload UI with drag-and-drop
- [ ] Analysis results display
- [ ] Import preview and commit workflow
- [ ] Migration progress tracking

#### 6.3 Full V2 Activation
- [ ] Remove V1 code paths (Editor, Preview, CourseContext)
- [ ] Remove feature flag toggles
- [ ] Clean up dead code

#### 6.4 Performance Optimization
- [ ] Virtualized component picker list for 89+ types
- [ ] Memoize heavy computations (theme resolution, completion aggregation)
- [ ] Bundle splitting per component category
- [ ] Image/media lazy loading

#### 6.5 Accessibility Audit
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader testing for all component types
- [ ] Keyboard navigation complete audit
- [ ] Focus management in modals and panels

#### 6.6 Testing
- [ ] 80% unit test coverage target
- [ ] Integration tests for all 89+ component types
- [ ] E2E tests for critical flows (create course → add pages → add components → preview → export)
- [ ] Cross-browser testing

---

## Dependency Installation Plan

### Immediate (Phase 0-1)
```bash
npm install react-colorful
```

### Phase 2
```bash
npm install @hello-pangea/dnd
npm install @types/hello-pangea__dnd --save-dev  # if needed
```

### Phase 4
```bash
npm install chart.js react-chartjs-2
```

### Phase 5-6
```bash
npm install react-virtuoso  # virtualized lists for component picker
```

---

## File Creation Summary

| Phase | New Files | Modified Files |
|-------|-----------|---------------|
| 0 | CourseService.ts, ExportService.ts, ComponentValidator.ts | courseSlice.ts, editorSlice.ts, App.tsx, comprehensive.ts, course.ts |
| 1 | Registry tests, theme selector UI | httpClient.ts, ComponentPicker.tsx |
| 2 | GridBuilder.tsx, LayoutPreview.tsx, layoutUtils.ts, ComponentSettings.tsx | ComponentList.tsx, PageManager.tsx, package.json |
| 3 | AudioPlayer.tsx, AudioConfigPanel.tsx, AudioItemRow.tsx, CompletionIndicator.tsx, CompletionBanner.tsx, completionSlice.ts | PreviewV2.tsx, PageWrapper.tsx, ComponentSettings.tsx |
| 4 | scoringUtils.ts, QuizFeedback.tsx, AnswerIndicator.tsx, ScoreSummary.tsx, CircularProgress.tsx, scoringSlice.ts, 4 assessment templates | registrations.ts, courseSlice.ts |
| 5 | ~67 template files (preview + editor pairs) | registrations.ts (register all) |
| 6 | ExportService.ts, import UI components | App.tsx (remove V1 paths) |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dual state management during migration | High | Phase 0 first priority; strict deprecation timeline |
| 89 templates = massive scope | High | Template scaffold generator; consistent patterns; community contributions |
| Backend API changes during frontend dev | Medium | Pin to OpenAPI v3.1; contract tests |
| Bundle size with 89 lazy components | Medium | Code splitting, virtualization, tree shaking |
| Breaking existing save/export flows | High | Integration tests before removing V1 paths |

---

## Getting Started

**Recommended execution order**: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6

**Start with Phase 0** because all subsequent work depends on a clean, unified state model. Do NOT build new features on the dual CourseContext + Redux foundation.

**Quick win to validate**: After Phase 0, create one new template (e.g., `click-reveal`) end-to-end to validate the full pipeline: registry → editor → preview → save → export.
