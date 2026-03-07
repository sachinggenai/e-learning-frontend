# Start Work Prompt - March 3, 2026

## Quick Context

**Current Status:** Just completed Scenario template design refactor (BranchingScenario, CaseStudy). All work committed and pushed to `feature/interaction-templates-bem-theme` branch.

**Latest Commits:**
- `5225fa5` - Scenario templates: apply themed BEM design refactor and add tests (March 2, 2026)
- `48dd703` - Add design plan for Scenario templates
- `aa0ad94` - Interaction templates: apply themed BEM design refactor
- `601e19d` - Add design plan for Interaction templates

**Branch:** `feature/interaction-templates-bem-theme` (tracking `origin/feature/interaction-templates-bem-theme`)

**Build Status:** ✅ All tests passing, production build clean

---

## Today's Task: Assessment Templates Design Refactor

**Objective:** Implement design-only BEM refactor for 8 Assessment category templates following the same pattern as Interaction and Scenario templates.

**Design Plan:** [DESIGN_PLAN_ASSESSMENT_TEMPLATES.md](../DESIGN_PLAN_ASSESSMENT_TEMPLATES.md) (created March 2, 2026)

### Templates to Refactor (8 total)

**Phase 1: MCQ, MultipleSelect, TrueFalse (3 templates)**
1. **Multiple Choice (MCQ)** - [MCQ.tsx](../src/components/templates/assessment/MCQ.tsx)
   - Has partial CSS in TemplateStyles.css → migrate to dedicated MCQ.css
   - Standardize BEM classes, add theme tokens
   
2. **Multiple Select** - [MultipleSelect.tsx](../src/components/templates/assessment/MultipleSelect.tsx)
   - NO CSS currently → create MultipleSelect.css from scratch
   - Implement checkbox semantics, multiple selection states
   
3. **True / False** - [TrueFalse.tsx](../src/components/templates/assessment/TrueFalse.tsx)
   - Has partial CSS in TemplateStyles.css → migrate to dedicated TrueFalse.css
   - Implement responsive horizontal/vertical button layout

**Phase 2: FillBlanks, Matching (2 templates)**
4. **Fill in the Blanks** - [FillBlanks.tsx](../src/components/templates/assessment/FillBlanks.tsx)
   - Has partial CSS in TemplateStyles.css → migrate to dedicated FillBlanks.css
   
5. **Matching** - [Matching.tsx](../src/components/templates/assessment/Matching.tsx)
   - Has partial CSS in TemplateStyles.css → migrate to dedicated Matching.css

**Phase 3: ScenarioQuestion, KnowledgeCheck, FinalAssessment (3 templates)**
6. **Scenario-Based Question** - [ScenarioQuestion.tsx](../src/components/templates/assessment/ScenarioQuestion.tsx)
   - NO CSS currently → create ScenarioQuestion.css from scratch
   
7. **Knowledge Check** - [KnowledgeCheck.tsx](../src/components/templates/assessment/KnowledgeCheck.tsx)
   - NO CSS currently → create KnowledgeCheck.css from scratch
   
8. **Final Assessment** - [FinalAssessment.tsx](../src/components/templates/assessment/FinalAssessment.tsx)
   - NO CSS currently → create FinalAssessment.css from scratch

---

## Implementation Approach

### Design System (Same as Previous Work)

**BEM Convention:**
- Root: `.tpl-{template-name}` (preview), `.tpl-{template-name}-editor` (editor)
- Elements: `__{element}` (e.g., `.tpl-mcq__question`, `.tpl-mcq__option`)
- Modifiers: `--{modifier}` (e.g., `.tpl-mcq__option--selected`, `.tpl-mcq__option--correct`)

**9 Theme Tokens (with fallbacks):**
```css
var(--theme-primary, #2563eb)         /* Blue - primary buttons, selected states */
var(--theme-text, #1e293b)            /* Dark slate - main text */
var(--theme-text-secondary, #64748b)  /* Gray - instructions, hints */
var(--theme-border, #e2e8f0)          /* Light gray - borders, dividers */
var(--theme-surface, #f8fafc)         /* Off-white - card backgrounds */
var(--theme-background, #ffffff)      /* White - main backgrounds */
var(--theme-success, #22c55e)         /* Green - correct answers */
var(--theme-error, #ef4444)           /* Red - incorrect answers */
var(--theme-info, #3b82f6)            /* Info blue - informational messages */
```

**Responsive Breakpoint:** `768px` (mobile-first)

**Accessibility:** Preserve all role attributes, aria-labels, keyboard navigation

---

## Step-by-Step Workflow

### Start with Phase 1 (Recommended)

1. **Audit existing code:**
   - Read [MCQ.tsx](../src/components/templates/assessment/MCQ.tsx), [MultipleSelect.tsx](../src/components/templates/assessment/MultipleSelect.tsx), [TrueFalse.tsx](../src/components/templates/assessment/TrueFalse.tsx)
   - Check existing CSS in [TemplateStyles.css](../src/components/templates/TemplateStyles.css) (lines 559-728 for MCQ/TrueFalse)
   - Document class names currently used

2. **Create CSS files:**
   - Create `src/components/templates/assessment/MCQ.css` (migrate from TemplateStyles.css)
   - Create `src/components/templates/assessment/MultipleSelect.css` (from scratch)
   - Create `src/components/templates/assessment/TrueFalse.css` (migrate from TemplateStyles.css)
   - Apply BEM naming, theme tokens, responsive rules

