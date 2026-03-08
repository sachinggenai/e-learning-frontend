# Learning Roadmap Template: Design & Implementation Plan

## Template Overview

**Template Type:** `learning-roadmap`  
**Category:** Navigation  
**Status:** Missing - Needs Full Implementation  
**File:** `src/components/templates/navigation/LearningRoadmap.tsx` (to be created)

**Purpose:** Visual learning path showing course progression through milestone cards with status indicators (completed, current, locked), connecting lines, and optional navigation to specific pages.

---

## Functional Requirements

### Core Functionality

**1. Milestone Progression Display**
- Display milestones in sequential order (top to bottom or left to right)
- Show visual connections between milestones (connecting lines)
- Support 3 milestone states:
  - **Completed**: User has finished this milestone (green checkmark)
  - **Current**: User is currently on this milestone (highlighted, primary color)
  - **Locked**: Not yet accessible (gray, lock icon)

**2. Milestone Card Content**
- Milestone number or icon
- Milestone title (required)
- Milestone description (optional)
- Status badge/icon
- Optional page link for navigation

**3. Visual Learning Path**
- Vertical connecting line between milestones
- Line segments colored based on completion status
- Responsive layout: vertical on all screen sizes

**4. Interactive Behavior**
- Completed and current milestones are clickable (if pageId provided)
- Locked milestones are not clickable
- No onComplete or onInteraction callbacks (navigation only)
- Visual feedback on hover for clickable milestones

**5. Empty State**
- Display message when no milestones configured
- "No milestones configured" with icon

---

## Data Contract

### TypeScript Interface
```typescript
interface Milestone {
  id: string;
  title: string;
  description?: string;
  pageId?: string; // Optional link to course page
  status: 'completed' | 'current' | 'locked';
  icon?: string; // Optional custom icon (Lucide name)
  estimatedDuration?: number; // Optional duration in minutes
}

interface LearningRoadmapData {
  title?: string; // Optional roadmap title
  description?: string; // Optional intro text
  milestones: Milestone[];
  showConnectors?: boolean; // Show/hide connecting lines (default: true)
  layout?: 'vertical' | 'horizontal'; // Layout direction (default: vertical)
}
```

### Registry Default Data
```typescript
{
  title: 'Learning Roadmap',
  description: 'Track your progress through the course',
  milestones: [
    {
      id: 'ms-1',
      title: 'Getting Started',
      description: 'Introduction to the course',
      status: 'completed',
      pageId: 'page-1',
      icon: 'CheckCircle'
    },
    {
      id: 'ms-2',
      title: 'Core Concepts',
      description: 'Learn the fundamentals',
      status: 'current',
      pageId: 'page-2',
      icon: 'BookOpen'
    },
    {
      id: 'ms-3',
      title: 'Advanced Topics',
      description: 'Deep dive into complex subjects',
      status: 'locked',
      pageId: 'page-3',
      icon: 'Lock'
    }
  ],
  showConnectors: true,
  layout: 'vertical'
}
```

---

## Design Specifications

### BEM Structure

**Root Blocks:**
- `.tpl-learning-roadmap` - Preview container
- `.tpl-learning-roadmap-editor` - Editor container

**Preview Elements:**
```css
.tpl-learning-roadmap__header
.tpl-learning-roadmap__title
.tpl-learning-roadmap__description
.tpl-learning-roadmap__path         /* Path container */
.tpl-learning-roadmap__milestone-wrapper /* Milestone + connector wrapper */
.tpl-learning-roadmap__milestone    /* Milestone card */
.tpl-learning-roadmap__milestone--completed
.tpl-learning-roadmap__milestone--current
.tpl-learning-roadmap__milestone--locked
.tpl-learning-roadmap__milestone--clickable
.tpl-learning-roadmap__connector    /* Line between milestones */
.tpl-learning-roadmap__connector--completed
.tpl-learning-roadmap__milestone-badge /* Status icon/number badge */
.tpl-learning-roadmap__milestone-badge--completed
.tpl-learning-roadmap__milestone-badge--current
.tpl-learning-roadmap__milestone-badge--locked
.tpl-learning-roadmap__milestone-content
.tpl-learning-roadmap__milestone-title
.tpl-learning-roadmap__milestone-description
.tpl-learning-roadmap__milestone-duration /* Optional duration badge */
.tpl-learning-roadmap__empty        /* Empty state */
```

