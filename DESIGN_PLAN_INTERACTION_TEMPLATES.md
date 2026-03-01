# Design Plan: Interaction Templates Theme Alignment

**Objective:** Update Interaction templates to match the app's theme system using consistent CSS variables. No functionality changes—only design/styling updates.

**Scope:** 5 templates (4 existing + 1 new placeholder)
- Drag and Drop (DragDropSort)
- Flip Cards (FlipCards)
- Carousel
- Clickable Icons (ClickReveal)
- Slider (NEW - can be added in Phase 2 if needed)

**Timeline:** Sequential implementation per template, each with full test coverage.

---

## 1. DRAG AND DROP (DragDropSort)

### Current State
- **File:** `src/components/templates/interaction/DragDropSort.tsx`
- **CSS:** Inline styles with hardcoded colors:
  - Text color: `#64748b` (text-secondary)
  - Border: `1px solid #e5e7eb`, `1px solid #4ade80` (success), `1px solid #fc8181` (error)
  - Background: White, light gray backgrounds
  - Button colors: `#3b82f6` (primary), `#6b7280` (secondary)
- **Status:** ⚠️ **NOT theme-aligned** — Uses hardcoded hex values
- **Missing:** No dedicated CSS file

### Design Changes Required

#### 1.1 Create `DragDropSort.css`
Extract all inline styles into external CSS file with BEM naming and theme tokens:

**CSS Classes to implement:**
- `.tpl-drag-drop-sort` — Main container
- `.tpl-drag-drop-sort__title` — Title styling
- `.tpl-drag-drop-sort__instructions` — Instructions text  
- `.tpl-drag-drop-sort__list` — Sortable list container
- `.tpl-drag-drop-sort__item` — Individual draggable item
- `.tpl-drag-drop-sort__item--dragging` — State when being dragged
- `.tpl-drag-drop-sort__item--correct` — State after correct sort (success)
- `.tpl-drag-drop-sort__item--incorrect` — State after incorrect sort (error)
- `.tpl-drag-drop-sort__item--submitted` — State when form submitted
- `.tpl-drag-drop-sort__feedback` — Feedback message
- `.tpl-drag-drop-sort__actions` — Submit/Reset button container
- `.tpl-drag-drop-sort__button` — Button styling
- `.tpl-drag-drop-sort__button--primary` — Primary button (submit)
- `.tpl-drag-drop-sort__button--secondary` — Secondary button (reset)
- `.tpl-drag-drop-sort__progress` — Progress indicator

**Theme Token Mapping:**
```css
/* Colors */
--theme-primary: #2563eb (blue) — Primary buttons, focus states
--theme-text: #1e293b (dark) — Main text
--theme-text-secondary: #64748b (gray) — Instructions, secondary text
--theme-border: #e2e8f0 (light gray) — Item borders
--theme-background: #fff (white) — Item backgrounds
--theme-surface: #f8fafc (light gray) — Container backgrounds
--theme-success: #22c55e (green) — Correct sort state
--theme-error: #ef4444 (red) — Incorrect sort state
--theme-info: #3b82f6 (blue) — Optional info states
```

#### 1.2 Update `DragDropSort.tsx`
- Import CSS file: `import './DragDropSort.css';`
- Replace inline styles with className attributes
- Maintain all functionality (drag, drop, shuffle, submit, validation)
- Add data-testid attributes for test selectors

**Key styling updates:**
- Item borders: `var(--theme-border, #e2e8f0)`
- Submitted + wrong: `var(--theme-error, #ef4444)`
- Submitted + correct: `var(--theme-success, #22c55e)`
- Button primary: `var(--theme-primary, #2563eb)`
- Text: `var(--theme-text, #1e293b)`
- Secondary text: `var(--theme-text-secondary, #64748b)`

**Spacing/Layout Refinements:**
- Item padding: 12px 16px (consistent with other templates)
- List gap: 8px
- Button area gap: 8px
- Focus state: 2px outline with `var(--theme-primary)`, 2px offset
- Transition: All interactive elements use `transition: background-color 150ms ease, border-color 150ms ease`

