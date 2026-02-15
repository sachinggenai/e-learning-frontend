# Master Data — Seed Data for Backend DB

This directory contains **all master/seed data** required by the backend to populate the database. The data covers every API entity defined in the OpenAPI v3.1 specification.

## Quick Start (for Backend Team)

### Option A — Use the JSON files directly

Pre-generated JSON files are in the `seed-data/` folder (root of the repo). Each file corresponds to one DB collection/table.

### Option B — Regenerate JSON files from TypeScript source

```bash
npx tsx scripts/exportMasterData.ts
```

This creates/updates the `seed-data/` folder with 19 JSON files.

---

## File Inventory

| # | File | DB Collection | Records | Description |
|---|------|--------------|---------|-------------|
| 1 | `01-categories.json` | `categories` | 17 | Component type categories |
| 2 | `02-component-types.json` | `component_types` | 89 | All component type definitions (full detail) |
| 3 | `03-component-types-by-category.json` | — | 17 groups | Component types grouped by category (convenience) |
| 4 | `04-theme-presets.json` | `themes` | 5 | Pre-built theme presets |
| 5 | `05-courses.json` | `courses` | 3 | Full course objects with nested pages/components |
| 6 | `06-course-safety-101.json` | — | 1 | Individual course: Workplace Safety |
| 7 | `07-course-cs-excellence.json` | — | 1 | Individual course: Customer Service |
| 8 | `08-course-webdev-intro.json` | — | 1 | Individual course: Web Development |
| 9 | `09-course-list.json` | — | 3 | Course list summaries (for list endpoints) |
| 10 | `10-score-response-pass.json` | `score_results` | 1 | Sample passing score calculation |
| 11 | `11-score-response-fail.json` | `score_results` | 1 | Sample failing score calculation |
| 12 | `12-course-completion.json` | `completion_status` | 1 | Course completion status with all pages |
| 13 | `13-page-completion.json` | `completion_status` | 1 | Single page completion status |
| 14 | `14-interaction-events.json` | `interactions` | 14 | Interaction event history samples |
| 15 | `15-audio-assets.json` | `audio_assets` | 4 | Audio file metadata |
| 16 | `16-export-statuses.json` | `exports` | 4 | Export lifecycle states (pending → completed/failed) |
| 17 | `17-validation-pass.json` | — | 1 | Validation response (valid course) |
| 18 | `18-validation-fail.json` | — | 1 | Validation response (invalid course with errors) |
| 19 | `19-media-uploads.json` | `media` | 5 | Uploaded media file metadata |

---

## Data Schema Reference

All data structures match the TypeScript interfaces in `src/types/course.ts`. Key entities:

### Component Categories (`01-categories.json`)

```json
{
  "categoryId": "content-presentation",
  "displayName": "Content Presentation",
  "description": "Core content display components...",
  "icon": "layout",
  "componentCount": 7,
  "sortOrder": 0
}
```

**17 Categories**: content-presentation, process-flow, interaction, scenario, assessment, comparison, media-rich, microlearning, navigation, gamification, compliance, diagnostic, practice, feedback, social, accessibility, analytics

### Component Types (`02-component-types.json`)

```json
{
  "typeId": "mcq",
  "category": "assessment",
  "displayName": "Multiple Choice",
  "description": "Single-answer multiple choice question with feedback",
  "icon": "circle-check",
  "tags": ["quiz", "mcq", "question", "assessment"],
  "completionCapabilities": ["interact", "score"],
  "scoringEnabled": true,
  "audioSupport": {
    "perComponent": true,
    "perInteraction": false
  },
  "schema": {},
  "defaultData": {
    "question": "What is the capital of France?",
    "options": [
      { "id": "opt-1", "text": "Paris", "isCorrect": true },
      { "id": "opt-2", "text": "London", "isCorrect": false }
    ],
    "explanation": "Paris is the capital of France.",
    "maxScore": 10
  },
  "defaultCompletionType": "interact",
  "maxScore": 10,
  "scoringRules": { "mode": "all-or-nothing" },
  "sortOrder": 0,
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-14T00:00:00Z"
}
```

**89 Component Types across 17 categories:**