**Editor Elements:**
```css
.tpl-learning-roadmap-editor__header
.tpl-learning-roadmap-editor__field
.tpl-learning-roadmap-editor__label
.tpl-learning-roadmap-editor__input
.tpl-learning-roadmap-editor__textarea
.tpl-learning-roadmap-editor__checkbox
.tpl-learning-roadmap-editor__milestones
.tpl-learning-roadmap-editor__milestone-card
.tpl-learning-roadmap-editor__milestone-header
.tpl-learning-roadmap-editor__milestone-number
.tpl-learning-roadmap-editor__milestone-fields
.tpl-learning-roadmap-editor__status-selector
.tpl-learning-roadmap-editor__remove-btn
.tpl-learning-roadmap-editor__add-btn
```

### Theme Token Mapping

| Element | Token | Usage |
|---------|-------|-------|
| Container background | `--theme-background` | Root container |
| Title text | `--theme-text` | Roadmap title |
| Description text | `--theme-text-secondary` | Intro text |
| Milestone card background | `--theme-surface` | Card background |
| Milestone card border | `--theme-border` | Card border |
| Completed badge background | `--theme-success` | Green check icon bg |
| Completed text | `--theme-text` | Completed milestone text |
| Current badge background | `--theme-primary` | Current milestone badge |
| Current card border | `--theme-primary` | Current milestone accent |
| Current text | `--theme-text` | Current milestone text |
| Locked badge background | `--theme-border` | Gray lock icon bg |
| Locked text | `--theme-text-secondary` | Locked milestone text |
| Connector line | `--theme-border` | Default connector |
| Connector line completed | `--theme-success` | Completed segment |
| Hover background | `--theme-surface` | Hover state (clickable) |
| Duration badge | `--theme-info` | Duration indicator |

### Visual Specifications

**Milestone Card:**
- Width: `100%` (max-width: `600px` centered)
- Min-height: `120px`
- Padding: `20px`
- Border: `1px solid var(--theme-border)`
- Border-radius: `12px`
- Box-shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
- Gap between badge and content: `16px`

**Status Badge:**
- Size: `48px × 48px`
- Border-radius: `50%` (circle)
- Icon size: `24px`
- Position: Top-left or left-center of card

**Connector Line:**
- Width: `3px`
- Height: Distance between milestone centers
- Position: Centered between badges
- Z-index: Behind cards

**States:**

**Completed:**
- Badge: Green background (`--theme-success`), white check icon
- Card: Standard border
- Clickable: Yes (if pageId exists)

**Current:**
- Badge: Primary background (`--theme-primary`), white icon
- Card: Primary border (`2px solid var(--theme-primary)`)
- Slight elevation: `box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15)`
- Clickable: Yes (if pageId exists)

**Locked:**
- Badge: Gray background (`--theme-border`), gray lock icon
- Card: Standard border
- Text: Secondary color (`--theme-text-secondary`)
- Opacity: `0.7`
- Clickable: No
- Cursor: `default`

**Hover (Clickable Milestones):**
- Card: Border color intensifies
- Badge: Slight scale: `transform: scale(1.05)`
- Cursor: `pointer`

**Typography:**
- Title: `18px`, `font-weight: 600`, `--theme-text`
- Milestone title: `16px`, `font-weight: 600`
- Milestone description: `14px`, `font-weight: 400`, `--theme-text-secondary`
- Duration badge: `12px`, `font-weight: 500`

