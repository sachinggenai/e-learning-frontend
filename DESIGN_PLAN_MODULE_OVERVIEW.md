# Module Overview Template: Design & Implementation Plan

## Template Overview

**Template Type:** `module-overview`  
**Category:** Navigation  
**Status:** Missing - Needs Full Implementation  
**File:** `src/components/templates/navigation/ModuleOverview.tsx` (to be created)

**Purpose:** Introduction page for a course module displaying module metadata, learning objectives, estimated duration, and optional prerequisites. Serves as an entry point to set learner expectations.

---

## Functional Requirements

### Core Functionality

**1. Module Information Display**
- Module title (prominent heading)
- Module description (optional introductory text)
- Estimated duration badge (e.g., "30 minutes")
- Optional difficulty level indicator (Beginner/Intermediate/Advanced)

**2. Learning Objectives Section**
- List of specific, measurable learning objectives
- Checkmark or bullet icons per objective
- Support for 1-10 objectives
- Clear visual hierarchy

**3. Optional Sections**
- Prerequisites list (what learners should know beforehand)
- What you'll learn summary (brief overview)
- Module topics/outline (high-level topics covered)

**4. Visual Presentation**
- Card-based layout for clean organization
- Icon-enhanced sections for visual appeal
- Responsive layout for all screen sizes
- Optional module cover image/icon

**5. Interactive Behavior**
- Static content display (no interactions)
- Optional "Start Module" button (future enhancement)
- No scoring or completion tracking
- Calls `onComplete` when viewed (future: when "Start" clicked)

**6. Empty State**
- Show default content when no data provided
- "Module overview not configured" message

---

## Data Contract

### TypeScript Interface
```typescript
interface ModuleObjective {
  id: string;
  text: string;
  icon?: string; // Optional Lucide icon name
}

interface Prerequisite {
  id: string;
  text: string;
  completed?: boolean; // Optional completion indicator
}

interface ModuleTopic {
  id: string;
  title: string;
  description?: string;
}

interface ModuleOverviewData {
  title: string; // Required
  description?: string;
  estimatedDuration?: number; // Minutes
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  coverImage?: string; // Optional image URL
  objectives: ModuleObjective[]; // Required, min 1
  prerequisites?: Prerequisite[];
  topics?: ModuleTopic[];
  showStartButton?: boolean; // Show "Start Module" button
}
```

### Registry Default Data
```typescript
{
  title: 'Module Overview',
  description: 'This module will cover essential concepts and practical applications.',
  estimatedDuration: 30,
  difficultyLevel: 'beginner',
  objectives: [
    { id: 'obj-1', text: 'Understand the fundamental concepts', icon: 'CheckCircle' },
    { id: 'obj-2', text: 'Apply concepts to real-world scenarios', icon: 'CheckCircle' },
    { id: 'obj-3', text: 'Complete hands-on exercises', icon: 'CheckCircle' }
  ],
  prerequisites: [
    { id: 'pre-1', text: 'Basic understanding of the topic', completed: true }
  ],
  topics: [
    { id: 'topic-1', title: 'Introduction', description: 'Getting started with the basics' },
    { id: 'topic-2', title: 'Core Concepts', description: 'Deep dive into fundamental ideas' },
    { id: 'topic-3', title: 'Practical Application', description: 'Hands-on practice and examples' }
  ],
  showStartButton: false
}
```

---

## Design Specifications

### BEM Structure

**Root Blocks:**
- `.tpl-module-overview` - Preview container
- `.tpl-module-overview-editor` - Editor container

**Preview Elements:**
```css
.tpl-module-overview__header
.tpl-module-overview__cover-image
.tpl-module-overview__title
.tpl-module-overview__metadata         /* Duration + difficulty badges */
.tpl-module-overview__duration-badge
.tpl-module-overview__difficulty-badge
.tpl-module-overview__difficulty-badge--beginner
.tpl-module-overview__difficulty-badge--intermediate
.tpl-module-overview__difficulty-badge--advanced
.tpl-module-overview__description
.tpl-module-overview__section          /* Generic section wrapper */
.tpl-module-overview__section-title
.tpl-module-overview__section-icon
.tpl-module-overview__objectives       /* Objectives section */
.tpl-module-overview__objective-item
.tpl-module-overview__objective-icon
.tpl-module-overview__objective-text
.tpl-module-overview__prerequisites    /* Prerequisites section */
.tpl-module-overview__prerequisite-item
.tpl-module-overview__prerequisite-icon
.tpl-module-overview__prerequisite-icon--completed
.tpl-module-overview__prerequisite-text
.tpl-module-overview__topics           /* Topics section */
.tpl-module-overview__topic-card
.tpl-module-overview__topic-title
.tpl-module-overview__topic-description
.tpl-module-overview__start-button     /* Optional start button */
.tpl-module-overview__empty            /* Empty state */
```

