# Try-It Simulation - Detailed Design Plan

## Purpose
Enable learners to practice a targeted interaction in a guided mini-simulation.

## Learner Experience
- Learner reads short scenario.
- Learner clicks required targets in order.
- Learner gets instant feedback for correct/incorrect attempts.

## Data Model
```ts
interface TryItTarget {
  id: string;
  label: string;
  order: number;
  x: number;
  y: number;
  radius?: number;
  feedback?: string;
}

interface TryItSimulationData {
  title: string;
  prompt: string;
  canvasLabel: string;
  targets: TryItTarget[];
  allowRetry?: boolean;
}
```

## Preview Behavior
- Render target area with hotspot buttons.
- Validate click order if configured.
- Show feedback toast/message.
- Track attempts and success count.

## Editor Behavior
- Fields: title, prompt, canvasLabel, allowRetry.
- Target manager add/remove/reorder.
- Target fields: label, order, x, y, radius, feedback.

## Interaction Events
- `tryit_target_clicked`
- `tryit_step_correct`
- `tryit_step_incorrect`
- `tryit_simulation_completed`

## Completion Rules
- Complete when all targets clicked correctly in sequence.

## Accessibility
- Provide keyboard-selectable fallback list of targets.
- Announce feedback in `aria-live` region.

## CSS Plan
- File: `src/components/templates/practice/TryItSimulation.css`
- Blocks: `.tpl-tryit`, `.tpl-tryit__canvas`, `.tpl-tryit__target`, `.tpl-tryit__feedback`, `.tpl-tryit__legend`

## Unit Test Plan
- Correct and incorrect click handling.
- Sequence enforcement.
- Completion callback on success.

## E2E Plan
- Picker visibility for Try-It Simulation.

## Acceptance Criteria
- Reliable coordinate rendering and interaction logic.
