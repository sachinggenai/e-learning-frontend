# Start Work Prompt - 2026-03-09

## Context Overview
Continue work on the **Media-Rich Template Design** project. A comprehensive design plan has been created and committed to a dedicated branch. Ready to begin implementation phase following the design-only theme alignment plan.

## Current State

### Branch & Commits
- **Active Branch**: `media-rich-template-design`
- **Remote Tracking**: `origin/media-rich-template-design` (pushed and synced)
- **Latest Commit**: `7ca63d1` - "docs(media-rich): add design-only theme alignment plan and commit staged files"
- **Files in Commit**: 
  - DESIGN_PLAN_MEDIA_RICH_TEMPLATES.md (new, 322 lines)
  - test-output.txt (new)
- **Working Tree**: Clean (no uncommitted changes)

### Design Plan Status
✅ **Completed**: DESIGN_PLAN_MEDIA_RICH_TEMPLATES.md created with:
- Design system standards (9 theme tokens, BEM convention, responsive breakpoints)
- Template-specific scope for all 4 Media-Rich templates
- Implementation phases (Phase 1: Refactors, Phase 2: New implementations)
- Theme-alignment improvement additions (5 mandatory checkpoints)
- Comprehensive testing matrix (70+ tests target across 4 templates)
- File artifacts checklist
- Validation criteria and rollback strategy
- Success metrics

## Media-Rich Templates Scope

### The 4 Templates
1. **Video-Based Slide** - Refactor existing VideoSlide.tsx
2. **Audio-Based Slide** - New implementation (similar to Video but audio-focused)
3. **Animated Explainer** - New implementation (animation/SVG-based)
4. **Infographic** - Refactor existing Infographic.tsx

### Implementation Priority Order
**Phase 1 - Refactors** (Faster, safer):
1. VideoSlide.tsx refactor (existing file: src/components/templates/media/VideoSlide.tsx)
2. Infographic.tsx refactor (existing file: src/components/templates/media/Infographic.tsx)

**Phase 2 - New Implementations**:
3. AudioSlide.tsx implementation (reference VideoSlide for patterns)
4. AnimatedExplainer.tsx implementation (new concept)

## Key Design Requirements

### Design System Standards (Must Follow)
**9 Theme Tokens Only** (hardcoded colors forbidden):
```css
--theme-primary
--theme-text
--theme-text-secondary
--theme-border
--theme-surface
--theme-background
--theme-success
--theme-error
--theme-info
```

**BEM Naming Convention**:
- Block: `.tpl-{name}` (e.g., `.tpl-video-slide`)
- Editor: `.tpl-{name}-editor`
- Element: `__element` (e.g., `__video-container`)
- Modifier: `--modifier` (e.g., `--playing`)

**Responsive Breakpoint**: 768px

**Accessibility**:
- Focus rings: 2px solid primary + 2px offset
- ARIA labels on all interactive elements
- Keyboard navigation support

### Functional Invariance (Critical)
⚠️ **DO NOT CHANGE**:
- Callback signatures (onComplete, onInteraction, etc.)
- Completion tracking logic
- Scoring/validation mechanisms
- Props interfaces (only add optional design props if needed)

### Theme-Alignment Improvements (Mandatory Checkpoints)
1. **Token Coverage Map**: Verify all 9 tokens used appropriately
2. **Hardcoded Style Prevention**: Zero hardcoded colors/fonts in TSX/CSS
3. **State Matrix Verification**: Cover default/hover/focus/active/disabled states
4. **Viewport Verification Matrix**: Test 320/375/768/1024px widths
5. **Accessibility Verification Matrix**: Focus rings, ARIA labels, keyboard nav

## Template-Specific Implementation Details

### 1. VideoSlide Refactor
**Existing File**: [src/components/templates/media/VideoSlide.tsx](src/components/templates/media/VideoSlide.tsx)

**Scope**:
- Extract all hardcoded colors → CSS variables
- Add BEM classes: `.tpl-video-slide`, `.tpl-video-slide__player`, `.tpl-video-slide__controls`
- Add responsive breakpoints for mobile/tablet/desktop
- Add focus rings on controls
- Add ARIA labels: `aria-label="Play video"`, `role="region"`

**Data Contract** (DO NOT CHANGE):
```typescript
interface VideoSlideData {
  videoUrl: string;
  title?: string;
  description?: string;
  autoplay?: boolean;
  controls?: boolean;
}
```

**Files to Touch**:
- src/components/templates/media/VideoSlide.tsx (TSX refactor)
- src/components/templates/media/VideoSlide.css (new or update CSS file)
- src/data/componentRegistryData.ts (update defaultData if needed)
- src/__tests__/templates/media/VideoSlide.test.tsx (add/update tests)

**Test Coverage Target**: 15-20 tests
- Preview rendering, Editor rendering, Callback invocations, Responsive layouts, Accessibility attributes

---

### 2. Infographic Refactor
**Existing File**: [src/components/templates/media/Infographic.tsx](src/components/templates/media/Infographic.tsx)

