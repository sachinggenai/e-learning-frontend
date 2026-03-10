# Design Plan: Feedback Templates

## Overview

The Feedback category supports reflection, metacognition, and learner-owned improvement planning. These templates collect qualitative and quantitative learner input while remaining lightweight enough for regular use across modules.

- Category: `feedback`
- Templates: 5
- Primary intent: reflection, confidence tracking, goal setting
- Completion capability: `interact`
- Accessibility target: WCAG 2.1 AA

---

## Template 1: Reflective Question

### Purpose
Prompt a focused post-learning reflection with optional guidance and structured response capture.

### Preview UX
- Title and question prompt
- Optional guidance callout
- Response box (editable for learner mode, read-only for reviewer mode)
- Save/submit state with timestamp

### Editor UX
- Prompt title
- Question text
- Guidance text (optional)
- Placeholder text
- Response settings (character limit, min length, autosave toggle)

### Functional Requirements
- Require question text
- Support autosave and explicit submit
- Track `lastSavedAt` and `submittedAt`
- Enforce optional min/max character validation

### Data Contract
```ts
interface ReflectiveQuestionData {
  title: string;
  questionText: string;
  guidanceText?: string;
  placeholder?: string;
  minChars?: number;
  maxChars?: number;
  autosave?: boolean;
  learnerResponse?: string;
  lastSavedAt?: string; // ISO
  submittedAt?: string; // ISO
}
```

### Interaction Events
- `response_change`
- `response_saved`
- `response_submitted`

---

## Template 2: Learner Journal

### Purpose
Provide a chronological journal where learners can add multiple entries during a course/module.

### Preview UX
- Journal header
- Optional daily/weekly prompt
- Entry list (newest first)
- Expand/collapse per entry
- Empty state when no entries exist

### Editor UX
- Journal title and description
- Prompt bank (optional)
- Entry controls (add/edit/delete)
- Display settings (sort order, max entries)

### Functional Requirements
- Create, edit, delete entries
- Timestamp each entry (`createdAt`, `updatedAt`)
- Optional tag per entry (e.g., `challenge`, `insight`, `action`)
- Optional limit and warning when near limit

### Data Contract
```ts
interface JournalEntry {
  id: string;
  content: string;
  tags?: string[];
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

interface LearnerJournalData {
  title: string;
  description?: string;
  prompt?: string;
  entries: JournalEntry[];
  sortOrder?: 'newest' | 'oldest';
  maxEntries?: number;
}
```

### Interaction Events
- `entry_added`
- `entry_updated`
- `entry_deleted`
- `entry_expanded`

---

## Template 3: Self-Assessment

### Purpose
Allow learners to rate their own capability across predefined competencies.

### Preview UX
- Assessment title and instructions
- Competency list
- Per-competency scale (default 1-5)
- Optional comments per competency
- Calculated average score

### Editor UX
- Competency CRUD
- Scale configuration (min/max and labels)
- Toggle comments
- Optional threshold bands (low/medium/high)

### Functional Requirements
- At least one competency required
- One rating per competency required (if `required=true`)
- Compute summary statistics (average, min, max)
- Support retake/update mode

### Data Contract
```ts
interface AssessmentCompetency {
  id: string;
  name: string;
  description?: string;
}

interface AssessmentResponse {
  competencyId: string;
  score: number;
  comment?: string;
}

interface SelfAssessmentData {
  title: string;
  instructions?: string;
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: string[];
  competencies: AssessmentCompetency[];
  responses: AssessmentResponse[];
  showComments?: boolean;
}
```

### Interaction Events
- `score_selected`
- `comment_updated`
- `assessment_completed`

---

## Template 4: Confidence Rating

### Purpose
Capture learner confidence before and after a learning segment to measure perceived growth.

### Preview UX
- Objective list
- Before confidence and after confidence controls
- Delta indicator (+/-)
- Optional rationale text field

### Editor UX
- Objective CRUD
- Scale format (`1-5` or `0-100`)
- Show/hide rationale
- Delta display style (numeric, badge, bar)

### Functional Requirements
- Support baseline (`before`) and outcome (`after`) values
- Compute delta per objective and aggregate average delta
- Highlight increases/decreases

### Data Contract
```ts
interface ConfidenceObjective {
  id: string;
  title: string;
}

interface ConfidenceRecord {
  objectiveId: string;
  before?: number;
  after?: number;
  rationale?: string;
}

interface ConfidenceRatingData {
  title: string;
  objectives: ConfidenceObjective[];
  records: ConfidenceRecord[];
  scaleType?: '1-5' | '0-100';
  showRationale?: boolean;
}
```

### Interaction Events
- `before_set`
- `after_set`
- `rationale_changed`

---

## Template 5: Action Planning

### Purpose
Convert reflection into concrete actions with due dates and completion tracking.

### Preview UX
- Action list with status chips
- Priority and due date
- Progress summary (e.g., 2/5 complete)
- Optional milestone subtasks

### Editor UX
- Action CRUD
- Priority and date settings
- Required fields toggle
- Display filters (all/open/completed)

### Functional Requirements
- Status lifecycle: `not-started -> in-progress -> completed`
- Due date validation (no invalid date formats)
- Optional overdue indicator
- Completion tracking and summary metrics

### Data Contract
```ts
interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO date
  completedAt?: string; // ISO
}

interface ActionPlanningData {
  title: string;
  instructions?: string;
  items: ActionItem[];
  showPriority?: boolean;
  showDueDates?: boolean;
}
```

### Interaction Events
- `action_added`
- `action_updated`
- `action_completed`
- `action_deleted`

---

## Shared Design System Guidance

### Theme Tokens
- `--theme-background`
- `--theme-surface`
- `--theme-border`
- `--theme-text`
- `--theme-text-secondary`
- `--theme-primary`
- `--theme-success`
- `--theme-warning`
- `--theme-error`

### BEM Naming
- Wrapper pattern: `.tpl-{template-name}`
- Element pattern: `.tpl-{template-name}__{element}`
- Modifier pattern: `.tpl-{template-name}__{element}--{modifier}`

### Accessibility
- Keyboard reachable controls
- Clear focus states
- Labels for all inputs
- Status announcements via aria-live where needed
- Avoid color-only status communication

### Responsive
- Desktop: multi-column where useful
- Tablet: compact spacing and two-column fallback
- Mobile: single-column stacked controls

---

## Suggested Registration Metadata

- `reflective-question` (icon: `message-square`)
- `learner-journal` (icon: `book-text`)
- `self-assessment` (icon: `clipboard-check`)
- `confidence-rating` (icon: `gauge`)
- `action-planning` (icon: `list-checks`)
