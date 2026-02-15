# Template Engine - Frontend Implementation Plan
**Version**: 2.0 | **Date**: February 2026 | **Status**: Draft

## Executive Summary

This implementation plan outlines the phased rollout of the Template Engine frontend architecture. The plan transforms the current monolithic template system into a composable, extensible component-based platform with theming, audio integration, completion tracking, and scoring capabilities.

**Total Timeline**: 24 weeks (5 phases)
**Team Size**: 2-3 frontend developers + 1 backend developer
**Risk Level**: High (architectural overhaul)
**Success Criteria**: All 89+ component types implemented, backward compatibility maintained, 80% test coverage

---

## Phase 0: Alignment & Migration Prep (Week 0)
**Goal**: Remove legacy state duplication, align types, and confirm backend readiness
**Deliverables**: Single state model, finalized MVP schemas, backend dependency checklist

**Tasks:**
- Deprecate `CourseContext` and move save/export/validation into Redux thunks.
- Remove duplicate `Course` and `EditorState` type definitions; keep a single source of truth.
- Mark `EnhancedTemplate` as legacy-only (or remove if unused).
- Define MVP component data shapes (Tabs, Accordion, MCQ, ContentText, ContentImage, ContentVideo).
- Confirm backend readiness for registry/theme/page/component endpoints before Phase 1 starts.

---

## Phase 1: Foundation & Registry (Weeks 1-4)
**Goal**: Establish component registry architecture, migrate existing templates, build theming foundation
**Deliverables**: Component registry system, migrated legacy templates, theme provider, component picker

### 1.1 TypeScript Types Overhaul (Week 1, Days 1-2)
**Tasks:**
- Rewrite `src/types/course.ts` to match OpenAPI v2 schemas
- Rewrite `src/types/comprehensive.ts` with new architecture types
- Add Component, AudioConfig, CompletionCriteria, PageLayout, ThemeColors types
- Expand `src/constants/templateTypes.ts` with all 89+ component type IDs and categories
- Create `src/types/registry.ts` for ComponentDefinition, CategoryDefinition

**Files Created:**
- `src/types/registry.ts`
- `src/types/theme.ts`
- `src/types/audio.ts`
- `src/types/completion.ts`
- `src/types/scoring.ts`

**Files Modified:**
- `src/types/course.ts` (full rewrite — Page with components[], PageLayout, PageThemeConfig)
- `src/types/comprehensive.ts` (full rewrite — new state shapes, API types)
- `src/constants/templateTypes.ts` (expand to 89+ types with category mapping)

### 1.2 Component Registry Architecture (Week 1, Days 3-5)
**Tasks:**
- Create `src/components/registry/` directory structure
- Implement `ComponentRegistry.ts` class with registration, lookup, category filtering
- Define `ComponentDefinition` interface in registry types
- Create registry singleton instance
- Add lazy loading support for component resolution

**Files Created:**
- `src/components/registry/index.ts`
- `src/components/registry/ComponentRegistry.ts`
- `src/components/registry/types.ts`
- `src/components/registry/__tests__/ComponentRegistry.test.ts`

### 1.3 Migrate Existing Templates (Week 2)
**Tasks:**
- Convert 7 existing templates to registry pattern with self-registration
- Create editor + preview component pairs for each
- Implement `DynamicComponentRenderer` to replace PageEditor switch statement
- Maintain backward compatibility with legacy `templates[]` format

**Files Created:**
- `src/components/templates/content/Welcome.tsx`
- `src/components/templates/content/Welcome.editor.tsx`
- `src/components/templates/content/ContentText.tsx`
- `src/components/templates/content/ContentText.editor.tsx`
- `src/components/templates/content/ContentVideo.tsx`
- `src/components/templates/content/ContentVideo.editor.tsx`
- `src/components/templates/content/ContentImage.tsx`
- `src/components/templates/content/ContentImage.editor.tsx`
- `src/components/templates/assessment/MCQ.tsx`
- `src/components/templates/assessment/MCQ.editor.tsx`
- `src/components/templates/content/Summary.tsx`
- `src/components/templates/content/Summary.editor.tsx`
- `src/components/templates/interaction/Interactive.tsx`
- `src/components/templates/interaction/Interactive.editor.tsx`
- `src/components/DynamicComponentRenderer.tsx`

