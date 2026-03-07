# Assessment Templates: Design-Only BEM Refactor Plan

## Overview

### Purpose
Align all 8 Assessment-category templates with the established theme system using dedicated CSS files, consistent BEM naming conventions, and the 9 standardized theme tokens. This is a **design-only refactor**—no changes to business logic, scoring algorithms, state management, or callback behaviors.

### Scope
**Templates in scope:**
1. [Multiple Choice (MCQ)](src/components/templates/assessment/MCQ.tsx) — Migrate from TemplateStyles.css
2. [Multiple Select](src/components/templates/assessment/MultipleSelect.tsx) — Create new CSS file
3. [True / False](src/components/templates/assessment/TrueFalse.tsx) — Migrate from TemplateStyles.css
4. [Fill in the Blanks](src/components/templates/assessment/FillBlanks.tsx) — Migrate from TemplateStyles.css
5. [Matching](src/components/templates/assessment/Matching.tsx) — Migrate from TemplateStyles.css
6. [Scenario-Based Question](src/components/templates/assessment/ScenarioQuestion.tsx) — Create new CSS file
7. [Knowledge Check](src/components/templates/assessment/KnowledgeCheck.tsx) — Create new CSS file
8. [Final Assessment](src/components/templates/assessment/FinalAssessment.tsx) — Create new CSS file

**Current state:**
- 4 templates (MCQ, TrueFalse, FillBlanks, Matching) have partial CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) using `tpl-{component}-preview__` prefix
- 4 templates (MultipleSelect, ScenarioQuestion, KnowledgeCheck, FinalAssessment) have **NO CSS** and rely on inline styles or generic classes
- All templates already use BEM-style class naming in TSX
- All follow Preview + Editor component pattern

### Timeline
- **Phase 1:** MCQ, MultipleSelect, TrueFalse (3 templates, 2-3 days)
- **Phase 2:** FillBlanks, Matching (2 templates, 1-2 days)
- **Phase 3:** ScenarioQuestion, KnowledgeCheck, FinalAssessment (3 templates, 2-3 days)
- **Total:** 5-8 days with parallel test development

### Success Criteria
- ✅ All 8 templates have dedicated CSS files with full BEM class coverage
- ✅ All styles use theme tokens with fallback values
- ✅ Zero inline styles remain in TSX files (except dynamic/computed styles)
- ✅ All tests pass (existing + new style/rendering tests)
- ✅ Visual regression: no unintended visual changes
- ✅ Functional invariance: callbacks, scoring, state transitions unchanged
- ✅ Build succeeds without warnings
- ✅ Responsive behavior maintained at 768px breakpoint

---

## Design System Standards

### BEM Convention
**Root naming:** `.tpl-{template-name}` for preview, `.tpl-{template-name}-editor` for editor.

**Element/Modifier pattern:** `__{element}` and `--{modifier}`.

**Examples:**
```css
.tpl-mcq                              /* root */
.tpl-mcq__question                    /* element */
.tpl-mcq__option                      /* element */
.tpl-mcq__option--selected            /* modifier */
.tpl-mcq__option--correct             /* state modifier */
.tpl-mcq__feedback                    /* element */
.tpl-mcq__button                      /* element */
.tpl-mcq__button--primary             /* modifier */
```

### Theme Tokens (with fallback)
**All 9 tokens must be used exclusively—no hardcoded colors, no new custom properties:**

| Token | Fallback | Usage |
|-------|----------|-------|
| `var(--theme-primary, #2563eb)` | Blue | Primary buttons, focus states, selected borders |
| `var(--theme-text, #1e293b)` | Dark slate | Main text, question text, labels |
| `var(--theme-text-secondary, #64748b)` | Gray | Instructions, hints, secondary labels |
| `var(--theme-border, #e2e8f0)` | Light gray | Borders, dividers, default option borders |
| `var(--theme-surface, #f8fafc)` | Off-white | Card backgrounds, containers, disabled states |
| `var(--theme-background, #ffffff)` | White | Main backgrounds, input fields, panels |
| `var(--theme-success, #22c55e)` | Green | Correct answers, positive feedback, checkmarks |
| `var(--theme-error, #ef4444)` | Red | Incorrect answers, error feedback, X icons |
| `var(--theme-info, #3b82f6)` | Info blue | Informational messages, hints, tips |

### Responsive Rules
**Primary breakpoint:** `768px`

**Desktop (>768px):**
- Full spacing (16px-24px gaps)
- Horizontal layouts where appropriate (e.g., True/False buttons side-by-side)
- Readable line-length max-width (~700px for text-heavy content)

**Mobile (≤768px):**
- Reduced spacing (12px-16px gaps)
- Stacked layouts (vertical button arrangements)
- Full-width interactive elements
- Minimum tap targets: 44px height
- Preserved font sizes (minimum 14px for body text)

### Accessibility Visual Requirements
- **Focus rings:** 2px solid primary color with 2px offset on all interactive elements
- **Contrast ratios:** WCAG AA compliance using theme tokens (text on background, text-secondary on surface)
- **Hover states:** Subtle background tint or border color shift
- **Active states:** Slightly darker shade of hover state
- **Disabled states:** Reduced opacity (0.6) + cursor: not-allowed
- **Submit feedback:** Use success/error colors with sufficient contrast
- **Icons:** Decorative only (meaning conveyed through text/color)

---

## Template-Specific Scope

### 1. Multiple Choice (MCQ)

**Current state:** Partial CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) (lines 559-663). Uses `tpl-mcq-preview__` prefix. Editor styles exist. TSX file: [MCQ.tsx](src/components/templates/assessment/MCQ.tsx).

**Migration strategy:** 
1. Create [MCQ.css](src/components/templates/assessment/MCQ.css)
2. Extract all `tpl-mcq-*` rules from TemplateStyles.css
3. Standardize BEM naming: `.tpl-mcq__question`, `.tpl-mcq__options`, `.tpl-mcq__option`, `.tpl-mcq__option--selected`, `.tpl-mcq__option--correct`, `.tpl-mcq__option--incorrect`
4. Add missing styles for: retry button, explanation panel, score display
5. Update TSX: import CSS, ensure className consistency

