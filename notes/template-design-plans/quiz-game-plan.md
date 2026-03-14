# Quiz Game - Detailed Design Plan

## Purpose
Use gamified quiz mechanics (score, lives, timer) to increase engagement.

## Scope
`QuizGame.tsx` already exists. This plan adds CSS, robust tests, and refinement.

## Learner Experience
- Learner answers one question at a time.
- HUD displays score, lives, current question, and timer.
- Learner receives immediate correctness feedback.
- Learner sees summary screen and can replay.

## Data Model
```ts
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points?: number;
}

interface QuizGameData {
  questions: QuizQuestion[];
  maxLives: number;
  timeLimit: number;
}
```

## Preview Behavior
- Timer restarts on each question when enabled.
- Wrong answer or timeout reduces lives.
- Correct answer adds points.
- End state reached when no lives or no remaining questions.

## Editor Behavior
- Manage `maxLives`, `timeLimit`, and question list.
- Per question: prompt, 4 options, correct index, explanation, points.

## Interaction Events
- `quiz-game-answer`
- `quiz-game-timeout`
- `quiz-game-restart`
- `quiz-game-completed`

## Completion Rules
- Complete when final question is reached with lives > 0.
- Optional config update: allow complete on any game end.

## Accessibility
- Answer options are buttons with clear text.
- Timer uses polite updates.
- Ensure feedback colors include text/icon cues.

## CSS Plan
- File: `src/components/templates/gamification/QuizGame.css`
- Migrate inline styles to BEM classes.
- Blocks: `.tpl-quiz-game`, `.tpl-quiz-game__hud`, `.tpl-quiz-game__question`, `.tpl-quiz-game__option`, `.tpl-quiz-game__result`

## Unit Test Plan
- Renders first question and HUD.
- Correct answer updates score.
- Wrong answer decreases lives.
- Timeout behavior executes with fake timers.
- Final state shows replay control.

## E2E Plan
- Picker visibility for Quiz Game.

## Acceptance Criteria
- No regressions from existing logic.
- Visual states are clear and consistent.
- Tests validate core game loop.