**Files Modified:**
- `src/components/PageEditor.tsx` (replace switch with DynamicComponentRenderer)
- `src/components/Preview.tsx` (update template rendering)

### 1.4 Theming Foundation (Week 3)
**Tasks:**
- Create `ThemeContext.tsx` with provider and CSS variable injection
- Implement `resolveTheme()` utility (preset -> course overrides -> page overrides)
- Add ThemeColors, ThemeTypography, ThemeComponentStyles types
- Create theme provider wrapper in `App.tsx`
- Build basic theme API client (`ThemeService`)

**Files Created:**
- `src/context/ThemeContext.tsx`
- `src/utils/themeUtils.ts`
- `src/services/ThemeService.ts`

**Files Modified:**
- `src/App.tsx` (wrap with ThemeProvider)
- `src/index.css` (add CSS variable declarations)

### 1.5 Component Picker Modal (Week 4)
**Tasks:**
- Create `ComponentPicker.tsx` with category tabs and component grid
- Create `ComponentCard.tsx` for individual component display
- Implement search + filter using `/components/search` API
- Create `RegistryService` API client
- Add "Add Component" button to page editor
- Integrate with Redux for adding components to pages

**Files Created:**
- `src/components/ComponentPicker.tsx`
- `src/components/ComponentPicker.css`
- `src/components/ComponentCard.tsx`
- `src/services/RegistryService.ts`

**Files Modified:**
- `src/components/PageEditor.tsx` (add component picker integration)
- `src/store/slices/editorSlice.ts` (add addComponent, removeComponent actions)

### 1.6 Testing (Ongoing through Phase 1)
- Unit tests for ComponentRegistry (register, get, getByCategory, search)
- Integration tests for migrated templates (render, edit, save)
- Theme provider tests (CSS variable injection, inheritance)
- Component picker tests (search, filter, insert)
- **Target**: 80% coverage for new code

---

## Phase 2: Page Composition & Layout (Weeks 5-8)
**Goal**: Enable multi-component pages with drag-and-drop and layout system
**Deliverables**: Component reordering, layout presets, page composition UI

### 2.1 Multi-Component Page Structure (Week 5)
**Tasks:**
- Update Page interface to include `components[]` array
- Modify Redux store to handle component arrays per page
- Create `ComponentList.tsx` container with ordering
- Create `ComponentSlot.tsx` for individual component wrappers
- Update `PageService` API client for page CRUD

**Files Created:**
- `src/components/ComponentList.tsx`
- `src/components/ComponentSlot.tsx`
- `src/components/ComponentSlot.css`
- `src/services/PageService.ts`
- `src/services/ComponentService.ts`

**Files Modified:**
- `src/store/slices/editorSlice.ts` (component array state management)
- `src/store/slices/courseSlice.ts` (update page structure)

### 2.2 Drag-and-Drop Reordering (Week 6)
**Tasks:**
- Install `@hello-pangea/dnd` library
- Implement component drag-and-drop in `ComponentList.tsx`
- Implement page drag-and-drop in `PageManager.tsx`
- Add reorder actions to Redux + API calls
- Visual feedback: drag handle, drop zone highlights, placeholder

**Files Modified:**
- `src/components/ComponentList.tsx` (add DnD)
- `src/components/PageManager.tsx` (add page DnD)
- `src/store/slices/editorSlice.ts` (add reorderComponents action)
- `package.json` (add @hello-pangea/dnd dependency)

### 2.3 Layout System (Week 7)
**Tasks:**
- Create layout presets (8 types: single-column, two-column, grid-2x2, etc.)
- Implement `LayoutSelector.tsx` with visual preset picker
- Add custom grid builder UI
- Implement CSS grid rendering based on PageLayout
- Support component placement into grid areas

**Files Created:**
- `src/components/layout/LayoutSelector.tsx`
- `src/components/layout/LayoutSelector.css`
- `src/components/layout/GridBuilder.tsx`
- `src/components/layout/LayoutPreview.tsx`
- `src/utils/layoutUtils.ts`

**Files Modified:**
- `src/components/PageEditor.tsx` (layout selector integration)
- `src/components/ComponentList.tsx` (grid-based rendering)

