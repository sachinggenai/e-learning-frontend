# Scenario Debate - Detailed Design Plan

## Purpose
Teach argumentation by presenting a scenario with two competing positions.

## Learner Experience
- Learner reads scenario.
- Learner picks Position A or Position B.
- Learner enters rationale text.
- Learner can view opposing argument cues.

## Data Model
```ts
interface ScenarioDebateData {
  title: string;
  scenario: string;
  positionA: string;
  positionB: string;
  showOpposing?: boolean;
  minChars?: number;
}
```

## Preview Behavior
- Position cards behave as exclusive choice.
- Rationale field appears after selection.
- Submit disabled until min chars reached.

## Editor Behavior
- Fields: title, scenario, positionA, positionB, showOpposing, minChars.

## Interaction Events
- `scenario_debate_side_selected`
- `scenario_debate_rationale_changed`
- `scenario_debate_submitted`

## Completion Rules
- Complete after side selected and rationale submitted.

## Accessibility
- Side selection uses radio group semantics.
- Opposing argument section has heading and landmark role.

## CSS Plan
- File: `src/components/templates/social/ScenarioDebate.css`
- Blocks: `.tpl-scenario-debate`, `.tpl-scenario-debate__scenario`, `.tpl-scenario-debate__sides`, `.tpl-scenario-debate__rationale`, `.tpl-scenario-debate__opposing`

## Unit Test Plan
- Side selection toggles state.
- Min chars validation works.
- Completion triggers only on valid submit.

## E2E Plan
- Picker visibility for Scenario Debate.

## Acceptance Criteria
- Supports balanced, readable debate layout.
