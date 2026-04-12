# Frontend AI Developer - Implementation Brief
## SCORM Integration Contract & Phase 1 Kickoff Guide

**Date:** April 12, 2026  
**Status:** ✅ APPROVED FOR IMPLEMENTATION  
**Authority:** Backend AI Developer + TPO (Joint Contract Lock)

---

## EXECUTIVE SUMMARY: What You Need to Know

The backend team has **locked the integration contract**. This document contains everything required to begin Phase 1 implementation immediately.

### What's Locked ✅
- **4 canonical REST endpoints** with request/response models
- **Error handling standard** (unified envelope format)
- **40+ supported template types** (list below)
- **Timeline & delivery dates** (P0 items by Apr 15, samples by Apr 19)
- **Signature authority** (Backend AI Dev + TPO confirmed)

### What You Build Against
- `POST /api/v1/courses/{courseId}/scoring/calculate` — Submit answers, get scores
- `POST /api/v1/courses/{courseId}/pages/{pageId}/completion` — Mark pages done
- `POST /api/v1/courses/{courseId}/interactions` — Log user interactions
- `POST /api/v1/export/scorm/{courseId}?format=scorm_1_2` — Generate SCORM ZIP

### Timeline (Critical Dates)
| Date | Deliverable | Owner | Your Action |
|------|------------|-------|------------|
| Apr 15 | exportContractVersion + supportedTemplateTypes fields live | BE | Validate in sample packages |
| Apr 19 | Sample SCORM packages ready | BE | Download, test, integrate renderer |
| Apr 26 | Phase 1 MVP (accordion, tabs, MCQ, progress) | FE | Ship first production components |
| Apr 22 | Error envelope normalization | BE | Adopt new error format |

**TL;DR:** You can start building NOW using the locked contracts below. Sample packages arrive Apr 19.

---

## 1. CANONICAL ENDPOINTS (Copy to Service Layer)

### 1.1 Scoring Endpoint

**Purpose:** Calculate scores after learner submits answers for a component.

```typescript
// src/services/ScoringService.ts

POST /api/v1/courses/{courseId}/scoring/calculate

// REQUEST
{
  "answers": [
    {
      "componentId": "comp-mcq-001",
      "componentType": "mcq",
      "responses": [
        {
          "questionId": "q-1",
          "selectedOptionIds": ["opt-a", "opt-b"],
          "textAnswer": null
        }
      ]
    }
  ],
  "attemptNumber": 1
}

// RESPONSE
{
  "totalScore": 75.0,
  "maxScore": 100.0,
  "percentage": 75.0,
  "passed": true,
  "passingScore": 70,
  "componentResults": [
    {
      "componentId": "comp-mcq-001",
      "componentType": "mcq",
      "score": 75.0,
      "maxScore": 100.0,
      "weight": 1.0,
      "weightedScore": 75.0,
      "questionResults": [
        {
          "questionId": "q-1",
          "correct": true,
          "score": 50.0,
          "maxScore": 50.0,
          "partialCredit": false
        }
      ]
    }
  ],
  "attemptNumber": 1,
  "remainingAttempts": null
}
```

**Key Behaviors:**
- ✅ **Idempotent**: Send same request twice = same response (safe for retries)
- ✅ **Aggregate scoring**: FE collects all component answers, BE calculates total + per-component breakdown
- ✅ **Partial credit supported**: questionResults[] includes per-question scoring
- ✅ **Component weighting**: Each component contributes via `weight * score / maxScore` to total

**Error Responses:**
```json
// 400 Bad Request - Invalid answer structure
{
  "code": "VALIDATION_ERROR",
  "field": "answers[0].componentId",
  "message": "Component 'unknown-comp' not found",
  "details": {
    "attempted": "Score component unknown-comp",
    "reason": "No matching component in course",
    "suggestion": "Verify componentId exists in course structure"
  }
}

// 404 Not Found - Course doesn't exist
{
  "code": "NOT_FOUND",
  "field": "courseId",
  "message": "Course 'invalid-course' not found",
  "details": { "attempted": "Fetch course", "reason": "Course ID invalid" }
}

// 422 Validation Error - Answer references unknown question
{
  "code": "VALIDATION_ERROR",
  "field": "answers[0].responses[0].questionId",
  "message": "Question 'unknown-q' not in component"
}
```