### 2.4 Page Composition UI Polish (Week 8)
**Tasks:**
- Component deletion with confirmation
- Component duplication
- Component-specific settings panel (sidebar)
- Component toolbar (move up/down, delete, duplicate, settings)
- Improve visual hierarchy and spacing
- Responsive layout handling

**Files Created:**
- `src/components/ComponentToolbar.tsx`
- `src/components/ComponentSettings.tsx`

**Files Modified:**
- `src/components/ComponentSlot.tsx` (add toolbar, delete, duplicate)
- `src/components/PageEditor.tsx` (settings panel)
- `src/components/PageEditor.css` (updated styles)

### 2.5 Testing (Ongoing through Phase 2)
- Drag-drop integration tests
- Layout preset rendering tests
- Component composition tests (add, remove, reorder, duplicate)
- Responsive layout tests

---

## Phase 3: Audio & Completion (Weeks 9-12)
**Goal**: Add audio playback with per-interaction support and completion tracking
**Deliverables**: Audio player, audio config panel, completion context, page wrapper

### 3.1 Audio Player Component (Week 9)
**Tasks:**
- Create `AudioPlayer.tsx` with play/pause/seek/progress controls
- Implement 90% listen threshold for completion detection
- Support multiple audio formats (mp3, wav, ogg, m4a)
- Keyboard accessibility (Space, Arrow keys)
- Display label and transcript
- Auto-advance for multiple audio items per interaction

**Files Created:**
- `src/components/common/AudioPlayer.tsx`
- `src/components/common/AudioPlayer.css`
- `src/components/common/AudioPlayer.test.tsx`

### 3.2 Audio Config Panel (Week 10)
**Tasks:**
- Create `AudioConfigPanel.tsx` for editor sidebar
- Per-interaction-point audio assignment UI
- Integration with media upload (POST /assets/audio)
- Audioconfig controls: autoplay, requiredForCompletion, label, transcript
- Drag-to-reorder audio items within an interaction point
- Create `AudioService` API client

**Files Created:**
- `src/components/editor/AudioConfigPanel.tsx`
- `src/components/editor/AudioConfigPanel.css`
- `src/components/editor/AudioItemRow.tsx`
- `src/services/AudioService.ts`

**Files Modified:**
- `src/components/ComponentSettings.tsx` (integrate audio panel)
- `src/store/slices/editorSlice.ts` (add setComponentAudioConfig action)

### 3.3 Completion Tracking Context (Week 11)
**Tasks:**
- Create `CompletionContext.tsx` with per-component completion state
- Implement `CompletionService.ts` for criteria evaluation
- Track interactions performed (`interactionsCompleted[]`)
- Track audio listened (`audiosCompleted[]`)
- Create `CompletionIndicator.tsx` (green checkmark overlay)
- Record interaction events via API (`POST /courses/{id}/interactions`)

**Files Created:**
- `src/context/CompletionContext.tsx`
- `src/services/CompletionService.ts`
- `src/components/common/CompletionIndicator.tsx`
- `src/components/common/CompletionIndicator.css`

### 3.4 Page Completion Wrapper (Week 12)
**Tasks:**
- Create `PageWrapper.tsx` with completion aggregation logic
- Support all 4 strategies: all, any, percentage, custom
- Completion banner/notification on page complete
- Integration with navigation controls (unlock next page)
- API: `POST /courses/{id}/pages/{id}/completion`

**Files Created:**
- `src/components/preview/PageWrapper.tsx`
- `src/components/preview/CompletionBanner.tsx`
- `src/components/preview/CompletionBanner.css`

**Files Modified:**
- `src/components/Preview.tsx` (wrap pages with PageWrapper)
- `src/components/PageManager.tsx` (show completion checkmarks)

### 3.5 Testing (Ongoing through Phase 3)
- Audio playback tests (play, pause, seek, completion threshold)
- Audio config panel tests (add, remove, reorder audio items)
- Completion criteria evaluation tests (view, interact, audio, score)
- Page completion aggregation tests (all 4 strategies)
- Integration: audio -> completion -> page wrapper flow

---

## Phase 4: Scoring & Assessment (Weeks 13-16)
**Goal**: Implement quiz scoring, feedback, and assessment templates
**Deliverables**: Scoring UI, quiz feedback, score summary, assessment templates

