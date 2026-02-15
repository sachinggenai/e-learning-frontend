# Backend Team — Master/Seed Data Handoff

**From:** Frontend Team  
**Date:** February 14, 2026  
**Subject:** Seed Data for DB Population — Component Types, Themes, Sample Courses & All API Entities

---

## Hi Backend Team,

We have prepared **complete master/seed data** for every entity in our OpenAPI v3.1 specification. This data is ready for you to import directly into the database so that all API endpoints return realistic, consistent data from day one.

Everything is available in **two formats**:
1. **JSON files** (ready to import) → `seed-data/` folder (19 files, ~330 KB total)
2. **TypeScript source** (if you need to modify and re-export) → `src/data/` folder

---

## What's Included

### 1. Component Type Registry — `seed-data/01-categories.json` + `02-component-types.json`

**17 categories** and **84 component types** covering every supported component in the platform.

Each component type includes:
- `typeId`, `category`, `displayName`, `description`, `icon`, `tags`
- `completionCapabilities` — what completion modes the component supports (view, interact, audio, score, custom)
- `scoringEnabled` — whether the component can contribute to course score
- `audioSupport` — per-component and per-interaction audio configuration
- `defaultData` — **the exact default data shape** the backend should store when a new component of this type is created
- `maxScore`, `scoringRules`, `sortOrder`, `isActive`

**Categories & Component Counts:**

| # | Category | Count | Component Types |
|---|----------|-------|----------------|
| 1 | Content Presentation | 7 | tabs, accordion, click-reveal, timeline, image-hotspots, layered-content, text-with-media |
| 2 | Process & Flow | 5 | step-by-step, cycle-diagram, flowchart, process-map, decision-tree |
| 3 | Interaction | 5 | drag-and-drop, flip-cards, slider, carousel, clickable-icons |
| 4 | Scenario-Based | 4 | scenario, branching-scenario, role-play-simulation, case-study |
| 5 | Assessment | 8 | mcq, multiple-select, true-false, fill-blanks, matching, scenario-question, knowledge-check, final-assessment |
| 6 | Comparison & Analysis | 4 | comparison-table, pros-cons, before-after, matrix-grid |
| 7 | Media-Rich | 4 | video-slide, audio-slide, animated-explainer, infographic |
| 8 | Microlearning | 3 | microlearning-cards, flashcards, quick-tips |
| 9 | Navigation & Structural | 5 | course-menu, learning-roadmap, module-overview, summary-takeaways, resources-downloads |
| 10 | Gamification | 4 | quiz-game, points-badges, progress-tracker, level-learning |
| 11 | Compliance & Corporate | 5 | policy-acknowledgement, dos-donts, code-of-conduct, regulatory-scenario, audit-checklist |
| 12 | Diagnostic & Adaptive | 5 | pre-assessment, diagnostic-quiz, skill-gap-analysis, adaptive-learning-path, recommendation-card |
| 13 | Practice & Simulation | 5 | guided-practice, try-it-simulation, software-simulation, sandbox-practice, error-identification |
| 14 | Feedback & Reflection | 5 | reflective-question, learner-journal, self-assessment, confidence-rating, action-planning |
| 15 | Social & Collaborative | 5 | discussion-prompt, peer-review, poll-vote, team-challenge, scenario-debate |
| 16 | Accessibility & Support | 5 | accessibility-tip, keyboard-nav-guide, screen-reader-guide, language-selector, transcript-caption |
| 17 | Analytics & Learning Insight | 5 | progress-summary, performance-dashboard, skill-mastery-report, completion-certificate, manager-review |

**File for grouped view:** `seed-data/03-component-types-by-category.json`

---

### 2. Theme Presets — `seed-data/04-theme-presets.json`

**5 pre-built themes** ready to insert into the `themes` collection/table:

| Theme ID | Name | Best For |
|----------|------|----------|
| preset-light | Modern Light | General purpose, default theme |
| preset-dark | Dark Mode | Night-time learning, reduced eye strain |
| preset-corporate | Corporate Blue | Compliance, onboarding, professional courses |
| preset-vibrant | Vibrant & Playful | Gamified, creative, engagement-focused courses |
| preset-minimal | Minimal Mono | Technical documentation, code-heavy content |