**FE Implementation Guide:**
1. Build answer collection form (accordion/tabs with inputs)
2. On submit, call `ScoringService.calculateScore(courseId, answers)` with payload above
3. Display response: `totalScore / maxScore`, show pass/fail badge based on `passed` flag
4. Log interaction event separately (see Endpoint 1.3)

---

### 1.2 Page Completion Endpoint

**Purpose:** Submit component completion states → backend evaluates page-level completion.

```typescript
// src/services/CompletionService.ts

POST /api/v1/courses/{courseId}/pages/{pageId}/completion

// REQUEST
{
  "componentStates": [
    {
      "componentId": "comp-accordion-001",
      "completed": true,
      "interactionsCompleted": ["section-1", "section-2"],
      "audiosCompleted": [],
      "score": null
    },
    {
      "componentId": "comp-mcq-001",
      "completed": true,
      "interactionsCompleted": [],
      "audiosCompleted": [],
      "score": 75
    }
  ]
}

// RESPONSE
{
  "pageId": "page-001",
  "title": "Introduction to Module 1",
  "completed": true,
  "strategy": "all",  // all|any|percentage|custom
  "components": [
    {
      "componentId": "comp-accordion-001",
      "completed": true,
      "completionType": "view",
      "threshold": 0
    },
    {
      "componentId": "comp-mcq-001",
      "completed": true,
      "completionType": "score",
      "threshold": 70
    }
  ]
}
```

**Key Behaviors:**
- ✅ **Completion strategy**: Page marked complete only if strategy evaluates TRUE
  - `all`: All components must be completed
  - `any`: At least one component completed
  - `percentage`: X% of components completed
  - `custom`: Backend rule defined in course config
- ✅ **Idempotent**: Send same state twice = safe (SCORM suspend/resume friendly)
- ✅ **Partial completion ok**: Mark some components done, others in progress; next call completes page
- ✅ **Safe for retry**: Duplicate requests don't cause state rollback or errors

**Error Responses:**
```json
// 400 Bad Request - Missing required field
{
  "code": "VALIDATION_ERROR",
  "field": "componentStates[0].componentId",
  "message": "componentId is required"
}

// 404 Not Found - Page doesn't exist for course
{
  "code": "NOT_FOUND",
  "field": "pageId",
  "message": "Page 'invalid-page' not found in course 'course-001'"
}

// 409 Conflict - State error
{
  "code": "STATE_ERROR",
  "field": "componentStates[0].completed",
  "message": "Cannot mark already-completed component incomplete"
}
```

**FE Implementation Guide:**
1. Track component completion state locally (Redux/Context)
2. On page load, subscribe to component completion events
3. When all visible components indicate completion, call `CompletionService.submitPageCompletion(...)`
4. Update UI progress bar/badge to reflect response.completed
5. Enable "Next Page" button only when response.completed = true
6. Safe to call on every interaction (idempotent)

---

### 1.3 Interaction Logging Endpoint

**Purpose:** Log all user interactions (clicks, reveals, submissions, etc.) for analytics/LMS tracking.

```typescript
// src/services/CompletionService.ts (same service)

POST /api/v1/courses/{courseId}/interactions

// REQUEST
{
  "pageId": "page-001",
  "componentId": "comp-accordion-001",
  "interactionType": "reveal",  // ← Open string, not enum
  "learnerId": "learner-123",
  "data": {
    "interactionId": "section-1",
    "value": "user expanded section",
    "duration": 2.3,
    "isCorrect": null,
    "score": null
  },
  "completed": false
}

// RESPONSE
{
  "id": "interaction-abc123",
  "courseId": "course-001",
  "pageId": "page-001",
  "componentId": "comp-accordion-001",
  "learnerId": "learner-123",
  "interactionType": "reveal",
  "data": {
    "interactionId": "section-1",
    "value": "user expanded section",
    "duration": 2.3
  },
  "completed": false,
  "score": null,
  "maxScore": null,
  "createdAt": "2026-04-12T14:30:00Z"
}
```

**Key Behaviors:**
- ✅ **Open interactionType**: Not an enum! Use any string:
  - `view`, `click`, `submit`, `scroll`, `reveal`, `drag-drop`, `select`, `input`, `navigation`, ...
  - FE can invent new types without BE changes