### 4.1 Quiz Scoring Logic (Week 13)
**Tasks:**
- Implement `ScoringService.ts` with score calculation
- Scoring utilities for each assessment type (MCQ, Multiple Select, T/F, etc.)
- Partial credit support
- Weighted scoring support
- Attempt tracking (best/last/average)
- API integration: GET/PATCH scoring config, POST calculate

**Files Created:**
- `src/services/ScoringService.ts`
- `src/utils/scoringUtils.ts`

### 4.2 Quiz Feedback Components (Week 14)
**Tasks:**
- Create `QuizFeedback.tsx` for immediate/on-submit/end feedback modes
- Correct/incorrect visual indicators
- Explanation display for wrong answers
- Partial credit display
- Integrate with assessment component templates

**Files Created:**
- `src/components/preview/QuizFeedback.tsx`
- `src/components/preview/QuizFeedback.css`
- `src/components/preview/AnswerIndicator.tsx`

### 4.3 Course Score Summary (Week 15)
**Tasks:**
- Create `ScoreSummary.tsx` with progress visualization
- `CircularProgress.tsx` for score percentage display
- Score breakdown table (per component)
- Pass/fail indicator
- Attempt information display
- SCORM score reporting integration (`cmi.core.score.raw`)

**Files Created:**
- `src/components/preview/ScoreSummary.tsx`
- `src/components/preview/ScoreSummary.css`
- `src/components/common/CircularProgress.tsx`

**Files Modified:**
- `src/store/slices/courseSlice.ts` (add scoring state)

### 4.4 Assessment Template Expansion (Week 16)
**Tasks:**
- Implement additional assessment templates with editor + preview pairs:

| Template | Files |
|----------|-------|
| Multiple Select | `assessment/MultipleSelect.tsx`, `.editor.tsx` |
| True/False | `assessment/TrueFalse.tsx`, `.editor.tsx` |
| Fill in the Blanks | `assessment/FillBlanks.tsx`, `.editor.tsx` |
| Matching | `assessment/Matching.tsx`, `.editor.tsx` |
| Scenario-Based Question | `assessment/ScenarioQuestion.tsx`, `.editor.tsx` |
| Knowledge Check | `assessment/KnowledgeCheck.tsx`, `.editor.tsx` |
| Final Assessment | `assessment/FinalAssessment.tsx`, `.editor.tsx` |

- Register all in ComponentRegistry with scoring rules
- Add scoring logic for each type in scoringUtils

**Files Created:**
- `src/components/templates/assessment/MultipleSelect.tsx`
- `src/components/templates/assessment/MultipleSelect.editor.tsx`
- `src/components/templates/assessment/TrueFalse.tsx`
- `src/components/templates/assessment/TrueFalse.editor.tsx`
- `src/components/templates/assessment/FillBlanks.tsx`
- `src/components/templates/assessment/FillBlanks.editor.tsx`
- `src/components/templates/assessment/Matching.tsx`
- `src/components/templates/assessment/Matching.editor.tsx`
- `src/components/templates/assessment/ScenarioQuestion.tsx`
- `src/components/templates/assessment/ScenarioQuestion.editor.tsx`
- `src/components/templates/assessment/KnowledgeCheck.tsx`
- `src/components/templates/assessment/KnowledgeCheck.editor.tsx`
- `src/components/templates/assessment/FinalAssessment.tsx`
- `src/components/templates/assessment/FinalAssessment.editor.tsx`

### 4.5 Testing (Ongoing through Phase 4)
- Scoring calculation tests (per type, partial credit, weighted)
- Quiz feedback rendering tests (3 feedback modes)
- Score summary tests
- Assessment template tests (render, interact, submit, score)

---

## Phase 5: Full Template Library & Polish (Weeks 17-24)
**Goal**: Implement all remaining 89+ component types across all categories
**Deliverables**: Complete template library, accessibility audit, performance optimization

### 5.1 Content Presentation Templates (Week 17, first half) — 7 types
Each template gets: `{Name}.tsx` (preview), `{Name}.editor.tsx` (editor), registered in ComponentRegistry.

