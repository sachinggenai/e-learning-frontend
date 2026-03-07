# Media-Rich Templates: Design-Only Theme Alignment Plan

## Overview

### Purpose
Align all 4 Media-Rich templates with the current app theme and design system using dedicated CSS files, strict BEM naming, and the existing 9 theme tokens with fallback values. This is a **design-only** refactor/implementation plan.

### Scope
Templates in scope:
1. Video-Based Slide (`video-slide`)
2. Audio-Based Slide (`audio-slide`)
3. Animated Explainer (`animated-explainer`)
4. Infographic (`infographic`)

Current implementation state:
- Exists and needs design refactor: `src/components/templates/media/VideoSlide.tsx`, `src/components/templates/media/Infographic.tsx`
- Missing and needs implementation: Audio-Based Slide, Animated Explainer

### Functional Invariance (Non-Negotiable)
No functionality changes are allowed:
- No callback payload shape changes (`onChange`, `onInteraction`, `onComplete`)
- No completion logic changes (including watch-threshold semantics for video)
- No scoring behavior changes
- No data contract changes to registered template fields

Source-of-truth references:
- `src/constants/templateTypes.ts`
- `src/data/componentRegistryData.ts`
- `src/components/registry/registrations.ts`
- `TemplateEngine_Frontend_Requirements.md`

---

## Design System Standards

### BEM Convention
Root blocks:
- `.tpl-video-slide`, `.tpl-video-slide-editor`
- `.tpl-audio-slide`, `.tpl-audio-slide-editor`
- `.tpl-animated-explainer`, `.tpl-animated-explainer-editor`
- `.tpl-infographic`, `.tpl-infographic-editor`

Elements and modifiers:
- `__element`
- `--modifier`

### Theme Token Contract (Current Theme Alignment)
All visual styling must use only these 9 tokens with fallback values:
- `var(--theme-primary, #2563eb)`
- `var(--theme-text, #1e293b)`
- `var(--theme-text-secondary, #64748b)`
- `var(--theme-border, #e2e8f0)`
- `var(--theme-surface, #f8fafc)`
- `var(--theme-background, #ffffff)`
- `var(--theme-success, #22c55e)`
- `var(--theme-error, #ef4444)`
- `var(--theme-info, #3b82f6)`

Rules:
- No hardcoded static colors in template styles
- No mixed token families for the same template
- No inline visual styles except documented dynamic/computed cases

### Responsive Requirements
Primary breakpoint: `768px`
- Desktop: standard layout and spacing
- Mobile (`<=768px`): full-width controls, no clipping, reduced spacing, readable captions/transcripts
- Tap targets: minimum `44px` for interactive controls

### Accessibility Visual Requirements
- Focus ring: `2px solid var(--theme-primary, #2563eb)` + `2px` offset
- Distinct hover/active/disabled visuals
- Keyboard support (Tab, Enter/Space)
- Contrast compliance for text, overlays, captions, transcript panels

---

## Template-Specific Plan

### 1) Video-Based Slide
Files:
- Refactor: `src/components/templates/media/VideoSlide.tsx`
- Create: `src/components/templates/media/VideoSlide.css`
- Create/expand tests: `src/components/templates/media/VideoSlide.test.tsx`

Design scope:
- Move inline styles to CSS
- Theme-align player container, placeholder, overlay, caption, editor fields
- Preserve completion watch-threshold behavior and callback flow

Core BEM targets:
- `.tpl-video-slide__title`
- `.tpl-video-slide__player`
- `.tpl-video-slide__placeholder`
- `.tpl-video-slide__overlay`
- `.tpl-video-slide__caption`

---

### 2) Audio-Based Slide
Files:
- Create: `src/components/templates/media/AudioSlide.tsx`
- Create: `src/components/templates/media/AudioSlide.css`
- Create: `src/components/templates/media/AudioSlide.test.tsx`
- Register: `src/components/registry/registrations.ts`

Design scope:
- Build preview/editor with existing contract only
- Theme-align audio player panel, transcript, visual content panel, editor controls
- Preserve non-scoring and interaction contract behavior

Core BEM targets:
- `.tpl-audio-slide__title`
- `.tpl-audio-slide__player`
- `.tpl-audio-slide__transcript`
- `.tpl-audio-slide__visual`

---

### 3) Animated Explainer
Files:
- Create: `src/components/templates/media/AnimatedExplainer.tsx`
- Create: `src/components/templates/media/AnimatedExplainer.css`
- Create: `src/components/templates/media/AnimatedExplainer.test.tsx`
- Register: `src/components/registry/registrations.ts`

Design scope:
- Build preview/editor with steps UI matching current theme
- Theme-align animation panel, step cards, active step state, editor step rows
- Preserve contract behavior for step data and interactions

Core BEM targets:
- `.tpl-animated-explainer__media`
- `.tpl-animated-explainer__steps`
- `.tpl-animated-explainer__step`
- `.tpl-animated-explainer__step--active`

---

### 4) Infographic
Files:
- Refactor: `src/components/templates/media/Infographic.tsx`
- Create: `src/components/templates/media/Infographic.css`
- Create/expand tests: `src/components/templates/media/Infographic.test.tsx`

Design scope:
- Move inline styles to CSS
- Theme-align cards, section stats, labels, borders, layout modes, editor controls
- Preserve current data/edit behavior and layout semantics