#### 1.3 Update `componentRegistryData.ts`
Ensure realistic default data for drag-drop-sort:
```javascript
defaultData: {
  title: 'Arrange in Order',
  instructions: 'Drag items to arrange in the correct sequence.',
  items: [
    { id: 'item-1', text: 'First step', correctOrder: 0 },
    { id: 'item-2', text: 'Second step', correctOrder: 1 },
    { id: 'item-3', text: 'Third step', correctOrder: 2 },
  ]
}
```

### Test Cases

#### Preview Tests (8 tests)
1. ✅ **Renders empty state** when no items provided
2. ✅ **Renders title and instructions** when provided
3. ✅ **Displays all items** in shuffled order on first render
4. ✅ **Drag item** moves it within the list (validate via snapshot or position)
5. ✅ **Submit button** triggers sort validation
6. ✅ **Correct sort shows success styling** (green border/background)
7. ✅ **Incorrect sort shows error styling** (red border/background)
8. ✅ **Reset button reshuffles items** and clears submitted state

#### Editor Tests (6 tests)
1. ✅ **Renders title input** with current value
2. ✅ **Renders instructions input** with current value
3. ✅ **Renders item list cards** for each item
4. ✅ **Add item button** creates new item
5. ✅ **Remove item button** deletes item
6. ✅ **All inputs disabled** when readOnly=true

#### Interaction Tests (4 tests)
1. ✅ **onInteraction callback fires** when item dragged
2. ✅ **onInteraction callback fires** when submitted
3. ✅ **onComplete callback fires** when correct sort submitted
4. ✅ **Keyboard navigation** works (Tab through items, Enter to submit)

#### CSS/Styling Tests (5 tests)
1. ✅ **Theme color variables apply** (check computed styles)
2. ✅ **Responsive layout** works on 768px breakpoint
3. ✅ **Focus styles visible** (outline on keyboard navigation)
4. ✅ **Hover states work** (button hover color change)
5. ✅ **Submitted item states render correctly** (correct vs incorrect colors)

**Total: 23 tests**

---

## 2. FLIP CARDS (FlipCards)

### Current State
- **File:** `src/components/templates/interaction/FlipCards.tsx`
- **CSS File:** `src/components/templates/interaction/FlipCards.css` ✅ EXISTS
- **Current CSS Status:** ⚠️ **Partially theme-aligned**
  - Uses `var(--primary, #3b82f6)` (should be `--theme-primary`)
  - Some hardcoded colors: `#e2e8f0` (border), `#64748b` (text), `#94a3b8` (meta)
  - No unified theme token system
- **Status:** 🟡 **Needs alignment** — CSS file exists but inconsistent

### Design Changes Required

#### 2.1 Update `FlipCards.css` to Full Theme Alignment
**Review entire CSS file and standardize all colors:**

**Key replacements:**
```css
/* Before → After */
var(--primary, #3b82f6) → var(--theme-primary, #2563eb)
#e2e8f0 → var(--theme-border, #e2e8f0)
#64748b → var(--theme-text-secondary, #64748b)
#1f2937 → var(--theme-text, #1e293b)
#f3f4f6 → var(--theme-surface, #f8fafc)
#ffffff → var(--theme-background, #fff)
#94a3b8 → var(--theme-text-secondary, #64748b) [or adjust]
```

**CSS Classes Review:**
- `.flip-cards__title` — ✅ OK
- `.flip-cards__grid` — ✅ OK
- `.flip-card` — Update focus outline to use `--theme-primary`
- `.flip-card__front`, `.flip-card__back` — Update border/background colors
- Add hover state with subtle shadow or border-color change
- Add disabled state styling for readOnly mode

#### 2.2 Update `FlipCards.tsx`
- Ensure all classNames are applied properly
- Add data-testid for test queries
- Add aria-labels for accessibility
- Ensure responsive grid spacing matches Process Flow templates (gap: 12px minimum)

**Spacing/Layout Refinements:**
- Card min-height: 160px → 180px (more spacious)
- Card padding: 20px → 24px (consistent with other templates)
- Grid gap: Update to 16px (from current value)
- Flip animation: Keep 0.6s transition (good UX)
- Focus state: 2px outline, 2px offset, use `--theme-primary`