| typeId | File Path | Per-Interaction Audio |
|--------|-----------|----------------------|
| `tabs` | `templates/content/Tabs.tsx` | Yes — per tab |
| `accordion` | `templates/content/Accordion.tsx` | Yes — per panel |
| `click-reveal` | `templates/content/ClickReveal.tsx` | Yes — per item |
| `timeline` | `templates/content/Timeline.tsx` | Yes — per event |
| `image-hotspots` | `templates/content/ImageHotspots.tsx` | Yes — per hotspot |
| `layered-content` | `templates/content/LayeredContent.tsx` | No — per component |
| `text-with-media` | `templates/content/TextWithMedia.tsx` | No — per component |

### 5.2 Process & Flow Templates (Week 17, second half) — 5 types
| typeId | File Path | Per-Interaction Audio |
|--------|-----------|----------------------|
| `step-by-step` | `templates/process/StepByStep.tsx` | Yes — per step |
| `cycle-diagram` | `templates/process/CycleDiagram.tsx` | No — per component |
| `flowchart` | `templates/process/Flowchart.tsx` | No — per component |
| `process-map` | `templates/process/ProcessMap.tsx` | No — per component |
| `decision-tree` | `templates/process/DecisionTree.tsx` | Yes — per node |

### 5.3 Interaction Templates (Week 18, first half) — 5 types
| typeId | File Path | Per-Interaction Audio |
|--------|-----------|----------------------|
| `drag-and-drop` | `templates/interaction/DragAndDrop.tsx` | No — per component |
| `flip-cards` | `templates/interaction/FlipCards.tsx` | Yes — per card |
| `slider` | `templates/interaction/Slider.tsx` | No — per component |
| `carousel` | `templates/interaction/Carousel.tsx` | Yes — per slide |
| `clickable-icons` | `templates/interaction/ClickableIcons.tsx` | Yes — per icon |

### 5.4 Scenario-Based Templates (Week 18, second half) — 4 types
| typeId | File Path | Scoring |
|--------|-----------|---------|
| `scenario` | `templates/scenario/Scenario.tsx` | Yes |
| `branching-scenario` | `templates/scenario/BranchingScenario.tsx` | Yes |
| `role-play-simulation` | `templates/scenario/RolePlaySimulation.tsx` | Yes |
| `case-study` | `templates/scenario/CaseStudy.tsx` | Yes |

### 5.5 Comparison & Analysis + Media-Rich + Microlearning (Week 19) — 11 types
| typeId | File Path | Category |
|--------|-----------|----------|
| `comparison-table` | `templates/comparison/ComparisonTable.tsx` | Comparison |
| `pros-cons` | `templates/comparison/ProsCons.tsx` | Comparison |
| `before-after` | `templates/comparison/BeforeAfter.tsx` | Comparison |
| `matrix-grid` | `templates/comparison/MatrixGrid.tsx` | Comparison |
| `video-slide` | `templates/media/VideoSlide.tsx` | Media-Rich |
| `audio-slide` | `templates/media/AudioSlide.tsx` | Media-Rich |
| `animated-explainer` | `templates/media/AnimatedExplainer.tsx` | Media-Rich |
| `infographic` | `templates/media/Infographic.tsx` | Media-Rich |
| `microlearning-cards` | `templates/microlearning/MicrolearningCards.tsx` | Microlearning |
| `flashcards` | `templates/microlearning/Flashcards.tsx` | Microlearning |
| `quick-tips` | `templates/microlearning/QuickTips.tsx` | Microlearning |

### 5.6 Navigation + Gamification + Compliance (Week 20) — 14 types
| typeId | File Path | Category |
|--------|-----------|----------|
| `course-menu` | `templates/navigation/CourseMenu.tsx` | Navigation |
| `learning-roadmap` | `templates/navigation/LearningRoadmap.tsx` | Navigation |
| `module-overview` | `templates/navigation/ModuleOverview.tsx` | Navigation |
| `summary-takeaways` | `templates/navigation/SummaryTakeaways.tsx` | Navigation |
| `resources-downloads` | `templates/navigation/ResourcesDownloads.tsx` | Navigation |
| `quiz-game` | `templates/gamification/QuizGame.tsx` | Gamification |
| `points-badges` | `templates/gamification/PointsBadges.tsx` | Gamification |
| `progress-tracker` | `templates/gamification/ProgressTracker.tsx` | Gamification |
| `level-learning` | `templates/gamification/LevelLearning.tsx` | Gamification |
| `policy-acknowledgement` | `templates/compliance/PolicyAcknowledgement.tsx` | Compliance |
| `dos-donts` | `templates/compliance/DosDonts.tsx` | Compliance |
| `code-of-conduct` | `templates/compliance/CodeOfConduct.tsx` | Compliance |
| `regulatory-scenario` | `templates/compliance/RegulatoryScenario.tsx` | Compliance |
| `audit-checklist` | `templates/compliance/AuditChecklist.tsx` | Compliance |