**BEM class structure:**
```
.tpl-mcq                              // Root container
.tpl-mcq__question                    // Question heading
.tpl-mcq__options                     // Options wrapper
.tpl-mcq__option                      // Individual option button
.tpl-mcq__option--selected            // Selected state
.tpl-mcq__option--correct             // Correct answer (post-submit)
.tpl-mcq__option--incorrect           // Incorrect answer (post-submit)
.tpl-mcq__option--disabled            // Disabled state
.tpl-mcq__icon                        // CheckCircle/XCircle icon
.tpl-mcq__icon--correct               // Green checkmark
.tpl-mcq__icon--incorrect             // Red X
.tpl-mcq__feedback                    // Feedback message container
.tpl-mcq__explanation                 // Explanation text
.tpl-mcq__actions                     // Button container
.tpl-mcq__button                      // Generic button
.tpl-mcq__button--primary             // Submit button
.tpl-mcq__button--secondary           // Retry button
.tpl-mcq__score                       // Score display
.tpl-mcq-editor                       // Editor root
.tpl-mcq-editor__option-row           // Option row in editor
.tpl-mcq-editor__correct-radio        // Correct answer radio
```

**Key design elements:**
- Option buttons: 2px border (theme-border default, theme-primary selected, theme-success/error post-submit)
- Border-radius: 8px for options, 6px for buttons
- Padding: 12px 16px for options
- Gap between options: 12px
- Transitions: border-color 150ms, background 150ms
- Hover: border-color changes to theme-primary
- Icons: 20px size, aligned to right of option text

**Test coverage:**
- Renders question and options
- Handles option selection (updates state)
- Disables unselected options after submit
- Shows correct/incorrect visual feedback
- Displays explanation after submit
- Retry button resets state
- Calls onInteraction with correct score
- Calls onComplete after submit
- Themed classes applied correctly
- Keyboard navigation (arrow keys, Enter to select)
- Screen reader announces selected option

---

### 2. Multiple Select

**Current state:** NO CSS file. [MultipleSelect.tsx](src/components/templates/assessment/MultipleSelect.tsx) uses inline styles or generic classes. Preview + Editor implemented.

**Creation strategy:**
1. Create [MultipleSelect.css](src/components/templates/assessment/MultipleSelect.css) from scratch
2. Mirror MCQ structure but with checkbox semantics
3. Handle multiple selection visual states (multiple options can be selected simultaneously)
4. Add proportional vs all-or-nothing scoring visual feedback

**BEM class structure:**
```
.tpl-ms                               // Root container
.tpl-ms__question                     // Question heading
.tpl-ms__instructions                 // Instructions (e.g., "Select all that apply")
.tpl-ms__options                      // Options wrapper
.tpl-ms__option                       // Individual checkbox option
.tpl-ms__option--selected             // Selected state
.tpl-ms__option--correct              // Correct answer (post-submit)
.tpl-ms__option--incorrect            // Incorrect answer (post-submit)
.tpl-ms__checkbox                     // Checkbox visual
.tpl-ms__checkbox--checked            // Checked state
.tpl-ms__icon                         // Check/X icon
.tpl-ms__feedback                     // Feedback message
.tpl-ms__feedback--partial            // Partial credit feedback
.tpl-ms__actions                      // Button container
.tpl-ms__button                       // Generic button
.tpl-ms__button--primary              // Submit button
.tpl-ms__score                        // Score display
.tpl-ms-editor                        // Editor root
.tpl-ms-editor__option-row            // Option row
.tpl-ms-editor__correct-checkbox      // Correct answer checkbox
.tpl-ms-editor__mode-toggle           // Scoring mode toggle
```

**Key design elements:**
- Checkbox visual: 18px square with 2px border, border-radius 4px
- Checked state: filled with theme-primary, white checkmark
- Multiple selections highlighted with theme-primary background tint
- Post-submit: green for correct options, red for incorrect selections, gray for unselected correct options
- Partial credit feedback: theme-info background for proportional scoring
- Transitions: same as MCQ

**Test coverage:**
- Renders question and multiple options
- Allows multiple selections
- Toggles selection on click
- Submit calculates score based on mode (proportional vs all-or-nothing)
- Shows correct/incorrect feedback for each option
- Displays partial credit message (if applicable)
- Calls onInteraction with correct score and selected IDs
- Themed classes applied
- Keyboard: Space to toggle, Tab to navigate

---

### 3. True / False

**Current state:** Partial CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) (lines 667-728). Uses `tpl-tf-preview__` prefix. TSX: [TrueFalse.tsx](src/components/templates/assessment/TrueFalse.tsx).

**Migration strategy:**
1. Create [TrueFalse.css](src/components/templates/assessment/TrueFalse.css)
2. Extract `tpl-tf-*` rules from TemplateStyles.css
3. Standardize BEM: `.tpl-tf__question`, `.tpl-tf__options`, `.tpl-tf__option`
4. Update button styling to match system
5. Update TSX: import CSS, ensure className consistency

**BEM class structure:**
```
.tpl-tf                               // Root container
.tpl-tf__question                     // Question/statement text
.tpl-tf__options                      // Button wrapper
.tpl-tf__option                       // True/False button
.tpl-tf__option--selected             // Selected state
.tpl-tf__option--correct              // Correct answer (post-submit)
.tpl-tf__option--incorrect            // Incorrect answer (post-submit)
.tpl-tf__icon                         // CheckCircle/XCircle
.tpl-tf__explanation                  // Explanation text
.tpl-tf__actions                      // Submit button container
.tpl-tf__button                       // Submit button
.tpl-tf-editor                        // Editor root
```

**Key design elements:**
- Two large buttons (True/False): 12px 32px padding, min-width 120px
- Desktop: side-by-side with 16px gap
- Mobile: stacked vertically, full width
- Border: 2px solid theme-border, theme-primary selected, theme-success/error post-submit
- Border-radius: 8px
- Font-weight: 600, font-size: 16px
- Transitions: all 150ms

**Test coverage:**
- Renders statement and two buttons
- Selects True or False
- Submit shows correct/incorrect feedback
- Displays explanation
- Calls onInteraction with isCorrect boolean
- Responsive layout (horizontal → vertical)
- Themed classes
- Keyboard: Tab + Enter/Space

---

### 4. Fill in the Blanks