3. **Update TSX files:**
   - Add `import './[Component].css';` at top of each file
   - Verify className attributes match BEM structure
   - Remove any remaining inline styles (preserve dynamic styles if needed)

4. **Add test coverage:**
   - Create `MCQ.test.tsx`, `MultipleSelect.test.tsx`, `TrueFalse.test.tsx`
   - Test: rendering, selection, submission, scoring, callbacks, themed classes, keyboard nav

5. **Validate:**
   - Run `npm test` (all tests pass)
   - Run `npm run build` (clean build)
   - Visual inspection in dev mode
   - Test responsive behavior at 768px
   - Verify callbacks: onInteraction (with score), onComplete (with componentId)

6. **Commit Phase 1:**
   ```bash
   git add src/components/templates/assessment/MCQ.* src/components/templates/assessment/MultipleSelect.* src/components/templates/assessment/TrueFalse.*
   git commit -m "feat(assessment): BEM CSS refactor for MCQ, MultipleSelect, TrueFalse templates"
   ```

### Continue with Phase 2, then Phase 3

Follow the same pattern for FillBlanks/Matching (Phase 2) and ScenarioQuestion/KnowledgeCheck/FinalAssessment (Phase 3).

### Final Cleanup

1. Remove migrated styles from [TemplateStyles.css](../src/components/templates/TemplateStyles.css) (lines 559-854)
2. Run full test suite and build
3. Commit cleanup:
   ```bash
   git add src/components/templates/TemplateStyles.css
   git commit -m "refactor(templates): remove migrated assessment styles from TemplateStyles.css"
   ```

---

## Critical Rules (Design-Only Refactor)

### ⚠️ DO NOT CHANGE:
- State management logic (useState, useCallback, useEffect)
- Scoring algorithms (MCQ correctness, MultipleSelect proportional, Matching validation, FillBlanks alternatives, ScenarioQuestion points, FinalAssessment aggregation, KnowledgeCheck count)
- Callback signatures/payloads (onInteraction, onComplete)
- Data structures (MCQOption, MSOption, FAQuestion, etc.)
- Prop types (ComponentPreviewProps, ComponentEditorProps)
- Editor behavior (onChange callbacks, controlled inputs)
- Accessibility attributes (role, aria-label, aria-checked)
- Keyboard navigation handlers

### ✅ DO CHANGE:
- Extract inline styles → CSS files
- Apply BEM class naming
- Use theme tokens with fallbacks
- Add responsive media queries
- Create comprehensive test coverage
- Improve visual consistency

---

## Testing Checklist (Per Template)

- [ ] Renders without errors (no console errors)
- [ ] BEM classes applied correctly (`.tpl-{name}__*` in DOM)
- [ ] User can select/input answers (state updates)
- [ ] Submit button enabled/disabled appropriately
- [ ] onInteraction callback fired with correct payload (score, maxScore, isCorrect)
- [ ] onComplete callback fired after submit
- [ ] Visual feedback shown (correct/incorrect states)
- [ ] Retry/reset works (if applicable)
- [ ] Responsive layout adapts at 768px
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Accessibility attributes present (role, aria-*)

---

## Quick Reference Links

**Design Plan:** [DESIGN_PLAN_ASSESSMENT_TEMPLATES.md](../DESIGN_PLAN_ASSESSMENT_TEMPLATES.md)

**Template Files:**
- [src/components/templates/assessment/](../src/components/templates/assessment/)
- [src/components/templates/TemplateStyles.css](../src/components/templates/TemplateStyles.css) (existing CSS to migrate)

**Test Files:** Same directory as component files, naming: `{Component}.test.tsx`

**Previous Work (for reference):**
- [DESIGN_PLAN_INTERACTION_TEMPLATES.md](../DESIGN_PLAN_INTERACTION_TEMPLATES.md)
- [DESIGN_PLAN_SCENARIO_TEMPLATES.md](../DESIGN_PLAN_SCENARIO_TEMPLATES.md)

---

## Estimated Timeline

- **Phase 1 (MCQ, MultipleSelect, TrueFalse):** 2-3 days
- **Phase 2 (FillBlanks, Matching):** 1-2 days
- **Phase 3 (ScenarioQuestion, KnowledgeCheck, FinalAssessment):** 2-3 days
- **Cleanup & Final Validation:** 0.5 day
- **Total:** 5-8 days

---

## Success Criteria

✅ All 8 templates have dedicated CSS files  
✅ All styles use theme tokens with fallbacks  
✅ Zero inline styles (except dynamic/computed)  
✅ 100% test pass rate (existing + new tests)  
✅ Production build clean (no errors/warnings)  
✅ Visual regression: no unintended changes  
✅ Functional invariance: callbacks, scoring, state unchanged  
✅ Responsive behavior maintained at 768px  
✅ Keyboard accessibility preserved  

---

## Starting Command

Start your session with:

```
I'm ready to start the Assessment templates design refactor. I've reviewed the design plan in DESIGN_PLAN_ASSESSMENT_TEMPLATES.md. Let's begin with Phase 1: MCQ, MultipleSelect, and TrueFalse templates. Should I proceed with auditing the existing code and creating the CSS files?
```

**Or ask me to:**
- "Start with Phase 1: audit MCQ template and create CSS file"
- "Begin Assessment template refactor, starting with Multiple Choice"
- "Implement the Assessment design plan starting with Phase 1"

---

**Document Created:** March 2, 2026  
**For Session:** March 3, 2026  
**Branch:** `feature/interaction-templates-bem-theme`  
**Last Commit:** `5225fa5` (Scenario templates complete)  
**Next Task:** Assessment templates design refactor (Phase 1)
