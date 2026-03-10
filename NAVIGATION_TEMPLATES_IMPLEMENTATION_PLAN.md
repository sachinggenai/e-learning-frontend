# Navigation Templates Implementation Plan
**Branch:** navigation-template-design  
**Created:** March 10, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This plan outlines the complete implementation of 5 Navigation category templates with design-first approach, removing all hardcoded colors, implementing BEM CSS structure, replacing emoji icons with Lucide React icons, and adding comprehensive test coverage.

### Template Status Overview

| # | Template | Status | Type | Tests | Effort |
|---|----------|--------|------|-------|--------|
| 1 | Course Menu | **Exists** | Refactor | 22 | 4-6h |
| 2 | Resources & Downloads | **Exists** | Refactor | 21 | 4-6h |
| 3 | Module Overview | **Missing** | New | 23 | 8-10h |
| 4 | Learning Roadmap | **Missing** | New | 25 | 8-10h |
| 5 | Summary / Key Takeaways | **Missing** | New | 22 | 8-10h |
| **TOTAL** | | | | **113 tests** | **32-42h** |

---

## Phase 0: Pre-Implementation (Critical Issues Resolution)

**Before starting any implementation, these issues MUST be resolved in the design plans.**

### 🔴 Critical Issue 1: Navigation Callbacks Missing

**Problem:** All clickable elements lack callback definitions in data contracts.

**Fix Required in Design Plans:**

#### Course Menu
```typescript
interface CourseMenuData {
  // ... existing fields
  onItemClick?: (itemId: string, pageId?: string) => void;
}
```

#### Resources & Downloads
```typescript
// Keep as-is - links navigate directly via href, no callback needed
```

#### Module Overview
```typescript
interface ModuleOverviewData {
  // ... existing fields
  onStartClick?: () => void;
}
```

#### Learning Roadmap
```typescript
interface LearningRoadmapData {
  // ... existing fields
  onMilestoneClick?: (milestoneId: string, pageId?: string) => void;
}
```

#### Summary / Key Takeaways
```typescript
interface SummaryTakeawaysData {
  // ... existing fields
  onCompleteClick?: () => void;
  onContinueClick?: () => void;
}
```

**Action Items:**
- [ ] Update DESIGN_PLAN_COURSE_MENU.md - Add onItemClick callback
- [ ] Update DESIGN_PLAN_MODULE_OVERVIEW.md - Add onStartClick callback
- [ ] Update DESIGN_PLAN_LEARNING_ROADMAP.md - Add onMilestoneClick callback
- [ ] Update DESIGN_PLAN_SUMMARY_TAKEAWAYS.md - Add onCompleteClick and onContinueClick callbacks

---

### 🔴 Critical Issue 2: Icon Strategy Documentation

**Problem:** Icon mappings are scattered or missing from design specifications.

**Fix Required:** Add standardized "Icon Mapping" subsection to Design Specifications for all templates.

**Template:** 
```markdown
### Icon Mapping

| Element | Lucide Icon | Size | Color Token |
|---------|------------|------|-------------|
| {Element name} | {IconName} | {px} | {--theme-token} |
```

**Action Items:**
- [ ] Add icon mapping table to DESIGN_PLAN_COURSE_MENU.md
- [ ] Move icon mapping to Design Specs in DESIGN_PLAN_MODULE_OVERVIEW.md
- [ ] Clarify custom vs status icons in DESIGN_PLAN_LEARNING_ROADMAP.md
- [ ] Verify icon mapping in DESIGN_PLAN_SUMMARY_TAKEAWAYS.md

---

### 🟡 Important Issue 3: Learning Roadmap Connector Implementation

**Problem:** Connector line implementation is vague ("Height: Distance between milestone centers").

**Fix Required:** Add CSS implementation guidance.

**Recommended Approach:**
```css
/* Connector between milestones */
.tpl-learning-roadmap__milestone-wrapper {
  position: relative;
}

.tpl-learning-roadmap__connector {
  position: absolute;
  width: 3px;
  height: 40px; /* Fixed gap between milestones */
  top: 60px; /* Badge height (48px) + margin */
  left: 50%;
  transform: translateX(-50%);
  background: var(--theme-border);
  z-index: 0;
}

.tpl-learning-roadmap__connector--completed {
  background: var(--theme-success);
}
```

**Action Items:**
- [ ] Add connector CSS implementation section to DESIGN_PLAN_LEARNING_ROADMAP.md

