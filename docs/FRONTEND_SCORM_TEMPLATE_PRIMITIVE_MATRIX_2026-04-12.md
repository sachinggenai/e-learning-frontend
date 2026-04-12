# Frontend SCORM Template Primitive Matrix (2026-04-12)

Scope: Mapping of all 84 active template/component types to reusable export-runtime primitives, expected renderer strategy, and rough frontend effort band.

## Legend

- Primitive: Shared rendering building block the runtime should reuse.
- Strategy:
  - `direct`: straightforward renderer using one primitive
  - `composed`: renderer built from multiple primitives
  - `specialized`: needs template-specific logic beyond simple composition
- Effort:
  - `S`: 0.5 to 1 day
  - `M`: 1 to 2 days
  - `L`: 2 to 4 days

## Core Primitive Set

1. `rich-text`
2. `tabs-shell`
3. `accordion-shell`
4. `card-grid`
5. `media-shell`
6. `resource-list`
7. `assessment-shell`
8. `choice-group`
9. `process-shell`
10. `node-graph`
11. `navigation-shell`
12. `report-shell`
13. `metric-card`
14. `scenario-shell`
15. `interaction-shell`
16. `accessibility-info`
17. `feedback-shell`
18. `gamification-shell`

## Content Presentation

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `tabs` | content-presentation | `tabs-shell`, `rich-text` | direct | M | High-priority proving case |
| `accordion` | content-presentation | `accordion-shell`, `rich-text` | direct | M | High-priority proving case |
| `click-reveal` | content-presentation | `interaction-shell`, `card-grid`, `rich-text` | composed | M | Reveal-state handling |
| `timeline` | content-presentation | `process-shell`, `rich-text` | direct | M | Chronological list layout |
| `image-hotspots` | content-presentation | `media-shell`, `interaction-shell`, `rich-text` | specialized | L | Positioning + overlays |
| `layered-content` | content-presentation | `navigation-shell`, `rich-text` | composed | M | Layer switching |
| `text-with-media` | content-presentation | `media-shell`, `rich-text` | direct | S | Low-risk |

## Navigation

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `course-menu` | navigation | `navigation-shell`, `card-grid` | composed | M | Progress-aware visuals if data exists |
| `resources-downloads` | navigation | `resource-list`, `rich-text` | direct | S | Asset-dependent but simple layout |
| `module-overview` | navigation | `navigation-shell`, `card-grid`, `rich-text` | composed | M | Section summary layout |
| `learning-roadmap` | navigation | `process-shell`, `navigation-shell` | composed | M | Milestone/path visuals |
| `summary-takeaways` | navigation | `card-grid`, `rich-text` | direct | S | Low interaction complexity |

## Assessment

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `mcq` | assessment | `assessment-shell`, `choice-group` | direct | M | Existing export support to refactor |
| `multiple-select` | assessment | `assessment-shell`, `choice-group` | direct | M | Multi-answer state |
| `true-false` | assessment | `assessment-shell`, `choice-group` | direct | S | Simple binary choice |
| `fill-blanks` | assessment | `assessment-shell`, `interaction-shell` | specialized | M | Input validation state |
| `matching` | assessment | `assessment-shell`, `interaction-shell` | specialized | L | Pairing UI |
| `knowledge-check` | assessment | `assessment-shell`, `choice-group` | direct | M | Reuses quiz shell |
| `final-assessment` | assessment | `assessment-shell`, `choice-group` | composed | M | Assessment sequence wrapper |
| `scenario-question` | assessment | `assessment-shell`, `scenario-shell` | composed | M | Prompt + response state |

## Media Rich

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `animated-explainer` | media-rich | `media-shell`, `rich-text` | direct | M | Animation fallback considerations |
| `audio-slide` | media-rich | `media-shell`, `rich-text` | direct | M | Audio controls |
| `infographic` | media-rich | `media-shell`, `card-grid`, `rich-text` | composed | M | Layout-heavy |
| `video-slide` | media-rich | `media-shell`, `rich-text` | direct | S | Standard media layout |

