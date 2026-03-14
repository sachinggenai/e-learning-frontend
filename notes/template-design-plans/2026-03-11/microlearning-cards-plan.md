# Microlearning Cards - Detailed Design Plan

## Purpose
Deliver bite-sized learning cards that learners can move through quickly on desktop and mobile.

## Learner Experience
- Learner sees one card at a time with title, short body, and optional icon.
- Learner can move Next and Previous.
- Learner sees progress like `2/6`.
- Learner completes after viewing final card.

## Data Model
```ts
interface MicroCard {
  id: string;
  title: string;
  body: string;
  icon?: string;
  accentColor?: string;
}

interface MicrolearningCardsData {
  heading: string;
  intro?: string;
  cards: MicroCard[];
  shuffle?: boolean;
  autoAdvanceSec?: number; // 0 disables auto-advance
  showProgress?: boolean;
}
```

## Preview Behavior
- Render heading and optional intro.
- If `shuffle` is true, randomize display order once on mount.
- Render current card with transition.
- Show Previous and Next controls.
- Disable Previous on first card.
- Next becomes Finish on last card.
- If `autoAdvanceSec > 0`, auto move to next until last card.

## Editor Behavior
- Fields: heading, intro, shuffle toggle, autoAdvanceSec number, showProgress toggle.
- Card manager: add card, remove card, reorder cards.
- Per-card fields: title, body, icon, accentColor.
- Validation: require at least 1 card and non-empty title/body.

## Interaction Events
- `micro_card_viewed` when card changes.
- `micro_card_next_clicked` on Next.
- `micro_card_prev_clicked` on Previous.
- `micro_cards_completed` when Finish is clicked or auto reaches end.

## Completion Rules
- Completed when learner reaches final card and triggers Finish.
- If `cards.length === 1`, completion can happen on first Next/Finish click.

## Accessibility
- Controls must be keyboard focusable.
- ArrowLeft and ArrowRight support navigation.
- Use `aria-live="polite"` for progress updates.
- Ensure color contrast for accent backgrounds.

## CSS Plan
- File: `src/components/templates/microlearning/MicrolearningCards.css`
- Blocks: `.tpl-micro-cards`, `.tpl-micro-cards__header`, `.tpl-micro-cards__card`, `.tpl-micro-cards__actions`, `.tpl-micro-cards__progress`

## Unit Test Plan
- Renders heading and first card.
- Next moves to second card.
- Previous returns to first card.
- Finish calls `onComplete`.
- Shuffle preserves full set of cards.
- Auto-advance moves over time (fake timers).

## E2E Plan
- Picker test finds `Microlearning Cards` under Microlearning.
- Add component and verify heading field appears in editor.

## Acceptance Criteria
- Works on mobile and desktop without layout break.
- Keyboard and screen-reader flow is usable.
- `onInteraction` payload includes card id and index.
- All tests pass and component is registered.