---

### 🟡 Important Issue 4: Horizontal Layout in Learning Roadmap

**Problem:** Data contract includes `layout?: 'vertical' | 'horizontal'` but no specs provided.

**Decision Required:** Remove for Phase 1 or provide full specs.

**Recommendation:** Remove from initial implementation.

**Action Items:**
- [ ] Either remove `layout` from data contract OR mark as Phase 2 with clear note
- [ ] Add comment: `// layout?: 'vertical' | 'horizontal'; // Phase 2: Horizontal layout not implemented`

---

### 🟢 Nice-to-Have Issue 5: Empty State Message Standardization

**Current Inconsistency:**
- Course Menu: "No menu items configured"
- Module Overview: "Module overview not configured"
- Learning Roadmap: "No milestones configured"
- Summary: (not specified)
- Resources: "No resources added yet."

**Recommended Standard:**
```
"No {items} added yet"
```

**Action Items:**
- [ ] Standardize all empty state messages in design plans

---

## Phase 1: Course Menu (Refactor Existing) - 4-6 hours

### Current State
- ✅ File exists: `src/components/templates/navigation/CourseMenu.tsx`
- ✅ Registered in registry
- ❌ All styles inline
- ❌ Hardcoded colors: `#eff6ff`, `#2563eb`, `#3b82f6`, `#374151`, `#1e293b`
- ❌ No BEM structure
- ❌ No CSS file
- ❌ No tests

### Implementation Steps

#### 1.1 Create CSS File (1 hour)
- [ ] Create `src/components/templates/navigation/CourseMenu.css`
- [ ] Define all BEM classes from design plan
- [ ] Map theme tokens to CSS variables
- [ ] Implement hierarchical indentation formula: `padding-left: calc(14px + (var(--depth) * 20px))`
- [ ] Add hover/focus/active states
- [ ] Add responsive breakpoint (@media max-width: 768px)

**Key Classes:**
```css
.tpl-course-menu
.tpl-course-menu__title
.tpl-course-menu__nav
.tpl-course-menu__list
.tpl-course-menu__item
.tpl-course-menu__item--active
.tpl-course-menu__item--nested
.tpl-course-menu__icon
.tpl-course-menu__label
.tpl-course-menu__empty
```

#### 1.2 Refactor TSX (1.5 hours)
- [ ] Import CSS file
- [ ] Replace all inline styles with BEM classes
- [ ] Keep dynamic indentation via inline style or CSS custom property
- [ ] Add semantic HTML (`<nav>`, `role="navigation"`, `aria-current="page"`)
- [ ] Add keyboard navigation support
- [ ] Implement onItemClick callback
- [ ] Add ARIA labels

#### 1.3 Update Default Data (0.5 hour)
- [ ] Review current default in `componentRegistryData.ts`
- [ ] Add sample nested menu structure
- [ ] Ensure at least 3 items with one nested level

#### 1.4 Create Tests (1.5 hours)
- [ ] Create `src/components/templates/navigation/CourseMenu.test.tsx`
- [ ] Implement all 22 test cases from design plan
- [ ] Test hierarchical rendering
- [ ] Test active state logic
- [ ] Test editor interactions

#### 1.5 Validation (0.5 hour)
- [ ] Run: `npm test -- CourseMenu`
- [ ] Run: `npx tsc --noEmit`
- [ ] Visual verification in UI
- [ ] Test in both light and dark themes
- [ ] Check keyboard navigation
- [ ] Verify responsive behavior

---

## Phase 2: Resources & Downloads (Refactor Existing) - 4-6 hours

### Current State
- ✅ File exists: `src/components/templates/navigation/ResourcesDownloads.tsx`
- ✅ Registered in registry
- ❌ All styles inline
- ❌ Hardcoded colors: `#64748b`, `#e2e8f0`, `#fff`, `#1e293b`, `#f1f5f9`, `#475569`, `#94a3b8`
- ❌ Emoji icons: 📄📝🔗🎬🖼️📎
- ❌ No BEM structure
- ❌ No CSS file
- ❌ No tests

### Implementation Steps

#### 2.1 Create CSS File (1 hour)
- [ ] Create `src/components/templates/navigation/ResourcesDownloads.css`
- [ ] Define all BEM classes from design plan
- [ ] Map theme tokens to CSS variables
- [ ] Add hover/focus states for resource cards
- [ ] Implement type badge modifiers (--pdf, --doc, --link, etc.)
- [ ] Add responsive breakpoint