**Spacing:**
- Milestone gap: `40px` (includes connector)
- Title margin-bottom: `8px`
- Description margin-bottom: `24px`
- Badge-to-content gap: `16px`
- Internal card padding: `20px`

---

## Component Behavior

### Preview Component

**Rendering Logic:**
```typescript
1. Render optional title and description
2. Iterate through milestones array
3. For each milestone:
   - Render milestone card with status-based styling
   - Render status badge with appropriate icon
   - Render connector line (if not last milestone)
   - Apply clickable wrapper if status is 'completed' or 'current' and pageId exists
4. Handle empty state (no milestones)
```

**Icon Mapping:**
- Completed: `<CheckCircle />` from lucide-react
- Current: Custom icon from data or `<BookOpen />`
- Locked: `<Lock />` from lucide-react

**Interaction:**
- Click on completed/current milestone → No action in preview (parent handles navigation)
- Click on locked milestone → No action
- Hover on clickable → Visual feedback

### Editor Component

**Field Structure:**
```typescript
1. Title input (text)
2. Description textarea
3. Show connectors checkbox
4. Layout selector (vertical/horizontal) - Phase 2
5. Milestone list:
   For each milestone:
   - Milestone number badge (read-only)
   - Title input (required)
   - Description textarea (optional)
   - Status dropdown (completed/current/locked)
   - Icon input (optional)
   - Duration input (optional, number)
   - Page ID input (optional, for navigation)
   - Remove button
6. Add Milestone button
```

**Validation:**
- At least one milestone required
- Each milestone must have a title
- Only one milestone can have 'current' status at a time (enforce in editor)

**Data Updates:**
- Generate unique IDs for new milestones: `ms-${Date.now()}`
- Call onChange on every field update
- Preserve milestone order

---

## Responsive Specifications

### Desktop (>768px)
- Vertical layout (default)
- Milestone cards: max-width `600px`, centered
- Connector lines: centered, 3px width
- Standard spacing

### Mobile (≤768px)
- Vertical layout (maintained)
- Milestone cards: full-width with horizontal padding `16px`
- Badge size: `40px × 40px` (slightly smaller)
- Reduce internal card padding: `16px`
- Connector height: adjust for smaller cards
- Ensure tap targets ≥44px

---

## Accessibility Requirements

- Semantic structure: `<section>`, `<article>` for milestones
- `role="navigation"` on roadmap container
- `aria-label="Learning roadmap"`
- Status announced: `aria-label="Milestone 1: Getting Started, Status: Completed"`
- Locked milestones: `aria-disabled="true"`
- Clickable milestones: Proper link or button semantics
- Keyboard navigation: Tab through clickable milestones
- Focus visible: `outline: 2px solid var(--theme-primary)`, `outline-offset: 2px`
- Screen reader: Announce status changes
- Color not sole indicator: Use icons + text for status

---

## Test Cases (25 Tests)

### Preview Tests (15)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title when provided
   - ✓ Renders description when provided
   - ✓ Does not render title/description when not provided

2. **Milestone Display**
   - ✓ Renders all milestones from data
   - ✓ Milestones appear in correct order
   - ✓ Renders milestone title correctly
   - ✓ Renders milestone description when provided
   - ✓ Does not render description when not provided

3. **Status Indicators**
   - ✓ Completed milestone shows check icon
   - ✓ Current milestone shows current indicator
   - ✓ Locked milestone shows lock icon
   - ✓ Completed milestone has success color
   - ✓ Current milestone has primary color border
   - ✓ Locked milestone has muted styling

4. **Connector Lines**
   - ✓ Renders connectors between milestones
   - ✓ Completed milestones have success-colored connectors
   - ✓ Does not render connector after last milestone

5. **Interactive Behavior**
   - ✓ Completed milestones with pageId are clickable
   - ✓ Current milestones with pageId are clickable
   - ✓ Locked milestones are not clickable

6. **Empty State**
   - ✓ Shows empty state when no milestones
   - ✓ Empty state has appropriate message