### 5.7 Diagnostic & Adaptive + Practice & Simulation (Week 21) — 10 types
| typeId | File Path | Category |
|--------|-----------|----------|
| `pre-assessment` | `templates/diagnostic/PreAssessment.tsx` | Diagnostic |
| `diagnostic-quiz` | `templates/diagnostic/DiagnosticQuiz.tsx` | Diagnostic |
| `skill-gap-analysis` | `templates/diagnostic/SkillGapAnalysis.tsx` | Diagnostic |
| `adaptive-learning-path` | `templates/diagnostic/AdaptiveLearningPath.tsx` | Diagnostic |
| `recommendation-card` | `templates/diagnostic/RecommendationCard.tsx` | Diagnostic |
| `guided-practice` | `templates/practice/GuidedPractice.tsx` | Practice |
| `try-it-simulation` | `templates/practice/TryItSimulation.tsx` | Practice |
| `software-simulation` | `templates/practice/SoftwareSimulation.tsx` | Practice |
| `sandbox-practice` | `templates/practice/SandboxPractice.tsx` | Practice |
| `error-identification` | `templates/practice/ErrorIdentification.tsx` | Practice |

### 5.8 Feedback & Reflection + Social & Collaborative (Week 22) — 10 types
| typeId | File Path | Category |
|--------|-----------|----------|
| `reflective-question` | `templates/feedback/ReflectiveQuestion.tsx` | Feedback |
| `learner-journal` | `templates/feedback/LearnerJournal.tsx` | Feedback |
| `self-assessment` | `templates/feedback/SelfAssessment.tsx` | Feedback |
| `confidence-rating` | `templates/feedback/ConfidenceRating.tsx` | Feedback |
| `action-planning` | `templates/feedback/ActionPlanning.tsx` | Feedback |
| `discussion-prompt` | `templates/social/DiscussionPrompt.tsx` | Social |
| `peer-review` | `templates/social/PeerReview.tsx` | Social |
| `poll-vote` | `templates/social/PollVote.tsx` | Social |
| `team-challenge` | `templates/social/TeamChallenge.tsx` | Social |
| `scenario-debate` | `templates/social/ScenarioDebate.tsx` | Social |

### 5.9 Accessibility & Support + Analytics (Week 23) — 10 types
| typeId | File Path | Category |
|--------|-----------|----------|
| `accessibility-tip` | `templates/accessibility/AccessibilityTip.tsx` | Accessibility |
| `keyboard-nav-guide` | `templates/accessibility/KeyboardNavGuide.tsx` | Accessibility |
| `screen-reader-guide` | `templates/accessibility/ScreenReaderGuide.tsx` | Accessibility |
| `language-selector` | `templates/accessibility/LanguageSelector.tsx` | Accessibility |
| `transcript-caption` | `templates/accessibility/TranscriptCaption.tsx` | Accessibility |
| `progress-summary` | `templates/analytics/ProgressSummary.tsx` | Analytics |
| `performance-dashboard` | `templates/analytics/PerformanceDashboard.tsx` | Analytics |
| `skill-mastery-report` | `templates/analytics/SkillMasteryReport.tsx` | Analytics |
| `completion-certificate` | `templates/analytics/CompletionCertificate.tsx` | Analytics |
| `manager-review` | `templates/analytics/ManagerReview.tsx` | Analytics |

### 5.10 System Polish & Optimization (Week 24)
**Tasks:**
- Performance optimization:
  - Lazy loading for all template components (`React.lazy()`)
  - Memoization of frequently rendered components
  - Virtual scrolling in component picker
  - Bundle analysis and tree shaking
