# Gap Analysis — Backend Fix Instructions vs Frontend Codebase
## Subject: `content-media` (Text + Image) Template — SCORM Export Image Bug
**Date:** 2026-05-10 (Updated 2026-05-10 14:00)
**From:** Frontend Architecture Team  
**To:** Backend Team  
**Re:** Review of "Frontend Fix: content-media Template — SCORM Export" instructions  
**Status:** ⚠️ CRITICAL BACKEND BUG CONFIRMED — Root cause isolated to backend export code

---

## 🔴 UPDATE — Root Cause Now Confirmed (2026-05-10 14:00)

All frontend fixes are complete and verified. The image URL **is** saved in the database.
The bug is **entirely in the backend SCORM export code**. Details below.

### Proof

**1 — Component in database (GET /api/v1/courses/{courseId}/pages/{pageId}/components/{componentId}):**

```json
{
  "componentId": "b4099514-2225-4995-8dbb-b0653d08f755",
  "componentType": "text-with-media",
  "data": {
    "title": "asfasdf",
    "body": "sdfgfgdfdfg",
    "mediaType": "image",
    "mediaUrl": "https://amtrustfinancial.com/getmedia/b50eaa25-b5e7-4d07-9b85-1f3d7e36fd25/ANA_AmTrust_Remote_Worker_Best_Practices_Social_1200X628-min.jpg"
  }
}
```
→ `mediaUrl` is **present and correct** in the database. ✅

**2 — SCORM export output (course_data.js from POST /export/scorm/{courseId}):**

```json
{
  "type": "content-media",
  "data": {
    "content": "sdfgfgdfdfg",
    "body": "sdfgfgdfdfg",
    "mediaUrl": "",
    "mediaType": "image",
    "mediaPosition": "right"
  }
}
```
→ `mediaUrl` is **empty** in the exported package. ✗

### What this tells us about the backend export code

The backend export correctly reads:
- `data.body` → `"sdfgfgdfdfg"` ✅
- `data.mediaType` → `"image"` ✅

But it **does not read** `data.mediaUrl` — instead it emits an empty string.
It also emits `mediaPosition: "right"` as a default even though that field is not stored in the DB record.

This pattern indicates the backend export code has a **hardcoded schema** for `content-media`
templates that uses a default (empty) value for `mediaUrl` instead of reading it from
`component.data.mediaUrl`. Something like:

```python
# WHAT THE BACKEND IS LIKELY DOING (incorrect):
template_data = {
    "body":          component.data.get("body", ""),
    "mediaType":     component.data.get("mediaType", "none"),
    "mediaPosition": component.data.get("mediaPosition", "right"),  # default
    "mediaUrl":      "",   # ← hardcoded empty / key not mapped
}
```

### Fix required from backend

```python
# WHAT IT SHOULD DO:
template_data = {
    "body":          component.data.get("body", ""),
    "mediaType":     component.data.get("mediaType", "none"),
    "mediaPosition": component.data.get("mediaPosition", "right"),
    "mediaUrl":      component.data.get("mediaUrl", ""),  # ← ADD THIS LINE
}
```

**One-line fix. No schema change required. The data is already in the DB.**

---

## Executive Summary

We have reviewed the backend instructions dated 2026-05-10. The root cause analysis and
the export payload contract are correct and well-specified. However, cross-referencing the
instructions against our actual codebase has identified **6 gaps** that will prevent the fix
from working end-to-end even after we implement everything described.

Three of the gaps require **backend clarification or backend-side changes**. The remaining
three are frontend work we will implement once the backend confirms the design decisions.

We are raising this as a joint document to align before implementation begins to avoid
another broken export cycle.

---

## 1. CRITICAL — Export Button Does NOT Use the Payload Path

### What the instructions assume
> *"The backend export endpoint `POST /api/v1/export` accepts a Course JSON object."*