7. **BEM Classes**
   - ✓ Root has correct BEM class
   - ✓ Milestones have correct status modifiers

### Editor Tests (10)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title input
   - ✓ Renders description textarea
   - ✓ Displays all milestones from data

2. **Title/Description Fields**
   - ✓ Title input shows current value and updates
   - ✓ Description textarea shows current value and updates
   - ✓ onChange called with new values

3. **Milestone Management**
   - ✓ Add milestone button adds new milestone
   - ✓ Remove button removes milestone
   - ✓ New milestones have unique IDs

4. **Milestone Fields**
   - ✓ Title input displays and updates
   - ✓ Description textarea displays and updates
   - ✓ Status selector displays and updates
   - ✓ Icon input displays and updates
   - ✓ Duration input displays and updates

5. **Validation**
   - ✓ Cannot have multiple 'current' milestones
   - ✓ Milestone title is required (validation message)

6. **BEM Classes**
   - ✓ Editor root has correct BEM class
   - ✓ Editor elements have correct BEM classes

---

## Implementation Checklist

### Phase 1: Component Structure
- [ ] Create `LearningRoadmap.tsx` with Preview and Editor exports
- [ ] Define TypeScript interfaces
- [ ] Set up basic component structure
- [ ] Import necessary dependencies (React, lucide-react)

### Phase 2: CSS Implementation
- [ ] Create `LearningRoadmap.css`
- [ ] Define all BEM classes
- [ ] Implement theme token mapping
- [ ] Add responsive breakpoints
- [ ] Style milestone states (completed/current/locked)
- [ ] Style connector lines
- [ ] Add hover/focus states

### Phase 3: Preview Component
- [ ] Implement milestone rendering loop
- [ ] Add status-based styling logic
- [ ] Implement icon rendering based on status
- [ ] Add connector line rendering
- [ ] Implement clickable wrapper for non-locked milestones
- [ ] Add empty state
- [ ] Add accessibility attributes

### Phase 4: Editor Component
- [ ] Implement title/description inputs
- [ ] Implement milestone list rendering
- [ ] Add milestone field inputs
- [ ] Add status selector dropdown
- [ ] Implement add/remove milestone functionality
- [ ] Add validation for 'current' status uniqueness
- [ ] Style editor with BEM classes

### Phase 5: Registration
- [ ] Add lazy imports to `registrations.ts`
- [ ] Register Preview and Editor components
- [ ] Update `componentRegistryData.ts` with default data

### Phase 6: Testing
- [ ] Create `LearningRoadmap.test.tsx`
- [ ] Implement all 25 test cases
- [ ] Test milestone rendering
- [ ] Test status indicators
- [ ] Test editor interactions
- [ ] Test validation logic

### Phase 7: Validation
- [ ] All tests passing
- [ ] No hardcoded colors
- [ ] TypeScript errors resolved
- [ ] Visual verification in UI
- [ ] Accessibility verification
- [ ] Responsive testing

---

## Files to Create

**New Files:**
- `src/components/templates/navigation/LearningRoadmap.tsx`
- `src/components/templates/navigation/LearningRoadmap.css`
- `src/components/templates/navigation/LearningRoadmap.test.tsx`

**Updated Files:**
- `src/components/registry/registrations.ts` (add registration)
- `src/data/componentRegistryData.ts` (verify default data)

---

## Success Criteria

- ✅ All 3 milestone states display correctly
- ✅ Connector lines render between milestones
- ✅ Completed and current milestones are clickable
- ✅ Locked milestones are not clickable
- ✅ All theme tokens used (no hardcoded colors)
- ✅ BEM classes implemented throughout
- ✅ 25 tests passing
- ✅ No TypeScript errors
- ✅ Accessibility requirements met
- ✅ Responsive behavior verified
- ✅ Editor validation works correctly

---

**Document Version:** 1.0  
**Created:** March 8, 2026  
**Template Status:** New Implementation Required  
**Estimated Effort:** 8-10 hours
