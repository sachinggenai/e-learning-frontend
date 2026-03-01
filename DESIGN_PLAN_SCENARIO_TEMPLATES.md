# Scenario Templates Design Plan (Design-Only)

## 1) Objective
Align all Scenario-category templates with the current product theme and visual system without changing business logic, data flow, scoring rules, navigation rules, or callbacks.

Templates in scope:
1. Scenario
2. Branching Scenario
3. Role-Play Simulation
4. Case Study

---

## 2) Guardrails (No Functionality Changes)

### In Scope
- CSS extraction/refactor
- BEM class naming standardization
- Theme token usage with fallbacks
- Spacing, typography, color, border, radius, focus, hover, disabled visual states
- Responsive layout behavior and visual hierarchy
- Editor/Preview visual consistency
- Test updates/additions for design and style assertions

### Out of Scope
- No changes to state machines, branching logic, scoring math, timing logic, or completion criteria
- No schema/data-shape breaking changes
- No registry behavior changes except visual default content polish where needed
- No new side effects or API contracts

### Functional Invariance Rules
- Existing callbacks (`onInteraction`, `onComplete`, `onChange`) must fire exactly as before
- Existing progression paths must remain identical
- Existing correctness/points outcomes must remain identical

---

## 3) Design System Requirements

## 3.1 BEM Convention
Use `.tpl-{component}` root and `__element--modifier` children.

Examples:
- `.tpl-scenario`
- `.tpl-branching-scenario__choice--selected`
- `.tpl-role-play-simulation__response--inappropriate`
- `.tpl-case-study__button--submit`

## 3.2 Theme Tokens (with fallback)
Use only these tokens and fallback values:
- `var(--theme-primary, #2563eb)`
- `var(--theme-text, #1e293b)`
- `var(--theme-text-secondary, #64748b)`
- `var(--theme-border, #e2e8f0)`
- `var(--theme-surface, #f8fafc)`
- `var(--theme-background, #ffffff)`
- `var(--theme-success, #22c55e)`
- `var(--theme-error, #ef4444)`
- `var(--theme-info, #3b82f6)`

No new hard-coded colors, fonts, or shadows.

## 3.3 Responsive Rules
Primary breakpoint: `768px`.
- Desktop/tablet: full spacing and horizontal affordances where applicable
- Mobile: stacked actions, reduced padding/font sizes, preserved readability and tap targets

## 3.4 Accessibility Visual Rules
- Visible keyboard focus ring on all interactive controls
- Contrast-safe text/background combinations using theme tokens
- Hover, active, disabled states visually distinct
- Preserve semantic roles/labels already present

---

## 4) Per-Template Design Plan

## 4.1 Scenario
Status: planned visual implementation/standardization.

### Visual Updates
- Add root container `.tpl-scenario` with max-width, centered layout
- Introduce narrative card (`surface`, `border`, `radius`, readable line-height)
- Standardize choice buttons (default/hover/active/focus/disabled)
- Add feedback styling variants using success/error/info tokens
- Ensure image frame style consistency (radius, spacing, object-fit)

### Candidate CSS Structure
- `.tpl-scenario`
- `.tpl-scenario__title`
- `.tpl-scenario__description`
- `.tpl-scenario__narrative`
- `.tpl-scenario__choices`
- `.tpl-scenario__choice`
- `.tpl-scenario__choice--selected`
- `.tpl-scenario__feedback`
- `.tpl-scenario__feedback--success|--error|--info`

---

## 4.2 Branching Scenario
Status: existing component; refactor inline/hard-coded styles to themed CSS.

### Visual Updates
- Extract inline style blocks into `BranchingScenario.css`
- Convert all colors/borders/text styles to theme tokens
- Standardize node container, choice list, and feedback card spacing
- Add consistent points/progress visual treatment
- Ensure restart button uses primary button visual language

### Candidate CSS Structure
- `.tpl-branching-scenario`
- `.tpl-branching-scenario__node`
- `.tpl-branching-scenario__title`
- `.tpl-branching-scenario__narrative`
- `.tpl-branching-scenario__image`
- `.tpl-branching-scenario__choices`
- `.tpl-branching-scenario__choice`
- `.tpl-branching-scenario__choice--selected`
- `.tpl-branching-scenario__choice--correct|--incorrect`
- `.tpl-branching-scenario__feedback`
- `.tpl-branching-scenario__feedback--success|--error|--info`
- `.tpl-branching-scenario__points`
- `.tpl-branching-scenario__button--restart`

---

## 4.3 Role-Play Simulation
Status: planned visual implementation/standardization.

### Visual Updates
- Role header card with role badge and context container
- Dialogue/speaker styling with clear visual hierarchy
- Response buttons themed by appropriateness (success/info/error)
- Unified feedback card style and score/progress strip
- Mobile-first stacked response layout