## Process Flow

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `step-by-step` | process-flow | `process-shell`, `rich-text` | direct | S | Reusable step list |
| `cycle-diagram` | process-flow | `process-shell`, `node-graph` | specialized | M | Circular layout |
| `flowchart` | process-flow | `node-graph` | specialized | L | Node + edge rendering |
| `decision-tree` | process-flow | `node-graph`, `scenario-shell` | specialized | L | Branch state |
| `process-map` | process-flow | `process-shell`, `node-graph` | composed | M | Hybrid process layout |

## Comparison

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `before-after` | comparison | `card-grid`, `media-shell`, `rich-text` | composed | M | Side-by-side compare |
| `comparison-table` | comparison | `report-shell`, `rich-text` | direct | S | Table layout |
| `matrix-grid` | comparison | `report-shell`, `card-grid` | composed | M | Matrix semantics |
| `pros-cons` | comparison | `card-grid`, `rich-text` | direct | S | Low interaction complexity |

## Feedback

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `action-planning` | feedback | `feedback-shell`, `rich-text` | direct | M | Reflective input |
| `confidence-rating` | feedback | `feedback-shell`, `interaction-shell` | direct | S | Rating UI |
| `learner-journal` | feedback | `feedback-shell`, `rich-text` | direct | M | Long-form input |
| `reflective-question` | feedback | `feedback-shell`, `rich-text` | direct | S | Prompt + response |
| `self-assessment` | feedback | `feedback-shell`, `choice-group` | composed | M | Rating/selection mix |

## Diagnostic

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `adaptive-learning-path` | diagnostic | `scenario-shell`, `navigation-shell` | specialized | L | Path recommendation logic |
| `diagnostic-quiz` | diagnostic | `assessment-shell`, `choice-group` | composed | M | Quiz wrapper |
| `pre-assessment` | diagnostic | `assessment-shell`, `choice-group` | direct | M | Shared assessment shell |
| `recommendation-card` | diagnostic | `card-grid`, `rich-text` | direct | S | Recommendation layout |
| `skill-gap-analysis` | diagnostic | `report-shell`, `metric-card` | composed | M | Skill summary display |

## Analytics

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `completion-certificate` | analytics | `report-shell`, `rich-text` | direct | S | Certificate layout |
| `manager-review` | analytics | `report-shell`, `metric-card` | composed | M | Structured report |
| `performance-dashboard` | analytics | `report-shell`, `metric-card` | direct | M | Metric cards + summary |
| `progress-summary` | analytics | `report-shell`, `metric-card` | direct | S | Summary report |
| `skill-mastery-report` | analytics | `report-shell`, `metric-card` | composed | M | Skill table/cards |

## Accessibility

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `accessibility-tip` | accessibility | `accessibility-info`, `rich-text` | direct | S | Simple advisory block |
| `keyboard-nav-guide` | accessibility | `accessibility-info`, `report-shell` | direct | S | Instructional layout |
| `language-selector` | accessibility | `accessibility-info`, `interaction-shell` | composed | M | Selector state |
| `screen-reader-guide` | accessibility | `accessibility-info`, `rich-text` | direct | S | Low layout complexity |
| `transcript-caption` | accessibility | `accessibility-info`, `media-shell`, `rich-text` | composed | M | Media transcript alignment |

## Compliance

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `audit-checklist` | compliance | `feedback-shell`, `choice-group` | composed | M | Checklist state |
| `code-of-conduct` | compliance | `rich-text`, `feedback-shell` | direct | S | Content + acknowledgement |
| `dos-donts` | compliance | `card-grid`, `rich-text` | direct | S | Dual-column compare |
| `policy-acknowledgement` | compliance | `feedback-shell`, `rich-text` | direct | M | Acknowledge action |
| `regulatory-scenario` | compliance | `scenario-shell`, `rich-text` | specialized | M | Scenario flow |