**Key Classes:**
```css
.tpl-resources-downloads
.tpl-resources-downloads__title
.tpl-resources-downloads__description
.tpl-resources-downloads__list
.tpl-resources-downloads__resource
.tpl-resources-downloads__resource-icon
.tpl-resources-downloads__resource-content
.tpl-resources-downloads__resource-title
.tpl-resources-downloads__resource-description
.tpl-resources-downloads__resource-meta
.tpl-resources-downloads__type-badge
.tpl-resources-downloads__type-badge--pdf (and other types)
.tpl-resources-downloads__file-size
.tpl-resources-downloads__empty
```

#### 2.2 Replace Emoji with Lucide Icons (0.5 hour)
- [ ] Import icons from `lucide-react`
- [ ] Replace emoji mapping:
  ```typescript
  import { FileText, Link, Video, Image, Paperclip } from 'lucide-react';
  
  const TYPE_ICONS = {
    pdf: FileText,
    doc: FileText,
    link: Link,
    video: Video,
    image: Image,
    other: Paperclip,
  };
  ```
- [ ] Update rendering to use icon components with size={28}

#### 2.3 Refactor TSX (1.5 hours)
- [ ] Import CSS file
- [ ] Replace all inline styles with BEM classes
- [ ] Update icon rendering
- [ ] Add proper `aria-label` attributes
- [ ] Ensure target="_blank" and rel="noopener noreferrer" on links
- [ ] Add focus visible states

#### 2.4 Update Default Data (0.5 hour)
- [ ] Review current default in `componentRegistryData.ts`
- [ ] Add 3 diverse resource examples (PDF, link, video)
- [ ] Add descriptions and file sizes

#### 2.5 Create Tests (1.5 hours)
- [ ] Create `src/components/templates/navigation/ResourcesDownloads.test.tsx`
- [ ] Implement all 21 test cases
- [ ] Test Lucide icon rendering
- [ ] Test type badge display
- [ ] Test external link attributes
- [ ] Test editor CRUD operations

#### 2.6 Validation (0.5 hour)
- [ ] Run: `npm test -- ResourcesDownloads`
- [ ] Run: `npx tsc --noEmit`
- [ ] Visual verification
- [ ] Test theme consistency
- [ ] Verify responsive behavior

---

## Phase 3: Module Overview (New Implementation) - 8-10 hours

### Current State
- ❌ File doesn't exist
- ❌ Not registered
- ✅ Default data exists in componentRegistryData.ts
- ✅ Complete design plan available

### Implementation Steps

#### 3.1 Create Component Structure (1 hour)
- [ ] Create `src/components/templates/navigation/ModuleOverview.tsx`
- [ ] Define TypeScript interfaces (4 interfaces):
  - `ModuleObjective`
  - `Prerequisite`
  - `ModuleTopic`
  - `ModuleOverviewData`
- [ ] Set up Preview and Editor component shells
- [ ] Import React and types

#### 3.2 Create CSS File (2 hours)
- [ ] Create `src/components/templates/navigation/ModuleOverview.css`
- [ ] Define all BEM classes (~30 classes)
- [ ] Implement difficulty badge color variants (--beginner, --intermediate, --advanced)
- [ ] Style objectives, prerequisites, and topics sections
- [ ] Implement 2-column grid for topics (desktop)
- [ ] Add responsive breakpoint (1-column on mobile)
- [ ] Style metadata badges (duration, difficulty)
- [ ] Add optional cover image styles

#### 3.3 Implement Preview Component (2 hours)
- [ ] Render header (cover image, title, description, metadata)
- [ ] Import Lucide icons: Clock, Target/BookOpen, CheckCircle, AlertCircle, Circle, List
- [ ] Render duration badge with Clock icon
- [ ] Render difficulty badge with color variant
- [ ] Render objectives section with checkmarks
- [ ] Conditionally render prerequisites section
- [ ] Conditionally render topics section (grid layout)
- [ ] Conditionally render start button
- [ ] Add empty state
- [ ] Add accessibility attributes (aria-labels, semantic HTML)

