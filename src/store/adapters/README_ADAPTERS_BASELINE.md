# Adapters Baseline (Phase 1)

This file documents the Phase 1 baseline capture of raw backend template DTOs prior to introducing formal adapter mapping.

## Purpose

- Preserve untouched backend template payloads under `course.rawTemplates` in Redux state.
- Continue supplying existing UI with `course.templates` using legacy normalized structure for a safe transition.
- Provide a reference snapshot to write deterministic adapter unit tests in Phase 2.

## Current State Additions

- `CourseState.rawTemplates: any[]` added (initially empty array).
- `fetchTemplates` thunk now returns `{ raw, legacy }` instead of only a normalized array.
- Extra reducer stores `raw` into `state.rawTemplates` and `legacy` into `state.templates` (UI remains functional).

## Next Steps (Phase 2)

1. Introduce strongly typed DTO interfaces (`TemplateDTO`) and ViewModel (`TemplateVM`).
2. Implement pure functions in `templateAdapter.ts`:
   - `mapTemplateDtoToVm(dto: TemplateDTO): TemplateVM`
   - `mapTemplateList(dtoList: TemplateDTO[]): TemplateVM[]`
3. Replace legacy normalization usage with adapter output; deprecate `legacy` branch.
4. Add Jest tests covering mapping variations (intro, lab, assessment/mcq).
5. Remove heuristic transformations in `PageManager.handlePageSelect` once page DTO mapping is in place.

## Rollback Strategy

If any regressions occur after Phase 2 changes:

- Revert to git tag `baseline-adapters-phase1` (to be created externally) which includes this file and dual storage logic.

## Validation Hooks

Temporary console logging (if needed) can compare `rawTemplates.length` to `templates.length` to ensure parity.

-- End of Baseline Documentation --
