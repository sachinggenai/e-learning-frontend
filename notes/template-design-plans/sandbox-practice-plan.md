# Sandbox Practice - Detailed Design Plan

## Purpose
Provide a safe free-form space for learners to try a task and compare with reference answer.

## Learner Experience
- Learner reads prompt and enters response.
- Learner can reveal reference answer when ready.
- Learner can reset and retry.

## Data Model
```ts
interface SandboxPracticeData {
  title: string;
  prompt: string;
  placeholder?: string;
  referenceAnswer: string;
  minChars?: number;
  allowReveal?: boolean;
}
```

## Preview Behavior
- Editable response area.
- Optional reveal button for reference answer.
- Self-check checklist appears after reveal.

## Editor Behavior
- Fields: title, prompt, placeholder, referenceAnswer, minChars, allowReveal.

## Interaction Events
- `sandbox_input_changed`
- `sandbox_reference_revealed`
- `sandbox_reset`
- `sandbox_completed`

## Completion Rules
- Complete when learner writes at least `minChars` and either submits or reveals reference.

## Accessibility
- Large labeled text area.
- Reveal control uses clear announce text.

## CSS Plan
- File: `src/components/templates/practice/SandboxPractice.css`
- Blocks: `.tpl-sandbox`, `.tpl-sandbox__prompt`, `.tpl-sandbox__input`, `.tpl-sandbox__reference`, `.tpl-sandbox__actions`

## Unit Test Plan
- Min chars validation.
- Reveal toggles reference panel.
- Completion callback logic.

## E2E Plan
- Picker visibility for Sandbox Practice.

## Acceptance Criteria
- Learner can retry without stale state.
