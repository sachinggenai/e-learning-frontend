# AI Stepwise Implementation and Test Cases

Date: 2026-05-22
Branch: demo-course-AI
Scope: Build AI course generation in chunks and test each chunk before moving forward.

## 1. Objective

Implement AI in incremental phases so the team can:
- Build safely without breaking manual authoring
- Validate each phase with clear pass/fail checks
- Demo value early while keeping architecture scalable

In-scope templates for all phases:
- Text Content
- Tabs
- Accordion
- Click & Reveal
- Final Assessment

Primary model:
- GPT-4.1

Fallback model:
- GPT-4.1-mini

## 2. Build Strategy

1. Finish one chunk fully.
2. Run chunk test cases.
3. Fix defects.
4. Get sign-off.
5. Move to next chunk.

Definition of done for each chunk:
- Build tasks completed
- All chunk test cases pass
- No regression in manual course build flow

## 3. Chunk Plan

## Chunk 0: Foundation and Feature Flag

Build tasks:
1. Add AI feature flag.
2. Add environment config for model routing.
3. Add logging scaffolding for AI requests.
4. Keep all AI UI hidden behind feature flag.

Test cases:
- TC-CH0-01: Feature flag off hides AI controls.
  Expected: No AI button/panel visible.
- TC-CH0-02: Feature flag on shows AI entry point only.
  Expected: Existing manual flow unchanged.
- TC-CH0-03: Missing model env config.
  Expected: Friendly configuration error, no crash.

Exit criteria:
- App behavior same as before when feature flag is off.

## Chunk 1: Template Registry and Schemas

Build tasks:
1. Create template capability registry for 5 templates.
2. Add JSON schema per template.
3. Add validator module.
4. Add unit tests for schema validation.

Test cases:
- TC-CH1-01: Valid payload per template.
  Expected: Validation passes.
- TC-CH1-02: Missing required field per template.
  Expected: Validation fails with specific field error.
- TC-CH1-03: Unsupported template in payload.
  Expected: Validation fails with template not allowed.
- TC-CH1-04: Combined multi-page valid plan.
  Expected: Entire plan passes validation.

Exit criteria:
- Validator blocks invalid structures before UI apply.

## Chunk 2: AI API Contract and Model Router

Build tasks:
1. Implement GET /ai/models.
2. Implement POST /ai/chat (create mode only).
3. Add model allowlist validation.
4. Add fallback to GPT-4.1-mini on primary failure.

Test cases:
- TC-CH2-01: Valid create request with GPT-4.1.
  Expected: 200 OK, modelUsed=gpt-4.1.
- TC-CH2-02: Unsupported model requested.
  Expected: Validation error or fallback policy applied.
- TC-CH2-03: Primary model timeout.
  Expected: Auto fallback used, response returns modelUsed fallback.
- TC-CH2-04: Bad request missing mode.
  Expected: 400 with clear error message.

Exit criteria:
- Stable API response contract and fallback behavior verified.

## Chunk 3: Prompt Builder and Planner (Create Draft)

Build tasks:
1. Implement prompt builder with template whitelist.
2. Implement planning logic for section-to-template selection.
3. Enforce output as strict JSON.
4. Add one repair prompt retry for invalid JSON.

Test cases:
- TC-CH3-01: Storyboard with 5 sections.
  Expected: Planner outputs allowed templates only.
- TC-CH3-02: Prompt asks unsupported template.
  Expected: Planner refuses unsupported template and uses whitelist.
- TC-CH3-03: LLM returns malformed JSON first attempt.
  Expected: Repair pass succeeds or error returned safely.
- TC-CH3-04: Very short storyboard input.
  Expected: Minimal valid draft generated.

Exit criteria:
- AI returns valid structured draft plan consistently.

## Chunk 4: Course Assembly into Existing UI State

Build tasks:
1. Map validated AI plan to existing course/page/component state.
2. Reuse existing editor store actions.
3. Render generated draft in editor.
4. Ensure preview and export consume same data structure.

Test cases:
- TC-CH4-01: Apply AI draft to empty course.
  Expected: Course appears in editor and all components render.
- TC-CH4-02: Preview generated course.
  Expected: Preview works without runtime errors.
- TC-CH4-03: Export generated course.
  Expected: Export succeeds using existing export path.
- TC-CH4-04: Manual edit after AI draft.
  Expected: Manual editing behaves normally.

Exit criteria:
- End-to-end create flow works from AI prompt to export.

## Chunk 5: AI Chat UI Panel

Build tasks:
1. Add Build with AI entry button.
2. Add chat panel with input + status states.
3. Show generation summary before apply.
4. Add error/retry messages.

Test cases:
- TC-CH5-01: Open and close panel repeatedly.
  Expected: No state leaks or UI breakage.
