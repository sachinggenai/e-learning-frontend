# Start-Work Prompt for Tomorrow (2026-03-12)

Use this exact prompt to continue work tomorrow:

"Continue from the latest state in `c:\Users\ADMIN\e-learning-frontend` on branch `facda-five-catagory`.

Context:
- Accessibility templates are already fully implemented and committed in `4d8cecb`.
- Detailed design plans were created and archived in:
  - `notes/template-design-plans/`
  - `notes/template-design-plans/2026-03-11/`
- There are 17 per-template plan files covering:
  - Microlearning (3)
  - Gamification (4)
  - Social (5)
  - Practice (5)

Primary objective for this session:
Implement templates category-by-category using the plan files, with full delivery for each category before moving to the next.

Execution order:
1. Microlearning
2. Gamification
3. Social
4. Practice

For each category, do all of the following before moving on:
1. Implement/finish TSX templates per plan.
2. Add CSS files (BEM naming).
3. Add unit tests for each template.
4. Register templates in `src/components/registry/registrations.ts` with lazy imports + `r(...)` blocks.
5. Add category E2E picker spec in `e2e/`.
6. Run validation:
   - `npm run type-check`
   - category-focused Jest run
   - category E2E Playwright run
7. Fix all failures.
8. Commit category changes in a separate commit.

Important constraints:
- Do not revert unrelated existing changes.
- Keep completion capabilities valid (`view | interact | audio | score`).
- Prefer picker-level E2E assertions for stability.

Suggested first action tomorrow:
Start with Microlearning using:
- `notes/template-design-plans/2026-03-11/microlearning-cards-plan.md`
- `notes/template-design-plans/2026-03-11/flashcards-plan.md`
- `notes/template-design-plans/2026-03-11/quick-tips-plan.md`

Expected output by end of tomorrow session:
- All 4 categories implemented with tests and E2E coverage, passing checks, and clean category-wise commits."