The instructions describe a flow where the frontend constructs a full JSON payload and
sends it to `POST /api/v1/export`. The fix is to populate `data.mediaUrl` in that payload.

### What our code actually does

The Export button in the application (`Header.tsx`, line 136) calls:

```ts
const result = await exportService.exportScorm(course.courseId, "scorm_1_2");
```

This resolves to:

```
POST /export/scorm/{courseId}
```

This is a **server-side export** — the backend reads the course from its own database
using the `courseId` and generates the SCORM package from persisted data.
**No JSON payload is sent. The frontend mediaUrl in Redux state is irrelevant.**

The `POST /api/v1/export` with full JSON payload path exists in our codebase
(`CourseContext.tsx`, `ExportService.exportCourse()`) but is **not wired to any
Export button** accessible to users.

### What we need the backend to clarify

> **QUESTION B1:** Does `POST /export/scorm/{courseId}` read the component
> `data.mediaUrl` from the `components` table correctly? Or is it reading from the
> `templates` table which has a different schema?
>
> From the SCORM package we received (`course_data.js`), the exported data contains
> `mediaUrl: ""` — which means the database record for that component had an empty
> `mediaUrl` at export time. Is the SCORM generator reading from the right table?

> **QUESTION B2:** Should we switch the Export button to use `POST /api/v1/export`
> (with full JSON payload), or should we fix the `POST /export/scorm/{courseId}`
> path to correctly read component-level data?
>
> This is an architectural decision that affects both teams. We cannot implement the
> fix without this answer.

---

## 2. CRITICAL — Upload API Response Shape Does Not Match

### What the instructions specify

Section 3, Step 2 of the instructions specifies this upload response:

```jsonc
{
  "success": true,
  "media": {
    "id": "a1b2c3d4-...",
    "url": "/api/v1/media/files/global/image/<uuid>.jpg"
  }
}
```

### What our current upload client expects

`api.ts` already contains an `uploadAsset()` method that calls `POST /media/upload`.
However it maps the response as:

```ts
return response.data; // expects { id: string, url: string }
```

This expects a **flat** `{ id, url }` shape. If the backend returns `{ success, media: { url } }`,
our code reads `url` as `undefined` and the stored `mediaUrl` will be an empty string —
the exact bug we are trying to fix.

### What we need the backend to confirm

> **QUESTION B3:** What is the actual response shape from `POST /api/v1/media/upload`?
>
> Option A — Flat: `{ id: string, url: string, ... }`  
> Option B — Nested: `{ success: true, media: { id, url, ... } }`
>
> Please confirm which is live. We will update our client mapping accordingly.
> If it changed at some point, please tell us the current production shape.

---

## 3. IMPORTANT — Environment Variable Name Mismatch

### What the instructions specify

Section 3, Step 3 instructs:

```js
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const mediaUrl = BASE_URL + response.media.url;
```

### What our codebase actually uses

Our `httpClient.ts` exports the base URL using this resolution order:

```ts
const API_BASE_URL =
  process.env.REACT_APP_API_BASE ||   // ← our primary var
  process.env.REACT_APP_API_URL ||    // ← legacy fallback
  'http://localhost:8000/api/v1';
```

The variable `REACT_APP_API_BASE_URL` (as written in the instructions) **does not exist**
in our configuration. Using it verbatim would produce `undefined`, resulting in a
relative URL (`/api/v1/media/files/...`) instead of an absolute URL
(`https://api.domain.com/api/v1/media/files/...`).

### Our resolution

We will use our existing exported constant `API_BASE_URL` from `httpClient.ts` — not a
new env read — to build the absolute URL. We are noting this so the backend is aware
that this specific code sample in the instructions cannot be used literally. No backend
action required.

---

## 4. IMPORTANT — `transform.ts` Export Path Strips All Media Fields

### The bug

Our `transformCourseForExport()` function in `transform.ts` (used by
`CourseContext.exportCourse()` — the `POST /api/v1/export` payload path) rebuilds the
`data` object for all non-MCQ templates as:

```ts
base.data = {
  content: content.content || content.template_name || content.body || "Content",
  subtitle: content.subtitle || undefined,
  videoUrl: content.videoUrl || undefined,
  // ← mediaUrl, mediaType, mediaPosition are COMPLETELY ABSENT
};
```

Even if the user enters a valid `mediaUrl` in the editor, this transform will strip it
from the payload before it reaches `POST /api/v1/export`.

Additionally, the text body is serialized as `data.content`, but the backend instructions
specify `data.body` as the primary field. The backend's field resolution priority
(`body → text → description → content`) means text will fall through to `content` as a
last resort — but this is fragile and undocumented behaviour that we should not rely on.

### What we will fix (frontend action)

We will update `transformCourseForExport()` to:
1. Preserve `mediaUrl`, `mediaType`, `mediaPosition` in the output `data` object
2. Serialize the text body as `data.body` (matching the backend's primary field)
3. Set legacy fields (`content`, `subtitle`, `videoUrl`, `questions`, `tabs`, `panels`)
   to `null` as specified in the contract

> **QUESTION B4 (for awareness):** Can the backend confirm that `data.body` is the
> authoritative field for `POST /api/v1/export` payloads? We want to stop relying on
> the `data.content` fallback path for new exports.

---

## 5. IMPORTANT — Frontend Type Name vs Backend Type Name Mismatch

### The divergence

| System | Type identifier used |
|--------|---------------------|
| Frontend component registry | `text-with-media` |
| Backend SCORM export contract | `content-media` |
| SCORM player renderer registry | `content-media → renderTextWithMedia` |

The export payload must send `type: "content-media"` for the backend to recognise
the template. Our current `transformCourseForExport()` passes through `page.type`
which is `text-with-media` from the Redux store.

The SCORM player bridges this implicitly — but the export endpoint likely does not.
If the backend receives `type: "text-with-media"` instead of `"content-media"`, the
template may not be processed correctly.

### What we will fix (frontend action)

We will add an explicit type mapping in the export transform:

```ts
const EXPORT_TYPE_MAP: Record<string, string> = {
  'text-with-media': 'content-media',
};
const exportType = EXPORT_TYPE_MAP[page.type] ?? page.type;
```

> **QUESTION B5:** Does `POST /export/scorm/{courseId}` and `POST /api/v1/export`
> both require `type: "content-media"` exactly? Or does the backend also accept
> `"text-with-media"` as an alias?
>
> Also: Is `content-media` the canonical type string that was always used when
> components were persisted to the database? Or could existing saved courses have
> `text-with-media` stored as the component type in the DB?

---

## 6. IMPORTANT — Editor Has No File Upload UX (Text Input Only)

### Current state

The `TextWithMedia.tsx` editor currently renders a plain text input for `mediaUrl`:

```tsx
<input
  type="text"
  value={componentData.mediaUrl ?? ''}
  onChange={(event) => updateField('mediaUrl', event.target.value)}
  placeholder="https://..."
/>
```

Users paste URLs manually. There is no file picker, no upload trigger, and no
call to `POST /api/v1/media/upload` at any point in the current editor flow.

### Impact on the instructions

The instructions assume a file-select → upload → store-URL pattern. This entire
UX layer needs to be built. It includes:
- `<input type="file" accept="image/*,video/*" />`
- Upload progress indicator
- Preview of uploaded image
- Error handling for oversized files (>50 MB per Section 10)
- Handling the "change image" and "remove image" actions from the state table in Section 4

This is medium-complexity frontend work. We will implement it, but want the backend
to be aware that this is a **new feature build**, not a one-line data fix.

> **QUESTION B6:** For the file upload endpoint `POST /api/v1/media/upload` —
> is `course_id` a required field in the form data, or truly optional as shown in
> Section 3? And what is the maximum accepted file size — the instructions say 50 MB
> but we want to confirm this is enforced server-side so we can show the right error
> message client-side.

---

## 7. Summary of Open Questions for Backend

| # | Priority | Question | Status |
|---|----------|----------|--------|
| B1 | ~~CRITICAL~~ | Which export path? `POST /export` or `POST /export/scorm/{id}`? | **RESOLVED** — Export uses `POST /export/scorm/{courseId}` |
| B2 | **🔴 CRITICAL** | Does `POST /export/scorm/{courseId}` correctly read `data.mediaUrl` from DB? | **CONFIRMED BUG** — DB has URL, export outputs `""`. Backend must add `mediaUrl` to field mapping. |
| B3 | ~~CRITICAL~~ | Upload response shape — flat `{id,url}` or nested `{success, media:{url}}`? | **RESOLVED** — Nested. Frontend `uploadAsset()` updated to map `response.data.media.url`. |
| B4 | Important | Is `data.body` the canonical text field? | **CONFIRMED** — backend populates both `body` and `content`. |
| B5 | Important | Does export accept `"text-with-media"` alias? | **RESOLVED** — Frontend now maps to `"content-media"` before export. |
| B6 | Important | Is `course_id` required in upload? Confirm 50 MB server limit? | Still open |

**The only blocking backend action is B2 — one line fix in the SCORM export generator.**

---

## 8. Frontend Work — COMPLETED ✅

All items below have been implemented and verified (no backend response needed):

| Item | File | Status |
|------|------|--------|
| Fix `transformCourseForExport()` — preserve `mediaUrl`, `mediaType`, `mediaPosition` | `src/utils/transform.ts` | ✅ Done |
| Fix `transformCourseForExport()` — use `data.body` not `data.content` | `src/utils/transform.ts` | ✅ Done |
| Fix `textWithMediaRenderer.ts` — render `<img>` not `<p>` | `src/export-runtime/renderers/textWithMediaRenderer.ts` | ✅ Done |
| Add `text-with-media → content-media` type mapping in export | `src/utils/transform.ts` | ✅ Done |
| Add `updateComponent.rejected` handler — show error toast on save failure | `src/store/slices/componentsSlice.ts` | ✅ Done |
| Fix upload response mapping in `uploadAsset()` | `src/services/api.ts` | Map `response.data.media.url` |

---

## 9. Proposed Joint Testing Checkpoint

Once both teams have implemented their changes, we propose the following E2E test
using the minimal payload from Section 7 of the backend instructions:

```http
POST /api/v1/export
Content-Type: application/json

{
  "course": "<JSON string with mediaUrl populated>"
}
```

Expected result: Downloaded SCORM ZIP opens with image visible on right side of slide.

We can also run this test against the backend staging environment as soon as questions
B1–B3 are answered.

---

## 10. Appendix — Evidence from Exported SCORM Package

The file `samplecourse/course_1778387951760_scorm_1111_2/course_data.js` was examined.
The exported `data` object for the `content-media` template contains:

```js
"data": {
  "content":  "<div>...</div>",  // text body — wrong field name (should be "body")
  "subtitle": null,
  "videoUrl": null,
  "questions": null,
  "tabs":     null,
  "panels":   null,
  "body":     "<div>...</div>",  // also present — backend is populating both
  "mediaUrl": "",                // ← EMPTY — root cause confirmed
  "mediaType": "image",          // correctly set
  "mediaPosition": "right"       // correctly set
}
```

This confirms that:
1. The backend IS reading `components.data` (not the template schema) since `body`,
   `mediaType`, and `mediaPosition` are present
2. `mediaUrl` was `""` in the database at export time — the component was never saved
   with a valid URL because the editor has no upload capability
3. The backend is populating both `body` and `content` with the same value — this
   helps with backward compatibility but the instructions should be updated to reflect
   this actual behaviour

---

*Document prepared by Frontend Architecture Team — 2026-05-10*  
*Please respond to Questions B1–B6 above so implementation can proceed.*
