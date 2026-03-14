# Level-Based Learning - Detailed Design Plan

## Purpose
Represent course progression as unlockable levels.

## Learner Experience
- Learner sees current level and upcoming levels.
- Locked levels appear disabled with unlock requirements.
- Learner sees progression confidence via XP or completion metric.

## Data Model
```ts
interface LevelItem {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  objectiveCount?: number;
}

interface LevelBasedLearningData {
  title: string;
  currentXp: number;
  levels: LevelItem[];
  unlockMode: 'xp' | 'sequential';
}
```

## Preview Behavior
- Compute current level based on unlock mode.
- Render level track with active, completed, and locked states.
- Show progress to next level.
- Allow learner to open completed level detail cards.

## Editor Behavior
- Fields: title, currentXp, unlockMode.
- Level manager: add/remove/reorder.
- Level fields: name, description, xpRequired, objectiveCount.

## Interaction Events
- `level_viewed`
- `level_detail_opened`
- `level_based_learning_completed`

## Completion Rules
- Complete when learner opens current level detail and next-level requirements panel.

## Accessibility
- State labels include text values: Completed, Current, Locked.
- Track should be navigable by keyboard.

## CSS Plan
- File: `src/components/templates/gamification/LevelBasedLearning.css`
- Blocks: `.tpl-level-learning`, `.tpl-level-learning__track`, `.tpl-level-learning__level`, `.tpl-level-learning__status`, `.tpl-level-learning__next`

## Unit Test Plan
- Unlock calculations for both modes.
- Next-level progress rendering.
- State class assignment correctness.

## E2E Plan
- Picker visibility for Level-Based Learning.

## Acceptance Criteria
- Deterministic level state logic.
- Works with 1 level and large level sets.