**Editor Elements:**
```css
.tpl-module-overview-editor__header
.tpl-module-overview-editor__section
.tpl-module-overview-editor__field
.tpl-module-overview-editor__label
.tpl-module-overview-editor__input
.tpl-module-overview-editor__textarea
.tpl-module-overview-editor__select
.tpl-module-overview-editor__number-input
.tpl-module-overview-editor__checkbox
.tpl-module-overview-editor__list      /* Objectives/prerequisites list */
.tpl-module-overview-editor__list-item
.tpl-module-overview-editor__list-item-input
.tpl-module-overview-editor__remove-btn
.tpl-module-overview-editor__add-btn
```

### Theme Token Mapping

| Element | Token | Usage |
|---------|-------|-------|
| Container background | `--theme-background` | Root container |
| Title text | `--theme-text` | Module title |
| Description text | `--theme-text-secondary` | Description |
| Section card background | `--theme-surface` | Card backgrounds |
| Section card border | `--theme-border` | Card borders |
| Duration badge background | `--theme-info` | Duration indicator |
| Duration badge text | `--theme-background` | White text |
| Beginner badge | `--theme-success` | Green |
| Intermediate badge | `--theme-info` | Blue |
| Advanced badge | `--theme-error` | Red/orange |
| Objective icon | `--theme-success` | Green check |
| Objective text | `--theme-text` | Objective text |
| Prerequisite complete icon | `--theme-success` | Green check |
| Prerequisite incomplete icon | `--theme-text-secondary` | Gray circle |
| Section title | `--theme-text` | Section headings |
| Topic card background | `--theme-surface` | Topic cards |
| Topic card border | `--theme-border` | Topic borders |
| Start button background | `--theme-primary` | Primary button |
| Start button text | `--theme-background` | White text |
| Start button hover | `--theme-primary` (darker) | Hover state |

### Visual Specifications

**Module Header:**
- Cover image (optional): Full-width, max-height `200px`, object-fit: cover
- Title: `24px`, `font-weight: 700`, `--theme-text`
- Description: `16px`, `font-weight: 400`, `--theme-text-secondary`, line-height: `1.6`
- Metadata badges: Horizontal flex layout, gap `8px`

**Duration Badge:**
- Padding: `6px 12px`
- Border-radius: `16px`
- Background: `var(--theme-info)`
- Text: `13px`, `font-weight: 600`, white
- Icon: Clock icon (16px)

**Difficulty Badge:**
- Padding: `6px 12px`
- Border-radius: `16px`
- Text: `13px`, `font-weight: 600`, white
- Colors:
  - Beginner: `--theme-success`
  - Intermediate: `--theme-info`
  - Advanced: `--theme-error`

**Section Cards:**
- Padding: `20px`
- Border: `1px solid var(--theme-border)`
- Border-radius: `10px`
- Background: `var(--theme-surface)`
- Margin-bottom: `20px`

**Section Title:**
- Font-size: `18px`
- Font-weight: `600`
- Color: `--theme-text`
- Margin-bottom: `16px`
- Icon: 24px, left of text, gap `10px`

**Objectives List:**
- Display: Flex column
- Gap: `12px`
- Each item: Flex row, align-items: center, gap `12px`
- Icon: `20px`, `--theme-success`
- Text: `15px`, `--theme-text`

**Prerequisites List:**
- Similar to objectives
- Completed: Green checkmark
- Incomplete: Gray circle outline

**Topics Section:**
- Display: Grid (2 columns on desktop, 1 on mobile)
- Gap: `16px`
- Each topic card:
  - Padding: `16px`
  - Border: `1px solid var(--theme-border)`
  - Border-radius: `8px`
  - Background: `var(--theme-surface)`
  - Title: `15px`, `font-weight: 600`, `--theme-text`
  - Description: `14px`, `--theme-text-secondary`

**Start Button:**
- Width: `100%` (mobile), auto (desktop)
- Padding: `12px 32px`
- Border-radius: `8px`
- Background: `var(--theme-primary)`
- Color: white
- Font-size: `16px`, font-weight: `600`
- Hover: Darken background by 10%
- Focus: `outline: 2px solid var(--theme-primary)`, `outline-offset: 2px`