### Candidate CSS Structure
- `.tpl-role-play-simulation`
- `.tpl-role-play-simulation__header`
- `.tpl-role-play-simulation__role-badge`
- `.tpl-role-play-simulation__context`
- `.tpl-role-play-simulation__scene`
- `.tpl-role-play-simulation__speaker`
- `.tpl-role-play-simulation__dialogue`
- `.tpl-role-play-simulation__responses`
- `.tpl-role-play-simulation__response`
- `.tpl-role-play-simulation__response--appropriate|--neutral|--inappropriate`
- `.tpl-role-play-simulation__feedback`
- `.tpl-role-play-simulation__progress`
- `.tpl-role-play-simulation__score`

---

## 4.4 Case Study
Status: existing component; refactor inline/hard-coded styles to themed CSS.

### Visual Updates
- Extract inline styles into `CaseStudy.css`
- Normalize context/background callout card
- Standardize prompt cards and textarea/input controls
- Standardize sample-answer toggle/button style
- Standardize submit button, disabled state, and success message

### Candidate CSS Structure
- `.tpl-case-study`
- `.tpl-case-study__title`
- `.tpl-case-study__subtitle`
- `.tpl-case-study__background`
- `.tpl-case-study__background-text`
- `.tpl-case-study__image`
- `.tpl-case-study__prompts`
- `.tpl-case-study__prompt`
- `.tpl-case-study__prompt-question`
- `.tpl-case-study__prompt-input`
- `.tpl-case-study__sample-button`
- `.tpl-case-study__sample-answer`
- `.tpl-case-study__button--submit`
- `.tpl-case-study__message--success`

---

## 5) Test Plan (Design + Regression)

## 5.1 Cross-Template Baseline Tests (apply to all 4)
1. Root BEM class renders
2. Required child classes render for visible sections
3. Token-driven color usage in rendered style/class expectations
4. Keyboard focus state visible on primary controls
5. Hover/active/disabled class toggles render correctly
6. Mobile layout class/structure at `<768px`
7. No callback contract regressions (`onInteraction`, `onComplete`, `onChange` where applicable)
8. Snapshot or structural assertion for major visual blocks

## 5.2 Scenario Test Cases
- Renders title/description/narrative hierarchy
- Choice controls use expected themed classes
- Selected state class applies and clears correctly
- Feedback variant classes map to result type
- Image container class renders when image exists
- Responsive class behavior on mobile width
- Focus-visible behavior for keyboard-only navigation
- Non-functional regression: same interaction callback payload keys

## 5.3 Branching Scenario Test Cases
- Node card and choice list themed classes render
- Choice state modifiers (`selected`, `correct`, `incorrect`) apply correctly
- Feedback visual variants (success/error/info) apply correctly
- Restart control visual classes present
- Progress/points visual class present
- Responsive stacking of choices on mobile
- Non-functional regression: path/points/end callback behavior unchanged

## 5.4 Role-Play Simulation Test Cases
- Role badge/context card classes render
- Response variant class per appropriateness value
- Score/progress bar classes render
- Feedback class updates after response
- Mobile response stack layout classes render
- Focus/hover state classes present
- Non-functional regression: scoring/progression callback sequence unchanged

## 5.5 Case Study Test Cases
- Background/context card class renders
- Prompt card/input classes render per prompt
- Input focus style class applied
- Sample-answer toggle button class and state class render
- Submit button disabled/enabled visual states render
- Success message variant class renders post-submit
- Responsive typography/spacing behavior on mobile
- Non-functional regression: submit callback payload unchanged

## 5.6 Visual QA Checklist (Manual)
- Light/dark theme sanity (if app supports both)
- No clipped content at 320px width
- Line-height readability for long narratives and long prompts
- Button hit-targets meet minimum tap size
- No hard-coded color remnants in scenario components/CSS

---

## 6) Implementation Sequence
1. Audit current Scenario-category components for inline styles/hard-coded values
2. Create/normalize CSS modules per template with BEM classes
3. Replace JSX inline styles with className hooks
4. Apply theme tokenized color/border/typography/spacing
5. Add/adjust tests for visual states + non-functional regressions
6. Run targeted tests, then full scenario template suite
7. Build + type-check validation

---

## 7) Deliverables
- `src/components/templates/scenario/Scenario.css` (new/updated)
- `src/components/templates/scenario/BranchingScenario.css` (new)
- `src/components/templates/scenario/RolePlaySimulation.css` (new/updated)
- `src/components/templates/scenario/CaseStudy.css` (new)
- Updated TSX files to consume classNames only for style concerns
- Scenario-category test files updated with design assertions and regression checks

---

## 8) Exit Criteria
- All Scenario-category templates use BEM naming and theme tokens
- No hard-coded design values remain in scenario template rendering paths
- All design-state tests pass (including responsive + focus/hover/disabled)
- Functional behavior remains unchanged from baseline
- Build and type-check pass cleanly

---

## 9) Risk & Mitigation
- Risk: accidental functional drift while refactoring JSX
  - Mitigation: strict non-functional regression tests + payload shape assertions
- Risk: style regressions on mobile
  - Mitigation: dedicated `<768px` test assertions + manual visual QA at 320px/375px
- Risk: inconsistent class naming
  - Mitigation: enforce root naming pattern and class audit checklist before merge
