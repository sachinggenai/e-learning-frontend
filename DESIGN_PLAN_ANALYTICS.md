# Design Plan: Analytics Templates

## Overview

The Analytics category surfaces measurable learning outcomes for learners, managers, and administrators. These templates focus on progress visualization, performance insights, skill mapping, credentialing, and team-level review.

- Category: `analytics`
- Templates: 5
- Primary intent: evidence-based learning visibility
- Completion capability: `view`
- Data source: learner progress and assessment APIs

---

## Template 1: Learning Progress Summary

### Purpose
Provide a concise overview of completion progress through a module/course.

### Preview UX
- Completion percentage headline
- Progress bar and milestones
- Completed vs remaining counts
- Optional estimated time remaining

### Editor UX
- Summary title and subtitle
- Milestone configuration
- Show/hide ETA and streak
- Progress style options (bar/ring)

### Functional Requirements
- Compute percentage from `completedUnits / totalUnits`
- Show milestone statuses
- Handle edge cases (`totalUnits=0`)
- Optional trend vs prior period

### Data Contract
```ts
interface ProgressMilestone {
  id: string;
  label: string;
  threshold: number; // percentage
  reached: boolean;
}

interface LearningProgressSummaryData {
  title: string;
  totalUnits: number;
  completedUnits: number;
  percentage: number;
  milestones: ProgressMilestone[];
  estimatedTimeRemainingMins?: number;
}
```

### Interaction Events
- `progress_viewed`
- `milestone_viewed`

---

## Template 2: Performance Dashboard

### Purpose
Display key performance indicators (KPIs) such as score, attempt count, time on task, and trend.

### Preview UX
- KPI cards grid
- Chart section (line/bar)
- Filter summary (date range/cohort)
- Highlight card for weakest metric

### Editor UX
- KPI selection/reordering
- Chart type and legend toggles
- Threshold and goal settings
- Date range defaults

### Functional Requirements
- Render dynamic KPI cards from data array
- Support trend arrows and percent change
- Handle missing values gracefully
- Optional target comparison state

### Data Contract
```ts
interface DashboardKPI {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPct?: number;
  target?: number;
}

interface PerformanceDashboardData {
  title: string;
  kpis: DashboardKPI[];
  chartSeries?: Array<{ name: string; points: number[] }>;
  chartLabels?: string[];
  chartType?: 'line' | 'bar';
}
```

### Interaction Events
- `kpi_opened`
- `chart_filtered`

---

## Template 3: Skill Mastery Report

### Purpose
Visualize competency-level mastery and identify gaps.

### Preview UX
- Skill list with mastery bars
- Optional radar summary
- Gap highlights below threshold
- Recommended next skill focus

### Editor UX
- Skill CRUD
- Threshold settings (low/medium/high)
- Display mode (list/radar)
- Recommendation toggle

### Functional Requirements
- Compute mastery bands
- Mark low-scoring skills
- Sort by score descending or custom order
- Optional confidence overlay

### Data Contract
```ts
interface SkillMasteryItem {
  id: string;
  skill: string;
  score: number; // 0-100
  evidenceCount?: number;
}

interface SkillMasteryReportData {
  title: string;
  items: SkillMasteryItem[];
  lowThreshold?: number;
  highThreshold?: number;
  displayMode?: 'list' | 'radar';
}
```

### Interaction Events
- `skill_viewed`
- `gap_focus_selected`

---

## Template 4: Completion Certificate

### Purpose
Present completion credentials with learner identity and verification metadata.

### Preview UX
- Certificate layout with name, course, date
- Signature/seal area
- Certificate ID
- Download/print buttons (if enabled)

### Editor UX
- Template style controls
- Signatory fields
- Badge/seal upload URL
- Verification settings (certificate ID format)

### Functional Requirements
- Validate required identity fields
- Generate printable view
- Optional QR/code verification payload
- Support locale-aware date formatting

### Data Contract
```ts
interface CompletionCertificateData {
  title: string;
  learnerName: string;
  courseName: string;
  completionDate: string; // ISO
  certificateId: string;
  issuerName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  badgeUrl?: string;
}
```

### Interaction Events
- `certificate_viewed`
- `certificate_printed`
- `certificate_downloaded`

---

## Template 5: Manager Review Page

### Purpose
Give managers a team-level view of learner status, risk, and performance.

### Preview UX
- Learner table/rows
- Status chips (`on-track`, `at-risk`, `completed`)
- Team averages and completion metrics
- Action buttons (remind/escalate/export)

### Editor UX
- Column selection
- Risk threshold config
- Sorting defaults
- Alert rule toggles

### Functional Requirements
- Aggregate team metrics
- Flag at-risk learners by threshold
- Provide filter/sort controls
- Export-friendly layout

### Data Contract
```ts
interface ManagerLearnerRow {
  learnerId: string;
  learnerName: string;
  progressPct: number;
  averageScore?: number;
  status: 'on-track' | 'at-risk' | 'completed';
  lastActiveAt?: string; // ISO
}

interface ManagerReviewPageData {
  title: string;
  rows: ManagerLearnerRow[];
  riskThresholdPct?: number;
  showActions?: boolean;
}
```

### Interaction Events
- `learner_opened`
- `manager_filter_changed`
- `manager_export_triggered`

---

## Shared Design System Guidance

### Theme Tokens
- `--theme-primary`
- `--theme-success`
- `--theme-warning`
- `--theme-error`
- `--theme-info`
- `--theme-surface`
- `--theme-border`
- `--theme-text`

### BEM Naming
- `.tpl-{template}`
- `.tpl-{template}__{element}`
- `.tpl-{template}__{element}--{modifier}`

### Visual Rules
- Keep KPI cards consistent height
- Use clear numeric hierarchy (value > label > helper)
- Reserve red for risk/error only
- Avoid overloading with too many simultaneous charts

### Accessibility
- Data tables with proper headers
- Non-color cues for trend and status
- Keyboard-accessible filters and exports
- Screen-reader labels for metrics and charts

### Responsive
- Desktop: 3-4 KPI cards per row
- Tablet: 2 cards per row
- Mobile: stacked cards and horizontal-scroll for dense tables

---

## Suggested Registration Metadata

- `learning-progress-summary` (icon: `chart-no-axes-column`)
- `performance-dashboard` (icon: `layout-dashboard`)
- `skill-mastery-report` (icon: `target`)
- `completion-certificate` (icon: `award`)
- `manager-review-page` (icon: `users`)