#### 3.4 Implement Editor Component (2 hours)
- [ ] Basic info fields (title, description, cover image URL)
- [ ] Metadata inputs (duration number, difficulty dropdown)
- [ ] Objectives list with add/remove
- [ ] Prerequisites toggle and list with add/remove
- [ ] Topics toggle and list with add/remove (title + description per topic)
- [ ] Show start button checkbox
- [ ] Validation: Title required, at least 1 objective
- [ ] Generate unique IDs: `obj-${Date.now()}`, `pre-${Date.now()}`, `topic-${Date.now()}`

#### 3.5 Register Component (0.5 hour)
- [ ] Add lazy imports to `src/components/registry/registrations.ts`
- [ ] Register Preview and Editor components
- [ ] Update default data in `componentRegistryData.ts` to match new interface structure

#### 3.6 Create Tests (2 hours)
- [ ] Create `src/components/templates/navigation/ModuleOverview.test.tsx`
- [ ] Implement all 23 test cases
- [ ] Test conditional section rendering (prerequisites, topics, start button)
- [ ] Test badge color variants
- [ ] Test editor add/remove operations
- [ ] Test validation logic (title required, min 1 objective)

#### 3.7 Validation (0.5 hour)
- [ ] Run: `npm test -- ModuleOverview`
- [ ] Run: `npx tsc --noEmit`
- [ ] Visual verification in UI
- [ ] Test all 3 difficulty badge colors
- [ ] Test topics grid responsive behavior
- [ ] Verify accessibility (screen reader, keyboard nav)

---

## Phase 4: Learning Roadmap (New Implementation) - 8-10 hours

### Current State
- ❌ File doesn't exist
- ❌ Not registered
- ✅ Default data exists in componentRegistryData.ts
- ✅ Complete design plan available

### Implementation Steps

#### 4.1 Create Component Structure (1 hour)
- [ ] Create `src/components/templates/navigation/LearningRoadmap.tsx`
- [ ] Define TypeScript interfaces:
  - `Milestone`
  - `LearningRoadmapData`
- [ ] Remove `layout` field from data contract OR mark as Phase 2
- [ ] Set up Preview and Editor component shells

#### 4.2 Create CSS File (2.5 hours)
- [ ] Create `src/components/templates/navigation/LearningRoadmap.css`
- [ ] Define all BEM classes
- [ ] Implement milestone state variants (--completed, --current, --locked, --clickable)
- [ ] Implement connector line styling with CSS positioning
- [ ] Add connector completion state (--completed)
- [ ] Style status badges (48×48px circles)
- [ ] Add hover transformations (scale 1.05)
- [ ] Add current milestone elevation shadow
- [ ] Implement responsive breakpoint (smaller badges on mobile)

#### 4.3 Implement Preview Component (2 hours)
- [ ] Import Lucide icons: CheckCircle, BookOpen, Lock
- [ ] Render optional title and description
- [ ] Map through milestones array
- [ ] Render milestone cards with status-based styling
- [ ] Render status badge with appropriate icon
- [ ] Render connector line between milestones (not after last)
- [ ] Implement clickable wrapper for completed/current milestones with pageId
- [ ] Add onMilestoneClick callback
- [ ] Add empty state
- [ ] Add accessibility attributes (aria-label with status, aria-disabled for locked)

#### 4.4 Implement Editor Component (1.5 hours)
- [ ] Title and description inputs
- [ ] Milestone list rendering
- [ ] Per-milestone fields: title, description, status dropdown, icon, duration, pageId
- [ ] Add/remove milestone buttons
- [ ] **Validation:** Enforce only one 'current' status at a time
  - Auto-update previous 'current' to 'completed' when new 'current' selected
- [ ] Generate unique IDs: `ms-${Date.now()}`

#### 4.5 Register Component (0.5 hour)
- [ ] Add lazy imports to registrations.ts
- [ ] Register Preview and Editor
- [ ] Update default data to match new interface (ensure 3 milestones with all status types)

#### 4.6 Create Tests (2 hours)
- [ ] Create `src/components/templates/navigation/LearningRoadmap.test.tsx`
- [ ] Implement all 25 test cases
- [ ] Test milestone status rendering
- [ ] Test connector line rendering
- [ ] Test clickability based on status + pageId
- [ ] Test editor validation (only one 'current')
- [ ] Test status icon display

#### 4.7 Validation (0.5 hour)
- [ ] Run: `npm test -- LearningRoadmap`
- [ ] Run: `npx tsc --noEmit`
- [ ] Visual verification of connector lines
- [ ] Test all 3 status states
- [ ] Verify hover effects
- [ ] Check locked milestone is not clickable

---