| Category | Component Types |
|----------|----------------|
| Content Presentation (7) | tabs, accordion, click-reveal, timeline, image-hotspots, layered-content, text-with-media |
| Process & Flow (5) | step-by-step, cycle-diagram, flowchart, process-map, decision-tree |
| Interaction (5) | drag-and-drop, flip-cards, slider, carousel, clickable-icons |
| Scenario (4) | scenario, branching-scenario, role-play-simulation, case-study |
| Assessment (8) | mcq, multiple-select, true-false, fill-blanks, matching, scenario-question, knowledge-check, final-assessment |
| Comparison (4) | comparison-table, pros-cons, before-after, matrix-grid |
| Media-Rich (4) | video-slide, audio-slide, animated-explainer, infographic |
| Microlearning (3) | microlearning-cards, flashcards, quick-tips |
| Navigation (5) | course-menu, learning-roadmap, module-overview, summary-takeaways, resources-downloads |
| Gamification (4) | quiz-game, points-badges, progress-tracker, level-learning |
| Compliance (5) | policy-acknowledgement, dos-donts, code-of-conduct, regulatory-scenario, audit-checklist |
| Diagnostic (5) | pre-assessment, diagnostic-quiz, skill-gap-analysis, adaptive-learning-path, recommendation-card |
| Practice (5) | guided-practice, try-it-simulation, software-simulation, sandbox-practice, error-identification |
| Feedback (5) | reflective-question, learner-journal, self-assessment, confidence-rating, action-planning |
| Social (5) | discussion-prompt, peer-review, poll-vote, team-challenge, scenario-debate |
| Accessibility (5) | accessibility-tip, keyboard-nav-guide, screen-reader-guide, language-selector, transcript-caption |
| Analytics (5) | progress-summary, performance-dashboard, skill-mastery-report, completion-certificate, manager-review |

### Theme Presets (`04-theme-presets.json`)

```json
{
  "themeId": "preset-light",
  "name": "Modern Light",
  "isPreset": true,
  "colors": {
    "primary": "#2563EB",
    "secondary": "#7C3AED",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#1E293B",
    "textSecondary": "#64748B",
    "border": "#E2E8F0",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headingFont": "Inter, system-ui, sans-serif",
    "baseFontSize": 16,
    "headingSizes": { "h1": 32, "h2": 26, "h3": 22, "h4": 18 },
    "lineHeight": 1.6,
    "fontWeight": { "normal": 400, "medium": 500, "bold": 700 }
  },
  "componentStyles": {
    "button": { "borderRadius": 12, "padding": "10px 20px", "fontWeight": 600, "textTransform": "none" },
    "card": { "borderRadius": 12, "shadow": "0 1px 3px rgba(0,0,0,0.12)", "borderWidth": 1, "padding": "20px" },
    "tabs": { "style": "pill", "borderRadius": 8 },
    "accordion": { "style": "card", "iconPosition": "right", "spacing": 8 },
    "input": { "borderRadius": 8, "borderColor": "#E2E8F0", "focusColor": "#2563EB" },
    "progressBar": { "height": 8, "borderRadius": 4 }
  }
}
```

**5 Presets**: Modern Light, Dark Mode, Corporate Blue, Vibrant & Playful, Minimal Mono

### Course Structure (`05-courses.json`)

```json
{
  "courseId": "course-safety-101",
  "title": "Workplace Safety & Compliance",
  "author": "Safety Training Dept.",
  "language": "en",
  "description": "...",
  "version": "1.0.0",
  "status": "published",
  "pages": [
    {
      "pageId": "p1-01",
      "title": "Welcome to Workplace Safety",
      "order": 0,
      "components": [
        {
          "componentId": "c1-01-01",
          "componentType": "text-with-media",
          "order": 0,
          "data": { "title": "...", "body": "...", "mediaUrl": "..." },
          "completionCriteria": { "type": "view" }
        }
      ],
      "layout": { "preset": "single-column", "spacing": "normal" },
      "pageCompletion": { "enabled": true, "strategy": "all" },
      "theme": { "inheritCourse": true }
    }
  ],
  "navigation": { "allowSkip": false, "showProgress": true, "linearProgression": true },
  "settings": { "themeId": "preset-corporate", "autoplay": false, "duration": 45 },
  "scoring": {
    "config": {
      "passingScore": 70,
      "maxAttempts": 3,
      "attemptScoring": "best",
      "showCorrectAnswers": true,
      "weightedScoring": false,
      "allowPartialCredit": true
    },
    "componentScores": [...],
    "scormReporting": { "enabled": true, "version": "1.2", ... }
  }
}
```

**3 Sample Courses:**

| Course ID | Title | Pages | Components | Theme | Status |
|-----------|-------|-------|------------|-------|--------|
| course-safety-101 | Workplace Safety & Compliance | 7 | 16 | Corporate Blue | published |
| course-cs-excellence | Customer Service Excellence | 5 | 11 | Vibrant & Playful | published |
| course-webdev-intro | Introduction to Web Development | 5 | 13 | Modern Light | draft |

