# Parked Backend Items
**Date**: February 2026

## 1. Social Component Binding
- Add `componentId` (required) and `pageId` (optional) to social entities:
  - `DiscussionThread`, `DiscussionThreadCreate`
  - `PeerReviewSubmission`, `PeerReviewSubmissionCreate`
  - `Poll`, `PollCreate`
  - `TeamChallenge` (if modeled separately from Team)

## 2. Branching Runtime Resolution
- Add runtime decision endpoint to resolve the next page based on rules + learner context.
- Suggested: `POST /courses/{courseId}/branches/resolve` with payload `{ pageId, learnerId, context }`.

## 3. Branch Rule Vocabulary
- Define allowed `field` sources (e.g., `page.score`, `component.score`, `interaction.value`, `course.progress`).
- Define allowed operators per field type to keep rule authoring safe and predictable.

## 4. Analytics Filters
- Add optional query params for analytics endpoints:
  - `from`, `to` (ISO date)
  - `learnerId` or `cohortId`

## 5. Social Pagination
- Add paging to social list endpoints to prevent unbounded lists.
- Suggested `page` + `limit` query params for discussions, peer reviews, polls, teams.