#### 2.3 Update `componentRegistryData.ts`
Ensure realistic default data:
```javascript
defaultData: {
  title: 'Flip Cards Example',
  cards: [
    { id: 'card-1', front: 'Question 1', back: 'Answer 1', imageUrl: '' },
    { id: 'card-2', front: 'Question 2', back: 'Answer 2', imageUrl: '' },
    { id: 'card-3', front: 'Question 3', back: 'Answer 3', imageUrl: '' },
  ],
  columns: 3
}
```

### Test Cases

#### Preview Tests (7 tests)
1. ✅ **Renders card grid** with correct number of columns
2. ✅ **Displays title** when provided
3. ✅ **Card front side shows** on initial render
4. ✅ **Click flips card** to back side
5. ✅ **All cards flipped triggers onComplete**
6. ✅ **onInteraction callback fires** on flip
7. ✅ **Empty state renders** when no cards provided

#### Editor Tests (5 tests)
1. ✅ **Renders title input** with current value
2. ✅ **Renders card list** with front/back inputs
3. ✅ **Add card button** creates new card
4. ✅ **Remove card button** deletes card
5. ✅ **All inputs disabled** when readOnly=true

#### Interaction Tests (3 tests)
1. ✅ **Keyboard flip** works (Enter/Space on focused card)
2. ✅ **Multiple flips work** smoothly
3. ✅ **Flip state persists** until clicked again

#### CSS/Styling Tests (5 tests)
1. ✅ **Theme colors apply** consistently
2. ✅ **Flip animation smooth** (perspective, transform-style)
3. ✅ **Focus outline visible** (keyboard nav)
4. ✅ **Responsive grid layout** (1 column on mobile)
5. ✅ **Hover state changes** (border/shadow on hover)

**Total: 20 tests**

---

## 3. CAROUSEL (Carousel)

### Current State
- **File:** `src/components/templates/interaction/Carousel.tsx`
- **CSS:** ❌ NO CSS FILE — All inline styles
- **Inline colors:**
  - Border: `#e2e8f0` (border), `#f8fafc` (background)
  - Text: `#94a3b8` (secondary), `#1f2937` (primary)
  - Button: `#3b82f6` (primary), `#d1d5db` (disabled)
  - Background: `#ffffff` (white)
- **Status:** ❌ **NOT theme-aligned**

### Design Changes Required

#### 3.1 Create `Carousel.css`
Extract all inline styles and implement BEM structure with theme tokens:

**CSS Classes to implement:**
- `.tpl-carousel` — Main container
- `.tpl-carousel__title` — Title styling
- `.tpl-carousel__slide-container` — Slide wrapper
- `.tpl-carousel__slide` — Individual slide
- `.tpl-carousel__slide-image` — Image styling
- `.tpl-carousel__slide-content` — Content area inside slide
- `.tpl-carousel__slide-title` — Slide title
- `.tpl-carousel__slide-body` — Slide body text
- `.tpl-carousel__controls` — Navigation controls container
- `.tpl-carousel__button` — Navigation button (prev/next)
- `.tpl-carousel__button--prev`, `.tpl-carousel__button--next`
- `.tpl-carousel__button:disabled` — Disabled state
- `.tpl-carousel__indicators` — Dot indicators
- `.tpl-carousel__indicator-dot` — Individual dot
- `.tpl-carousel__indicator-dot--active` — Active dot
- `.tpl-carousel__progress` — Progress text (X of Y)

**Theme Token Mapping:**
```css
--theme-primary: #2563eb — Button colors, active indicator
--theme-text: #1e293b — Slide title, main text
--theme-text-secondary: #64748b — Body text, progress text
--theme-border: #e2e8f0 — Container borders
--theme-background: #fff — Slide background
--theme-surface: #f8fafc — Container background
--theme-info: #3b82f6 — Optional info states
```

#### 3.2 Update `Carousel.tsx`
- Import CSS: `import './Carousel.css';`
- Replace all inline styles with classNames
- Replace emoji/text arrows with Lucide icons (ChevronLeft, ChevronRight)
- Add data-testid attributes