- ✅ **Non-blocking**: If this endpoint fails (500), page progression continues (don't break UX)
- ✅ **Fire & forget**: Don't wait for response; use 202/ACCEPTED for async processing
- ✅ **Batch safe**: Rapid successive calls OK (100 interactions/sec acceptable)

**Common Interaction Types:**
```javascript
// Content/Navigation Interactions
"view"           // Page/component viewed
"click"          // Any clickable element activated
"scroll"         // Page scrolled past threshold
"reveal"         // Hidden content revealed (accordion, click-reveal)

// Assessment Interactions
"submit"         // Form/quiz submitted
"select"         // Option selected in dropdown/multi-select
"input"          // Text input field changed
"drag-drop"      // Drag-drop item placed

// Media Interactions
"audio-play"     // Audio started
"audio-pause"    // Audio paused
"audio-complete" // Audio finished
"video-play"     // Video started
"video-navigate" // User seeked video

// Advanced
"navigation"     // Page/section navigation
"search"         // Search executed
"sort"           // Data sorted in table
"filter"         // Filter applied
```

**Error Responses:**
```json
// 202 Accepted - Processing async, don't wait
{
  "code": "ACCEPTED",
  "message": "Interaction recorded, processing in background"
}

// 400 Bad Request - Missing required field
{
  "code": "VALIDATION_ERROR",
  "field": "interactionType",
  "message": "interactionType is required"
}

// 500 Internal Error - DB failure (safe to retry)
{
  "code": "INTERNAL_ERROR",
  "message": "Failed to write interaction to database",
  "details": { "suggestion": "Retry in 5 seconds" }
}
```

**FE Implementation Guide:**
1. Install event handler on all interactive elements:
   ```typescript
   import { CompletionService } from '@services/CompletionService';
   
   element.addEventListener('click', async (e) => {
     // Fire async call (don't await)
     CompletionService.recordInteraction({
       pageId, componentId, learnerId,
       interactionType: 'click',
       data: { interactionId: e.target.id, value: e.target.textContent }
     }).catch(err => console.warn('Interaction log failed (non-blocking):', err));
   });
   ```
2. Use `Promise.fire()` pattern (fire async, don't break UX on failure)
3. Batch rapid interactions if needed (e.g., debounce scroll events)
4. Don't retry manually; let network/browser handle retries

---

### 1.4 SCORM Export Endpoint

**Purpose:** Generate complete SCORM 1.2 ZIP package ready for LMS upload.

```typescript
// src/services/ExportService.ts

POST /api/v1/export/scorm/{courseId}?format=scorm_1_2

// RESPONSE: Binary ZIP stream
// Content-Type: application/zip
// Content-Disposition: attachment; filename="course-001-export.zip"

// ZIP Contents:
// ├── imsmanifest.xml          (SCORM 1.2 manifest)
// ├── index.html               (Player shell)
// ├── course_data.js           (Course configuration)
// ├── styles.css               (Theme CSS)
// ├── scorm_wrapper.js         (SCORM API bridge)
// └── asset_manifest.json      (Asset inventory)
```

**course_data.js Content (NEW fields as of Apr 15):**
```javascript
var courseData = {
  "courseId": "course-001",
  
  // ← NEW field (critical for versioning)
  "exportContractVersion": "2026-04-12.1",
  
  "exportDate": "2026-04-12T14:30:00Z",
  "title": "Course Title",
  
  // ← NEW field (must check before rendering unknown types)
  "supportedTemplateTypes": [
    "accordion", "tabs", "mcq", "true-false", "fill-in-blank",
    "flashcard", "scenario", "video", "image", "code-snippet",
    "timeline", "table", "metric", "counter", "list",
    "data-viz", "media-gallery", "carousel", "stepper", "breadcrumb",
    "modal", "tooltip", "popover", "notification", "progress-tracker",
    "drag-drop", "hotspot", "matching", "ranking", "essay-prompt",
    "audio-player", "pdf", "transcript", "closed-captions", "keyboard-nav",
    // ... 40+ types total
  ],
  
  "templates": [
    {
      "id": "comp-accordion-001",
      "type": "accordion",
      "title": "Introduction",
      "sections": [
        { "title": "What is this?", "content": "Lorem ipsum..." },
        { "title": "Why matters?", "content": "Lorem ipsum..." }
      ]
    },
    {
      "id": "comp-mcq-001",
      "type": "mcq",
      "title": "Knowledge Check",
      "questions": [
        {
          "id": "q-1",
          "text": "What is X?",
          "options": [
            { "id": "opt-a", "text": "Answer A", "correct": true },
            { "id": "opt-b", "text": "Answer B", "correct": false }
          ]
        }
      ]
    }
    // ... all template instances
  ]
};
```

**Player Runtime (index.html - REQUIRED for rendering):**
```html
<script>
var Player = {
  // ← Called for every template.type in courseData.templates
  getRenderer: function(type) {
    var registry = {
      'accordion':        this.renderAccordion,
      'tabs':            this.renderTabs,
      'mcq':             this.renderMCQ,
      'true-false':      this.renderTrueFalse,
      'fill-in-blank':   this.renderFillInBlank,
      'flashcard':       this.renderFlashcard,
      'scenario':        this.renderScenario,
      'video':           this.renderVideo,
      'image':           this.renderImage,
      'code-snippet':    this.renderCodeSnippet,
      // ... 30+ more types
    };
    
    // ← Fallback for unknown types (graceful degradation)
    return registry[type] || this.renderFallback;
  },
  
  renderAccordion: function(template) { /* ... */ },
  renderTabs: function(template) { /* ... */ },
  // ... renderer implementations
  
  renderFallback: function(template) {
    // Display content-only fallback
    var html = '<div class="content-fallback">';
    html += '<h3>' + template.title + '</h3>';
    html += '<p>Template type "' + template.type + '" not supported in this version.</p>';
    html += '</div>';
    return html;
  }
};
</script>
```

**Key Behaviors:**
- ✅ **Deterministic**: Same course = identical ZIP every export (save versioning)
- ✅ **SCORM 1.2 compliant**: Works in any LMS (Canvas, Blackboard, Moodle, Cornerstone)
- ✅ **Renderer dispatch**: Player.getRenderer(type) covers 40+ types
- ✅ **Fallback rendering**: Unknown types render content-only (no white screen)
- ✅ **CSS theming**: Custom CSS properties for branding
  ```css
  :root {
    --theme-primary: #007bff;
    --theme-secondary: #6c757d;
    --theme-success: #28a745;
    --theme-danger: #dc3545;
  }
  ```

**Error Responses:**
```json
// 200 OK - ZIP stream valid
Headers: Content-Type: application/zip

// 400 Bad Request - Invalid courseId format
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid courseId format"
}

// 404 Not Found - Course missing
{
  "code": "NOT_FOUND",
  "message": "Course 'invalid-id' not found"
}

// 422 Unprocessable - Unsupported template type
{
  "code": "VALIDATION_ERROR",
  "message": "Course contains unsupported template type: 'fancy-widget'",
  "details": {
    "unsupportedType": "fancy-widget",
    "suggestion": "Update course to use supported types only"
  }
}

// 503 Service Unavailable - ZIP generation failed
{
  "code": "INTERNAL_ERROR",
  "message": "Failed to generate SCORM package"
}
```

**FE Implementation Guide:**
1. Call `ExportService.exportScorm(courseId)` on user "Download SCORM" action
2. Handle response as blob download:
   ```typescript
   const blob = await ExportService.exportScorm(courseId);
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `course-${courseId}-export.zip`;
   a.click();
   ```
3. **Validate contract version** before consuming:
   ```typescript
   // After unzipping, parse course_data.js
   const minVersion = '2026-04-12.1';
   if (compareVersions(courseData.exportContractVersion, minVersion) < 0) {
     throw new Error('Exported package too old, re-export required');
   }
   ```
4. Check `supportedTemplateTypes` before rendering unknown templates:
   ```typescript
   for (const template of courseData.templates) {
     if (!courseData.supportedTemplateTypes.includes(template.type)) {
       console.warn(`Unsupported template type: ${template.type}`);
       // Trigger fallback renderer
     }
   }
   ```

---

## 2. ERROR HANDLING STANDARD

**All error responses follow this unified envelope (as of Apr 22):**

```json
{
  "code": "ERROR_CODE_CONSTANT",
  "field": "path.to.field",              // Optional, field-level errors
  "message": "Human-readable summary",
  "details": {                           // Optional, extended debug info
    "attempted": "what we tried",
    "reason": "why it failed",
    "suggestion": "what to try next"
  }
}
```

### Error Code Reference

| Code | HTTP | Meaning | FE Handler |
|------|------|---------|-----------|
| `VALIDATION_ERROR` | 400 | Bad request payload | Show form validation toast |
| `INVALID_JSON` | 400 | Malformed JSON | Retry with valid JSON |
| `NOT_FOUND` | 404 | Resource missing | Show "not found" error page |
| `PERMISSION_ERROR` | 403 | Learner not enrolled | Redirect to enrollment |
| `STATE_ERROR` | 409 | Invalid state transition | Block action, show reason |
| `UNSUPPORTED_TYPE` | 422 | Template type unknown | Trigger fallback renderer |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Exponential backoff retry |
| `INTERNAL_ERROR` | 500 | Server failure | Show generic error, offer reload |

### FE Error Handler Pattern

```typescript
// src/services/errorHandler.ts

export function handleApiError(error: AxiosError) {
  if (!error.response) {
    // Network error
    return { type: 'network', message: 'Connection failed' };
  }
  
  const { code, field, message, details } = error.response.data;
  const status = error.response.status;
  
  switch (code) {
    case 'VALIDATION_ERROR':
      // Show field-level error in form
      return { type: 'validation', field, message: message || details?.suggestion };
      
    case 'NOT_FOUND':
      // Redirect or show not-found page
      return { type: 'not-found', message };
      
    case 'PERMISSION_ERROR':
      // Redirect to enrollment
      return { type: 'permission', message };
      
    case 'STATE_ERROR':
      // Block action, explain reason
      return { type: 'state', message: details?.reason };
      
    case 'RATE_LIMIT_EXCEEDED':
      // Exponential backoff
      return { type: 'rate-limit', retryAfter: 5000 };
      
    case 'INTERNAL_ERROR':
    default:
      // Generic error
      return { type: 'error', message: 'Something went wrong. Please try again.' };
  }
}

// Usage in components
try {
  await api.submitAnswers(answers);
} catch (error) {
  const handled = handleApiError(error);
  showToast(handled.message, 'error');
}
```

---

## 3. SUPPORTED TEMPLATE TYPES (40+)

**Backend guarantees support for these types in SCORM exports:**

### Content Templates (7 types)
- `text` — Plain text content
- `rich-text` — Formatted text (bold, italic, lists)
- `image` — Static image display
- `video` — Video player (MP4, WebM)
- `code-snippet` — Code block with syntax highlighting
- `pdf` — Embedded PDF viewer
- `audio` — Audio player (MP3, WAV)

### Interactive Templates (6 types)
- `mcq` — Multiple choice question
- `true-false` — True/false question
- `fill-in-blank` — Text input question
- `drag-drop` — Drag-drop matching
- `hotspot` — Click-on-image interactions
- `matching` — Match pairs/columns

### Navigation Templates (6 types)
- `accordion` — Expandable sections
- `tabs` — Tabbed content switcher
- `stepper` — Step-by-step progression
- `slider` — Image/content slider carousel
- `carousel` — Rotating content carousel
- `breadcrumb` — Navigation breadcrumb trail

### Data Display Templates (5 types)
- `table` — Data table with sorting/filtering
- `data-viz` — Charts (bar, line, pie)
- `metric` — KPI/metric display (large number)
- `counter` — Animated counter
- `timeline` — Chronological timeline

### Assessment Templates (5 types)
- `scenario` — Branching scenario/simulation
- `flashcard` — Front/back flashcard
- `essay-prompt` — Long-form text prompt
- `ranking` — Rank items in order
- `knowledge-check` — Quick quiz

### Media Template (2 types)
- `audio-player` — Advanced audio controls
- `video-player` — Advanced video controls

### Accessibility Templates (4 types)
- `transcript` — Text transcript of audio/video
- `closed-captions` — Video captions
- `audio-description` — Alternate audio description
- `keyboard-nav` — Keyboard shortcut help

### Utility Templates (5 types)
- `modal` — Pop-up dialog
- `tooltip` — Hover tooltip
- `popover` — Pop-over info box
- `notification` — Alert notification banner
- `progress-tracker` — Course progress visualization

**Total: 40+ types**

**Important:** If a template type is missing from `courseData.supportedTemplateTypes[]`, check with backend and consider fallback rendering.

---

## 4. PHASE 1 IMPLEMENTATION ROADMAP (MVP - Week 1-2)

### Phase 1 Priority (Ship by Apr 26)

#### A. Navigation Components
- [ ] Accordion component (use locked template from export-runtime/)
- [ ] Tabs component (use locked template from export-runtime/)
- [ ] Progress bar/badge (show page completion %)

#### B. Assessment Components
- [ ] MCQ component (single selection)
- [ ] True/False component
- [ ] Form submission → ScoringService.calculateScore()
- [ ] Score display (totalScore / maxScore, pass/fail badge)

#### C. Flow Integration
- [ ] Page completion detection → CompletionService.submitPageCompletion()
- [ ] Interaction logging → CompletionService.recordInteraction()
- [ ] Navigate to next page on completion
- [ ] Persist scores/completion states

#### D. Error Handling
- [ ] Display validation errors (field-level)
- [ ] Retry logic for 5xx errors
- [ ] Show "not found" page (404)
- [ ] Show generic error toast (500)

### Phase 1 Testing
- [ ] Unit tests for ScoringService request/response
- [ ] Unit tests for CompletionService request/response
- [ ] Integration test: End-to-end accordion → submit → next page
- [ ] Error test: Invalid componentId → VALIDATION_ERROR handling

### Phase 1 Success Criteria
- ✅ All 4 endpoints integrated (can call from UI)
- ✅ No TypeScript errors (type-check passes)
- ✅ Phase 1 component tests passing (4+)
- ✅ Valid SCORM ZIP generates with Phase 1 components
- ✅ Sample packages downloaded & validated (Apr 19)

---

## 5. CRITICAL ACTION ITEMS (For You)

### Before Apr 15 (This Week)
- [ ] **Read this document** with full team
- [ ] **Validate TypeScript contracts** match backend models (see Section 1)
  - Compare to `src/types/course.ts`
  - Update any mismatches
- [ ] **Sketch Phase 1 components** in Figma/wireframe
  - Accordion with scoring
  - MCQ form with submit button
  - Progress bar
- [ ] **Create branch** for Phase 1 work (e.g., `phase-1-scorm-integration`)

### Apr 15-19 (Sample Week)
- [ ] **Download sample packages** from BE (when delivered)
- [ ] **Extract & analyze** course_data.js
  - Check exportContractVersion field exists ✅
  - Check supportedTemplateTypes array exists ✅
  - Check Player.getRenderer dispatch exists ✅
- [ ] **Verify Player.getRenderer()** for Phase 1 types:
  - `accordion`, `tabs`, `mcq`, `true-false` must be in registry
- [ ] **Start Phase 1 development** with locked endpoints

### Apr 19-26 (MVP Week)
- [ ] **Implement Phase 1 components** (accordion, tabs, MCQ)
- [ ] **Integrate ScoringService** (POST /scoring/calculate)
- [ ] **Integrate CompletionService** (POST /completion + POST /interactions)
- [ ] **Error handling** (catch 400/404/500, show UI toasts)
- [ ] **Test with sample packages** (download, extract, verify rendering)
- [ ] **Deploy to staging** for QA
- [ ] **Ship Phase 1 MVP**

---

## 6. API INTEGRATION CHECKLIST

### Endpoint Integration (All 4)

- [ ] **ScoringService**
  - [ ] Implement `calculateScore(courseId, request: ScoreCalculateRequest): Promise<ScoreCalculateResponse>`
  - [ ] Handle VALIDATION_ERROR (invalid answer structure)
  - [ ] Handle NOT_FOUND (course missing)
  - [ ] Display score response on UI

- [ ] **CompletionService**
  - [ ] Implement `submitPageCompletion(courseId, pageId, payload: PageCompletionRequest): Promise<PageCompletionResponse>`
  - [ ] Handle VALIDATION_ERROR (missing componentId)
  - [ ] Handle STATE_ERROR (invalid state transition)
  - [ ] Block "Next" button until response.completed = true

- [ ] **CompletionService (Interactions)**
  - [ ] Implement `recordInteraction(courseId, request: InteractionRequest): Promise<InteractionResponse>`
  - [ ] Fire async (don't await on page interactions)
  - [ ] Handle 500 gracefully (non-blocking)
  - [ ] Log all component interactions (click, reveal, submit, etc.)

- [ ] **ExportService**
  - [ ] Implement `exportScorm(courseId): Promise<Blob>`
  - [ ] Validate exportContractVersion (≥2026-04-12.1)
  - [ ] Check supportedTemplateTypes before rendering
  - [ ] Download ZIP blob to user machine

### TypeScript Contracts

- [ ] **src/types/course.ts** updated
  - [ ] `ScoreCalculateRequest` with answers[]
  - [ ] `ScoreCalculateResponse` with totalScore, componentResults[]
  - [ ] `PageCompletionRequest` with componentStates[]
  - [ ] `PageCompletionResponse` with completed flag & strategy
  - [ ] `InteractionRequest` with interactionType (open string)
  - [ ] `InteractionResponse` with id & createdAt

### Error Handling

- [ ] Error envelope parser (Section 2)
- [ ] Display VALIDATION_ERROR on form fields
- [ ] Redirect on PERMISSION_ERROR (403)
- [ ] Show "not found" on NOT_FOUND (404)
- [ ] Show generic toast on INTERNAL_ERROR (500)
- [ ] Exponential backoff on RATE_LIMIT_EXCEEDED (429)

---

## 7. BLOCKERS & DEPENDENCIES

### You're Blocked Until:
1. **Apr 15** — exportContractVersion + supportedTemplateTypes fields live (BE P0)
2. **Apr 19** — Sample SCORM packages delivered (BE P0)

**What to do in the meantime:**
- Code against locked contract (Section 1) with confidence
- Write unit tests using mock responses
- Build Phase 1 components (accordion, tabs, MCQ)
- Set up service layer classes (no external calls yet)

### You Must Deliver:
1. **Apr 26** — Phase 1 MVP (accordion, tabs, MCQ, progress)
2. **Apr 20** — Contract smoke tests (verify endpoint shapes match)
3. **Apr 25** — Error envelope adoption (handle new error format)

---

## 8. PHASE 2 & 3 ROADMAP (Context Only)

### Phase 2 (Weeks 3-4): Extended Content
- Flashcard component
- Branching scenario renderer
- Video/media playback
- Data table with sorting

### Phase 3 (Weeks 5-6): Polish & Release
- Accessibility hardening (ARIA, keyboard nav)
- Performance optimization (lazy load, code split)
- Full test suite (unit + integration + e2e)
- Cross-browser validation

---

## 9. QUICK REFERENCE: What Changed from Initial Analysis

| Item | Initial Plan | Final Contract | Impact |
|------|------|------|--------|
| Scoring endpoint | Unclear (slide-level vs course-level) | ✅ Locked: `POST /courses/{courseId}/scoring/calculate` (course-level aggregate) | Safe for multi-component pages |
| Completion endpoint | Unclear | ✅ Locked: `POST /courses/{courseId}/pages/{pageId}/completion` with strategy evaluation | Flexible completion rules (all/any/percentage) |
| Export versioning | None | ✅ exportContractVersion + supportedTemplateTypes in course_data.js (as of Apr 15) | Can detect package staleness |
| Error envelope | Generic | ✅ Standardized: code + field + message + details | Unified FE error handling |
| Sample packages | Pending | ✅ Confirmed Apr 19 delivery (assessment + branching examples) | Concrete implementation reference |

---

## 10. SIGN-OFF: YOUR ACCEPTANCE BLOCK

**This document is ready for your implementation. Sign below to confirm:**

### Frontend AI Developer Acceptance

- [ ] I have read and understood the 4 canonical endpoints (Section 1)
- [ ] I have reviewed error handling standard (Section 2)
- [ ] I understand Phase 1 deliverables (Section 4)
- [ ] I am ready to begin Phase 1 implementation (approve all checkboxes above)
- [ ] Backend commitments are clear (Apr 15 fields, Apr 19 samples)

**Printed Name:** ________________________

**Date:** ________________________

**Timeline Commitment:**
- [ ] Phase 1 MVP ready by Apr 26
- [ ] Weekly syncs attended (Wednesdays, 2 PM UTC)
- [ ] Blockers flagged immediately to TPO

---

## 11. SUPPORT & ESCALATION

**Questions on contract?**
→ Post to [shared channel] with tag `#contract-question`  
→ TPO or Backend AI Dev responds within 4 hours

**Blocker during development?**
→ Tag TPO in [shared channel]  
→ Escalate if blocking progress more than 1 hour

**Weekly Sync (Wednesdays, 2 PM UTC):**
- **Attendees:** FE AI Dev, BE AI Dev, TPO
- **Duration:** 30 min
- **Topics:** Phase progress, blockers, questions
- **First Sync:** Apr 15 (validate sample packages)

---

## 12. APPENDIX: Common Implementation Patterns

### Pattern 1: Submit Answers & Get Score

```typescript
// In your MCQ/Assessment component

async function handleSubmit(answers: ComponentAnswer[]) {
  try {
    const response = await ScoringService.calculateScore(courseId, {
      answers,
      attemptNumber: 1
    });
    
    // Display score
    setScore(response.totalScore);
    setBadge(response.passed ? 'PASS' : 'FAIL');
    setDetails(response.componentResults);
    
    // Send completion event
    await CompletionService.submitPageCompletion(courseId, pageId, {
      componentStates: [{
        componentId: 'comp-mcq-001',
        completed: response.passed,
        score: response.totalScore
      }]
    });
    
    // Enable next button
    setCanProceed(true);
    
  } catch (error) {
    const handled = handleApiError(error);
    showToast(handled.message, 'error');
  }
}
```

### Pattern 2: Log Interactions Async (Fire & Forget)

```typescript
// In your accordion/tabs component

function handleAccordionToggle(sectionId: string, isOpen: boolean) {
  // Update UI immediately
  setOpenSections(prev => ({...prev, [sectionId]: isOpen}));
  
  // Log interaction async (don't wait)
  CompletionService.recordInteraction({
    pageId, componentId, learnerId,
    interactionType: 'reveal',
    data: {
      interactionId: sectionId,
      value: isOpen ? 'expanded' : 'collapsed'
    },
    completed: false
  }).catch(err => {
    // Fail silently (non-blocking)
    console.warn('Interaction log failed:', err);
  });
}
```

### Pattern 3: Validate Export Before Rendering

```typescript
// When user downloads SCORM package

async function handleExport() {
  const blob = await ExportService.exportScorm(courseId);
  
  // Unzip & validate
  const zip = await JSZip.loadAsync(blob);
  const courseDataText = await zip.file('course_data.js').async('text');
  const courseData = JSON.parse(courseDataText.replace('var courseData = ', ''));
  
  // Check contract version
  const minVersion = '2026-04-12.1';
  if (!courseData.exportContractVersion || 
      compareVersions(courseData.exportContractVersion, minVersion) < 0) {
    showToast('Package is too old. Please re-export.', 'error');
    return;
  }
  
  // Check supported types
  const unsupported = courseData.templates
    .filter(t => !courseData.supportedTemplateTypes.includes(t.type))
    .map(t => t.type);
  
  if (unsupported.length > 0) {
    console.warn('Unsupported types:', unsupported);
    // Still render (fallback for unknown types)
  }
  
  // Download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `course-${courseId}-export.zip`;
  a.click();
}
```

---

## 13. DOCUMENT METADATA

| Property | Value |
|----------|-------|
| **Document** | FRONTEND_AI_DEVELOPER_IMPLEMENTATION_BRIEF_2026-04-12.md |
| **Authority** | Backend AI Developer + TPO (Joint Contract Lock) |
| **Status** | ✅ APPROVED FOR IMPLEMENTATION |
| **Effective Date** | April 12, 2026 |
| **Next Sync** | April 15, 2026, 2 PM UTC |
| **Sample Delivery** | April 19, 2026 |
| **MVP Due** | April 26, 2026 |

---

**You are approved to begin Phase 1 implementation immediately.**

**Timeline:** 
- ✅ Contracts locked (today)
- ⏳ Sample packages (Apr 19)
- ⏳ MVP ship (Apr 26)

**Questions?** Tag TPO in [shared channel].