- Accessibility audit:
  - WCAG 2.1 AA compliance check on all 89+ components
  - ARIA labels, roles, keyboard navigation
  - Color contrast validation against theme tokens
  - Screen reader testing
- Error handling:
  - Graceful fallback for unknown component types
  - Network error handling for all API calls
  - Error boundaries per component slot
- Documentation:
  - Developer docs for adding new component types
  - Component API reference
  - Theme customization guide

---

## Directory Structure (Final)

```
src/components/
  registry/
    index.ts
    ComponentRegistry.ts
    types.ts
  templates/
    content/          # Welcome, ContentText, ContentVideo, ContentImage, Summary,
                      # Tabs, Accordion, ClickReveal, Timeline, ImageHotspots,
                      # LayeredContent, TextWithMedia
    process/          # StepByStep, CycleDiagram, Flowchart, ProcessMap, DecisionTree
    interaction/      # DragAndDrop, FlipCards, Slider, Carousel, ClickableIcons, Interactive
    scenario/         # Scenario, BranchingScenario, RolePlaySimulation, CaseStudy
    assessment/       # MCQ, MultipleSelect, TrueFalse, FillBlanks, Matching,
                      # ScenarioQuestion, KnowledgeCheck, FinalAssessment
    comparison/       # ComparisonTable, ProsCons, BeforeAfter, MatrixGrid
    media/            # VideoSlide, AudioSlide, AnimatedExplainer, Infographic
    microlearning/    # MicrolearningCards, Flashcards, QuickTips
    navigation/       # CourseMenu, LearningRoadmap, ModuleOverview,
                      # SummaryTakeaways, ResourcesDownloads
    gamification/     # QuizGame, PointsBadges, ProgressTracker, LevelLearning
    compliance/       # PolicyAcknowledgement, DosDonts, CodeOfConduct,
                      # RegulatoryScenario, AuditChecklist
    diagnostic/       # PreAssessment, DiagnosticQuiz, SkillGapAnalysis,
                      # AdaptiveLearningPath, RecommendationCard
    practice/         # GuidedPractice, TryItSimulation, SoftwareSimulation,
                      # SandboxPractice, ErrorIdentification
    feedback/         # ReflectiveQuestion, LearnerJournal, SelfAssessment,
                      # ConfidenceRating, ActionPlanning
    social/           # DiscussionPrompt, PeerReview, PollVote,
                      # TeamChallenge, ScenarioDebate
    accessibility/    # AccessibilityTip, KeyboardNavGuide, ScreenReaderGuide,
                      # LanguageSelector, TranscriptCaption
    analytics/        # ProgressSummary, PerformanceDashboard, SkillMasteryReport,
                      # CompletionCertificate, ManagerReview
  common/
    AudioPlayer.tsx
    CompletionIndicator.tsx
    CircularProgress.tsx
  editor/
    AudioConfigPanel.tsx
    AudioItemRow.tsx
  layout/
    LayoutSelector.tsx
    GridBuilder.tsx
    LayoutPreview.tsx
  preview/
    PageWrapper.tsx
    CompletionBanner.tsx
    QuizFeedback.tsx
    ScoreSummary.tsx
    AnswerIndicator.tsx
  ComponentPicker.tsx
  ComponentCard.tsx
  ComponentList.tsx
  ComponentSlot.tsx
  ComponentToolbar.tsx
  ComponentSettings.tsx
  DynamicComponentRenderer.tsx

src/context/
  ThemeContext.tsx
  CompletionContext.tsx

src/services/
  api.ts
  CourseService.ts
  PageService.ts
  ComponentService.ts
  RegistryService.ts
  ThemeService.ts
  ScoringService.ts
  CompletionService.ts
  AudioService.ts
  ExportService.ts

src/types/
  course.ts
  comprehensive.ts
  registry.ts
  theme.ts
  audio.ts
  completion.ts
  scoring.ts

src/constants/
  templateTypes.ts

src/utils/
  themeUtils.ts
  layoutUtils.ts
  scoringUtils.ts
```

---

## Dependencies & Prerequisites

