# Points and Badges - Detailed Design Plan

## Purpose
Show learner reward progress with points accumulation and badge achievements.

## Learner Experience
- Learner sees total points and progress to next badge.
- Learner views badge gallery with earned and locked states.
- Learner can inspect badge criteria.

## Data Model
```ts
interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  pointsRequired: number;
}

interface PointsAndBadgesData {
  title: string;
  currentPoints: number;
  badges: Badge[];
  earnedBadgeIds: string[];
  showNextGoal?: boolean;
}
```

## Preview Behavior
- Render points total in hero card.
- Render badge grid with earned lock states.
- Optional next-goal panel shows nearest locked badge.
- Badge click opens detail panel.

## Editor Behavior
- Fields: title, currentPoints, showNextGoal.
- Badge manager: add/remove/reorder.
- Badge fields: name, description, icon, pointsRequired.
- Earned badges via multiselect control.

## Interaction Events
- `badge_viewed`
- `badge_unlocked_previewed`
- `points_badges_goal_viewed`

## Completion Rules
- Complete when learner opens at least one earned badge detail.

## Accessibility
- Badge cards are keyboard focusable.
- Lock state announced with text, not color only.

## CSS Plan
- File: `src/components/templates/gamification/PointsAndBadges.css`
- Blocks: `.tpl-points-badges`, `.tpl-points-badges__hero`, `.tpl-points-badges__grid`, `.tpl-points-badges__badge`, `.tpl-points-badges__goal`

## Unit Test Plan
- Renders points total.
- Displays earned vs locked badges.
- Next goal computes nearest threshold.
- Detail panel opens on badge click.

## E2E Plan
- Picker visibility for Points and Badges.

## Acceptance Criteria
- Clear reward hierarchy and lock states.
- Works responsively with many badges.
- Strong semantic labels for all badges.
