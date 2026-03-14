# Peer Review - Detailed Design Plan

## Purpose
Support peer feedback with rubric-based ratings and written comments.

## Learner Experience
- Learner reviews criteria list.
- Learner rates each criterion.
- Learner writes summary comments.
- Learner submits review.

## Data Model
```ts
interface ReviewCriterion {
  id: string;
  label: string;
  description?: string;
}

interface PeerReviewData {
  title: string;
  criteria: ReviewCriterion[];
  maxRating: 3 | 5;
  requireComment?: boolean;
}
```

## Preview Behavior
- Render criteria rows with rating controls.
- Optional comments text area.
- Display average rating before submit.

## Editor Behavior
- Fields: title, maxRating, requireComment.
- Criteria manager add/remove/reorder.

## Interaction Events
- `peer_review_rating_changed`
- `peer_review_comment_changed`
- `peer_review_submitted`

## Completion Rules
- Complete when all criteria are rated and submit is clicked.

## Accessibility
- Rating control can be arrow-key navigated.
- Criterion labels associated to control groups.

## CSS Plan
- File: `src/components/templates/social/PeerReview.css`
- Blocks: `.tpl-peer-review`, `.tpl-peer-review__criterion`, `.tpl-peer-review__rating`, `.tpl-peer-review__comment`, `.tpl-peer-review__summary`

## Unit Test Plan
- Rates criteria and calculates average.
- Requires comment when configured.
- Submit triggers onComplete.

## E2E Plan
- Picker visibility for Peer Review.

## Acceptance Criteria
- Stable rating state and validation.