### New NPM Dependencies
| Package | Purpose | Phase |
|---------|---------|-------|
| `@hello-pangea/dnd` | Drag-and-drop for component/page reordering | Phase 2 |
| `react-colorful` | Color picker for theme editor | Phase 1 |
| `react-virtuoso` | Virtual scrolling for component picker | Phase 5 |
| `chart.js` + `react-chartjs-2` | Score summary visualizations | Phase 4 |

### Backend API Dependencies
| API Group | Required By Phase |
|-----------|------------------|
| Component Registry (`/components`, `/components/categories`, `/components/search`) | Phase 1 |
| Theme APIs (`/themes`, `/courses/{id}/theme`, `/courses/{id}/pages/{id}/theme`) | Phase 1 |
| Page APIs (`/courses/{id}/pages`, reorder) | Phase 2 |
| Component CRUD (`/courses/{id}/pages/{id}/components`, reorder) | Phase 2 |
| Audio APIs (`/assets/audio`, `/courses/{id}/narration`) | Phase 3 |
| Completion APIs (`/courses/{id}/completion`, `/courses/{id}/pages/{id}/completion`) | Phase 3 |
| Interaction APIs (`/courses/{id}/interactions`) | Phase 3 |
| Scoring APIs (`/courses/{id}/scoring`, calculate, validate) | Phase 4 |
| Branching/Adaptive APIs (decision tree, adaptive path resolution) | Phase 5 (Scenario + Diagnostic) |
| Social/Collaborative APIs (discussion, peer review, polls, teams) | Phase 5 (Social) |
| Analytics/Reporting APIs (dashboards, mastery, manager views) | Phase 5 (Analytics) |

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|-----------|
| Registry performance with 89+ types | Lazy loading, code splitting, virtual scrolling in picker |
| Redux state complexity | Normalized state with entity adapters, comprehensive tests |
| Backward compatibility breakage | Legacy transform layer, automated migration tests, feature flags |
| Audio playback cross-browser issues | Use HTML5 Audio API, test on Chrome/Firefox/Safari/Edge |
| Theme CSS variable conflicts | Scoped CSS variables, namespace prefix `--theme-` |

### Timeline Risks
| Risk | Mitigation |
|------|-----------|
| 89+ templates in 8 weeks | Parallel development, template scaffolding generator script |
| Backend API not ready | Mock services, OpenAPI-generated client stubs |
| Testing bottleneck | Parallel test streams, shared test utilities, snapshot tests for templates |

### Quality Risks
| Risk | Mitigation |
|------|-----------|
| Accessibility gaps | WCAG audit at each phase, axe-core automated tests |
| Performance degradation | Performance budgets, Lighthouse CI checks |
| Inconsistent UX across 89+ templates | Shared design system, component style guide |

---

## Success Metrics

### Functional Metrics
- All 89+ component types implemented and tested
- Backward compatibility with existing courses maintained
- SCORM export compatibility for all template types
- Audio playback and per-interaction assignment working
- Page completion tracking with all 4 strategies

### Quality Metrics
- 80%+ test coverage across all components
- WCAG 2.1 AA compliance for all interactive components
- Performance: <3s page load, <100ms component switch
- Zero critical bugs in production

### Business Metrics
- Authoring time reduced by 40% (multi-component pages)
- Template adoption: 80% of new courses use advanced templates
- User satisfaction score >4.5/5

---

## Feature Flag Strategy

| Flag | Description | Phase |
|------|-------------|-------|
| `ENABLE_COMPONENT_REGISTRY` | Use registry instead of switch-based rendering | Phase 1 |
| `ENABLE_MULTI_COMPONENT_PAGES` | Allow multiple components per page | Phase 2 |
| `ENABLE_PAGE_LAYOUT` | Show layout selector in page editor | Phase 2 |
| `ENABLE_AUDIO_PLAYER` | Show audio player in preview mode | Phase 3 |
| `ENABLE_COMPLETION_TRACKING` | Enable completion context and page wrapper | Phase 3 |
| `ENABLE_SCORING` | Enable scoring UI and quiz feedback | Phase 4 |
| `ENABLE_ADVANCED_TEMPLATES` | Unlock diagnostic, practice, social, analytics categories | Phase 5 |

All flags stored in `src/utils/featureFlags.ts` and toggled via environment variables.
