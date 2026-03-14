# Team Challenge - Detailed Design Plan

## Purpose
Coordinate collaborative task completion with clear team objective and steps.

## Learner Experience
- Learner sees challenge goal and team size.
- Learner tracks checklist steps.
- Learner marks steps completed.

## Data Model
```ts
interface ChallengeStep {
  id: string;
  text: string;
  ownerRole?: string;
}

interface TeamChallengeData {
  title: string;
  objective: string;
  teamSize: number;
  steps: ChallengeStep[];
  timeboxMin?: number;
}
```

## Preview Behavior
- Render objective card and metadata.
- Render checklist with optional owner role.
- Progress summary updates as steps complete.

## Editor Behavior
- Fields: title, objective, teamSize, timeboxMin.
- Step manager with add/remove/reorder.

## Interaction Events
- `team_challenge_step_toggled`
- `team_challenge_completed`

## Completion Rules
- Complete when all steps are checked.

## Accessibility
- Use checkbox controls with labels.
- Progress text announced politely.

## CSS Plan
- File: `src/components/templates/social/TeamChallenge.css`
- Blocks: `.tpl-team-challenge`, `.tpl-team-challenge__objective`, `.tpl-team-challenge__steps`, `.tpl-team-challenge__step`, `.tpl-team-challenge__progress`

## Unit Test Plan
- Step toggling updates progress.
- Completion event at all checked.

## E2E Plan
- Picker visibility for Team Challenge.

## Acceptance Criteria
- Progress remains consistent after multiple toggles.
