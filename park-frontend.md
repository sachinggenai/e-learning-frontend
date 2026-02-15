# Parked Frontend Items
**Date**: February 2026

## 1. Social Component Binding
- Social APIs do not bind to component instances. Frontend needs `componentId` (and optional `pageId`) on social entities to map multiple social components per page.
- Affected components: `discussion-prompt`, `peer-review`, `poll-vote`, `team-challenge`, `scenario-debate`.

## 2. Branching Runtime Resolution
- No runtime endpoint for resolving the next page based on branch rules and learner context.
- Frontend cannot reliably advance from `branching-scenario` or `adaptive-learning-path` without backend resolution support.

## 3. Branch Rule Authoring Model
- `BranchCondition.field` is open-ended with no vocabulary or source definition.
- Frontend editor cannot provide a consistent rule builder until field sources and supported operators are defined.

## 4. Analytics Filters
- Analytics endpoints have no time range or learner filters.
- Frontend reporting views need at least date range and cohort filters for enterprise usage.

## 5. Interaction Event Mapping
- Interaction event types are open strings, but frontend still needs a shared list of standard values for analytics and UI labels.
- Requires backend + frontend agreement on canonical interaction types.
