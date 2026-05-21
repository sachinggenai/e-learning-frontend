AI_STEPWISE_IMPLEMENTATION_AND_TEST_CASESsave this old md file as well with old name for refrence

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
