# Session Start Prompt — 2026-05-08

Copy everything inside the code block below and paste it as your first message.

---

```
We are working on the e-learning frontend at C:\Users\ADMIN\e-learning-frontend on branch Democourse.

--- WHAT WAS DONE IN PREVIOUS SESSIONS ---

## 2026-05-07 — Completed Tasks

### Task 1 — "Text Content" template not visible in Add Page dialog
Root cause: TemplateSelector has two data paths:
  - vmTemplates (from state.rawTemplates) — used when backend returns any templates
  - templates legacy — used only when rawTemplates is empty
The original static content-text injection only covered the legacy path.

Fix applied: fetchTemplates thunk (src/store/slices/courseSlice.ts) now uses a
DEMO_TEMPLATE_REGISTRY array covering all 19 demo templates. Any template the
backend does NOT return is injected into BOTH backendTemplates (raw) and legacyList.
This guarantees all 19 cards appear in the picker regardless of backend state.

Also fixed in src/store/adapters/templateAdapter.ts: mapTemplateDtoToVm now uses
dto.type first, falling back to categoryToType only when type is absent. Previously
the category map took priority and remapped e.g. "tabs" → "content-text".

### Task 2 — Demo-mode template filter (only 19 of 62 visible)
JS whitelist: DEMO_VISIBLE_TYPES Set in src/components/TemplateSelector.tsx
  filters filteredTemplates before render. Non-whitelisted types are dropped at JS level.
CSS whitelist: DEMO MODE block at the bottom of src/components/TemplateSelector.css
  hides all .template-card { display: none !important } then re-shows the 19 with
  [data-template-type="..."] attribute selectors as defence-in-depth.
Each .template-card div has data-template-type={(template as any).type} attribute added.

To restore all templates: remove DEMO_VISIBLE_TYPES filter in TemplateSelector.tsx
and the DEMO MODE block at the bottom of TemplateSelector.css.

### Task 3 — SCORM export coverage for all 19 demo templates
9 templates had no SCORM renderer and fell to renderUnsupportedComponent fallback.
Created: src/export-runtime/renderers/demoRenderers.ts
  Exports renderers for: image-hotspots, flip-cards, carousel, drag-drop-sort,
  fill-blanks, matching, knowledge-check, final-assessment, completion-certificate
Registered all 9 in: src/export-runtime/core/rendererRegistry.ts
All 19 demo templates now produce valid SCORM HTML on export.

### Task 4 — ContentText field convention fix
Canonical field: data.content (HTML string) — backend, SCORM renderer, editor
Legacy fallback: data.body — read for backward compat, never written
Files changed: ContentText.tsx, registrations.ts, Preview.tsx, TemplateEditor.tsx,
  TemplateValidator.ts, fieldValidation.ts, types/course.ts

--- CURRENT STATE ---

Branch: Democourse
Server: run `npm start` from C:\Users\ADMIN\e-learning-frontend to start at http://localhost:3000
Test status: 97/104 suites pass · 1041/1062 tests pass
6 failing suites are ALL pre-existing — do NOT fix them:
  - PageManager.titleEdit.test.tsx (mock timing)
  - menuBarKeyboard.test.tsx (missing useAutoSave hook — deleted before these sessions)
  - App.test.tsx (React StrictMode health-check call count)
  - courseSlice.test.ts (MCQ letter-index mismatch)
  - templateTypeNormalization.test.ts (Preview missing Redux Provider in test)
  - CustomTemplateEditor.test.tsx (createEnhancedTemplate mock not wired)

--- KEY ARCHITECTURE ---

### Template Dialog ("Add Page from Template")
PageManager.tsx → opens TemplateSelector.tsx
  → dispatches fetchTemplates(courseId) → courseSlice.ts fetchTemplates thunk
      → courseService.listAvailableTemplates() hits GET /courses/templates/available
      → DEMO_TEMPLATE_REGISTRY injects any missing templates into raw + legacy
  → reads state.rawTemplates → mapTemplateList() → vmTemplates (preferred path)
  → fallback: state.templates (legacy) if rawTemplates empty
  → JS filter: DEMO_VISIBLE_TYPES.has(type) must pass
  → renders .template-card[data-template-type="..."] per template
  → TemplateSelector.css DEMO MODE block hides non-demo cards (CSS defence)

### "Add Component" Dialog (separate — do NOT confuse with the above)
ComponentList.tsx → ComponentPicker.tsx
  → reads from ComponentRegistry (local, self-registered, in-memory)
  → registrations.ts populates registry on import (imported in App.tsx)

### SCORM Export Runtime
src/export-runtime/core/runtime.ts — createExportRuntime() entry point
src/export-runtime/core/rendererRegistry.ts — registers all renderers
src/export-runtime/renderers/ — one file per renderer or logical group
src/export-runtime/renderers/demoRenderers.ts — 9 renderers added 2026-05-07

### content-text Field Convention
Canonical: data.content (HTML string)
Fallback (read-only): data.body
SCORM renderer (contentRenderer.ts) reads component.data.content

--- KEY FILES ---

src/store/slices/courseSlice.ts            — fetchTemplates thunk, DEMO_TEMPLATE_REGISTRY
src/store/adapters/templateAdapter.ts      — mapTemplateDtoToVm (type takes priority over category)
src/components/TemplateSelector.tsx        — DEMO_VISIBLE_TYPES JS whitelist
src/components/TemplateSelector.css        — DEMO MODE CSS whitelist block at bottom
src/export-runtime/renderers/demoRenderers.ts  — 9 new SCORM renderers
src/export-runtime/core/rendererRegistry.ts    — renderer registrations
notes/DEMO_TEMPLATE_VISIBILITY.md         — full table of visible vs hidden templates

--- TEST COMMANDS ---

# Verify the 4 core suites from our work pass
npx react-scripts test --watchAll=false --forceExit --testPathPattern="automated-validator-smoke|templateAdapter|courseSlice.serviceLayer|templateSelectorError"
# Expected: 4 PASS

# Verify SCORM runtime
npx react-scripts test --watchAll=false --forceExit --testPathPattern="rendererRegistry|runtime.smoke|interactions.test"
# Expected: 3 PASS

# Full run (note 6 pre-existing failures)
npx react-scripts test --watchAll=false --forceExit 2>&1 | tail -20

--- KNOWN REMAINING ISSUES / FUTURE WORK ---

1. "Clickable Icons" template — not built. Needs design + implementation.
2. "Slider" template — not built. Carousel may cover the use case.
3. demoRenderers.ts renders static HTML only — JS interactions (drag, flip, etc.)
   not wired in the SCORM shell. Functional but not interactive.
4. demoRenderers.ts has no dedicated unit test file yet.
5. courseSlice.serviceLayer.test.ts may need updating if fetchTemplates
   assertions check the exact shape of the injected entries.

--- NEXT TASK ---

[Describe what needs to be done today]
```