**Scope**:
- Extract hardcoded colors → CSS variables
- Add BEM classes: `.tpl-infographic`, `.tpl-infographic__section`, `.tpl-infographic__stat`
- Add responsive stacking for mobile
- Add focus rings on interactive sections (if any)
- Add ARIA labels for data visualization

**Data Contract** (verify, preserve interface):
```typescript
interface InfographicData {
  sections: Array<{
    title: string;
    content: string;
    imageUrl?: string;
    stats?: Array<{ label: string; value: string }>;
  }>;
}
```

**Files to Touch**:
- src/components/templates/media/Infographic.tsx
- src/components/templates/media/Infographic.css
- src/data/componentRegistryData.ts
- src/__tests__/templates/media/Infographic.test.tsx

**Test Coverage Target**: 15-20 tests

---

### 3. AudioSlide Implementation (New)
**New File**: src/components/templates/media/AudioSlide.tsx

**Scope**:
- Create from scratch using VideoSlide as reference
- Audio player with controls (play/pause, progress bar, volume)
- Optional transcript display
- BEM classes: `.tpl-audio-slide`, `.tpl-audio-slide__player`, `.tpl-audio-slide__transcript`
- Full theme token usage, responsive design, accessibility

**Suggested Data Contract**:
```typescript
interface AudioSlideData {
  audioUrl: string;
  title?: string;
  description?: string;
  transcript?: string;
  autoplay?: boolean;
}
```

**Files to Create**:
- src/components/templates/media/AudioSlide.tsx
- src/components/templates/media/AudioSlide.css
- src/__tests__/templates/media/AudioSlide.test.tsx

**Files to Update**:
- src/constants/templateTypes.ts (add 'audio-slide' to ComponentTypeId if needed)
- src/components/registry/registrations.ts (register component)
- src/data/componentRegistryData.ts (add defaultData)

**Test Coverage Target**: 15-20 tests

---

### 4. AnimatedExplainer Implementation (New)
**New File**: src/components/templates/media/AnimatedExplainer.tsx

**Scope**:
- Create animated content display (CSS animations or SVG)
- Step-by-step animated storytelling
- Play/pause controls, progress indicator
- BEM classes: `.tpl-animated-explainer`, `.tpl-animated-explainer__stage`, `.tpl-animated-explainer__controls`
- Full theme token usage, responsive design, accessibility

**Suggested Data Contract**:
```typescript
interface AnimatedExplainerData {
  steps: Array<{
    title: string;
    content: string;
    animation?: string; // CSS class or animation name
    duration?: number;
  }>;
  autoplay?: boolean;
}
```

**Files to Create**:
- src/components/templates/media/AnimatedExplainer.tsx
- src/components/templates/media/AnimatedExplainer.css
- src/__tests__/templates/media/AnimatedExplainer.test.tsx

**Files to Update**:
- src/constants/templateTypes.ts
- src/components/registry/registrations.ts
- src/data/componentRegistryData.ts

**Test Coverage Target**: 20-25 tests (animations add complexity)

## Reference Files & Patterns

### Existing Media Templates (Good References)
- **ImageHotspots.tsx**: [src/components/templates/media/ImageHotspots.tsx](src/components/templates/media/ImageHotspots.tsx) - Good example of interactive media template
- **VideoSlide.tsx**: [src/components/templates/media/VideoSlide.tsx](src/components/templates/media/VideoSlide.tsx) - Starting point for AudioSlide

### Recent Design Plan Files (Pattern References)
- **Assessment Templates Plan**: [DESIGN_PLAN_ASSESSMENT_TEMPLATES.md](DESIGN_PLAN_ASSESSMENT_TEMPLATES.md) - Test pattern reference
- **Comparison Templates Plan**: [DESIGN_PLAN_COMPARISON_TEMPLATES.md](DESIGN_PLAN_COMPARISON_TEMPLATES.md) - Implementation pattern reference

### Key System Files
- **Registry**: [src/components/registry/registrations.ts](src/components/registry/registrations.ts) - Component registration
- **Default Data**: [src/data/componentRegistryData.ts](src/data/componentRegistryData.ts) - Sample data for templates
- **Type Definitions**: [src/constants/templateTypes.ts](src/constants/templateTypes.ts) - Component type IDs
- **Template Interface**: [TemplateEngine_Frontend_Requirements.md](TemplateEngine_Frontend_Requirements.md) - Overall requirements

### Testing References
- **Recent Test Files**: Check src/__tests__/templates/assessment/ and src/__tests__/templates/comparison/ for testing patterns
- **Test Command**: `npm test -- --testPathPattern="media" --watchAll=false`

## Recommended First Steps

### Option A: Start with VideoSlide Refactor (Recommended)
1. Checkout branch: `git checkout media-rich-template-design`
2. Read existing VideoSlide.tsx implementation
3. Create/update VideoSlide.css with BEM classes and theme tokens
4. Refactor VideoSlide.tsx to use new CSS classes
5. Update defaultData in componentRegistryData.ts
6. Create/update VideoSlide.test.tsx with 15+ tests
7. Run tests: `npm test -- --testPathPattern="VideoSlide" --watchAll=false`
8. Verify in UI manually
9. Commit: `feat(media-rich): refactor VideoSlide with theme alignment`