- TC-CH5-02: Submit prompt and generate draft.
  Expected: Progress states shown, draft ready to review.
- TC-CH5-03: API error handling in UI.
  Expected: Friendly error and retry option.
- TC-CH5-04: Cancel generation.
  Expected: Request safely canceled and UI resets.

Exit criteria:
- User can generate draft from chat without impacting manual UI.

## Chunk 6: Refine Mode with Patch-Based Updates

Build tasks:
1. Add refine mode in POST /ai/chat.
2. Define patch schema (targeted updates).
3. Validate patch scope before apply.
4. Add review-before-apply UX.

Test cases:
- TC-CH6-01: Refine text tone in one page.
  Expected: Only targeted component changes.
- TC-CH6-02: Add one tab in existing Tabs component.
  Expected: Correct localized update.
- TC-CH6-03: Unsafe broad patch request.
  Expected: Rejected by patch validator.
- TC-CH6-04: User rejects previewed patch.
  Expected: No changes applied.

Exit criteria:
- Safe iterative AI editing works with change control.

## Chunk 7: Final Assessment Quality Rules

Build tasks:
1. Add final-assessment rule checks (min questions, required options, answer keys).
2. Add scoring consistency validation.
3. Add explanation-field checks.

Test cases:
- TC-CH7-01: Valid assessment generated.
  Expected: Passes all assessment validators.
- TC-CH7-02: MCQ missing correct option.
  Expected: Validation error returned.
- TC-CH7-03: Invalid passing score out of range.
  Expected: Validation error blocks apply.
- TC-CH7-04: Multiple question-type mix.
  Expected: Render + preview + submit behavior intact.

Exit criteria:
- Assessment output is valid and stable in editor/preview.

## Chunk 8: Regression, Hardening, and Demo Readiness

Build tasks:
1. Run regression suite for manual flow.
2. Add smoke tests for AI create/refine paths.
3. Prepare backup prompts and fallback demo script.
4. Add operational monitoring metrics.

Test cases:
- TC-CH8-01: Manual course creation full flow.
  Expected: No behavior change.
- TC-CH8-02: AI create flow full path.
  Expected: Prompt -> draft -> preview -> export success.
- TC-CH8-03: AI refine flow full path.
  Expected: Targeted update + preview + export success.
- TC-CH8-04: Primary model outage simulation.
  Expected: Fallback works; user sees non-blocking message.

Exit criteria:
- Demo-ready build signed off.

## 4. Cross-Chunk Regression Suite

Run after every chunk from Chunk 4 onward:
1. Manual editor open/save behavior.
2. Template rendering for all 5 templates.
3. Preview page load.
4. Export generation.
5. Basic accessibility checks for newly added chat UI.

## 5. Test Data Pack

Prepare and reuse these fixtures:
1. Short storyboard (1 to 2 pages).
2. Medium storyboard (5 pages mixed templates).
3. Long storyboard (10+ pages stress test).
4. Compliance style content (accordion heavy).
5. Interactive learning content (click & reveal + tabs).
6. Assessment-heavy content (final assessment validation).

## 6. Defect Severity Rules

P0:
- Crash, data loss, export failure, manual flow break

P1:
- Invalid AI apply modifies wrong scope

P2:
- UI issue or minor content mismatch with easy workaround

Release rule:
- No open P0 or P1 for demo sign-off.

## 7. Suggested Ownership

Frontend:
- Chat panel, apply preview, store integration

Backend/BFF:
- AI orchestration, model routing, validation pipeline

QA:
- Chunk-wise test execution and regression suite

Product:
- Prompt quality sign-off and demo acceptance criteria

## 8. Traceability Matrix (Chunk to Capability)

- Chunk 0 to 2: Platform readiness
- Chunk 3 to 4: AI draft generation core value
- Chunk 5 to 6: Chat UX and iterative refinement
- Chunk 7: Assessment reliability
- Chunk 8: Production-like demo stability

## 9. Go/No-Go Checklist for Demo Day

1. AI draft generation works for all 5 templates.
2. Manual mode remains intact.
3. Preview and export work for AI-generated course.
4. Fallback model works when primary fails.
5. At least one full create and one refine script tested end-to-end.

## 10. Notes

This document is implementation planning and test planning only.
No runtime behavior is changed by this document itself.

## 11. Review Findings and Improvements Applied

The original chunk plan is strong for end-to-end delivery, but these gaps were identified:
1. No explicit template-by-template rollout path.
2. No page-level generation controls for partial implementation.
3. No explicit course-scope modes (full course versus selected pages).
4. No dedicated test cases for partial build operations.

Improvements added in this revision:
1. Template-wise rollout plan.
2. Course-wise and page-wise rollout plan.
3. Scope contract extensions.
4. New test suites for selective generation and selective refinement.

