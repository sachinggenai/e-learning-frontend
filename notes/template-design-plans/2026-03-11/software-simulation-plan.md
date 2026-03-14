# Software Simulation - Detailed Design Plan

## Purpose
Simulate software workflow using screenshot steps and annotated hotspots.

## Learner Experience
- Learner sees screenshot for current step.
- Learner clicks highlighted area to proceed.
- Learner receives contextual guidance and errors.

## Data Model
```ts
interface SoftwareStep {
  id: string;
  title: string;
  instruction: string;
  imageUrl: string;
  hotspots: { id: string; x: number; y: number; w: number; h: number; label: string }[];
}

interface SoftwareSimulationData {
  title: string;
  steps: SoftwareStep[];
  strictMode?: boolean;
}
```

## Preview Behavior
- Display current step image and instruction.
- Accept hotspot click, validate target.
- Move to next step on success.
- Show completion summary at end.

## Editor Behavior
- Fields: title, strictMode.
- Step manager add/remove/reorder.
- Per-step fields: title, instruction, imageUrl.
- Hotspot manager per step.

## Interaction Events
- `software_step_viewed`
- `software_hotspot_clicked`
- `software_step_completed`
- `software_simulation_completed`

## Completion Rules
- Complete when final step finished.

## Accessibility
- Provide keyboard-accessible hotspot list as alternative.
- Include alt text for screenshots.

## CSS Plan
- File: `src/components/templates/practice/SoftwareSimulation.css`
- Blocks: `.tpl-software-sim`, `.tpl-software-sim__viewer`, `.tpl-software-sim__image`, `.tpl-software-sim__hotspot`, `.tpl-software-sim__instructions`

## Unit Test Plan
- Step transitions on valid hotspot.
- Strict mode blocks wrong hotspot.
- Completion state and callback.

## E2E Plan
- Picker visibility for Software Simulation.

## Acceptance Criteria
- Hotspots remain aligned in responsive layout.
