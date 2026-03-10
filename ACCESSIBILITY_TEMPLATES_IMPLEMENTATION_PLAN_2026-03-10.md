# Accessibility Templates Implementation Plan
**Branch:** `navigation-template-design`  
**Created:** March 10, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This plan outlines implementation of 5 Accessibility templates focused on inclusive guidance, alternate language support, and media accessibility.

### Scope Overview

| # | Template | Planned Type ID | Status | Estimated Tests | Effort |
|---|----------|------------------|--------|-----------------|--------|
| 1 | Accessibility Tip Card | `accessibility-tip-card` | New | 14 | 4-6h |
| 2 | Keyboard Navigation Guide | `keyboard-navigation-guide` | New | 18 | 5-7h |
| 3 | Screen Reader Guide | `screen-reader-guide` | New | 16 | 5-7h |
| 4 | Language Selector | `language-selector` | New | 16 | 5-7h |
| 5 | Transcript / Caption Page | `transcript-caption-page` | New | 20 | 7-9h |
| **TOTAL** | | | | **84** | **26-36h** |

---

## Phase 0: Accessibility Baseline (Critical)

### 0.1 Standards Alignment
- [ ] Verify each template meets WCAG 2.1 AA baseline
- [ ] Define keyboard map and focus behavior rules
- [ ] Define ARIA strategy per template

### 0.2 Shared Utilities
- [ ] Add shared helpers for locale/language normalization
- [ ] Add shared helpers for transcript time formatting/search

### 0.3 Registry/Data Prep
- [ ] Prepare registrations in `src/components/registry/registrations.ts`
- [ ] Add defaults in `src/data/componentRegistryData.ts`

---

## Phase 1: Accessibility Tip Card (4-6h)

### Files
- `src/components/templates/accessibility/AccessibilityTipCard.tsx`
- `src/components/templates/accessibility/AccessibilityTipCard.css`
- `src/components/templates/accessibility/AccessibilityTipCard.test.tsx`

### Tasks
- [ ] Implement tip card variants by category
- [ ] Optional dismiss and learn-more link behavior
- [ ] Editor fields for content/category/icon/link

### Tests
- [ ] Variant rendering
- [ ] Dismiss interaction
- [ ] Link and event payload checks

---

## Phase 2: Keyboard Navigation Guide (5-7h)

### Files
- `src/components/templates/accessibility/KeyboardNavigationGuide.tsx`
- `src/components/templates/accessibility/KeyboardNavigationGuide.css`
- `src/components/templates/accessibility/KeyboardNavigationGuide.test.tsx`

### Tasks
- [ ] Render shortcut list/table with context groups
- [ ] OS label mode (`Ctrl`/`Cmd`) support
- [ ] Optional practice mode with simple checks
- [ ] Editor CRUD for shortcuts

### Tests
- [ ] Shortcut rendering and grouping
- [ ] OS mode transformation tests
- [ ] Practice mode interactions
- [ ] Editor update tests

---

## Phase 3: Screen Reader Guide (5-7h)

### Files
- `src/components/templates/accessibility/ScreenReaderGuide.tsx`
- `src/components/templates/accessibility/ScreenReaderGuide.css`
- `src/components/templates/accessibility/ScreenReaderGuide.test.tsx`

### Tasks
- [ ] Implement ordered step guidance with expected outcomes
- [ ] Tool-specific notes switcher (NVDA/JAWS/VoiceOver)
- [ ] Troubleshooting section (issue/fix)
- [ ] Editor step and troubleshooting CRUD

### Tests
- [ ] Step rendering order
- [ ] Tool switch display logic
- [ ] Troubleshooting toggle behavior
- [ ] Editor CRUD tests

---

## Phase 4: Language Selector (5-7h)

### Files
- `src/components/templates/accessibility/LanguageSelector.tsx`
- `src/components/templates/accessibility/LanguageSelector.css`
- `src/components/templates/accessibility/LanguageSelector.test.tsx`

### Tasks
- [ ] Language options selector UI
- [ ] Persist preference option
- [ ] Fallback language behavior for missing content
- [ ] RTL mode signaling support
- [ ] Editor controls for language options/default/fallback

### Tests
- [ ] Selection and event emission
- [ ] Fallback behavior
- [ ] Preference persistence toggle behavior
- [ ] Editor data update tests

---

## Phase 5: Transcript / Caption Page (7-9h)

### Files
- `src/components/templates/accessibility/TranscriptCaptionPage.tsx`
- `src/components/templates/accessibility/TranscriptCaptionPage.css`
- `src/components/templates/accessibility/TranscriptCaptionPage.test.tsx`

### Tasks
- [ ] Render transcript segments with timecodes
- [ ] Search/filter with highlight
- [ ] Optional click-to-seek event integration
- [ ] Download format options (txt/srt/vtt)
- [ ] Editor CRUD/import for transcript segments

### Tests
- [ ] Segment ordering and formatting
- [ ] Search matching/highlight
- [ ] Timestamp click event payload
- [ ] Download action tests
- [ ] Editor segment management tests

---

## Phase 6: Registry and Data Integration (2-3h)

### Files
- `src/components/registry/registrations.ts`
- `src/data/componentRegistryData.ts`

### Tasks
- [ ] Register all 5 templates under `accessibility`
- [ ] Add rich defaults and stable IDs
- [ ] Verify icon mappings and sort orders

---

## Phase 7: Validation and Quality Gate (2-4h)

### Commands
- `npx tsc --noEmit`
- `$env:CI='true'; npm test -- "AccessibilityTipCard|KeyboardNavigationGuide|ScreenReaderGuide|LanguageSelector|TranscriptCaptionPage" --watchAll=false`
- Optional focused E2E for keyboard traversal and language switch behavior

### Acceptance Criteria
- [ ] TypeScript clean
- [ ] Unit tests pass for all accessibility templates
- [ ] Keyboard-only navigation verified
- [ ] ARIA attributes verified in critical controls
- [ ] No hardcoded colors in template CSS
- [ ] Responsive behavior acceptable on mobile/tablet

---

## Coding Standards

- BEM naming with `tpl-` prefix
- Theme tokens only
- Interaction payload format:
```ts
{ componentId, interactionType, interactionId, value }
```
- Editor change payload:
```ts
onChange({ data: updatedData })
```

---

## Risks and Mitigations

### Risk 1: Accessibility regressions due to dynamic UI updates
- Mitigation: Explicit keyboard + aria tests for interactive controls

### Risk 2: Language fallback inconsistencies
- Mitigation: Central fallback utility with unit coverage

### Risk 3: Transcript search performance for long content
- Mitigation: Debounced search + memoized filtering

---

## Suggested Sequence

1. Accessibility Tip Card
2. Keyboard Navigation Guide
3. Screen Reader Guide
4. Language Selector
5. Transcript / Caption Page
6. Registry/data wiring
7. Full validation
