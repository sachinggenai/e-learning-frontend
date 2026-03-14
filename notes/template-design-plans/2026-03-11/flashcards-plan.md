# Flashcards - Detailed Design Plan

## Purpose
Provide a quick recall activity where each card flips from prompt to answer.

## Scope
Existing `Flashcards.tsx` is present. This plan focuses on production-ready polish: CSS, tests, and minor behavior hardening.

## Learner Experience
- Learner sees one flashcard prompt.
- Learner clicks Flip to reveal answer.
- Learner moves through deck using Next and Previous.
- Learner sees progress and completion state.

## Data Model
```ts
interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardsData {
  title: string;
  cards: Flashcard[];
  shuffle?: boolean;
  requireFlipBeforeNext?: boolean;
}
```

## Preview Behavior
- Render title and card count.
- Card starts on front side.
- Flip toggles front/back view.
- Next resets card to front.
- Optional guard: if `requireFlipBeforeNext`, block Next until flipped.

## Editor Behavior
- Fields: title, shuffle toggle, requireFlipBeforeNext toggle.
- Card manager: add/remove/reorder.
- Per-card fields: front, back, hint.

## Interaction Events
- `flashcard_flipped`
- `flashcard_next`
- `flashcard_prev`
- `flashcards_completed`

## Completion Rules
- Complete when learner reaches last card and has flipped it at least once.

## Accessibility
- Flip button has explicit label with current side.
- Card content uses semantic headings and paragraphs.
- Keyboard shortcuts: Enter to flip, Arrow keys for navigation.

## CSS Plan
- File: `src/components/templates/microlearning/Flashcards.css`
- Blocks: `.tpl-flashcards`, `.tpl-flashcards__card`, `.tpl-flashcards__face`, `.tpl-flashcards__controls`, `.tpl-flashcards__meta`
- Include reduced-motion handling for flip animation.

## Unit Test Plan
- Renders first card front.
- Flip reveals back.
- Next moves to next card and resets to front.
- Completion triggers at final card.
- `requireFlipBeforeNext` blocks next until flip.

## E2E Plan
- Picker visibility for Flashcards under Microlearning.

## Acceptance Criteria
- Existing behavior remains stable.
- CSS replaces inline style assumptions.
- Unit tests cover happy path and guard path.