### Option B: Start with Infographic Refactor
1. Same process as above but for Infographic.tsx
2. Focus on color extraction and responsive layout
3. Test data visualization accessibility

### Option C: Review Plan and Prepare
1. Read DESIGN_PLAN_MEDIA_RICH_TEMPLATES.md thoroughly
2. Review existing template implementations
3. Check current theme token definitions
4. Plan detailed implementation approach

## Testing Strategy

### Test Types Needed (Per Template)
1. **Preview Rendering** (3-5 tests): Default render, with all props, empty states
2. **Editor Rendering** (3-5 tests): Editor controls, data editing, validation
3. **Callback Invocations** (2-3 tests): onComplete, onInteraction callbacks
4. **Responsive Layouts** (2-4 tests): Mobile (320px), tablet (768px), desktop (1024px)
5. **Accessibility** (3-5 tests): ARIA labels, keyboard nav, focus management

### Test Command Examples
```bash
# Run all media template tests
npm test -- --testPathPattern="media" --watchAll=false

# Run specific template tests
npm test -- --testPathPattern="VideoSlide" --watchAll=false
npm test -- --testPathPattern="Infographic" --watchAll=false

# Run with coverage
npm test -- --testPathPattern="media" --coverage --watchAll=false
```

## Success Criteria (Per Template)

### Implementation Complete When:
- ✅ All hardcoded colors replaced with theme tokens
- ✅ BEM naming convention applied consistently
- ✅ Responsive breakpoints implemented (768px minimum)
- ✅ Focus rings and ARIA labels added
- ✅ 15+ tests written and passing
- ✅ TypeScript compilation clean: `npx tsc --noEmit`
- ✅ Manual UI verification in light/dark themes
- ✅ No functionality changes (callbacks/completion/scoring intact)
- ✅ defaultData updated with clean samples
- ✅ Component registered correctly

### Phase Complete When:
- All 4 templates meet individual success criteria
- Combined test suite: 70+ tests passing
- Build succeeds: `npm run build`
- E2E smoke tests pass (if applicable)
- Documentation updated (if needed)

## Git Workflow

### Commit Message Convention
```
feat(media-rich): [action] [template-name] [description]
test(media-rich): [action] [template-name] tests
refactor(media-rich): [action] [template-name] [description]
```

### Example Commits
```
feat(media-rich): refactor VideoSlide with theme alignment and BEM
test(media-rich): add 18 tests for VideoSlide preview and editor
feat(media-rich): implement AudioSlide template with accessibility
refactor(media-rich): extract Infographic colors to theme tokens
```

### Branch Protection
- Stay on `media-rich-template-design` branch
- Commit frequently with descriptive messages
- Push to remote regularly: `git push origin media-rich-template-design`
- When phase complete, create PR to merge into main

## Potential Blockers & Solutions

### Blocker: Existing templates have complex state
**Solution**: Preserve state logic exactly, only change styling/CSS classes

### Blocker: Theme tokens not defined
**Solution**: Check CSS variables in root styles, add if missing (unlikely)

### Blocker: Testing media elements (video/audio)
**Solution**: Mock media elements in tests, verify props/callbacks not playback

### Blocker: Responsive design breaks layout
**Solution**: Use CSS Grid/Flexbox with mobile-first approach, test at each breakpoint

### Blocker: Accessibility requirements unclear
**Solution**: Reference ImageHotspots.tsx for ARIA patterns, use axe-core if needed

## Quick Reference Commands

```bash
# Switch to branch
git checkout media-rich-template-design

# Check status
git status

# Run TypeScript check
npx tsc --noEmit

# Run specific tests
npm test -- --testPathPattern="VideoSlide" --watchAll=false

# Run all media tests
npm test -- --testPathPattern="media" --watchAll=false

# Build
npm run build

# Commit workflow
git add .
git commit -m "feat(media-rich): [your message]"
git push origin media-rich-template-design
```

## End Goal

By the end of this work stream, we will have:
1. **4 Media-Rich Templates** fully aligned with the current theme design system
2. **70+ Tests** covering preview, editor, callbacks, responsive, and accessibility
3. **Zero Functionality Changes** - all existing behavior preserved
4. **Consistent Design Language** across all media templates
5. **Complete Documentation** of theme alignment approach
6. **Ready for PR Review** - clean, tested, documented code

## Start Work Tomorrow With This Prompt

**Recommended Starting Prompt**:
```
Continue work on Media-Rich template design from branch media-rich-template-design 
(commit 7ca63d1). Follow DESIGN_PLAN_MEDIA_RICH_TEMPLATES.md. Start with VideoSlide 
refactor: extract colors to theme tokens, add BEM classes, ensure responsive design, 
add accessibility attributes. Create 15+ tests. No functionality changes to callbacks 
or completion logic. Verify TypeScript clean and tests passing before committing.
```

---

**File Created**: 2026-03-08  
**Branch**: media-rich-template-design  
**Status**: Ready to begin implementation Phase 1 (VideoSlide refactor)
