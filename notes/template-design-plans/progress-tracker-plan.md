# Progress Tracker - Detailed Design Plan

## Purpose
Visualize learner advancement through pages or milestones.

## Scope
`ProgressTracker.tsx` already exists. This plan adds CSS and tests plus behavior polish.

## Learner Experience
- Learner sees completion percentage and progress bar.
- Learner sees milestone checkpoints.
- Learner understands what is done and what is next.

## Data Model
```ts
interface Milestone {
  id: string;
  label: string;
  pageIndex: number;
  icon?: string;
}

interface ProgressTrackerData {
  title: string;
  totalPages: number;
  completedPages: number;
  milestones: Milestone[];
}
```

## Preview Behavior
- Percentage derived from completed and total pages.
- Milestones are marked complete when `pageIndex <= completedPages`.
- Optional next-step hint highlights nearest incomplete milestone.

## Editor Behavior
- Fields: title, totalPages, completedPages.
- Milestone manager with add/remove/reorder.
- Milestone fields: label, pageIndex, icon.

## Interaction Events
- `progress_tracker_viewed`
- `progress_tracker_milestone_opened`
- `progress_tracker_completed`

## Completion Rules
- Complete when `completedPages >= totalPages`.

## Accessibility
- Progress bar should include `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Milestone list uses semantic list structure.

## CSS Plan
- File: `src/components/templates/gamification/ProgressTracker.css`
- Blocks: `.tpl-progress-tracker`, `.tpl-progress-tracker__bar`, `.tpl-progress-tracker__fill`, `.tpl-progress-tracker__milestone`, `.tpl-progress-tracker__meta`

## Unit Test Plan
- Correct percentage rendering.
- Milestone completion logic.
- Completion callback when done.

## E2E Plan
- Picker visibility for Progress Tracker.

## Acceptance Criteria
- Accurate progress computation in edge cases.
- Clear completed/incomplete milestone states.
