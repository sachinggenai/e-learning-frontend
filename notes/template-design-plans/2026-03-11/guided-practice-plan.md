# Guided Practice - Detailed Design Plan

## Purpose
Walk learners through sequenced tasks with optional hints.

## Learner Experience
- Learner follows numbered steps.
- Learner can reveal hint per step.
- Learner marks each step complete.

## Data Model
```ts
interface GuidedStep {
  id: string;
  instruction: string;
  hint?: string;
  expectedOutcome?: string;
}

interface GuidedPracticeData {
  title: string;
  intro?: string;
  steps: GuidedStep[];
  showHintsByDefault?: boolean;
}
```

## Preview Behavior
- Show stepper with current index.
- Next and Previous move through steps.
- Hint panel toggles per step.
- Step completion checkbox available.

## Editor Behavior
- Fields: title, intro, showHintsByDefault.
- Step manager add/remove/reorder.
- Per-step fields: instruction, hint, expectedOutcome.

## Interaction Events
- `guided_step_viewed`
- `guided_step_hint_toggled`
- `guided_step_completed`
- `guided_practice_completed`

## Completion Rules
- Complete when all steps marked complete.

## Accessibility
- Step navigation buttons labeled with step numbers.
- Hint region controlled with `aria-expanded`.

## CSS Plan
- File: `src/components/templates/practice/GuidedPractice.css`
- Blocks: `.tpl-guided-practice`, `.tpl-guided-practice__stepper`, `.tpl-guided-practice__step`, `.tpl-guided-practice__hint`, `.tpl-guided-practice__actions`

## Unit Test Plan
- Step navigation works.
- Hint toggling works.
- Completion only after all steps checked.

## E2E Plan
- Picker visibility for Guided Practice.

## Acceptance Criteria
- Clear progression and low cognitive load.