**Current state:** Partial CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) (lines 733-786). Uses `tpl-fb-preview__` prefix. TSX: [FillBlanks.tsx](src/components/templates/assessment/FillBlanks.tsx).

**Migration strategy:**
1. Create [FillBlanks.css](src/components/templates/assessment/FillBlanks.css)
2. Extract `tpl-fb-*` rules from TemplateStyles.css
3. Refine input field styling (underline style, focus states)
4. Add correct answer display styling
5. Update TSX: import CSS

**BEM class structure:**
```
.tpl-fb                               // Root container
.tpl-fb__title                        // Title/instructions
.tpl-fb__content                      // Text content with blanks
.tpl-fb__inline                       // Inline wrapper for input
.tpl-fb__input                        // Blank input field
.tpl-fb__input--correct               // Correct answer (green underline)
.tpl-fb__input--incorrect             // Incorrect answer (red underline)
.tpl-fb__correct-answer               // Displayed correct answer (if wrong)
.tpl-fb__actions                      // Submit button container
.tpl-fb__button                       // Submit button
.tpl-fb-editor                        // Editor root
.tpl-fb-editor__template-help         // Help text (e.g., "Use {{blank_id}}")
.tpl-fb-editor__blank-row             // Blank configuration row
.tpl-fb-editor__blank-id              // Blank ID label
```

**Key design elements:**
- Input fields: inline-block, min-width 100px, border-bottom 2px solid theme-primary
- No top/left/right borders (underline style)
- Padding: 4px 8px
- Focus: border-color → darker primary, background tint
- Correct: green underline + green background tint
- Incorrect: red underline + red background tint + show correct answer below
- Font-size: 15px to match surrounding text
- Line-height: 2 for readability

**Test coverage:**
- Parses template text with {{placeholder}} syntax
- Renders inline input fields
- Accepts user input
- Submit calculates correctness (including alternatives)
- Shows correct answer for wrong blanks
- Calls onInteraction with answers object and score
- Themed classes
- Keyboard: Tab between inputs, Enter to submit

---

### 5. Matching

**Current state:** Partial CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) (lines 790-854). Uses `tpl-matching-preview__` prefix. TSX: [Matching.tsx](src/components/templates/assessment/Matching.tsx).

**Migration strategy:**
1. Create [Matching.css](src/components/templates/assessment/Matching.css)
2. Extract `tpl-matching-*` rules from TemplateStyles.css
3. Enhance selection connection visual (line or arrow between matched items)
4. Add matched state styling
5. Update TSX: import CSS

**BEM class structure:**
```
.tpl-matching                         // Root container
.tpl-matching__title                  // Title
.tpl-matching__instructions           // Instructions
.tpl-matching__columns                // Two-column layout
.tpl-matching__left                   // Left column
.tpl-matching__right                  // Right column
.tpl-matching__item                   // Matchable item
.tpl-matching__item--selected         // Selected (waiting for match)
.tpl-matching__item--matched          // Already matched
.tpl-matching__item--correct          // Correct match (post-submit)
.tpl-matching__item--incorrect        // Incorrect match (post-submit)
.tpl-matching__link                   // Visual link indicator (→)
.tpl-matching__actions                // Submit button container
.tpl-matching__button                 // Submit button
.tpl-matching-editor                  // Editor root
.tpl-matching-editor__pair            // Pair row in editor
```

**Key design elements:**
- Two-column grid layout: `grid-template-columns: 1fr 1fr`, gap 16px
- Items: padding 12px 16px, border 2px solid theme-border, border-radius 6px
- Selected: theme-primary border + blue background tint + box-shadow
- Matched: light green border + green background tint
- Correct: theme-success border
- Incorrect: theme-error border + red background tint
- Visual link: arrow icon (→) appears when matched
- Mobile (<768px): single column, stacked

**Test coverage:**
- Renders two columns (left and right shuffled)
- Click left item → selected state
- Click right item → creates match
- Submit calculates correctness (left.id === right.id)
- Shows correct/incorrect feedback
- Calls onInteraction with selections object and score
- Responsive layout (grid → stack)
- Themed classes
- Keyboard: Tab + Enter to select/match

---

### 6. Scenario-Based Question

**Current state:** NO CSS file. [ScenarioQuestion.tsx](src/components/templates/assessment/ScenarioQuestion.tsx) uses inline styles. Supports scenario context (text + optional image) + question + options with points-based scoring.

**Creation strategy:**
1. Create [ScenarioQuestion.css](src/components/templates/assessment/ScenarioQuestion.css) from scratch
2. Design scenario context card (border, padding, background)
3. Image styling (max-width, border-radius)
4. Options similar to MCQ but may show points or feedback per option
5. Points-based scoring display

**BEM class structure:**
```
.tpl-sq                               // Root container
.tpl-sq__context                      // Scenario context container
.tpl-sq__image                        // Scenario image
.tpl-sq__description                  // Scenario description text
.tpl-sq__question                     // Question heading
.tpl-sq__options                      // Options wrapper
.tpl-sq__option                       // Individual option
.tpl-sq__option--selected             // Selected state
.tpl-sq__option--best                 // Best answer (highest points)
.tpl-sq__option--acceptable           // Acceptable answer (medium points)
.tpl-sq__option--poor                 // Poor answer (low/no points)
.tpl-sq__points                       // Points badge on option
.tpl-sq__feedback                     // Feedback message
.tpl-sq__feedback-content             // Per-option feedback
.tpl-sq__actions                      // Submit button container
.tpl-sq__button                       // Submit button
.tpl-sq__score                        // Score display (X/Y points)
.tpl-sq-editor                        // Editor root
.tpl-sq-editor__option-row            // Option row with points input
```

**Key design elements:**
- Context card: padding 20px, border 1px solid theme-border, border-radius 8px, background theme-surface
- Image: max-width 100%, border-radius 8px, margin-bottom 16px
- Description: line-height 1.7, color theme-text
- Options: similar to MCQ styling
- Points badge: small circular badge (24px), theme-info background, white text
- Best answer: green tint, Acceptable: blue tint, Poor: gray
- Feedback per option (if provided): shows after submit

**Test coverage:**
- Renders scenario context (text + image)
- Renders question and options
- Select option
- Submit calculates points-based score
- Shows feedback for selected option
- Displays score (e.g., "3/5 points")
- Calls onInteraction with points, maxPoints, isCorrect (best answer)
- Themed classes
- Responsive: image scales, text readable