### Scoring Config

Nested in each course under `scoring`. See `10-score-response-pass.json` and `11-score-response-fail.json` for calculation result samples.

### Completion Status

See `12-course-completion.json` for a full course completion tree and `13-page-completion.json` for a single page.

### Interaction Events (`14-interaction-events.json`)

```json
{
  "pageId": "p1-02",
  "componentId": "c1-02-02",
  "interactionType": "click",
  "data": {
    "interactionId": "hs-1",
    "value": "Wet Floor"
  },
  "completed": false
}
```

**Interaction types**: view, click, submit, audio-play, audio-complete, drag-drop, select, input, navigation

---

## Component Types per Use Case

| Use Case | Recommended Component Types |
|----------|---------------------------|
| UC1: Create Course | course-menu, module-overview, learning-roadmap |
| UC2: Add/Edit Page | Any component type used within pages |
| UC3: Content Authoring | tabs, accordion, click-reveal, text-with-media, carousel, flip-cards |
| UC4: Assessment Creation | mcq, multiple-select, true-false, fill-blanks, matching, knowledge-check, final-assessment |
| UC5: Scoring Configuration | mcq, quiz-game, scenario, branching-scenario, drag-and-drop |
| UC6: Theme Customization | All — themes are applied globally or per-page |
| UC7: Audio Integration | tabs (per-tab), accordion (per-panel), step-by-step (per-step), audio-slide |
| UC8: Completion Tracking | All types with completionCapabilities defined |
| UC9: Scenario-Based Learning | scenario, branching-scenario, role-play-simulation, case-study |
| UC10: SCORM Export | All — packaged via ExportService |
| UC11: Drag & Drop Reorder | drag-and-drop, matching |
| UC12: Gamification | quiz-game, points-badges, progress-tracker, level-learning |
| UC13: Compliance Training | policy-acknowledgement, dos-donts, code-of-conduct, regulatory-scenario, audit-checklist |

---

## How to Import into Backend DB

### MongoDB

```javascript
const fs = require('fs');
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('elearning');

// Categories
const categories = JSON.parse(fs.readFileSync('seed-data/01-categories.json'));
await db.collection('categories').insertMany(categories);

// Component Types
const types = JSON.parse(fs.readFileSync('seed-data/02-component-types.json'));
await db.collection('component_types').insertMany(types);

// Themes
const themes = JSON.parse(fs.readFileSync('seed-data/04-theme-presets.json'));
await db.collection('themes').insertMany(themes);

// Courses
const courses = JSON.parse(fs.readFileSync('seed-data/05-courses.json'));
await db.collection('courses').insertMany(courses);
```

### PostgreSQL (via JSON column or normalized)

```sql
-- Create tables and import JSON using your ORM/migration tool
-- Each JSON file maps to a table:
--   categories     → 01-categories.json
--   component_types → 02-component-types.json
--   themes         → 04-theme-presets.json
--   courses        → 05-courses.json (with pages/components as JSONB)
```

### Python (FastAPI / Django)

```python
import json

with open('seed-data/02-component-types.json') as f:
    component_types = json.load(f)

for ct in component_types:
    ComponentType.objects.create(**ct)
```

---

## Source Files (TypeScript)

| File | Description |
|------|-------------|
| `src/data/componentRegistryData.ts` | 17 categories + 89 component type definitions |
| `src/data/themePresetsData.ts` | 5 theme presets with colors, typography, component styles |
| `src/data/sampleCoursesData.ts` | 3 sample courses with pages, components, scoring |
| `src/data/scoringCompletionData.ts` | Score calc, completion, interactions, audio, export, validation, media |
| `src/data/index.ts` | Barrel export |
| `scripts/exportMasterData.ts` | JSON exporter script |

---

## Notes for Backend Team

1. **IDs are string-based** — use UUID or string primary keys
2. **Dates are ISO 8601** — `2026-01-01T00:00:00Z`
3. **All `defaultData` schemas** are in `02-component-types.json` — use these to validate component data on save
4. **Course → Page → Component** is a nested hierarchy; you may normalize into separate tables or keep as nested documents
5. **`completionCapabilities`** on each component type defines what completion criteria types are valid for that type
6. **`scoringEnabled: true`** means the component can contribute to course score; see `maxScore` and `scoringRules`
7. **`audioSupport.perInteraction`** means audio can be attached per interaction point (e.g., per tab, per accordion panel)
8. **Theme cascading**: Page theme → Course theme → Preset theme (page overrides course, which overrides preset default)
