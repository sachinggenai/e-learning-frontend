# Diagnostic Templates Implementation Plan
**Branch:** `navigation-template-design`  
**Created:** March 10, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This plan defines phased implementation for 5 Diagnostic templates with consistent architecture:
- React + TypeScript template components (`Preview` + `Editor`)
- BEM CSS per template
- Registry + default data wiring
- Unit tests for preview/editor behavior
- Full validation using TypeScript, Jest, and selected E2E checks

### Scope Overview

| # | Template | Planned Type ID | Status | Estimated Tests | Effort |
|---|----------|------------------|--------|-----------------|--------|
| 1 | Pre-Assessment | `pre-assessment` | New | 24 | 8-10h |
| 2 | Diagnostic Quiz | `diagnostic-quiz` | New | 22 | 7-9h |
| 3 | Skill Gap Analysis | `skill-gap-analysis` | New | 20 | 6-8h |
| 4 | Adaptive Learning Path | `adaptive-learning-path` | New | 22 | 7-9h |
| 5 | Recommendation Card | `recommendation-card` | New | 18 | 5-7h |
| **TOTAL** | | | | **106** | **33-43h** |

---

## Phase 0: Foundations and Contracts (Critical)

### 0.1 Type/Data Contract Finalization
- [ ] Align all interfaces with `DESIGN_PLAN_DIAGNOSTIC.md`
- [ ] Add safe parsing for optional legacy/default shapes
- [ ] Define shared helper types for question/score bands

### 0.2 Registry Prep
- [ ] Add lazy imports in `src/components/registry/registrations.ts`
- [ ] Add category registrations under `diagnostic`
- [ ] Assign sort orders and icons

### 0.3 Default Data Prep
- [ ] Add diagnostic defaults in `src/data/componentRegistryData.ts`
- [ ] Ensure IDs are stable (`id` for list CRUD + test selectors)

### 0.4 Test Harness Prep
- [ ] Create template test skeleton pattern (preview/editor describes)
- [ ] Add deterministic mock data for scoring and rule logic

---

## Phase 1: Pre-Assessment (8-10h)

### Files
- `src/components/templates/diagnostic/PreAssessment.tsx`
- `src/components/templates/diagnostic/PreAssessment.css`
- `src/components/templates/diagnostic/PreAssessment.test.tsx`

### Tasks
- [ ] Implement mixed question rendering (`mcq`, `true-false`, `short`)
- [ ] Add local answer state and submit flow
- [ ] Implement score calculation for objective items
- [ ] Add optional timer behavior (display + timeout handling)
- [ ] Add editor CRUD for question bank
- [ ] Add validations (prompt required, options required for MCQ)

### Tests
- [ ] Render and interaction tests for all question types
- [ ] Submission event payload tests
- [ ] Score computation tests (with weights)
- [ ] Editor CRUD tests

---

## Phase 2: Diagnostic Quiz (7-9h)

### Files
- `src/components/templates/diagnostic/DiagnosticQuiz.tsx`
- `src/components/templates/diagnostic/DiagnosticQuiz.css`
- `src/components/templates/diagnostic/DiagnosticQuiz.test.tsx`

### Tasks
- [ ] Implement topic-grouped question flow
- [ ] Compute topic-level and overall scores
- [ ] Map scores to proficiency bands
- [ ] Support optional retry mode
- [ ] Editor controls for topics and band thresholds

### Tests
- [ ] Topic score partitioning
- [ ] Band mapping correctness
- [ ] Retry state reset behavior
- [ ] Editor topic/question management

---

## Phase 3: Skill Gap Analysis (6-8h)

### Files
- `src/components/templates/diagnostic/SkillGapAnalysis.tsx`
- `src/components/templates/diagnostic/SkillGapAnalysis.css`
- `src/components/templates/diagnostic/SkillGapAnalysis.test.tsx`

### Tasks
- [ ] Implement gap computation (`target - current`)
- [ ] Display severity tiers and sorting
- [ ] Add optional remediation links
- [ ] Build editor for skill list and thresholds

### Tests
- [ ] Gap math and severity badge tests
- [ ] Sort/filter tests
- [ ] Remediation interaction events
- [ ] Editor CRUD/validation tests

---

## Phase 4: Adaptive Learning Path (7-9h)

### Files
- `src/components/templates/diagnostic/AdaptiveLearningPath.tsx`
- `src/components/templates/diagnostic/AdaptiveLearningPath.css`
- `src/components/templates/diagnostic/AdaptiveLearningPath.test.tsx`

### Tasks
- [ ] Implement node path rendering and statuses
- [ ] Apply branch rules from diagnostics conditions
- [ ] Enforce prerequisites
- [ ] Add editor for nodes/rules

### Tests
- [ ] Rule resolution tests
- [ ] Prerequisite lock/unlock behavior
- [ ] Progress navigation events
- [ ] Editor rule/node update tests

---

## Phase 5: Recommendation Card (5-7h)

### Files
- `src/components/templates/diagnostic/RecommendationCard.tsx`
- `src/components/templates/diagnostic/RecommendationCard.css`
- `src/components/templates/diagnostic/RecommendationCard.test.tsx`

### Tasks
- [ ] Implement prioritized recommendation list/cards
- [ ] Apply condition-based filtering
- [ ] Add CTA tracking events
- [ ] Editor configuration for priority + conditions

### Tests
- [ ] Priority ordering
- [ ] Condition filtering
- [ ] CTA payload tests
- [ ] Editor field update tests

---

## Phase 6: Registry and Data Integration (2-3h)

### Files
- `src/components/registry/registrations.ts`
- `src/data/componentRegistryData.ts`

### Tasks
- [ ] Register all 5 templates under `diagnostic`
- [ ] Add complete default data payloads
- [ ] Verify icon/typeId consistency with design plan

---

## Phase 7: Validation and Quality Gate (2-4h)

### Commands
- `npx tsc --noEmit`
- `$env:CI='true'; npm test -- "PreAssessment|DiagnosticQuiz|SkillGapAnalysis|AdaptiveLearningPath|RecommendationCard" --watchAll=false`
- `$env:CI='true'; npm test -- "diagnostic" --watchAll=false` (if naming pattern exists)

### Acceptance Criteria
- [ ] TypeScript clean
- [ ] All diagnostic unit tests passing
- [ ] No hardcoded colors in new CSS files
- [ ] Keyboard interaction coverage for interactive controls
- [ ] ARIA labels/roles in place for form controls and status regions

---

## Coding Standards

- Use BEM class naming with `tpl-` prefix
- Use theme tokens only, no hardcoded palette values
- Use `onInteraction` payload format:
```ts
{ componentId, interactionType, interactionId, value }
```
- Use editor `onChange` format:
```ts
onChange({ data: updatedData })
```

---

## Risks and Mitigations

### Risk 1: Complex rule logic in adaptive path
- Mitigation: Isolate pure function for rule evaluation and unit test heavily

### Risk 2: Inconsistent scoring across templates
- Mitigation: Centralize shared score helpers under diagnostic utils

### Risk 3: Test fragility with dynamic IDs
- Mitigation: Use deterministic seed IDs in defaults and test fixtures

---

## Suggested Sequence

1. Pre-Assessment
2. Diagnostic Quiz
3. Skill Gap Analysis
4. Adaptive Learning Path
5. Recommendation Card
6. Registry/data wiring
7. Full validation