**Spacing:**
- Sections gap: `24px`
- Internal section padding: `20px`
- Metadata badges gap: `8px`
- Objectives/prerequisites gap: `12px`
- Topics grid gap: `16px`

**Typography:**
- Module title: `24px`, `font-weight: 700`
- Section title: `18px`, `font-weight: 600`
- Objective text: `15px`, `font-weight: 400`
- Topic title: `15px`, `font-weight: 600`
- Topic description: `14px`, `font-weight: 400`
- Body text: `16px`, `font-weight: 400`

---

## Component Behavior

### Preview Component

**Rendering Logic:**
```typescript
1. Render header:
   - Optional cover image
   - Module title
   - Metadata badges (duration + difficulty)
   - Description
2. Render Learning Objectives section (required):
   - Section title with icon
   - List of objectives with checkmarks
3. Render Prerequisites section (if data.prerequisites exists):
   - Section title with icon
   - List of prerequisites with completion indicators
4. Render Topics section (if data.topics exists):
   - Section title with icon
   - Grid of topic cards
5. Render Start button (if showStartButton is true)
6. Handle empty state (no objectives)
```

**Icons:**
- Duration: `<Clock />` from lucide-react
- Objectives: `<Target />` or `<BookOpen />` section icon, `<CheckCircle />` per item
- Prerequisites: `<AlertCircle />` section icon, `<CheckCircle />` or `<Circle />` per item
- Topics: `<List />` section icon

**Interaction:**
- Start button click → calls `onInteraction` with type 'start-module'
- No other interactions in preview

### Editor Component

**Field Structure:**
```typescript
1. Basic Information:
   - Title input (required)
   - Description textarea (optional)
   - Cover image URL input (optional)
   
2. Metadata:
   - Estimated duration (number input, minutes)
   - Difficulty level (dropdown: beginner/intermediate/advanced)
   
3. Learning Objectives (required):
   - List of objective inputs
   - Add/remove objective buttons
   - At least 1 objective required
   
4. Prerequisites (optional):
   - Toggle to show/hide section
   - List of prerequisite inputs
   - Add/remove prerequisite buttons
   
5. Topics (optional):
   - Toggle to show/hide section
   - List of topic cards with title + description inputs
   - Add/remove topic buttons
   
6. Options:
   - Show start button checkbox
```

**Validation:**
- Title is required
- At least one objective required
- Duration must be positive number if provided

**Data Updates:**
- Generate unique IDs for new items: `obj-${Date.now()}`, `pre-${Date.now()}`, `topic-${Date.now()}`
- Call onChange on every field update
- Preserve item order

---

## Responsive Specifications

### Desktop (>768px)
- Cover image: Full-width, max-height 200px
- Metadata badges: Horizontal layout
- Topics: 2-column grid
- Start button: Centered, max-width 300px
- Section padding: 20px

### Mobile (≤768px)
- Cover image: Full-width, max-height 150px
- Metadata badges: Vertical stack or wrap
- Topics: 1-column grid
- Start button: Full-width
- Section padding: 16px
- Reduce font sizes slightly (title: 20px)

---

## Accessibility Requirements

- Semantic structure: `<article>` for module overview
- Section headings: `<h2>` for section titles, `<h3>` for topic titles
- List semantics: `<ul>` for objectives/prerequisites
- Duration badge: `aria-label="Estimated duration: 30 minutes"`
- Difficulty badge: `aria-label="Difficulty level: Beginner"`
- Objectives: `<li>` elements with proper list structure
- Start button: `<button>` with clear label
- Focus visible states on all interactive elements
- Color not sole indicator: Use icons + text for prerequisites completion
- Screen reader friendly: Announce sections and lists properly

---

## Test Cases (23 Tests)

### Preview Tests (14)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders module title
   - ✓ Renders description when provided
   - ✓ Does not render description when not provided

2. **Metadata Display**
   - ✓ Renders duration badge when provided
   - ✓ Displays duration in correct format
   - ✓ Renders difficulty badge when provided
   - ✓ Difficulty badge has correct color (beginner/intermediate/advanced)

3. **Cover Image**
   - ✓ Renders cover image when provided
   - ✓ Does not render cover image when not provided

4. **Learning Objectives**
   - ✓ Renders objectives section
   - ✓ Displays all objectives from data
   - ✓ Each objective has checkmark icon
   - ✓ Objectives text displays correctly

5. **Prerequisites Section**
   - ✓ Renders prerequisites when provided
   - ✓ Does not render prerequisites section when not provided
   - ✓ Completed prerequisites have green checkmark
   - ✓ Incomplete prerequisites have gray circle