Each theme contains:
- `colors` (12 tokens: primary, secondary, accent, background, surface, text, textSecondary, border, success, warning, error, info)
- `typography` (fontFamily, headingFont, baseFontSize, headingSizes, lineHeight, fontWeight)
- `componentStyles` (button, card, tabs, accordion, input, progressBar styles)

---

### 3. Sample Courses — `seed-data/05-courses.json` (or individual files 06, 07, 08)

**3 fully-populated courses** demonstrating all use cases:

| Course ID | Title | Pages | Components | Theme | Status | Use Cases Covered |
|-----------|-------|-------|------------|-------|--------|------------------|
| course-safety-101 | Workplace Safety & Compliance | 7 | 16 | Corporate Blue | published | UC1, UC3, UC4, UC5, UC7, UC8, UC9, UC10, UC13 |
| course-cs-excellence | Customer Service Excellence | 5 | 11 | Vibrant & Playful | published | UC1, UC3, UC4, UC5, UC8, UC9, UC12 |
| course-webdev-intro | Introduction to Web Development | 5 | 13 | Modern Light | draft | UC1, UC2, UC3, UC4, UC6, UC8, UC11 |

Each course includes:
- Full **page** hierarchy with `pageId`, `title`, `order`, `layout`, `pageCompletion`, `theme`
- Full **component** data with `componentId`, `componentType`, `order`, `data`, `audioConfig`, `completionCriteria`
- **Navigation settings** (`allowSkip`, `showProgress`, `linearProgression`)
- **Course settings** (`themeId`, `autoplay`, `duration`)
- **Scoring config** (`passingScore`, `maxAttempts`, `attemptScoring`, `componentScores`, `scormReporting`)

**Component types used across the 3 courses:**
text-with-media, module-overview, learning-roadmap, tabs, image-hotspots, dos-donts, accordion, comparison-table, step-by-step, scenario, knowledge-check, final-assessment, summary-takeaways, policy-acknowledgement, completion-certificate, pre-assessment, flip-cards, branching-scenario, self-assessment, action-planning, quiz-game, carousel, flashcards, fill-blanks, before-after, matching, timeline, click-reveal, mcq, confidence-rating, resources-downloads

---

### 4. Scoring & Score Calculation — `seed-data/10-*.json`, `11-*.json`

Two sample score calculation responses:

- **10-score-response-pass.json** — Student scored 82/100 (passed, 70% threshold)
- **11-score-response-fail.json** — Student scored 35/100 (failed)

Each contains `componentResults` with per-question breakdowns (`questionResults`), weighted scores, and remaining attempts.

---

### 5. Completion Status — `seed-data/12-*.json`, `13-*.json`

- **12-course-completion.json** — Full course completion tree showing 57% progress (4 of 7 pages complete, per-component status)
- **13-page-completion.json** — Single page completion status with component-level tracking

---

### 6. Interaction Events — `seed-data/14-interaction-events.json`

**14 sample interaction events** covering all interaction types:
`view`, `click`, `submit`, `audio-play`, `audio-complete`, `select`, `navigation`

These represent the event stream the frontend sends as learners interact with components.

---

### 7. Audio Assets — `seed-data/15-audio-assets.json`

**4 audio asset records** with metadata: `audioId`, `audioUrl`, `duration`, `label`, `transcript`, `mimeType`, `fileSize`, `courseId`

---

### 8. Export Statuses — `seed-data/16-export-statuses.json`

**4 export lifecycle states**: pending → processing → completed → failed

The completed state includes a `downloadUrl`; the failed state includes an `error` message.

---

### 9. Validation Responses — `seed-data/17-*.json`, `18-*.json`

- **17-validation-pass.json** — `{ valid: true, errors: [] }`
- **18-validation-fail.json** — `{ valid: false, errors: [4 sample errors] }`

---

### 10. Media Uploads — `seed-data/19-media-uploads.json`

**5 media upload records** covering images, audio, and documents with `fileId`, `fileUrl`, `mimeType`, `category`.

---

## File Summary Table