Core BEM targets:
- `.tpl-infographic__sections`
- `.tpl-infographic__section`
- `.tpl-infographic__stat-value`
- `.tpl-infographic__stat-label`

---

## Implementation Phases

### Phase 1: Baseline & Contract Lock
- [ ] Confirm current behavior and payload baselines
- [ ] Capture invariance checklist per template
- [ ] Confirm registry/defaultData parity with constants and requirements

### Phase 2: Existing Template Design Refactor
- [ ] VideoSlide: TSX class mapping + CSS extraction + tests
- [ ] Infographic: TSX class mapping + CSS extraction + tests
- [ ] Remove inline style usage for static visuals

### Phase 3: Missing Template Implementation
- [ ] Implement AudioSlide preview/editor + CSS + tests + registration
- [ ] Implement AnimatedExplainer preview/editor + CSS + tests + registration

### Phase 4: Validation and Integration
- [ ] Run template test suites
- [ ] Run combined media-rich checks
- [ ] Run build and type checks
- [ ] Manual UI verification in template selector + editor + preview

---

## Theme-Alignment Improvement Additions

These improvements are mandatory additions to keep templates inline with current color theme and design:

1. **Token Coverage Map per template**
   - [ ] Root container
   - [ ] Media surface (player/animation/image)
   - [ ] Captions/transcript panels
   - [ ] Interactive controls (default/hover/focus/active/disabled)
   - [ ] Empty/loading/error states

2. **Hardcoded Style Prevention Gate**
   - [ ] No static `#hex`, `rgb()`, `rgba()`, or named colors in template styles
   - [ ] No fixed shadow colors outside token contract

3. **State Matrix Verification**
   - [ ] Validate: default, hover, focus-visible, active, disabled
   - [ ] Validate state visuals on both desktop and mobile

4. **Viewport Verification Matrix**
   - [ ] Check at widths: 320, 375, 768, 1024
   - [ ] Ensure no horizontal overflow and no clipped content

5. **Accessibility Verification Matrix**
   - [ ] Keyboard-only flow works end-to-end
   - [ ] Focus ring visible and consistent
   - [ ] Captions/overlays/transcript text contrast passes AA

---

## Testing Matrix (Comparison-Level Depth)

Target: `15-25 tests per template`

Common test cases for all 4 templates:
- [ ] Preview render without crash
- [ ] Editor render and controlled updates
- [ ] BEM root + critical class presence
- [ ] Callback payload invariance
- [ ] Completion behavior invariance
- [ ] Responsive behavior assertions
- [ ] Accessibility keyboard checks
- [ ] Focus and disabled state checks

Template-specific:

Video-Based Slide:
- [ ] Video source and fallback placeholder
- [ ] Overlay/caption/transcript rendering states
- [ ] Watch-threshold completion behavior preserved

Audio-Based Slide:
- [ ] Audio source and fallback placeholder
- [ ] Transcript and visual-content rendering
- [ ] Editor update contract behavior

Animated Explainer:
- [ ] Steps rendering and active-state visuals
- [ ] Step editor update behavior
- [ ] Interaction callbacks as expected

Infographic:
- [ ] Layout mode rendering (`grid` and alternate mode)
- [ ] Section card/stat visual states
- [ ] Editor section mutation behavior preserved

---

## File Artifacts

New files:
- `src/components/templates/media/VideoSlide.css`
- `src/components/templates/media/VideoSlide.test.tsx`
- `src/components/templates/media/AudioSlide.tsx`
- `src/components/templates/media/AudioSlide.css`
- `src/components/templates/media/AudioSlide.test.tsx`
- `src/components/templates/media/AnimatedExplainer.tsx`
- `src/components/templates/media/AnimatedExplainer.css`
- `src/components/templates/media/AnimatedExplainer.test.tsx`
- `src/components/templates/media/Infographic.css`
- `src/components/templates/media/Infographic.test.tsx`

Updated files:
- `src/components/templates/media/VideoSlide.tsx`
- `src/components/templates/media/Infographic.tsx`
- `src/components/registry/registrations.ts`
- `src/services/validators/TemplateValidator.ts` (only if needed for type parity)

---

## Validation Criteria

Automated:
- [ ] Test suite passes for changed templates
- [ ] Build passes
- [ ] Type-check passes

Manual:
- [ ] All 4 templates selectable from template picker
- [ ] Preview and editor work for each template
- [ ] Theme consistency matches current app design
- [ ] Responsive and keyboard checks pass

Design-compliance:
- [ ] Dedicated CSS file per template
- [ ] BEM class consistency
- [ ] Token-only visual styling
- [ ] No out-of-scope UX additions

---

## Rollback Strategy

- Phase-based commits only (atomic)
- Revert latest failing phase if regression is found
- Prioritize rollback triggers:
  - callback/contract regressions
  - completion/scoring regressions
  - theme/a11y regressions
  - runtime template selection crashes

---

## Success Metrics

Quantitative:
- 4/4 media-rich templates covered
- 70+ tests total across media-rich templates
- 0 behavior regressions against invariance checklist

Qualitative:
- Media-rich templates are fully inline with current color theme and design
- Maintainability improved with dedicated CSS and consistent BEM
- Stable template selection, editing, and preview behavior

---

**Document Version:** 1.0  
**Created:** March 7, 2026  
**Execution Mode:** Design-only, contract-preserving, theme-aligned