## 12. New Execution Modes (Must-Have for Flexible Delivery)

AI generation should support these modes:
1. Full course mode:
- AI generates full course draft from storyboard.
2. Template-wise mode:
- AI generates only requested template blocks.
3. Course-wise mode:
- AI generates selected modules/pages only.
4. Page-wise mode:
- AI updates one page or page range only.

## 13. Scope Contract Extensions

Add these fields to AI request contract:

```json
{
  "generationScope": "full_course|template_wise|course_wise|page_wise",
  "templateScope": {
    "allowedTemplates": [
      "text-content",
      "tabs",
      "accordion",
      "click-reveal",
      "final-assessment"
    ],
    "targetTemplates": []
  },
  "pageScope": {
    "mode": "all|page_range|specific_pages|single_page",
    "startPage": 1,
    "endPage": 3,
    "pageIds": [],
    "maxPagesToGenerate": 3
  },
  "operation": "create|append|replace|refine"
}
```

Validation rules:
1. If generationScope is template_wise, targetTemplates is required.
2. If generationScope is page_wise, pageScope is required.
3. final-assessment is restricted to append/replace rules defined by product.

## 14. Template-Wise Delivery Plan

Use when team wants to build by template in isolated increments.

Template Chunk T0: Shared core
Build tasks:
1. Registry and schema infra.
2. Validator and apply pipeline.
3. Common test harness.

Exit criteria:
1. Any template payload can be validated/applied via one shared path.

Template Chunk T1: Text Content
Build tasks:
1. Planner prompt and mapping for text-content.
2. UI create/refine support for text-content only.

Test cases:
- TC-T1-01: Generate one text page from short brief.
- TC-T1-02: Refine tone only on selected text page.

Template Chunk T2: Tabs
Build tasks:
1. Tabs schema and planner rules.
2. Item count safeguards.

Test cases:
- TC-T2-01: Generate tabs with 3 to 5 items.
- TC-T2-02: Reject tabs payload missing item titles.

Template Chunk T3: Accordion
Build tasks:
1. Accordion mapping and order handling.
2. Expand/collapse content validation.

Test cases:
- TC-T3-01: Generate accordion from FAQ style brief.
- TC-T3-02: Reject empty accordion panel content.

Template Chunk T4: Click and Reveal
Build tasks:
1. Click-reveal item mapping.
2. Interaction content constraints.

Test cases:
- TC-T4-01: Generate click and reveal with valid reveal content.
- TC-T4-02: Reject missing reveal text for any item.

Template Chunk T5: Final Assessment
Build tasks:
1. Question generation rules.
2. Scoring and answer-key validation.

Test cases:
- TC-T5-01: Generate mixed-type valid assessment.
- TC-T5-02: Block invalid correct-answer structures.

## 15. Course-Wise and Page-Wise Delivery Plan

Use when user wants to implement only selected pages or modules.

Course Chunk C1: Full course create
Test cases:
- TC-C1-01: Storyboard to full course draft.

Course Chunk C2: Append selected pages
Build tasks:
1. operation=append support.
2. Page insertion index handling.

Test cases:
- TC-C2-01: Append 2 pages at end.
- TC-C2-02: Append at specific index.

Course Chunk C3: Replace page range
Build tasks:
1. page_range targeting.
2. Safe replace with preview diff.

Test cases:
- TC-C3-01: Replace pages 3 to 4 only.
- TC-C3-02: Verify pages outside range unchanged.

Course Chunk C4: Refine specific pages
Build tasks:
1. specific_pages targeting.
2. Patch scope enforcement.

Test cases:
- TC-C4-01: Refine only page IDs provided.
- TC-C4-02: Reject patch touching out-of-scope pages.

Course Chunk C5: Single page rapid update
Build tasks:
1. single_page optimization path.
2. Fast prompt profile for small edits.

Test cases:
- TC-C5-01: Update one page heading and summary only.
- TC-C5-02: Ensure no course-level metadata changed.

## 16. Additional Regression Suite for Partial Builds

Run after any template-wise or page-wise release:
1. Out-of-scope pages unchanged check.
2. Template integrity after partial apply.
3. Preview and export still succeed after selective updates.
4. Undo/redo consistency after selective AI operations.
5. Manual edit continuity on modified and unmodified pages.

## 17. Practical Build Order Recommendation

If timeline is tight, implement in this order:
1. Chunk 0 to 4 from core plan.
2. Template-wise T1 to T3.
3. Course-wise C2 and C4.
4. Template-wise T4 and T5.
5. Remaining hardening and demo checks.

Reason:
1. Delivers visible AI value early.
2. Supports partial page implementation quickly.
3. Keeps risk controlled for assessment complexity.