| File | Target DB Table | Records | Size |
|------|----------------|---------|------|
| `01-categories.json` | categories | 17 | 4 KB |
| `02-component-types.json` | component_types | 84 | 83 KB |
| `03-component-types-by-category.json` | *(grouped view)* | 17 groups | 90 KB |
| `04-theme-presets.json` | themes | 5 | 8 KB |
| `05-courses.json` | courses (+ pages + components) | 3 | 68 KB |
| `06-course-safety-101.json` | *(individual)* | 1 course, 7 pages | 27 KB |
| `07-course-cs-excellence.json` | *(individual)* | 1 course, 5 pages | 18 KB |
| `08-course-webdev-intro.json` | *(individual)* | 1 course, 5 pages | 19 KB |
| `09-course-list.json` | *(summary view)* | 3 | 1 KB |
| `10-score-response-pass.json` | score_results | 1 | 2 KB |
| `11-score-response-fail.json` | score_results | 1 | 1 KB |
| `12-course-completion.json` | completion_status | 1 | 3 KB |
| `13-page-completion.json` | completion_status | 1 | 0.4 KB |
| `14-interaction-events.json` | interactions | 14 | 3 KB |
| `15-audio-assets.json` | audio_assets | 4 | 2 KB |
| `16-export-statuses.json` | exports | 4 states | 1 KB |
| `17-validation-pass.json` | *(response)* | 1 | 0.1 KB |
| `18-validation-fail.json` | *(response)* | 1 | 1 KB |
| `19-media-uploads.json` | media | 5 | 1 KB |

---

## Actions Required from Backend Team

### Priority 1 — Populate Reference Data (Component Registry + Themes)
1. **Import `01-categories.json`** into your `categories` table/collection
2. **Import `02-component-types.json`** into your `component_types` table/collection — this is the registry the frontend queries to know what components exist
3. **Import `04-theme-presets.json`** into your `themes` table/collection (set `isPreset: true` to mark them as system defaults)

### Priority 2 — Populate Sample Courses
4. **Import `05-courses.json`** (or the individual 06/07/08 files) — these are complete courses with nested pages and components that can be used for testing all CRUD endpoints

### Priority 3 — Populate Transactional Data (for testing)
5. **Import `14-interaction-events.json`** → interactions table (for testing `GET /interactions` and completion engine)
6. **Import `15-audio-assets.json`** → audio_assets table
7. **Import `19-media-uploads.json`** → media table
8. Use `10-*`, `11-*`, `12-*`, `13-*` as **reference shapes** for score calculation and completion tracking responses

---

## Important Notes for Implementation

1. **All IDs are strings** (not integers) — use UUID or string primary keys
2. **Dates are ISO 8601 UTC** format (`2026-01-01T00:00:00Z`)
3. **The `defaultData` field** in each component type is the template for newly created components — when a user adds a new "mcq" component, populate its `data` field with the `defaultData` from the mcq component type
4. **Course → Page → Component** is a nested hierarchy:
   - **Option A:** Store as nested document (MongoDB-style)
   - **Option B:** Normalize into separate `courses`, `pages`, `components` tables with foreign keys
5. **Theme cascade order:** Page theme overrides → Course theme overrides → Preset theme default
6. **`completionCapabilities`** on each component type defines which `CompletionCriteria.type` values are valid — validate on save
7. **`scoringEnabled: true`** components can appear in `ScoringConfig.componentScores` — others cannot
8. **`audioSupport.perInteraction: true`** means audio items can be attached to individual interaction points (tabs, accordion panels, steps, etc.)

---

## API Contract Reference

All data schemas are defined in:
- **`openapi-v3.1-complete.yaml`** — Full API specification
- **`src/types/course.ts`** — TypeScript interface definitions (the single source of truth the frontend uses)

---

## How to Regenerate JSON Files

If we update the TypeScript source data, you can regenerate all JSON files:

```bash
cd e-learning-frontend
npx tsx scripts/exportMasterData.ts
```

This outputs fresh JSON files to `seed-data/`.

---

## Questions / Support

If any data shape doesn't match your DB schema or you need additional sample records, let us know and we'll update the seed data accordingly.

**Source files you may want to review:**
- `src/data/componentRegistryData.ts` — All 84 component types with defaultData shapes
- `src/data/themePresetsData.ts` — 5 theme presets with full color/typography/style config
- `src/data/sampleCoursesData.ts` — 3 courses with realistic page/component hierarchies
- `src/data/scoringCompletionData.ts` — Scoring, completion, interaction, audio, export, validation data
- `src/data/MASTER_DATA_README.md` — Detailed technical reference with DB import examples

---

*Generated by Frontend Team — February 14, 2026*