**Spacing/Layout Refinements:**
- Title margin-bottom: 16px
- Slide container border-radius: 12px
- Slide image height: 240px (from 200px for better visual)
- Content padding: 24px (from 24px, maintain)
- Control button size: 40px (make buttons larger, more accessible)
- Button hover: Scale 1.05, shadow effect
- Indicator dots: 8px diameter, 6px gap
- Progress text font-size: 12px, align right

#### 3.3 Update `componentRegistryData.ts`
Realistic default data:
```javascript
defaultData: {
  title: 'Product Features',
  slides: [
    { id: 's1', title: 'Feature 1', content: 'Description of first feature', imageUrl: '' },
    { id: 's2', title: 'Feature 2', content: 'Description of second feature', imageUrl: '' },
    { id: 's3', title: 'Feature 3', content: 'Description of third feature', imageUrl: '' },
  ]
}
```

### Test Cases

#### Preview Tests (8 tests)
1. ✅ **Renders empty state** when no slides
2. ✅ **Displays title** when provided
3. ✅ **Shows first slide** on initial render
4. ✅ **Next button advances slide**
5. ✅ **Prev button goes back slide**
6. ✅ **Navigation buttons disabled** at boundaries
7. ✅ **Indicator dots show active slide**
8. ✅ **onComplete fires** when all slides visited

#### Editor Tests (5 tests)
1. ✅ **Renders title input**
2. ✅ **Renders slide list** with title/content inputs
3. ✅ **Add slide button** creates new slide
4. ✅ **Remove slide button** deletes slide
5. ✅ **All inputs disabled** when readOnly=true

#### Interaction Tests (4 tests)
1. ✅ **onInteraction callback fires** on navigation
2. ✅ **Keyboard navigation** (arrow keys or Tab)
3. ✅ **Touch swipe support** (if applicable)
4. ✅ **Accessibility:** Slides labeled with aria-live for screen readers

#### CSS/Styling Tests (6 tests)
1. ✅ **Theme colors apply** (buttons, indicators, text)
2. ✅ **Button hover state** changes color/shadow
3. ✅ **Button disabled state** shows opacity/color change
4. ✅ **Indicator dots highlight** when slide active
5. ✅ **Responsive layout** (image scaling, controls layout on 768px)
6. ✅ **Focus outline visible** on buttons (keyboard nav)

**Total: 23 tests**

---

## 4. CLICKABLE ICONS (ClickReveal)

### Current State
- **File:** `src/components/templates/interaction/ClickReveal.tsx`
- **CSS File:** `src/components/templates/interaction/ClickReveal.css` ✅ EXISTS
- **CSS Status:** ✅ **Already theme-aligned!**
  - Uses `var(--theme-text)`, `var(--theme-border)`, `var(--theme-background)`, etc.
  - BEM naming implemented: `.tpl-click-reveal__*`
  - Responsive design with 768px breakpoint
  - Proper focus/hover states
- **Status:** ✅ **COMPLETE** — No design changes needed
- **Note:** This template is already the reference for other templates

### No Changes Required
- CSS is properly structured
- Theme tokens are correctly applied
- Test coverage exists
- Default data is realistic

### Maintenance Only
- ✅ Verify default data in `componentRegistryData.ts` (should be realistic)
- ✅ Ensure tests pass (8-10 tests expected)
- ✅ Use as reference model for other templates

### Test Cases (Reference - should already exist)

#### Preview Tests (5 tests)
1. ✅ Renders grid with correct columns
2. ✅ Displays title and instructions
3. ✅ Click reveals content
4. ✅ Progress counter updates
5. ✅ onComplete fires when all revealed

#### Editor Tests (5 tests)
1. ✅ Renders title/instructions inputs
2. ✅ Renders item list
3. ✅ Add/remove items work
4. ✅ readOnly mode disables inputs

#### CSS/Styling Tests (3 tests)
1. ✅ Theme colors apply
2. ✅ Responsive layout works
3. ✅ Focus/hover states visible

**Total: 13 tests (already implemented)**

---

## 5. SLIDER (NEW - Optional Phase 2)