## Phase 5: Summary / Key Takeaways (New Implementation) - 8-10 hours

### Current State
- ❌ File doesn't exist
- ❌ Not registered
- ✅ Default data exists in componentRegistryData.ts
- ✅ Complete design plan available

### Implementation Steps

#### 5.1 Create Component Structure (1 hour)
- [ ] Create `src/components/templates/navigation/SummaryTakeaways.tsx`
- [ ] Define TypeScript interfaces:
  - `KeyPoint`
  - `SummaryTakeawaysData`
- [ ] Set up Preview and Editor component shells

#### 5.2 Create CSS File (2 hours)
- [ ] Create `src/components/templates/navigation/SummaryTakeaways.css`
- [ ] Define all BEM classes
- [ ] Implement layout style variants (--list, --cards)
- [ ] Implement high emphasis key point styles
- [ ] Style closing remarks section
- [ ] Style next steps section (light blue tint background)
- [ ] Style action buttons (complete, continue)
- [ ] Add button hover states
- [ ] Add responsive breakpoint

#### 5.3 Implement Preview Component (2 hours)
- [ ] Import Lucide icons: CheckCircle, Star, ArrowRight/TrendingUp
- [ ] Render header (title, intro text)
- [ ] Render key points in selected layout (cards or list)
- [ ] Render key point icons (CheckCircle default, Star for high emphasis)
- [ ] Apply high emphasis styling conditionally
- [ ] Conditionally render closing remarks
- [ ] Conditionally render next steps section
- [ ] Conditionally render action buttons
- [ ] Add onCompleteClick and onContinueClick callbacks
- [ ] Add empty state
- [ ] Add accessibility attributes

#### 5.4 Implement Editor Component (2 hours)
- [ ] Title and intro text inputs
- [ ] Display style selector (radio: cards/list)
- [ ] Key points list with add/remove
- [ ] Per-key-point fields: text, icon, emphasis selector
- [ ] Closing remarks textarea
- [ ] Next steps textarea with toggle
- [ ] Show complete button checkbox
- [ ] Show continue button checkbox
- [ ] Continue button text input
- [ ] Validation: At least 1 key point required
- [ ] Generate unique IDs: `kp-${Date.now()}`

#### 5.5 Register Component (0.5 hour)
- [ ] Add lazy imports to registrations.ts
- [ ] Register Preview and Editor
- [ ] Update default data to match new interface

#### 5.6 Create Tests (2 hours)
- [ ] Create `src/components/templates/navigation/SummaryTakeaways.test.tsx`
- [ ] Implement all 22 test cases
- [ ] Test layout variants (cards vs list)
- [ ] Test high emphasis rendering
- [ ] Test conditional sections (closing, next steps, buttons)
- [ ] Test button click callbacks
- [ ] Test editor add/remove operations

#### 5.7 Validation (0.5 hour)
- [ ] Run: `npm test -- SummaryTakeaways`
- [ ] Run: `npx tsc --noEmit`
- [ ] Visual verification of both layouts
- [ ] Test high emphasis styling
- [ ] Test button interactions
- [ ] Verify next steps section styling

---

## Phase 6: Final Integration & Testing - 2 hours

### 6.1 Run Full Test Suite
- [ ] Run: `npm test` (all tests)
- [ ] Verify all 113 navigation template tests pass
- [ ] Fix any failing tests

### 6.2 TypeScript Validation
- [ ] Run: `npx tsc --noEmit`
- [ ] Fix any type errors
- [ ] Ensure strict mode compatibility

### 6.3 Build Verification
- [ ] Run: `npm run build`
- [ ] Verify no build errors
- [ ] Check bundle size impact

### 6.4 E2E Testing
- [ ] Add navigation template tests to `e2e/ui-redesign.spec.ts`
- [ ] Test each template can be added to a page
- [ ] Test each template renders in preview mode
- [ ] Test each template can be edited
- [ ] Run: `npm run test:e2e -- ui-redesign.spec.ts`

### 6.5 Visual Regression Testing
- [ ] Test all templates in light theme
- [ ] Test all templates in dark theme
- [ ] Verify responsive behavior on mobile viewport
- [ ] Check accessibility (keyboard nav, screen reader)
- [ ] Take screenshots for documentation

### 6.6 Documentation
- [ ] Update main README if needed
- [ ] Verify design plans match implementation
- [ ] Create implementation summary document

---

## Implementation Order & Dependencies

### Recommended Sequence