---

### 7. Knowledge Check

**Current state:** NO CSS file. [KnowledgeCheck.tsx](src/components/templates/assessment/KnowledgeCheck.tsx) uses inline styles. Supports multiple lightweight questions (1-3) with binary correct/incorrect feedback (no formal scoring display).

**Creation strategy:**
1. Create [KnowledgeCheck.css](src/components/templates/assessment/KnowledgeCheck.css) from scratch
2. Design compact question cards (less padding than full assessments)
3. Number each question (1., 2., 3.)
4. Inline options (compact radio-button-like UI)
5. Simple feedback (checkmark/X, no score)

**BEM class structure:**
```
.tpl-kc                               // Root container
.tpl-kc__title                        // Title ("Knowledge Check")
.tpl-kc__questions                    // Questions wrapper
.tpl-kc__question                     // Individual question container
.tpl-kc__question-text                // Question text (numbered)
.tpl-kc__options                      // Options for one question
.tpl-kc__option                       // Individual option
.tpl-kc__option--selected             // Selected state
.tpl-kc__option--correct              // Correct (post-submit)
.tpl-kc__option--incorrect            // Incorrect (post-submit)
.tpl-kc__icon                         // CheckCircle/XCircle
.tpl-kc__explanation                  // Explanation text (if provided)
.tpl-kc__actions                      // Submit button container
.tpl-kc__button                       // Submit button
.tpl-kc__summary                      // Summary (e.g., "2/3 correct")
.tpl-kc-editor                        // Editor root
.tpl-kc-editor__question-card         // Question card in editor
```