### Status
- ❌ **Does NOT exist currently**
- 🔄 **Can be added in Phase 2 if needed**

### Proposed Specification (for future implementation)
**Component Type:** Range input slider  
**Use Case:** Allow users to select value within range  
**Features:**
- Range input (min/max configurable)
- Visual track and thumb
- Optional ticks/labels
- Label display for current value
- Keyboard support (arrow keys)

**Design Spec:**
- CSS Classes: `.tpl-slider__*`
- Theme tokens: primary (track), secondary (labels)
- Sizing: 40px height minimum
- Color change on hover: slight opacity/brightness increase

---

## Implementation Sequence

### Phase 1 (Current) - 3 Templates
1. ✅ **Drag and Drop** — Extract CSS, theme align, test (23 tests)
2. ✅ **Flip Cards** — Update existing CSS, theme align, test (20 tests)  
3. ✅ **Carousel** — Create CSS, theme align, test (23 tests)

**Subtotal: 66 tests**

### Phase 1.5 (Verification) - 1 Template
4. ✅ **Clickable Icons** — Verify existing implementation (13 tests already pass)

**Total Phase 1: 79 tests**

### Phase 2 (Optional)
5. 🔄 **Slider** — Design and implement if needed

---

## Design Specifications Summary

### Color Palette (Theme Tokens)
```
Primary:        #2563eb (--theme-primary)
Text:           #1e293b (--theme-text)
Text Secondary: #64748b (--theme-text-secondary)
Border:         #e2e8f0 (--theme-border)
Background:     #ffffff (--theme-background)
Surface:        #f8fafc (--theme-surface)
Success:        #22c55e (--theme-success)
Error:          #ef4444 (--theme-error)
Info:           #3b82f6 (--theme-info)
```

### Spacing Guidelines
```
Container padding: 16px
Grid gap: 12-16px
Item padding: 16-24px
Button padding: 8px 12px
Icon size: 16-24px
Border-radius: 6-8px
```

### Typography
```
Title (h3): 18px, 600 weight, theme-text color
Subtitle (p): 14px, 500 weight, theme-text-secondary
Body text: 14px, 400 weight, theme-text
Small text: 12px, 400 weight, theme-text-secondary
```

### Interaction States
```
Hover:       Border color → theme-primary, shadow +2px
Focus:       Outline 2px solid theme-primary, offset 2px
Active:      Background → theme-primary, text → white
Disabled:    Opacity 0.5, cursor not-allowed
```

### Responsive Breakpoint
```
Mobile: < 768px
  - Grid 1 column
  - Padding reduced to 12px
  - Font sizes -1px
  - Touch target min 44px
```

---

## Validation Checklist

- [ ] All hardcoded colors replaced with `var(--theme-*)` tokens
- [ ] BEM naming applied consistently (`.tpl-component__element--modifier`)
- [ ] CSS files created/updated for all components without CSS
- [ ] Default data updated in `componentRegistryData.ts` with realistic samples
- [ ] Focus/hover states implemented with theme colors
- [ ] Responsive design tested (768px breakpoint)
- [ ] Accessibility: aria-labels, keyboard navigation, WCAG contrast
- [ ] All tests pass (total 79 tests across 4 templates)
- [ ] Production build succeeds (`npm run build`)
- [ ] TypeScript validation clean (`npx tsc --noEmit`)

---

## Commit Strategy

**Commit 1:** `Drag and Drop: Extract CSS, apply theme tokens (23 tests)`
**Commit 2:** `Flip Cards: Update CSS, align theme tokens (20 tests)`
**Commit 3:** `Carousel: Create CSS, apply theme tokens (23 tests)`
**Commit 4:** `Interaction templates: Verify ClickReveal, finalize design (79 tests total)`

---

## Success Criteria

✅ All 4 Interaction templates use consistent theme tokens  
✅ All 79 tests pass  
✅ TypeScript clean, production build clean  
✅ Responsive design verified on mobile/tablet/desktop  
✅ Accessibility verified (keyboard nav, focus states, aria-labels)  
✅ Code follows established BEM + theme token patterns  
✅ Default data realistic and matches design system  
