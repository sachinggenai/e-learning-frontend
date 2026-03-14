# Poll / Vote - Detailed Design Plan

## Purpose
Collect learner opinion quickly and display aggregate responses.

## Learner Experience
- Learner selects one or multiple options.
- Learner submits vote.
- Learner sees result bars by option.

## Data Model
```ts
interface PollOption {
  id: string;
  label: string;
  votes?: number;
}

interface PollVoteData {
  title: string;
  question: string;
  options: PollOption[];
  allowMultiple?: boolean;
  totalVotes?: number;
}
```

## Preview Behavior
- Input mode: radio for single, checkbox for multi.
- Submit enabled only with selection.
- After submit, lock selection and show percentages.

## Editor Behavior
- Fields: title, question, allowMultiple, totalVotes.
- Option manager add/remove/reorder and vote seed values.

## Interaction Events
- `poll_option_selected`
- `poll_submitted`
- `poll_results_viewed`

## Completion Rules
- Complete when vote is submitted.

## Accessibility
- Group options in fieldset with legend.
- Result bars include text percentages.

## CSS Plan
- File: `src/components/templates/social/PollVote.css`
- Blocks: `.tpl-poll`, `.tpl-poll__options`, `.tpl-poll__result`, `.tpl-poll__bar`, `.tpl-poll__meta`

## Unit Test Plan
- Single and multi-select modes.
- Submit transitions to results.
- Percentage calculations are correct.

## E2E Plan
- Picker visibility for Poll / Vote.

## Acceptance Criteria
- Clear before/after state transition.