**Key design elements:**
- Compact design: padding 12px 16px for questions
- Question numbering: bold, theme-primary color
- Options: smaller than MCQ (padding 8px 12px), inline-flex
- Border: 1px solid theme-border (lighter than MCQ's 2px)
- Border-radius: 6px
- Feedback: minimal, just icon + color state
- Summary: "X/Y correct" in theme-info color
- Lightweight feel: no heavy borders or shadows

**Test coverage:**
- Renders multiple questions (1-3)
- Each question can be answered independently
- Submit checks all answers
- Shows correct/incorrect for each option
- Displays explanation per question (if provided)
- Shows summary count
- Calls onInteraction with answers object, correctCount
- Themed classes
- Keyboard: Tab between questions/options, Enter to submit

---

### 8. Final Assessment

**Current state:** NO CSS file. [FinalAssessment.tsx](src/components/templates/assessment/FinalAssessment.tsx) uses inline styles. Aggregates multiple question types (MCQ, True/False, Fill Blank) with pass/fail scoring.

**Creation strategy:**
1. Create [FinalAssessment.css](src/components/templates/assessment/FinalAssessment.css) from scratch
2. Design comprehensive assessment container (formal look)
3. Question cards (each question is a card)
4. Type-specific rendering (reuses patterns from MCQ, TrueFalse, FillBlanks)
5. Results summary panel (pass/fail badge, score breakdown)

**BEM class structure:**
```
.tpl-fa                               // Root container
.tpl-fa__title                        // Assessment title
.tpl-fa__instructions                 // Instructions
.tpl-fa__questions                    // Questions wrapper
.tpl-fa__question-card                // Individual question container
.tpl-fa__question-number              // Question number badge
.tpl-fa__question-text                // Question text
.tpl-fa__question-type                // Question type badge (MCQ, T/F, Fill)
.tpl-fa__options                      // Options (for MCQ/TF)
.tpl-fa__option                       // Individual option
.tpl-fa__option--selected             // Selected state
.tpl-fa__option--correct              // Correct (post-submit)
.tpl-fa__option--incorrect            // Incorrect (post-submit)
.tpl-fa__input                        // Input field (for fill blanks)
.tpl-fa__points                       // Points per question
.tpl-fa__actions                      // Submit button container
.tpl-fa__button                       // Submit button
.tpl-fa__results                      // Results summary panel
.tpl-fa__results--pass                // Pass state (green theme)
.tpl-fa__results--fail                // Fail state (red theme)
.tpl-fa__score                        // Score display (X/Y)
.tpl-fa__percentage                   // Percentage score
.tpl-fa__status-badge                 // Pass/Fail badge
.tpl-fa-editor                        // Editor root
.tpl-fa-editor__question-card         // Question card in editor
```

**Key design elements:**
- Formal design: heavier borders, card shadows
- Question cards: padding 20px, border 1px solid theme-border, border-radius 8px, margin-bottom 16px, background theme-background, box-shadow subtle
- Question number: circular badge (32px), theme-primary background, white text, bold
- Type badge (MCQ/T/F/Fill): small pill, theme-info background, white text, font-size 11px
- Points per question: displayed in top-right corner
- Results panel: prominent card, padding 24px, border-radius 12px
  - Pass: background theme-success tint, border theme-success
  - Fail: background theme-error tint, border theme-error
- Status badge: large (48px height), bold, uppercase
- Score: large font (24px), bold
- Percentage: font-size 18px

**Test coverage:**
- Renders multiple questions of mixed types
- Each question type renders correctly (MCQ radio, TF buttons, Fill inputs)
- Submit calculates total score across all questions
- Calculates percentage
- Determines pass/fail based on passingScore threshold
- Shows results summary panel
- Shows which questions were correct/incorrect
- Calls onInteraction with total score, maxScore, passed boolean
- Themed classes
- Responsive: cards stack, readable on mobile

---

## Implementation Checklist

### Phase 1: MCQ, MultipleSelect, TrueFalse (Templates 1-3)

**Audit & Plan (0.5 day)**
- [ ] Review existing CSS in [TemplateStyles.css](src/components/templates/TemplateStyles.css) for MCQ and TrueFalse
- [ ] Identify all class names used in TSX files for all 3 templates
- [ ] Document current inline styles to migrate (MultipleSelect)
- [ ] Confirm callback structures and prop signatures (no changes)

**CSS File Creation (1 day)**
- [ ] Create [src/components/templates/assessment/MCQ.css](src/components/templates/assessment/MCQ.css)
  - [ ] Migrate `tpl-mcq-*` rules from TemplateStyles.css
  - [ ] Standardize BEM naming (`.tpl-mcq__*`)
  - [ ] Add missing styles (retry button, explanation, score display)
  - [ ] Apply theme tokens with fallbacks
  - [ ] Add responsive rules for mobile
- [ ] Create [src/components/templates/assessment/MultipleSelect.css](src/components/templates/assessment/MultipleSelect.css)
  - [ ] Build from scratch using MCQ as reference
  - [ ] Implement checkbox visual styles
  - [ ] Add multiple-selection states
  - [ ] Add partial credit feedback styles
  - [ ] Apply theme tokens with fallbacks
- [ ] Create [src/components/templates/assessment/TrueFalse.css](src/components/templates/assessment/TrueFalse.css)
  - [ ] Migrate `tpl-tf-*` rules from TemplateStyles.css
  - [ ] Refine button styling (large True/False buttons)
  - [ ] Add horizontal/vertical responsive layout
  - [ ] Apply theme tokens with fallbacks

**TSX Updates (0.5 day)**
- [ ] Update [MCQ.tsx](src/components/templates/assessment/MCQ.tsx)
  - [ ] Add `import './MCQ.css';` at top
  - [ ] Verify className attributes match `.tpl-mcq__*` structure
  - [ ] Remove any inline styles
  - [ ] Add data-testid attributes if missing
- [ ] Update [MultipleSelect.tsx](src/components/templates/assessment/MultipleSelect.tsx)
  - [ ] Add `import './MultipleSelect.css';`
  - [ ] Replace inline styles with className attributes (`.tpl-ms__*`)
  - [ ] Verify checkbox rendering logic
- [ ] Update [TrueFalse.tsx](src/components/templates/assessment/TrueFalse.tsx)
  - [ ] Add `import './TrueFalse.css';`
  - [ ] Verify className attributes match `.tpl-tf__*`
  - [ ] Remove inline styles

**Testing (1 day)**
- [ ] Write/update tests for MCQ: [MCQ.test.tsx](src/components/templates/assessment/MCQ.test.tsx)
  - [ ] Renders question and options
  - [ ] Selection updates state
  - [ ] Submit shows feedback
  - [ ] Retry resets state
  - [ ] Themed classes applied
  - [ ] Keyboard interaction
- [ ] Write/update tests for MultipleSelect: [MultipleSelect.test.tsx](src/components/templates/assessment/MultipleSelect.test.tsx)
  - [ ] Multiple selections allowed
  - [ ] Submit calculates score (both modes)
  - [ ] Feedback shown correctly
  - [ ] Themed classes applied
- [ ] Write/update tests for TrueFalse: [TrueFalse.test.tsx](src/components/templates/assessment/TrueFalse.test.tsx)
  - [ ] Renders True/False buttons
  - [ ] Selection works
  - [ ] Submit shows feedback
  - [ ] Themed classes applied
  - [ ] Responsive layout

**Validation (0.5 day)**
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run build` — no errors or warnings
- [ ] Visual inspection in Storybook or dev mode
- [ ] Check responsive behavior at 768px breakpoint
- [ ] Verify callbacks fire correctly (use console logs if needed)
- [ ] Check accessibility (keyboard navigation, focus rings)

**Commit: Phase 1 Complete**
```bash
git add src/components/templates/assessment/MCQ.* src/components/templates/assessment/MultipleSelect.* src/components/templates/assessment/TrueFalse.*
git commit -m "feat(assessment): BEM CSS refactor for MCQ, MultipleSelect, TrueFalse templates"
```

---

### Phase 2: FillBlanks, Matching (Templates 4-5)

**CSS File Creation (0.5 day)**
- [ ] Create [src/components/templates/assessment/FillBlanks.css](src/components/templates/assessment/FillBlanks.css)
  - [ ] Migrate `tpl-fb-*` rules from TemplateStyles.css
  - [ ] Refine input underline styling
  - [ ] Add correct answer display styles
  - [ ] Apply theme tokens with fallbacks
- [ ] Create [src/components/templates/assessment/Matching.css](src/components/templates/assessment/Matching.css)
  - [ ] Migrate `tpl-matching-*` rules from TemplateStyles.css
  - [ ] Enhance matched state visuals
  - [ ] Add link indicator styles
  - [ ] Apply theme tokens with fallbacks
  - [ ] Add responsive grid → stack layout

**TSX Updates (0.5 day)**
- [ ] Update [FillBlanks.tsx](src/components/templates/assessment/FillBlanks.tsx)
  - [ ] Add `import './FillBlanks.css';`
  - [ ] Verify className attributes (`.tpl-fb__*`)
  - [ ] Ensure input field rendering matches CSS
- [ ] Update [Matching.tsx](src/components/templates/assessment/Matching.tsx)
  - [ ] Add `import './Matching.css';`
  - [ ] Verify className attributes (`.tpl-matching__*`)
  - [ ] Check selection logic and matched state rendering

**Testing (0.5 day)**
- [ ] Write/update tests for FillBlanks: [FillBlanks.test.tsx](src/components/templates/assessment/FillBlanks.test.tsx)
  - [ ] Parses template with {{placeholders}}
  - [ ] Renders input fields
  - [ ] Submit calculates correctness
  - [ ] Shows correct answers
  - [ ] Themed classes applied
- [ ] Write/update tests for Matching: [Matching.test.tsx](src/components/templates/assessment/Matching.test.tsx)
  - [ ] Renders two columns
  - [ ] Selection and matching works
  - [ ] Submit calculates correctness
  - [ ] Feedback shown
  - [ ] Themed classes applied
  - [ ] Responsive layout

**Validation (0.5 day)**
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run build` — no errors
- [ ] Visual inspection and responsive check
- [ ] Verify callbacks and scoring logic unchanged

**Commit: Phase 2 Complete**
```bash
git add src/components/templates/assessment/FillBlanks.* src/components/templates/assessment/Matching.*
git commit -m "feat(assessment): BEM CSS refactor for FillBlanks and Matching templates"
```

---

### Phase 3: ScenarioQuestion, KnowledgeCheck, FinalAssessment (Templates 6-8)

**CSS File Creation (1 day)**
- [ ] Create [src/components/templates/assessment/ScenarioQuestion.css](src/components/templates/assessment/ScenarioQuestion.css)
  - [ ] Build from scratch
  - [ ] Scenario context card styles (border, padding, background)
  - [ ] Image styling (max-width, border-radius)
  - [ ] Options with points badges
  - [ ] Feedback per option
  - [ ] Apply theme tokens with fallbacks
- [ ] Create [src/components/templates/assessment/KnowledgeCheck.css](src/components/templates/assessment/KnowledgeCheck.css)
  - [ ] Build from scratch
  - [ ] Compact question cards
  - [ ] Numbered questions
  - [ ] Lightweight option styling
  - [ ] Summary display
  - [ ] Apply theme tokens with fallbacks
- [ ] Create [src/components/templates/assessment/FinalAssessment.css](src/components/templates/assessment/FinalAssessment.css)
  - [ ] Build from scratch
  - [ ] Formal assessment container
  - [ ] Question cards with numbers and type badges
  - [ ] Mixed question type styling (reuse patterns)
  - [ ] Results summary panel (pass/fail states)
  - [ ] Apply theme tokens with fallbacks

**TSX Updates (0.5 day)**
- [ ] Update [ScenarioQuestion.tsx](src/components/templates/assessment/ScenarioQuestion.tsx)
  - [ ] Add `import './ScenarioQuestion.css';`
  - [ ] Replace inline styles with `.tpl-sq__*` classes
  - [ ] Add data-testid attributes
- [ ] Update [KnowledgeCheck.tsx](src/components/templates/assessment/KnowledgeCheck.tsx)
  - [ ] Add `import './KnowledgeCheck.css';`
  - [ ] Replace inline styles with `.tpl-kc__*` classes
  - [ ] Verify question numbering logic
- [ ] Update [FinalAssessment.tsx](src/components/templates/assessment/FinalAssessment.tsx)
  - [ ] Add `import './FinalAssessment.css';`
  - [ ] Replace inline styles with `.tpl-fa__*` classes
  - [ ] Ensure results panel rendering matches CSS

**Testing (1 day)**
- [ ] Write/update tests for ScenarioQuestion: [ScenarioQuestion.test.tsx](src/components/templates/assessment/ScenarioQuestion.test.tsx)
  - [ ] Renders scenario context (text + image)
  - [ ] Renders question and options
  - [ ] Selection works
  - [ ] Submit calculates points-based score
  - [ ] Shows feedback
  - [ ] Themed classes applied
- [ ] Write/update tests for KnowledgeCheck: [KnowledgeCheck.test.tsx](src/components/templates/assessment/KnowledgeCheck.test.tsx)
  - [ ] Renders multiple questions
  - [ ] Each question answerable
  - [ ] Submit checks all answers
  - [ ] Shows summary
  - [ ] Themed classes applied
- [ ] Write/update tests for FinalAssessment: [FinalAssessment.test.tsx](src/components/templates/assessment/FinalAssessment.test.tsx)
  - [ ] Renders mixed question types
  - [ ] Each question type works correctly
  - [ ] Submit calculates total score
  - [ ] Pass/fail determined correctly
  - [ ] Results panel displays correctly
  - [ ] Themed classes applied

**Validation (0.5 day)**
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run build` — no errors
- [ ] Visual inspection (especially results panel styling)
- [ ] Responsive behavior for all 3 templates
- [ ] Verify scoring and pass/fail logic unchanged

**Commit: Phase 3 Complete**
```bash
git add src/components/templates/assessment/ScenarioQuestion.* src/components/templates/assessment/KnowledgeCheck.* src/components/templates/assessment/FinalAssessment.*
git commit -m "feat(assessment): BEM CSS refactor for ScenarioQuestion, KnowledgeCheck, FinalAssessment templates"
```

---

### Cleanup & Final Validation

**TemplateStyles.css Cleanup (0.5 day)**
- [ ] Remove migrated MCQ styles from [TemplateStyles.css](src/components/templates/TemplateStyles.css)
- [ ] Remove migrated TrueFalse styles
- [ ] Remove migrated FillBlanks styles
- [ ] Remove migrated Matching styles
- [ ] Verify no other components depend on deleted rules
- [ ] Run `npm test` to confirm no regressions

**Commit: Cleanup Complete**
```bash
git add src/components/templates/TemplateStyles.css
git commit -m "refactor(templates): remove migrated assessment styles from TemplateStyles.css"
```

**Final Integration (0.5 day)**
- [ ] Run full test suite: `npm test`
- [ ] Run build: `npm run build`
- [ ] Visual regression check: manually test all 8 assessment templates in dev mode
- [ ] Check each template in both Editor and Preview mode
- [ ] Verify responsive behavior on mobile viewport (DevTools)
- [ ] Test keyboard navigation and focus states
- [ ] Confirm all callbacks fire with unchanged behavior (use browser console if needed)

**Documentation Update**
- [ ] Update this plan document with any deviations or notes
- [ ] Add comments in CSS files explaining complex patterns
- [ ] Update component registry if default data improved

---

## Testing Matrix

### Common Test Scenarios (All 8 Templates)

| Test Case | Expected Behavior | Validation |
|-----------|-------------------|------------|
| **Default Render** | Template renders without errors | No console errors, elements present |
| **Themed Classes** | BEM classes applied correctly | `.tpl-{name}__*` classes in DOM |
| **Option Selection** | User can select answers | State updates, visual feedback |
| **Submit Button** | Enabled when answer(s) selected | Disabled state before selection |
| **Submit Action** | onInteraction callback fired | Spy/mock confirms call with correct payload |
| **Scoring Calculation** | Score calculated correctly | score/maxScore in callback payload |
| **Completion Callback** | onComplete fired after submit | Spy/mock confirms call with componentId |
| **Visual Feedback** | Correct/incorrect states shown | `.tpl-{name}__option--correct/incorrect` classes |
| **Retry/Reset** | State resets correctly (if applicable) | Selections cleared, submit enabled again |
| **Responsive Layout** | Layout adapts at 768px breakpoint | Grid → stack, buttons horizontal → vertical |
| **Keyboard Navigation** | Tab, Enter/Space work | Focus visible, selection/submission possible |
| **Accessibility** | Roles, labels, aria attributes present | role="radio/checkbox/group", aria-checked, aria-label |

### Template-Specific Tests

**MCQ**
- [ ] Only one option selectable (radio behavior)
- [ ] Unselected options disabled post-submit
- [ ] Correct answer highlighted with green border + checkmark
- [ ] Incorrect selection highlighted with red border + X icon
- [ ] Explanation displayed after submit (if provided)
- [ ] maxScore defaults to 1

**MultipleSelect**
- [ ] Multiple options selectable (checkbox behavior)
- [ ] All-or-nothing mode: score 0 or maxScore only
- [ ] Proportional mode: partial credit calculated correctly
- [ ] Each option shows correct/incorrect state post-submit
- [ ] Gray background for unselected correct options

**TrueFalse**
- [ ] Two buttons (True/False) rendered
- [ ] Selection toggles between True/False
- [ ] Desktop: buttons side-by-side
- [ ] Mobile: buttons stacked vertically
- [ ] Correct button highlighted green, incorrect red

**FillBlanks**
- [ ] Template text parsed with {{placeholder}} syntax
- [ ] Input fields rendered inline
- [ ] User can type in each blank
- [ ] Correct answers accepted (including alternatives)
- [ ] Incorrect blanks show correct answer below input
- [ ] Score = number of correct blanks

**Matching**
- [ ] Left and right columns rendered
- [ ] Right column shuffled randomly
- [ ] Click left item → selected state
- [ ] Click right item → match created
- [ ] Visual link indicator (→) shown when matched
- [ ] Correct matches: green, Incorrect: red
- [ ] Desktop: two-column grid
- [ ] Mobile: single column stack

**ScenarioQuestion**
- [ ] Scenario context card rendered (text + optional image)
- [ ] Question rendered below context
- [ ] Options similar to MCQ
- [ ] Points-based scoring (not binary correct/incorrect)
- [ ] Feedback per option shown after submit
- [ ] Score display: "X/Y points"

**KnowledgeCheck**
- [ ] Multiple questions (1-3) rendered
- [ ] Questions numbered (1., 2., 3.)
- [ ] Each question answered independently
- [ ] Submit checks all questions at once
- [ ] Correct/incorrect feedback per question
- [ ] Summary: "X/Y correct" displayed

**FinalAssessment**
- [ ] Multiple questions of mixed types rendered
- [ ] Each question type works correctly (MCQ, T/F, Fill)
- [ ] Submit calculates total score across all questions
- [ ] Percentage calculated
- [ ] Pass/fail determined by passingScore threshold
- [ ] Results panel: green (pass) or red (fail)
- [ ] Status badge: "PASS" or "FAIL"
- [ ] Score breakdown displayed

---

## File Artifacts

### New CSS Files (8)
1. [src/components/templates/assessment/MCQ.css](src/components/templates/assessment/MCQ.css) — **Migrate from TemplateStyles.css**
2. [src/components/templates/assessment/MultipleSelect.css](src/components/templates/assessment/MultipleSelect.css) — **Create new**
3. [src/components/templates/assessment/TrueFalse.css](src/components/templates/assessment/TrueFalse.css) — **Migrate from TemplateStyles.css**
4. [src/components/templates/assessment/FillBlanks.css](src/components/templates/assessment/FillBlanks.css) — **Migrate from TemplateStyles.css**
5. [src/components/templates/assessment/Matching.css](src/components/templates/assessment/Matching.css) — **Migrate from TemplateStyles.css**
6. [src/components/templates/assessment/ScenarioQuestion.css](src/components/templates/assessment/ScenarioQuestion.css) — **Create new**
7. [src/components/templates/assessment/KnowledgeCheck.css](src/components/templates/assessment/KnowledgeCheck.css) — **Create new**
8. [src/components/templates/assessment/FinalAssessment.css](src/components/templates/assessment/FinalAssessment.css) — **Create new**

### Modified TSX Files (8)
1. [src/components/templates/assessment/MCQ.tsx](src/components/templates/assessment/MCQ.tsx) — Import CSS, verify classes
2. [src/components/templates/assessment/MultipleSelect.tsx](src/components/templates/assessment/MultipleSelect.tsx) — Import CSS, replace inline styles
3. [src/components/templates/assessment/TrueFalse.tsx](src/components/templates/assessment/TrueFalse.tsx) — Import CSS, verify classes
4. [src/components/templates/assessment/FillBlanks.tsx](src/components/templates/assessment/FillBlanks.tsx) — Import CSS, verify classes
5. [src/components/templates/assessment/Matching.tsx](src/components/templates/assessment/Matching.tsx) — Import CSS, verify classes
6. [src/components/templates/assessment/ScenarioQuestion.tsx](src/components/templates/assessment/ScenarioQuestion.tsx) — Import CSS, replace inline styles
7. [src/components/templates/assessment/KnowledgeCheck.tsx](src/components/templates/assessment/KnowledgeCheck.tsx) — Import CSS, replace inline styles
8. [src/components/templates/assessment/FinalAssessment.tsx](src/components/templates/assessment/FinalAssessment.tsx) — Import CSS, replace inline styles

### New/Updated Test Files (8)
1. [src/components/templates/assessment/MCQ.test.tsx](src/components/templates/assessment/MCQ.test.tsx)
2. [src/components/templates/assessment/MultipleSelect.test.tsx](src/components/templates/assessment/MultipleSelect.test.tsx)
3. [src/components/templates/assessment/TrueFalse.test.tsx](src/components/templates/assessment/TrueFalse.test.tsx)
4. [src/components/templates/assessment/FillBlanks.test.tsx](src/components/templates/assessment/FillBlanks.test.tsx)
5. [src/components/templates/assessment/Matching.test.tsx](src/components/templates/assessment/Matching.test.tsx)
6. [src/components/templates/assessment/ScenarioQuestion.test.tsx](src/components/templates/assessment/ScenarioQuestion.test.tsx)
7. [src/components/templates/assessment/KnowledgeCheck.test.tsx](src/components/templates/assessment/KnowledgeCheck.test.tsx)
8. [src/components/templates/assessment/FinalAssessment.test.tsx](src/components/templates/assessment/FinalAssessment.test.tsx)

### Modified Shared Files (1)
1. [src/components/templates/TemplateStyles.css](src/components/templates/TemplateStyles.css) — Remove migrated assessment styles (MCQ, TrueFalse, FillBlanks, Matching)

---

## Validation Criteria

### Automated Checks
- ✅ **Test Pass Rate:** 100% (all existing + new tests pass)
- ✅ **Build Success:** `npm run build` completes without errors or warnings
- ✅ **Type Safety:** `npm run typecheck` (or `tsc --noEmit`) passes
- ✅ **Lint Clean:** `npm run lint` reports no issues (if applicable)

### Manual Validation
- ✅ **Visual Regression:** All 8 templates render identically to pre-refactor state (no unintended visual changes)
- ✅ **Interaction Testing:** All user interactions (selection, submission, retry) work as before
- ✅ **Callback Verification:** onInteraction and onComplete callbacks fire with correct payloads
- ✅ **Scoring Accuracy:** Scoring calculations unchanged (verify with sample data)
- ✅ **Responsive Behavior:** Templates adapt correctly at 768px breakpoint
- ✅ **Keyboard Accessibility:** Tab, Enter, Space keys navigate and interact correctly
- ✅ **Screen Reader:** Roles, labels, aria attributes present and correct

### Functional Invariance Checklist
**⚠️ CRITICAL: These must remain 100% unchanged:**
- [ ] State management logic (useState, useCallback) unchanged
- [ ] Scoring algorithms (MCQ correct/incorrect, MultipleSelect proportional, Matching pair matching, FillBlanks alternatives, ScenarioQuestion points, FinalAssessment aggregation) unchanged
- [ ] onInteraction callback payloads identical (componentId, interactionType, value, score, maxScore, isCorrect, completed)
- [ ] onComplete callback behavior identical (called after submit)
- [ ] Data structures (options arrays, question objects, pair objects) unchanged
- [ ] Editor functionality (onChange callbacks, controlled inputs) unchanged
- [ ] Accessibility attributes (role, aria-label, aria-checked) preserved

### CSS Quality Checks
- ✅ **BEM Consistency:** All classes follow `.tpl-{name}__element--modifier` pattern
- ✅ **Theme Token Coverage:** No hardcoded colors/fonts/shadows
- ✅ **Fallback Values:** All theme tokens have fallback values
- ✅ **Responsive Rules:** Breakpoint at 768px, mobile-first approach
- ✅ **No Duplication:** No duplicate rules (removed from TemplateStyles.css)
- ✅ **Maintainability:** CSS files organized, commented where complex

---

## Rollback Strategy

### Git Safety
- Each phase committed separately (Phase 1, Phase 2, Phase 3, Cleanup)
- Commit messages follow conventional commits format: `feat(assessment): ...`
- Each commit is atomic: includes TSX + CSS + tests together
- Use feature branch: `feature/assessment-templates-bem-refactor` (or continue on `feature/interaction-templates-bem-theme`)

### Rollback Procedure (if needed)
**Rollback last phase:**
```bash
git revert HEAD
git push
```

**Rollback to specific commit:**
```bash
git log --oneline  # Find commit hash before refactor
git revert <commit-hash>..HEAD
git push
```

**Nuclear option (local only, before push):**
```bash
git reset --hard <commit-hash-before-refactor>
```

### Incremental Validation
- Validate after each phase (not just at the end)
- If Phase 1 succeeds, commit and move to Phase 2
- If Phase 2 fails, rollback Phase 2 only, fix, retry
- Prevents large rollbacks

### Safe Commit Strategy
- Run tests before each commit: `npm test`
- Run build before each commit: `npm run build`
- If tests/build fail, do NOT commit
- Check git diff carefully before commit: `git diff --staged`

---

## Notes & Warnings

### Design-Only Guarantees
**⚠️ This refactor is STRICTLY design-only. The following are OUT OF SCOPE and must NOT be changed:**
- State management (useState, useReducer, useCallback hooks)
- Scoring algorithms (MCQ correctness, MultipleSelect proportional credit, Matching pair validation, FillBlanks alternatives, ScenarioQuestion points, FinalAssessment aggregation)
- Callback signatures and payloads (onInteraction, onComplete)
- Data structures and prop types (MCQOption, MSOption, FAQuestion, etc.)
- Editor behavior (onChange, controlled inputs, registry integration)
- Accessibility semantics (role attributes, aria-labels must be preserved)

### Edge Cases to Preserve
- **MCQ:** Disabled state for unselected options after submit
- **MultipleSelect:** Proportional scoring formula (hits - falsePositives) / correctCount
- **TrueFalse:** correctAnswer defaults to true if not specified
- **FillBlanks:** Case-insensitive answer checking, alternatives array support
- **Matching:** Shuffled right column (deterministic shuffle on mount)
- **ScenarioQuestion:** maxPoints = highest option points value
- **KnowledgeCheck:** No formal maxScore (just correctCount)
- **FinalAssessment:** passingScore defaults to 70 if not provided

### Performance Considerations
- CSS files are small (<200 lines each), no performance impact
- No new JavaScript logic added
- Responsive styles use standard media queries (no JS-based responsive logic)

### Accessibility Preservation
- All role attributes must remain (role="radio", role="radiogroup", role="checkbox")
- All aria-* attributes must remain (aria-checked, aria-label, aria-labelledby)
- Keyboard navigation logic unchanged (onKeyDown handlers untouched if present)

### Browser Compatibility
- Theme tokens use CSS custom properties (var(--theme-*)) with fallbacks
- BEM classes are standard CSS (no vendor prefixes needed)
- Responsive media queries use standard @media syntax
- No modern CSS features that require polyfills

---

## Success Metrics

### Quantitative
- 8 new CSS files created
- 8 TSX files updated with imports and className verification
- 8 test files created/updated
- 1 shared CSS file cleaned up (TemplateStyles.css)
- ~400-600 lines of CSS migrated/created
- 100% test pass rate maintained
- 0 build errors or warnings

### Qualitative
- Consistent design language across all assessment templates
- Improved maintainability (dedicated CSS files vs. monolithic TemplateStyles.css)
- Better developer experience (BEM naming makes intent clear)
- Easier theming in the future (centralized theme tokens)
- Reduced cognitive load (no inline styles to parse in TSX)

---

**Document Version:** 1.0  
**Created:** March 2, 2026  
**Branch:** `feature/interaction-templates-bem-theme` (or new branch `feature/assessment-templates-bem-refactor`)  
**Estimated Completion:** 5-8 days (depends on test coverage depth)