6. **Topics Section**
   - ✓ Renders topics when provided
   - ✓ Does not render topics section when not provided
   - ✓ Topic cards display title and description
   - ✓ Topics render in grid layout

7. **Start Button**
   - ✓ Renders start button when showStartButton is true
   - ✓ Does not render start button when showStartButton is false

8. **Empty State**
   - ✓ Shows appropriate message when no objectives

9. **BEM Classes**
   - ✓ Root has correct BEM class
   - ✓ Sections have correct BEM classes

### Editor Tests (9)

1. **Basic Rendering**
   - ✓ Renders without crashing
   - ✓ Renders title input
   - ✓ Renders description textarea
   - ✓ Displays all fields

2. **Basic Fields**
   - ✓ Title input shows current value and updates
   - ✓ Description textarea shows current value and updates
   - ✓ Duration input shows and updates correctly
   - ✓ Difficulty selector shows and updates correctly

3. **Objectives Management**
   - ✓ Add objective button adds new objective
   - ✓ Remove button removes objective
   - ✓ Objective text input updates correctly
   - ✓ Cannot remove last objective (validation)

4. **Prerequisites Management**
   - ✓ Add prerequisite button adds new item
   - ✓ Remove button removes prerequisite
   - ✓ Prerequisite input updates correctly

5. **Topics Management**
   - ✓ Add topic button adds new topic
   - ✓ Remove button removes topic
   - ✓ Topic title and description update correctly

6. **Options**
   - ✓ Show start button checkbox toggles value

7. **Validation**
   - ✓ Title field shows validation message when empty
   - ✓ Must have at least one objective

8. **BEM Classes**
   - ✓ Editor root has correct BEM class

---

## Implementation Checklist

### Phase 1: Component Structure
- [ ] Create `ModuleOverview.tsx` with Preview and Editor exports
- [ ] Define TypeScript interfaces
- [ ] Set up basic component structure
- [ ] Import dependencies (React, lucide-react)

### Phase 2: CSS Implementation
- [ ] Create `ModuleOverview.css`
- [ ] Define all BEM classes
- [ ] Implement theme token mapping
- [ ] Add responsive breakpoints
- [ ] Style all sections (objectives, prerequisites, topics)
- [ ] Style badges and metadata
- [ ] Add hover/focus states for start button

### Phase 3: Preview Component
- [ ] Implement header rendering (title, metadata, description)
- [ ] Add cover image rendering
- [ ] Implement objectives section
- [ ] Implement prerequisites section (conditional)
- [ ] Implement topics section (conditional)
- [ ] Add start button (conditional)
- [ ] Add empty state
- [ ] Add accessibility attributes

### Phase 4: Editor Component
- [ ] Implement basic info inputs (title, description, cover image)
- [ ] Implement metadata inputs (duration, difficulty)
- [ ] Implement objectives list with add/remove
- [ ] Implement prerequisites list with add/remove
- [ ] Implement topics list with add/remove
- [ ] Add show start button checkbox
- [ ] Add validation for required fields
- [ ] Style editor with BEM classes

### Phase 5: Registration
- [ ] Add lazy imports to `registrations.ts`
- [ ] Register Preview and Editor components
- [ ] Update `componentRegistryData.ts` with default data

### Phase 6: Testing
- [ ] Create `ModuleOverview.test.tsx`
- [ ] Implement all 23 test cases
- [ ] Test conditional section rendering
- [ ] Test badge color variants
- [ ] Test editor CRUD operations
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
- `src/components/templates/navigation/ModuleOverview.tsx`
- `src/components/templates/navigation/ModuleOverview.css`
- `src/components/templates/navigation/ModuleOverview.test.tsx`

**Updated Files:**
- `src/components/registry/registrations.ts` (add registration)
- `src/data/componentRegistryData.ts` (verify default data)

---

## Success Criteria

- ✅ All sections render correctly (objectives, prerequisites, topics)
- ✅ Metadata badges display with correct colors
- ✅ Optional sections show/hide correctly
- ✅ All theme tokens used (no hardcoded colors)
- ✅ BEM classes implemented throughout
- ✅ 23 tests passing
- ✅ No TypeScript errors
- ✅ Accessibility requirements met
- ✅ Responsive behavior verified
- ✅ Editor validation works correctly
- ✅ Start button appears/hides based on configuration

---

**Document Version:** 1.0  
**Created:** March 8, 2026  
**Template Status:** New Implementation Required  
**Estimated Effort:** 8-10 hours
