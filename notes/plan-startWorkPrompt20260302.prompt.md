## Start-Work Prompt - 2026-03-02

**Resumption Context:**  
- Branch: `phase-1-part-2`
- All sidebar, Tabs, and Accordion template updates are committed and verified.
- Working directory is clean; no merge conflicts.
- Reference file: notes/2026-02-28-work-status-and-prompt.md (contains full status, patterns, and checklist).

---

### ✅ COMPLETED (Reference for Tomorrow)
- Tabs: CSS polish, theme variables, realistic default data, tests, registry.
- Accordion: Full redesign, BEM class sync, theme variables, 3 realistic panels, tests, registry, and data sync.
- Sidebar: Professional layout, theme-matching, icon sizing, border separation.
- All code and style changes committed and verified.

---

### 🎯 NEXT ACTION: Click and Reveal Template

**Follow this workflow:**
1. Create `.test.tsx` for Click and Reveal with 3-4 behavior tests (FIRST).
2. Polish component CSS in `TemplateStyles.css` (centralized, BEM, theme variables).
3. Update `registrations.ts` and `componentRegistryData.ts` for registry and default data.
4. Add 2-3 realistic default items (not generic).
5. Run full test suite and type-check.
6. Commit with message: `"Click and Reveal template updates"`

**Patterns to follow:**  
- BEM naming: `.tpl-click-reveal-preview__item--revealed`
- Theme variables: `--theme-primary`, `--theme-border`, etc.
- Button classes: `.tpl-btn .tpl-btn--primary .tpl-btn--sm`
- Default data: Instructional, not generic
- Tests must pass: `npm test -- ClickReveal.test.tsx --watch=false`

**Verification Checklist:**  
- [ ] git status (clean working directory)
- [ ] npm test -- --watch=false (all tests pass)
- [ ] npm run type-check (no TypeScript errors)
- [ ] Classes match CSS selectors (BEM pattern)
- [ ] Theme variables used consistently
- [ ] Default data is realistic and instructional

---

**Reference:**  
See notes/2026-02-28-work-status-and-prompt.md for full details, completed work, and implementation patterns.  
Ready to start Click and Reveal template work!

---

**Save this file as:**  
notes/Start-Work-Prompt-2026-03-02.md

You can now lock and use this prompt to resume work tomorrow with full context and reference.
