# eLearning Authoring Tool — User Manual

**Version**: 2.0 | **Application**: eLearning Editor Frontend  
**Stack**: React 18 + TypeScript + Redux Toolkit  
**Backend API**: REST (OpenAPI v3.1) at `http://localhost:8000/api/v1`

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Application Overview](#2-application-overview)
3. [Use Case 1 — Create a Course with Composable Components](#3-use-case-1--create-a-course-with-composable-components)
4. [Use Case 2 — Design Per-Component Audio Narration](#4-use-case-2--design-per-component-audio-narration)
5. [Use Case 3 — Enable Scoring Across Assessment Components](#5-use-case-3--enable-scoring-across-assessment-components)
6. [Use Case 4 — Track Learner Completion (Multi-Level Rules)](#6-use-case-4--track-learner-completion-multi-level-rules)
7. [Use Case 5 — Customize Course Theme (Colors & Typography)](#7-use-case-5--customize-course-theme-colors--typography)
8. [Use Case 6 — Browse & Manage the Component Registry](#8-use-case-6--browse--manage-the-component-registry)
9. [Use Case 7 — Build Responsive Page Layouts](#9-use-case-7--build-responsive-page-layouts)
10. [Use Case 8 — Export Course to SCORM 1.2 Package](#10-use-case-8--export-course-to-scorm-12-package)
11. [Use Case 9 — Preview Mode with Interaction Tracking](#11-use-case-9--preview-mode-with-interaction-tracking)
12. [Use Case 10 — Validate Course JSON Before Upload](#12-use-case-10--validate-course-json-before-upload)
13. [Use Case 11 — Migrate Courses from Legacy Format](#13-use-case-11--migrate-courses-from-legacy-format)
14. [Use Case 12 — Reorder Pages and Components](#14-use-case-12--reorder-pages-and-components)
15. [Use Case 13 — Read & Navigate Course Content](#15-use-case-13--read--navigate-course-content)
16. [Component Reference (32 Component Types)](#16-component-reference-32-component-types)
17. [Keyboard Shortcuts](#17-keyboard-shortcuts)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. Getting Started

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **Backend API** running at `http://localhost:8000` (Python / FastAPI)

### Installation & Launch

```bash
# 1. Clone and install dependencies
cd e-learning-frontend
npm install

# 2. Start the development server
npm start

# 3. The app opens automatically at http://localhost:3000
```

### First Launch Checklist
| Step | What Happens |
|------|-------------|
| 1 | App checks backend health via `GET /api/v1/health` |
| 2 | Connection indicator shows **"Backend Connected"** (green) or **"Backend Offline"** (red) at bottom-right |
| 3 | Component Registry loads 32 component types across 10 categories |
| 4 | Default view is **Editor** mode with the V2 editor enabled |

> **Note**: The app works in offline/demo mode even when the backend is unavailable. Some features (save, export, audio upload) require backend connectivity.

---

## 2. Application Overview

### Main Screen Layout

```
┌──────────────────────────────────────────────────────────┐
│  MenuBar (File, Edit, View, Help menus)                  │
├──────────────────────────────────────────────────────────┤
│  Header (Course title, Save, Validate, Export, View toggle) │
├────────────┬──────────────────────────┬──────────────────┤
│  Page      │    Main Content Area     │  Component       │
│  Manager   │  (Editor / Preview)      │  Settings        │
│  (Left     │                          │  (Right Sidebar) │
│  Sidebar)  │                          │                  │
│            │                          │                  │
├────────────┴──────────────────────────┴──────────────────┤
│  Connection Status Indicator                             │
└──────────────────────────────────────────────────────────┘
```

### Two Main Views
| View | Purpose | Toggle |
|------|---------|--------|
| **Editor** | Author/design course pages with components | Click "Editor" in Header |
| **Preview** | See how learners will experience the course | Click "Preview" in Header |

### Key UI Regions
- **MenuBar** — File operations (New, Open, Save, Export), Edit (Undo/Redo), View settings
- **Header** — Course info, validation status, save/export buttons, editor/preview toggle
- **Page Manager** (left sidebar) — List of course pages; add, select, reorder pages
- **Main Content** — Current page with all its components rendered
- **Component Settings** (right sidebar) — Appears when a component is selected; configure data, audio, completion

---

## 3. Use Case 1 — Create a Course with Composable Components

**Goal**: Build a multi-page course where each page can contain multiple component types (Tabs, MCQ, Video, etc.).

### Step-by-Step

#### Step 1: Create a New Course
1. Click **File → New Course** in the MenuBar (or use keyboard shortcut)
2. Enter course details:
   - **Title**: e.g., "Onboarding Training"
   - **Author**: Your name
3. The course is created with a default first page

#### Step 2: Add Pages
1. In the **Page Manager** (left sidebar), click the **"+ Add Page"** button
2. Enter a page title (e.g., "Introduction", "Module 1", "Assessment")
3. Repeat to add as many pages as needed
4. Pages appear in order in the sidebar list

#### Step 3: Add Components to a Page
1. Select a page in the Page Manager by clicking on it
2. In the main content area, click **"+ Add Component"** button
3. The **Component Picker** modal opens showing:
   - **Category tabs** on the left (Content, Assessment, Interaction, etc.)
   - **Component cards** on the right with icon, name, description
4. Browse or search for the component you want
5. Click a component card (e.g., "Tabs") to add it to the page
6. The component appears in the main area with default data

#### Step 4: Configure Component Data
1. Click on any component in the page to select it
2. The **Component Settings** panel opens on the right sidebar
3. Edit the component's content:
   - For **Tabs**: Add/remove tabs, edit tab titles and body text
   - For **MCQ**: Write the question, add answer options, mark the correct one
   - For **Video Slide**: Enter video URL, add caption text
4. Changes are reflected immediately in the editor

#### Step 5: Combine Multiple Components
- A single page can hold any combination of components
- Example page: Accordion (theory) + Video Slide (demo) + MCQ (quiz)
- Components render in the order they appear on the page

#### Step 6: Save the Course
1. Click **"Save"** in the Header (or press **Ctrl+S**)
2. The course is sent to the backend via `POST /api/v1/courses`
3. Save status indicator shows "Saving..." → "Saved"

---

## 4. Use Case 2 — Design Per-Component Audio Narration

**Goal**: Attach audio narration to specific interactions within components (e.g., each tab can have its own audio clip).

### Step-by-Step

#### Step 1: Select a Component
1. Navigate to the page containing the target component
2. Click on the component (e.g., a Tabs component) to select it

#### Step 2: Open Audio Configuration
1. In the **Component Settings** right sidebar, find the **"Audio"** section
2. Toggle **"Enable Audio"** to ON

#### Step 3: Upload Audio Files
1. For each interaction point (e.g., Tab 1, Tab 2, Tab 3), you'll see an audio slot
2. Click **"Upload Audio"** for the desired interaction
3. Select an MP3/WAV file from your computer
4. The file uploads via `POST /api/v1/assets/audio`
5. Server returns an `audioId` and `audioUrl`

#### Step 4: Configure Audio Behavior
For each audio item, configure:
| Setting | Description | Options |
|---------|-------------|---------|
| **Trigger** | When audio plays | `load` (page load), `click` (user clicks), `interaction` (specific event) |
| **Target Interaction** | Which element triggers it | e.g., `tab-1`, `accordion-panel-2` |
| **Autoplay** | Play automatically on trigger | On / Off |
| **Required for Completion** | Must listen to complete page | On / Off |
| **Label** | Display name in player | Free text |

#### Step 5: Test Audio in Preview
1. Switch to **Preview** mode
2. Navigate to the page with audio
3. Interact with the component (click tabs, open panels)
4. The **Audio Player** appears at the bottom with:
   - Play/Pause button
   - Seek bar and time display
   - Audio label

#### Completion Tracking
- If audio is marked **"Required for Completion"**, the learner must listen to ≥90% of the audio
- The completion indicator shows progress as audio items are completed
- The **Completion Banner** appears at the page bottom when all required audio is heard

---

## 5. Use Case 3 — Enable Scoring Across Assessment Components

**Goal**: Configure weighted scoring across MCQ, drag-and-drop, and scenario assessments with a 70% passing threshold.

### Step-by-Step

#### Step 1: Add Assessment Components
1. Add scorable components to your course pages:
   - **MCQ** — Multiple Choice questions
   - **Multiple Select** — Select all that apply
   - **Scenario Question** — Branching decision questions
   - **Knowledge Check** — Non-graded practice (feedback only)
   - **Final Assessment** — End-of-course scored quiz
   - **Quiz Game** — Gamified assessment
   - **Drag & Drop Sort** — Order/categorize items

#### Step 2: Configure Scoring Per Component
1. Select an assessment component
2. In Component Settings, find the **"Scoring"** section
3. Configure:
   | Setting | Description |
   |---------|-------------|
   | **Max Points** | Maximum score for this component (e.g., 100) |
   | **Weight** | Relative weight in overall score (e.g., 0.4 = 40%) |
   | **Partial Credit** | Allow partial marks (for multi-select, matching) |
   | **Show Correct Answers** | Reveal answers after submission |

#### Step 3: Set Course-Level Scoring
1. In the Header, access course scoring settings
2. Configure:
   | Setting | Value | Description |
   |---------|-------|-------------|
   | **Passing Score** | 70 | Minimum percentage to pass |
   | **Max Attempts** | 3 | How many tries allowed (null = unlimited) |
   | **Attempt Scoring** | best | Which attempt counts (best / last / average) |
   | **Weighted Scoring** | true | Use component weights |
   | **Allow Partial Credit** | true | Enable partial scoring |

#### Step 4: Validate Scoring Weights
- The system validates that all component weights sum to 1.0 (100%)
- If weights don't sum correctly, a validation warning is shown
- API: `POST /api/v1/courses/{courseId}/scoring/validate`

#### Step 5: View Score Summary
In Preview mode, after completing assessments:
- **Circular Progress** chart shows overall score percentage
- **Pass/Fail** indicator with color coding (green = pass, red = fail)
- **Breakdown table** shows:
  - Component name
  - Raw score / Max points
  - Weight
  - Weighted contribution
- **Attempt info**: Current attempt number, remaining attempts

#### Scoring Rules by Component Type
| Component | Scoring Behavior |
|-----------|-----------------|
| MCQ | 1 correct answer → full points; wrong → 0 |
| Multiple Select | Partial: `(correct - incorrect) / total_correct × points` |
| True/False | Full points or 0 |
| Fill in Blanks | Per-blank scoring, case-insensitive |
| Matching | Per-pair scoring |
| Drag & Drop | Per-item correct placement |
| Scenario Question | Per-choice with branching weights |
| Knowledge Check | Non-graded — feedback only, no score |

---

## 6. Use Case 4 — Track Learner Completion (Multi-Level Rules)

**Goal**: Configure component-level, page-level, and course-level completion tracking with different strategies.

### Step-by-Step

#### Step 1: Set Component Completion Criteria
Each component has a **Completion Criteria** setting:

| Type | Meaning | Example |
|------|---------|---------|
| `view` | Complete when component enters viewport | Text, Infographic |
| `interact` | Complete when all required interactions performed | Tabs (all tabs clicked), Flip Cards |
| `audio` | Complete when required audio listened to ≥90% | Audio narration |
| `score` | Complete when score ≥ threshold | MCQ (score ≥ 70%) |
| `custom` | Custom logic per component | Combination conditions |

1. Select a component → Component Settings → **"Completion"** section
2. Choose the completion type
3. If `interact`: specify which interactions are required (e.g., `["tab-1", "tab-2", "tab-3"]`)
4. If `audio`: specify which audioIds must be listened to
5. If `score`: set the score threshold percentage

#### Step 2: Set Page Completion Strategy
1. Select a page in the Page Manager
2. Configure the page's completion strategy:

| Strategy | Rule | When to Use |
|----------|------|-------------|
| `all` | ALL components on page must be complete | Strict: every item matters |
| `any` | At least ONE component must be complete | Flexible: any engagement counts |
| `percentage` | X% of components must be complete | Moderate: e.g., 80% threshold |
| `custom` | Only specified components required | Selective: key items only |

3. For `percentage` strategy, set the threshold (e.g., 80)
4. For `custom` strategy, select which components are required

#### Step 3: Monitor Completion in Preview
Switch to Preview mode and interact with the course:

1. **Component Level**: Green ✓ checkmark overlay appears on each completed component
2. **Page Level**: Completion banner appears at bottom of page when page criteria met
3. **Course Level**: Progress bar in navigation shows overall completion percentage

#### Step 4: Completion Events
As the learner interacts:
- **View event**: Fired when component scrolls into viewport
- **Interaction event**: Fired on clicks, selections, form submissions
- **Audio event**: Fired when audio plays to ≥90% duration
- **Score event**: Fired when assessment is submitted and scored

Events are recorded via `POST /api/v1/courses/{courseId}/interactions`.

#### Completion Flow Diagram
```
Learner interacts with component
        ↓
Component checks its CompletionCriteria
        ↓
If complete → mark component done ✓
        ↓
PageWrapper checks page strategy (all/any/percentage/custom)
        ↓
If page complete → show completion banner + unlock next page
        ↓
Course checks all enabled pages
        ↓
If all pages complete → course complete → SCORM "completed" status
```

---

## 7. Use Case 5 — Customize Course Theme (Colors & Typography)

**Goal**: Apply a visual theme to the entire course, with optional per-page overrides.

### Step-by-Step

#### Step 1: Select a Preset Theme
1. Go to the theme settings (via MenuBar or Header)
2. Choose from available presets:
   | Preset | Description |
   |--------|-------------|
   | **Light** | Clean white background, dark text |
   | **Dark** | Dark background, light text |
   | **Corporate** | Professional blues and grays |
   | **Vibrant** | Bold accent colors, modern feel |
   | **Minimal** | Subtle palette, focused on content |

3. Click to apply — theme changes instantly via CSS custom properties

#### Step 2: Customize Colors
Edit any of the **12 color tokens**:

| Token | What It Controls | Default (Light) |
|-------|-----------------|-----------------|
| `primary` | Brand color, buttons, links | `#1976D2` |
| `secondary` | Secondary actions | `#9C27B0` |
| `background` | Page background | `#FFFFFF` |
| `surface` | Cards, panels | `#F5F5F5` |
| `text` | Primary text | `#212121` |
| `textSecondary` | Muted text | `#757575` |
| `accent` | Highlights | `#FF5722` |
| `error` | Error states | `#F44336` |
| `success` | Success indicators | `#4CAF50` |
| `warning` | Warning states | `#FF9800` |
| `info` | Informational | `#2196F3` |
| `border` | Borders, dividers | `#E0E0E0` |

Use the color picker or enter a hex value for each token.

#### Step 3: Customize Typography
| Property | Example | Effect |
|----------|---------|--------|
| Font Family | `"Inter, sans-serif"` | All body text |
| Heading Font | `"Poppins, sans-serif"` | H1-H4 headings |
| Base Font Size | `16px` | Root font size |
| Line Height | `1.6` | Text line spacing |
| Font Weights | Normal: 400, Bold: 700 | Text weight options |

#### Step 4: Set Page-Level Theme Overrides
1. Select a page in the Page Manager
2. Toggle **"Override Course Theme"** to ON
3. Modify any color or typography setting for just that page
4. The page inherits all unmodified values from the course theme

#### Theme Inheritance Chain
```
Preset Theme → Course Theme (overrides) → Page Theme (overrides)
```
Each level only needs to specify what's different — everything else inherits.

#### Step 5: Preview Theme
- Theme changes apply instantly in both Editor and Preview modes
- CSS custom properties (`--theme-primary`, `--theme-background`, etc.) are injected by the `ThemeProvider`
- All components automatically pick up the new values

---

## 8. Use Case 6 — Browse & Manage the Component Registry

**Goal**: Discover available component types, search by category or tag, and add them to pages.

### Step-by-Step

#### Step 1: Open the Component Picker
1. Select a page in the Page Manager
2. Click **"+ Add Component"** in the main content area
3. The Component Picker modal opens

#### Step 2: Browse by Category
The left sidebar shows 10 implemented categories:

| # | Category | Component Count | Examples |
|---|----------|----------------|---------|
| 1 | Content Presentation | 7 | Tabs, Accordion, Click & Reveal, Timeline |
| 2 | Assessment | 8 | MCQ, Multiple Select, True/False, Final Assessment |
| 3 | Interaction | 5 | Flip Cards, Drag & Drop, Carousel, Slider |
| 4 | Process & Flow | 1 | Step-by-Step Process |
| 5 | Comparison | 1 | Comparison Table |
| 6 | Microlearning | 1 | Flashcards |
| 7 | Media-Rich | 3 | Video Slide, Image Hotspots, Infographic |
| 8 | Scenario | 2 | Branching Scenario, Case Study |
| 9 | Navigation | 2 | Course Menu, Resources & Downloads |
| 10 | Gamification | 2 | Quiz Game, Progress Tracker |

Click a category to filter the component grid.

#### Step 3: Search Components
- Use the search box at the top of the picker
- Search matches against: component name, description, and tags
- Example: searching "quiz" returns MCQ, Multiple Select, Quiz Game, Knowledge Check

#### Step 4: Add Component
1. Click a component card
2. The component is added to the current page with its default data
3. The picker closes and you can immediately edit the new component

#### Step 5: View Component Details
Each component card shows:
- **Icon** — Visual identifier
- **Name** — e.g., "Multiple Choice (MCQ)"
- **Description** — Brief explanation of the component
- **Tags** — Searchable keywords
- **Scoring badge** — Shows if the component supports scoring
- **Completion types** — How completion is tracked (view, interact, audio, score)

---

## 9. Use Case 7 — Build Responsive Page Layouts

**Goal**: Choose a layout for each page that arranges components in columns or grids.

### Step-by-Step

#### Step 1: Select Page Layout
1. Select a page in the Page Manager
2. In the page settings, find the **"Layout"** section
3. Choose a layout preset:

| Preset | Description | Best For |
|--------|-------------|----------|
| `single-column` | All components stacked vertically | Simple content, mobile-first |
| `two-column` | Two equal columns side by side | Content + sidebar items |
| `sidebar-left` | Narrow left + wide main area | Navigation + content |
| `sidebar-right` | Wide main area + narrow right | Content + reference panel |
| `three-column-grid` | Three equal columns | Dense content display |

#### Step 2: Set Spacing
Choose spacing density:
| Spacing | Description |
|---------|-------------|
| `compact` | Tight spacing between components |
| `normal` | Standard spacing (default) |
| `loose` / `spacious` | Extra breathing room |

#### Step 3: Add Components
- Components flow into layout positions in document order
- In `two-column`, components alternate between left and right columns
- Components can specify a `gridArea` or `span` for custom placement

#### Step 4: Mobile Responsiveness
- All layouts automatically stack to **single-column** on mobile screens
- No extra configuration needed
- Media queries handle the responsive behavior in the SCORM export

---

## 10. Use Case 8 — Export Course to SCORM 1.2 Package

**Goal**: Generate a SCORM 1.2 ZIP package for upload to any LMS.

### Step-by-Step

#### Step 1: Validate Before Export
1. Click **"Validate"** in the Header
2. The system runs two-phase validation:
   - **Phase 1 (Structural)**: Checks course JSON structure
   - **Phase 2 (Business Rules)**: Validates component data against schemas, audio references, scoring weights
3. Fix any errors shown in the **Validation Panel**
4. Warnings are non-blocking (export proceeds with warnings)

#### Step 2: Trigger Export
1. Click **"Export SCORM"** in the Header
2. The backend processes the export via `POST /api/v1/courses/{courseId}/export`
3. A progress indicator shows export status for large courses

#### Step 3: Download ZIP
The generated ZIP contains:
| File | Purpose |
|------|---------|
| `imsmanifest.xml` | SCORM package manifest |
| `course_data.js` | Full course structure as JSON |
| `theme.css` | CSS variables from resolved theme |
| `scorm_wrapper.js` | SCORM API bridge + audio player + completion tracking |
| `pages/*.html` | Multi-component HTML pages |
| `media/*` | Audio, video, image assets |

#### Step 4: Upload to LMS
1. Download the ZIP file
2. Go to your LMS admin panel
3. Upload as a SCORM 1.2 package
4. The course runs in the LMS with full:
   - Component rendering
   - Audio playback on interaction triggers
   - Completion tracking (`cmi.core.lesson_status`)
   - Score reporting (`cmi.core.score.raw`)
   - Suspend/resume via `cmi.suspend_data`

#### Export Limits
- Maximum file size: **50MB**
- Missing media: Warning returned, placeholder included
- No scoring configured: Valid export, score fields omitted

---

## 11. Use Case 9 — Preview Mode with Interaction Tracking

**Goal**: Test the course as a learner would experience it, with real-time tracking.

### Step-by-Step

#### Step 1: Switch to Preview Mode
1. Click **"Preview"** in the Header toolbar
2. The view switches from Editor to Preview
3. Components render in their **preview/learner** mode (not editable)

#### Step 2: Navigate the Course
- Use the **Page Manager** sidebar to navigate between pages
- Or use **Next/Previous** buttons at the bottom of each page
- Pages that require completion before proceeding may be locked

#### Step 3: Interact with Components
| Component | How to Interact |
|-----------|----------------|
| **Tabs** | Click each tab to view its content |
| **Accordion** | Click panels to expand/collapse |
| **Flip Cards** | Click cards to flip and reveal back side |
| **MCQ** | Select an answer and click Submit |
| **Drag & Drop Sort** | Drag items into the correct order |
| **Carousel** | Click arrows or swipe to navigate slides |
| **Timeline** | Click timeline points to reveal events |
| **Image Hotspots** | Click highlighted areas on the image |
| **Branching Scenario** | Make choices that lead to different paths |

#### Step 4: Observe Completion Tracking
- **Component completion indicators** (✓ checkmarks) appear as you complete items
- **Page completion banner** appears when all page criteria are met
- **Progress bar** updates showing overall course progress

#### Step 5: View Scoring Results
After completing assessment components:
- **Quiz Feedback** shows correct/incorrect per question
- **Score Summary** displays circular progress + detailed breakdown
- **Pass/Fail** status based on configured passing score

#### Step 6: Session Behavior
- Preview sessions last 24 hours by default
- Progress is tracked in-memory on the backend
- Refreshing the page restores from session cache
- Each browser tab runs an independent session

---

## 12. Use Case 10 — Validate Course JSON Before Upload

**Goal**: Check your course JSON for errors before saving or exporting.

### Step-by-Step

#### Step 1: Trigger Validation
1. Click **"Validate"** button in the Header
2. Or use the validation shortcut from the MenuBar

#### Step 2: Review Results
The **Validation Panel** opens showing:

| Category | Examples |
|----------|---------|
| **Errors** (blocking) | Missing required fields, invalid component type, schema mismatch |
| **Warnings** (non-blocking) | Missing audio file, component without completion criteria |

Each error/warning shows:
- **Type**: Error or Warning
- **Location**: Path to the problematic field (e.g., `pages[0].components[1].data.options`)
- **Message**: Human-readable description

#### Step 3: Fix and Re-validate
1. Click on an error to navigate to the problematic component
2. Fix the issue in the Component Settings panel
3. Click **"Validate"** again
4. Repeat until all errors are resolved

#### Validation Rules
- All component types must exist in the registry
- Component data must match the type's JSON schema
- Audio IDs must reference uploaded files
- Scoring weights must sum to 1.0
- Required fields (title, at least one page) must be present
- At least one component per page

---

## 13. Use Case 11 — Migrate Courses from Legacy Format

**Goal**: Convert courses from the old `templates[]` format to the new `pages[].components[]` structure.

### Step-by-Step

#### Step 1: Understand the Legacy Format
Old format:
```json
{
  "templates": [
    { "type": "welcome", "data": {...} },
    { "type": "content-video", "data": {...} },
    { "type": "mcq", "data": {...} }
  ]
}
```

New format:
```json
{
  "pages": [
    {
      "pageId": "uuid",
      "title": "Welcome",
      "components": [
        { "componentId": "uuid", "componentType": "text-with-media", "data": {...} }
      ]
    }
  ]
}
```

#### Step 2: Automatic Conversion
The system handles legacy courses automatically:
1. When a legacy course JSON is loaded, the frontend transform layer converts it
2. Each old template becomes **one page with one component**
3. Component types are normalized:

| Legacy Type | New Type |
|-------------|----------|
| `welcome` | `text-with-media` |
| `content-text` | `text-with-media` |
| `content-video` | `video-slide` |
| `content-image` | `text-with-media` |
| `video` | `video-slide` |
| `quiz` | `mcq` |
| `interactive` | `click-reveal` |

#### Step 3: Batch Migration (Admin)
For bulk migration via the backend:
1. Call `POST /api/v1/admin/migrate/courses` with `{ dryRun: true }` to preview
2. Review the migration report: count of courses, warnings
3. Call with `{ dryRun: false }` to execute migration
4. Check status via `GET /api/v1/admin/migrate/status`

#### Step 4: Verify Migrated Course
1. Open the migrated course in the Editor
2. Verify pages and components were created correctly
3. Components retain their original data
4. Add new components to pages as needed

---

## 14. Use Case 12 — Reorder Pages and Components

**Goal**: Change the order of pages in a course, or components within a page.

### Step-by-Step

#### Reorder Pages
1. In the **Page Manager** (left sidebar), hover over a page
2. Grab the **drag handle** (≡ icon) on the left side of the page item
3. Drag the page to its new position in the list
4. Release to drop — the order updates immediately
5. The backend persists the new order via `POST /courses/{id}/pages/reorder`

#### Reorder Components
1. Select a page to view its components
2. In the **Component List**, hover over a component
3. Grab the **drag handle** on the component card
4. Drag up or down to reorder
5. Release to drop — the component order updates
6. Uses `@hello-pangea/dnd` library for smooth drag-and-drop
7. Backend persists via `POST /pages/{id}/components/reorder`

#### Impact of Reordering
- SCORM export reflects the new order
- `imsmanifest.xml` page sequence updates
- Completion tracking respects the new sequence
- Preview mode shows the updated order immediately

---

## 15. Use Case 13 — Read & Navigate Course Content

**Goal**: Browse course structure, view component details, and navigate between pages.

### Step-by-Step

#### View Course Structure
1. The **Page Manager** sidebar shows all pages with titles
2. Each page entry shows:
   - Page title
   - Number of components
   - Completion status (✓ if complete)
   - Drag handle for reordering

#### Select a Page
1. Click a page in the Page Manager
2. The main content area loads the page's components
3. The selected page is highlighted in the sidebar

#### View Component Details
1. Click any component in the main area to select it
2. The **Component Settings** panel opens showing:
   - Component type and display name
   - Editable data fields specific to the component type
   - Audio configuration (if supported)
   - Completion criteria settings
   - Scoring settings (if scorable)

#### Navigate in Preview Mode
1. Switch to Preview mode
2. Use page sidebar or Next/Previous buttons
3. Components render in their learner-facing view
4. Audio plays on interaction triggers
5. Completion and scoring track automatically

---

## 16. Component Reference (32 Component Types)

### Content Presentation (7 types)

| Component | Description | Key Features |
|-----------|-------------|-------------|
| **Tabs** | Tabbed content panels | Multiple tabs with independent content; per-tab audio support |
| **Accordion** | Expandable/collapsible panels | Allow multiple open; per-panel audio |
| **Click & Reveal** | Hidden content revealed on click | Progressive disclosure; per-item audio |
| **Timeline** | Chronological event display | Interactive timeline points; per-event audio |
| **Image Hotspots** | Interactive image with clickable zones | Overlay hotspots with popover content |
| **Text with Media** | Rich text with optional image/video | Flexible content block |
| **Layered Content** | Stacked content layers | Toggle between content layers |

### Assessment (8 types)

| Component | Description | Scoring |
|-----------|-------------|---------|
| **MCQ** | Single-answer multiple choice | Full points or 0 |
| **Multiple Select** | Multi-answer selection | Partial credit proportional |
| **True/False** | Binary choice | Full points or 0 |
| **Fill in Blanks** | Text input blanks | Per-blank scoring |
| **Matching** | Pair matching | Per-pair scoring |
| **Scenario Question** | Branching decision question | Per-choice weighted |
| **Knowledge Check** | Non-graded practice | Feedback only, no score |
| **Final Assessment** | End-of-course quiz | Aggregated section score |

### Interaction (5 types)

| Component | Description | Completion |
|-----------|-------------|-----------|
| **Flip Cards** | Cards with front and back content | All cards flipped |
| **Drag & Drop Sort** | Reorder or categorize items | Correct placement |
| **Carousel** | Slide-based content viewer | All slides viewed |
| **Slider** | Adjustable value selector | Value selected |
| **Clickable Icons** | Icon-based content triggers | All icons clicked |

### Process & Flow (1 type)

| Component | Description |
|-----------|-------------|
| **Step-by-Step** | Sequential process guide with numbered steps and per-step audio |

### Comparison (1 type)

| Component | Description |
|-----------|-------------|
| **Comparison Table** | Side-by-side feature comparison with rows and columns |

### Microlearning (1 type)

| Component | Description |
|-----------|-------------|
| **Flashcards** | Study cards with term/definition, flip-to-reveal, and shuffle |

### Media-Rich (3 types)

| Component | Description |
|-----------|-------------|
| **Video Slide** | Video player with caption, transcript, and chapter markers |
| **Image Hotspots** | Image with interactive hotspot zones |
| **Infographic** | Visual data/information display with sections |

### Scenario (2 types)

| Component | Description |
|-----------|-------------|
| **Branching Scenario** | Multi-path decision scenarios with scoring per branch |
| **Case Study** | Multi-section case analysis with prompts and discussion |

### Navigation (2 types)

| Component | Description |
|-----------|-------------|
| **Course Menu** | Table of contents for course navigation |
| **Resources & Downloads** | Downloadable files and reference links |

### Gamification (2 types)

| Component | Description |
|-----------|-------------|
| **Quiz Game** | Gamified quiz with timer, streak counter, difficulty levels |
| **Progress Tracker** | Visual progress indicator with milestones |

---

## 17. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+S** | Save course |
| **Ctrl+Z** | Undo last action |
| **Ctrl+Y** / **Ctrl+Shift+Z** | Redo |
| **Ctrl+N** | New course |
| **Ctrl+E** | Toggle Editor/Preview |
| **Ctrl+Shift+V** | Validate course |
| **Delete** | Remove selected component |
| **Tab** | Navigate between UI elements |
| **Space/Enter** | Activate focused button or control |
| **Escape** | Close modal or picker |

---

## 18. Troubleshooting

### Backend Connection Issues
| Symptom | Cause | Solution |
|---------|-------|----------|
| "Backend Offline" indicator | Backend not running | Start backend: `cd backend && uvicorn main:app --port 8000` |
| Save fails | Network error | Check backend logs; verify `http://localhost:8000/api/v1/health` responds |
| Export timeout | Large course | Check `GET /courses/{id}/export/status` for progress |

### Component Issues
| Symptom | Cause | Solution |
|---------|-------|----------|
| "Unknown Component" placeholder | Unregistered type | Check component type ID matches registry |
| Component won't render | Lazy load failure | Check browser console for chunk errors; clear cache |
| Audio won't play | Missing audio file | Re-upload audio via `POST /assets/audio` |

### Editor Issues
| Symptom | Cause | Solution |
|---------|-------|----------|
| Changes not saving | isDirty not set | Use Ctrl+S explicitly; check backend connectivity |
| Undo not working | Action excluded from history | Only page/component edits are tracked in undo history |
| Theme not applying | Page override active | Check if page has `inheritCourse: false` |

### Performance Tips
- Components lazy-load — first render may be slightly slower
- Keep pages to ≤10 components for best performance
- Large audio files (>10MB) may slow uploads
- Close unused browser tabs to free session memory

---

## Appendix: API Endpoints Quick Reference

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Courses** | `/api/v1/courses` | POST | Create course |
| | `/api/v1/courses/{id}` | GET | Get course |
| | `/api/v1/courses/{id}` | PATCH | Update course |
| | `/api/v1/courses/validate` | POST | Validate JSON |
| **Pages** | `/api/v1/courses/{id}/pages` | POST | Add page |
| | `/api/v1/courses/{id}/pages` | GET | List pages |
| | `/api/v1/courses/{id}/pages/{pageId}` | PATCH | Update page |
| | `/api/v1/courses/{id}/pages/reorder` | POST | Reorder pages |
| **Components** | `/api/v1/courses/{id}/pages/{pageId}/components` | POST | Add component |
| | `/api/v1/courses/{id}/pages/{pageId}/components/{compId}` | PATCH | Update component |
| | `/api/v1/courses/{id}/pages/{pageId}/components/reorder` | POST | Reorder components |
| **Registry** | `/api/v1/components` | GET | List types |
| | `/api/v1/components/search` | GET | Search types |
| | `/api/v1/components/categories` | GET | List categories |
| **Themes** | `/api/v1/themes/presets` | GET | List presets |
| | `/api/v1/courses/{id}/theme` | PATCH | Set course theme |
| | `/api/v1/courses/{id}/pages/{pageId}/theme` | PATCH | Set page theme |
| **Scoring** | `/api/v1/courses/{id}/scoring` | PATCH | Set scoring config |
| | `/api/v1/courses/{id}/scoring/calculate` | POST | Calculate score |
| | `/api/v1/courses/{id}/scoring/validate` | POST | Validate config |
| **Completion** | `/api/v1/courses/{id}/completion` | GET | Course completion |
| | `/api/v1/courses/{id}/pages/{pageId}/completion` | GET | Page completion |
| | `/api/v1/courses/{id}/interactions` | POST | Record interaction |
| **Audio** | `/api/v1/assets/audio` | POST | Upload audio |
| | `/api/v1/courses/{id}/narration` | GET | List all narration |
| **Export** | `/api/v1/courses/{id}/export` | POST | Export SCORM ZIP |
| | `/api/v1/courses/{id}/export/validate` | POST | Pre-validate export |
| **Admin** | `/api/v1/admin/migrate/courses` | POST | Migrate legacy courses |

---

*End of User Manual*
