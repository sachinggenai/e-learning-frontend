# Error Identification - Detailed Design Plan

## Purpose
Train learners to detect mistakes in a passage or workflow description.

## Learner Experience
- Learner reads content with potential errors.
- Learner selects lines/tokens they believe are incorrect.
- Learner submits and sees scored feedback.

## Data Model
```ts
interface ErrorToken {
  id: string;
  text: string;
  isError: boolean;
  explanation?: string;
}

interface ErrorIdentificationData {
  title: string;
  instructions: string;
  tokens: ErrorToken[];
  maxSelections?: number;
  showExplanations?: boolean;
}
```

## Preview Behavior
- Render selectable token chips or inline spans.
- Track learner selected ids.
- On submit, compute precision score.
- Optional explanation panel for missed and false-positive picks.

## Editor Behavior
- Fields: title, instructions, maxSelections, showExplanations.
- Token manager add/remove/reorder.
- Per-token fields: text, isError, explanation.

## Interaction Events
- `error_token_selected`
- `error_token_deselected`
- `error_identification_submitted`
- `error_identification_completed`

## Completion Rules
- Complete on submit.
- Score is included in interaction value payload.

## Accessibility
- Each token is button-like and keyboard togglable.
- Selected state announced via `aria-pressed`.

## CSS Plan
- File: `src/components/templates/practice/ErrorIdentification.css`
- Blocks: `.tpl-error-id`, `.tpl-error-id__tokens`, `.tpl-error-id__token`, `.tpl-error-id__results`, `.tpl-error-id__explanation`

## Unit Test Plan
- Token selection toggles correctly.
- Max selection limit enforced.
- Score calculation and explanations.

## E2E Plan
- Picker visibility for Error Identification.

## Acceptance Criteria
- Scoring logic is deterministic and test-covered.