**Week 1:**
1. ✅ Phase 0: Resolve critical issues in design plans (4 hours)
2. ✅ Phase 1: Course Menu refactor (4-6 hours)
3. ✅ Phase 2: Resources & Downloads refactor (4-6 hours)

**Week 2:**
4. ✅ Phase 3: Module Overview new implementation (8-10 hours)
5. ✅ Phase 4: Learning Roadmap new implementation (8-10 hours)

**Week 3:**
6. ✅ Phase 5: Summary / Key Takeaways new implementation (8-10 hours)
7. ✅ Phase 6: Final integration & testing (2 hours)

### Parallel Work Opportunities
- CSS files can be created in parallel with component work
- Tests can be started before full implementation (TDD approach)
- Documentation can be written during implementation

---

## Risk Mitigation

### Technical Risks

**Risk 1: Connector Line Rendering in Learning Roadmap**
- **Impact:** High
- **Mitigation:** Implement connector with fixed height first, iterate if needed
- **Fallback:** Use margin-based spacing instead of absolute positioned connectors

**Risk 2: Grid Layout Browser Compatibility**
- **Impact:** Low
- **Mitigation:** Use `display: grid` with `auto-fit` for topics in Module Overview
- **Fallback:** Use flexbox with flex-wrap

**Risk 3: Theme Token Inconsistencies**
- **Impact:** Medium
- **Mitigation:** Create shared CSS file for common navigation styles
- **Verification:** Visual comparison across all templates

### Process Risks

**Risk 1: Scope Creep**
- **Mitigation:** Stick to design plans, defer enhancements to Phase 2
- **Process:** Mark any new requirements as "Future Enhancement"

**Risk 2: Test Coverage Gaps**
- **Mitigation:** Follow design plan test cases exactly, aim for 100% coverage
- **Verification:** Run coverage report: `npm test -- --coverage`

---

## Success Criteria

### Must-Have (Phase 1 Complete)
- ✅ All 5 navigation templates implemented
- ✅ All 113 tests passing
- ✅ Zero hardcoded colors (all use theme tokens)
- ✅ Zero emoji icons (all use Lucide React)
- ✅ All components use BEM CSS structure
- ✅ TypeScript compiles with no errors
- ✅ Build succeeds
- ✅ All templates registered and accessible in UI

### Quality Gates
- ✅ Code review passed
- ✅ Accessibility audit passed (keyboard nav, ARIA labels)
- ✅ Visual regression tests passed (light & dark themes)
- ✅ E2E tests passed
- ✅ Documentation updated

### Performance Benchmarks
- Bundle size increase: < 50KB
- Component render time: < 16ms (60fps)
- Test suite execution: < 5 seconds per template

---

## Rollback Plan

If critical issues are discovered:

1. **Immediate Actions:**
   - Revert specific commits
   - Disable problematic template in registry
   - Document issues in GitHub issue

2. **Recovery Steps:**
   - Fix issues in separate branch
   - Re-run full test suite
   - Re-validate visually
   - Merge fix back to navigation-template-design

3. **Communication:**
   - Update team on issue
   - Provide ETA for fix
   - Document lessons learned

---

## Post-Implementation

### Code Review Checklist
- [ ] All design plan requirements met
- [ ] No inline styles (except dynamic values)
- [ ] All theme tokens used correctly
- [ ] Lucide icons used consistently
- [ ] BEM naming conventions followed
- [ ] Accessibility requirements met
- [ ] Tests cover all scenarios
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] Responsive behavior verified

### Merge Checklist
- [ ] All tests passing
- [ ] TypeScript compiles
- [ ] Build succeeds
- [ ] E2E tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Branch up to date with main
- [ ] No merge conflicts

---

## Notes & Decisions

### Design Decisions Made
1. **Empty State Messages:** Standardized to "No {items} added yet"
2. **Connector Implementation:** Fixed-height absolute positioning approach
3. **Horizontal Layout:** Deferred to Phase 2 for Learning Roadmap
4. **Icon Strategy:** Lucide React icons throughout, no emoji

### Deferred to Phase 2
- Horizontal layout for Learning Roadmap
- Drag-and-drop reordering in Course Menu
- Advanced prerequisite completion tracking in Module Overview

---

**Plan Version:** 1.0  
**Last Updated:** March 10, 2026  
**Estimated Completion:** 3-4 weeks (part-time)  
**Total Effort:** 32-42 hours
