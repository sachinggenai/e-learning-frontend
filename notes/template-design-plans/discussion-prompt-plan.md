# Discussion Prompt - Detailed Design Plan

## Purpose
Drive reflective discussion with structured prompt and response capture.

## Learner Experience
- Learner reads a prompt.
- Learner enters response in text area.
- Learner submits response and sees confirmation.

## Data Model
```ts
interface DiscussionPromptData {
  title: string;
  prompt: string;
  placeholder?: string;
  minChars?: number;
  allowAnonymous?: boolean;
}
```

## Preview Behavior
- Show prompt in highlighted panel.
- Text area with live character count.
- Submit button disabled until minimum characters met.
- Success state shows response accepted.

## Editor Behavior
- Fields: title, prompt, placeholder, minChars, allowAnonymous.

## Interaction Events
- `discussion_input_changed`
- `discussion_submitted`

## Completion Rules
- Complete on successful submit.

## Accessibility
- Text area linked to clear label and help text.
- Character count announced with `aria-live`.

## CSS Plan
- File: `src/components/templates/social/DiscussionPrompt.css`
- Blocks: `.tpl-discussion`, `.tpl-discussion__prompt`, `.tpl-discussion__input`, `.tpl-discussion__meta`, `.tpl-discussion__success`

## Unit Test Plan
- Submit blocked below min chars.
- Submit enabled at threshold.
- Completion callback and interaction payload.

## E2E Plan
- Picker visibility for Discussion Prompt.

## Acceptance Criteria
- Reliable validation and submit state.