## Practice

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `error-identification` | practice | `interaction-shell`, `media-shell` | specialized | M | Select error targets |
| `guided-practice` | practice | `feedback-shell`, `process-shell` | composed | M | Step guidance |
| `sandbox-practice` | practice | `interaction-shell`, `scenario-shell` | specialized | L | Open practice surface |
| `software-simulation` | practice | `interaction-shell`, `media-shell` | specialized | L | Simulation hotspots/state |
| `try-it-simulation` | practice | `interaction-shell`, `media-shell` | specialized | L | Similar to software simulation |

## Scenario

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `branching-scenario` | scenario | `scenario-shell` | specialized | L | Branching flow engine |
| `case-study` | scenario | `scenario-shell`, `rich-text` | composed | M | Narrative + decision structure |
| `role-play-simulation` | scenario | `scenario-shell`, `interaction-shell` | specialized | L | Multi-step state |
| `scenario` | scenario | `scenario-shell`, `rich-text` | direct | M | Generic scenario wrapper |

## Social

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `discussion-prompt` | social | `feedback-shell`, `rich-text` | direct | S | Static prompt unless backend adds live data |
| `peer-review` | social | `feedback-shell`, `report-shell` | composed | M | Review rubric shell |
| `poll-vote` | social | `interaction-shell`, `choice-group` | direct | M | Vote UI |
| `scenario-debate` | social | `scenario-shell`, `feedback-shell` | composed | M | Debate response flow |
| `team-challenge` | social | `gamification-shell`, `card-grid` | composed | M | Team score shell |

## Gamification

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `level-learning` | gamification | `gamification-shell`, `metric-card` | direct | M | Progress/level display |
| `points-badges` | gamification | `gamification-shell`, `card-grid` | direct | S | Badge list |
| `progress-tracker` | gamification | `gamification-shell`, `metric-card` | direct | S | Progress visualization |
| `quiz-game` | gamification | `assessment-shell`, `gamification-shell` | composed | M | Quiz wrapper with gamified shell |

## Microlearning

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `flashcards` | microlearning | `interaction-shell`, `card-grid` | direct | M | Flip state |
| `microlearning-cards` | microlearning | `card-grid`, `rich-text` | direct | S | Card list |
| `quick-tips` | microlearning | `card-grid`, `rich-text` | direct | S | Tip cards |

## Interaction

| Template | Category | Primitive(s) | Strategy | Effort | Notes |
|---|---|---|---|---|---|
| `carousel` | interaction | `interaction-shell`, `card-grid` | composed | M | Slide navigation |
| `clickable-icons` | interaction | `interaction-shell`, `card-grid`, `rich-text` | composed | M | Icon-trigger reveal |
| `drag-and-drop` | interaction | `interaction-shell` | specialized | L | Strong interaction logic |
| `flip-cards` | interaction | `interaction-shell`, `card-grid` | direct | M | Flip state |
| `slider` | interaction | `interaction-shell` | direct | S | Slider control |

## Priority Ordering

### Wave 1
- `tabs`
- `accordion`
- `text-with-media`
- `mcq`
- `course-menu`
- `resources-downloads`
- `module-overview`
- `learning-roadmap`
- `summary-takeaways`

### Wave 2
- `multiple-select`
- `true-false`
- `timeline`
- `click-reveal`
- `image-hotspots`
- `step-by-step`
- `comparison-table`
- `transcript-caption`
- `video-slide`

### Wave 3
- Remaining categories by primitive reuse potential

## TPO Notes

- This matrix is for frontend planning and renderer strategy only.
- Backend asset delivery, persisted style data, and ZIP packaging are external dependencies.
- Frontend should update this matrix as renderer implementation reaches `primitive-ready`, `renderer-ready`, and `tested` states in the main implementation doc.