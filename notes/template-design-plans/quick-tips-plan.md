# Quick Tips - Detailed Design Plan

## Purpose
Show short practical tips in a compact, scannable component.

## Learner Experience
- Learner reads a list of actionable tips.
- Learner can expand optional details per tip.
- Learner can mark tips as done.

## Data Model
```ts
interface QuickTip {
  id: string;
  title: string;
  detail?: string;
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface QuickTipsData {
  heading: string;
  subtitle?: string;
  tips: QuickTip[];
  allowMarkDone?: boolean;
  showPriorityBadge?: boolean;
}
```

## Preview Behavior
- Render heading/subtitle.
- Render tip list with optional icon and priority badge.
- Click tip row to expand detail.
- If `allowMarkDone`, show checkbox button per tip.
- Show completion summary when all tips are marked done.

## Editor Behavior
- Fields: heading, subtitle, allowMarkDone, showPriorityBadge.
- Tips manager with add/remove/reorder.
- Tip fields: title, detail, icon, priority.

## Interaction Events
- `quick_tip_opened`
- `quick_tip_closed`
- `quick_tip_marked_done`
- `quick_tips_completed`

## Completion Rules
- If `allowMarkDone` true, complete when all tips are done.
- If `allowMarkDone` false, complete when learner has opened all tips at least once.

## Accessibility
- Expanders use native button semantics.
- Use `aria-expanded` and `aria-controls`.
- Ensure icon-only controls have labels.

## CSS Plan
- File: `src/components/templates/microlearning/QuickTips.css`
- Blocks: `.tpl-quick-tips`, `.tpl-quick-tips__item`, `.tpl-quick-tips__header`, `.tpl-quick-tips__detail`, `.tpl-quick-tips__badge`

## Unit Test Plan
- Renders list and heading.
- Expands and collapses detail content.
- Marks tip done updates state.
- Completion event fires on all tips done.

## E2E Plan
- Picker visibility for Quick Tips.

## Acceptance Criteria
- Clear dense layout for mobile.
- Good keyboard and SR support.
- Strong event telemetry for tip usage.
