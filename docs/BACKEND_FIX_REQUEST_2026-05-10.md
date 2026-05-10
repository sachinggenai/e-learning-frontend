# Backend Fix Request — SCORM Export Issues
**Date:** 2026-05-10  
**Priority:** 🔴 CRITICAL — Blocker  
**From:** Frontend Team  
**To:** Backend Team  
**Affects:** `POST /export/scorm/{courseId}`

---

## Summary

Two issues in the SCORM export generator need to be fixed:

1. **`mediaUrl` not read from DB** — `content-media` templates always export `"mediaUrl": ""` even though the URL is correctly stored in the database. Image never shows.
2. **`.template` CSS `max-width: 800px`** — The generated `styles.css` constrains all templates to 800px width, preventing them from filling the slide area.

**Both are small backend fixes in the export generator.**

---

## Proof

### 1. Database Record (confirmed via API — 2026-05-10 09:00 UTC)

```
GET /api/v1/courses/course_1778403562385/pages/d422b214-03a1-4d06-9432-ff6c2a6617cb/components/b4099514-2225-4995-8dbb-b0653d08f755
```

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

✅ `mediaUrl` is **present and non-empty** in the database.

---

### 2. SCORM Export Output (from ZIP exported at 2026-05-10 09:00 UTC)

File: `course_1778403562385_scorm_1_2.zip` → `course_data.js`

```json
{
  "id": "b4099514-2225-4995-8dbb-b0653d08f755",
  "type": "content-media",
  "data": {
    "content": "sdfgfgdfdfg",
    "body":    "sdfgfgdfdfg",
    "mediaUrl": "",
    "mediaType": "image",
    "mediaPosition": "right"
  }
}
```

❌ `mediaUrl` is **empty string** in the exported package.

---

### 3. What the export correctly reads vs what it misses

| Field | In DB | In Export | Reading correctly? |
|-------|-------|-----------|-------------------|
| `body` | `"sdfgfgdfdfg"` | `"sdfgfgdfdfg"` | ✅ Yes |
| `mediaType` | `"image"` | `"image"` | ✅ Yes |
| `mediaUrl` | `"https://amtrustfinancial.com/..."` | `""` | ❌ **No — missing** |
| `mediaPosition` | *(not stored in DB)* | `"right"` | ⚠️ Default used |

The export reads `body` and `mediaType` from `component.data` correctly, but `mediaUrl` is being emitted as an empty string (either hardcoded or using a default that overrides the actual value).

---

## Root Cause Hypothesis

In the backend code that constructs the `course_data.js` payload for `content-media` templates, `mediaUrl` is likely not included in the field mapping. Something equivalent to:

```python
# Current (incorrect) — mediaUrl key is missing from the mapping:
template_data = {
    "body":          component.data.get("body", ""),
    "content":       component.data.get("body", ""),   # duplicated for compat
    "mediaType":     component.data.get("mediaType", "none"),
    "mediaPosition": component.data.get("mediaPosition", "right"),
    # "mediaUrl" is never set → defaults to "" somewhere in the pipeline
}
```

---

## Fix Required

Add `mediaUrl` to the `content-media` field mapping in the SCORM export generator:

```python
# Add this one line:
"mediaUrl": component.data.get("mediaUrl", ""),
```

Full corrected block:

```python
template_data = {
    "body":          component.data.get("body", ""),
    "content":       component.data.get("body", ""),
    "mediaType":     component.data.get("mediaType", "none"),
    "mediaPosition": component.data.get("mediaPosition", "right"),
    "mediaUrl":      component.data.get("mediaUrl", ""),   # ← ADD THIS
}
```

**No database migration, no schema change, no frontend change needed.** The URL is already stored correctly in `components.data.mediaUrl`.

---

## How to Verify After Fix

1. Export course `course_1778403562385` via `POST /export/scorm/course_1778403562385`
2. Unzip the downloaded file
3. Open `course_data.js`
4. Check that `templates[0].data.mediaUrl` equals:
   ```
   https://amtrustfinancial.com/getmedia/b50eaa25-b5e7-4d07-9b85-1f3d7e36fd25/ANA_AmTrust_Remote_Worker_Best_Practices_Social_1200X628-min.jpg
   ```
5. Open `index.html` in a browser — the image should appear on the right side of the slide

---

## Fix #2 — `.template` CSS `max-width: 800px` (styles.css)

### Problem

The `styles.css` embedded in every SCORM ZIP contains:

```css
.template { max-width: 800px; margin: 0 auto; line-height: 1.6; }
```

This constrains all template content to 800px wide, leaving large empty margins and preventing full-width layouts (especially the image in `text-with-media`).

### Fix Required

In the backend's SCORM CSS template/generator, change the `.template` rule:

```css
/* Before (incorrect): */
.template { max-width: 800px; margin: 0 auto; line-height: 1.6; }

/* After (correct): */
.template { width: 100%; margin: 0 auto; line-height: 1.6; box-sizing: border-box; }
```

---

## Frontend Status (for reference)

All frontend fixes are complete. The image URL is being saved to the DB correctly on every edit. The frontend is not the source of this bug.

| Frontend Fix | Status |
|---|---|
| File picker + image upload UX | ✅ Complete |
| Upload response mapping (`api.ts`) | ✅ Complete |
| Debounce flush before export | ✅ Complete |
| `textWithMediaRenderer.ts` renders `<img>` | ✅ Complete |
| Type map `text-with-media → content-media` | ✅ Complete |
| `transform.ts` preserves all media fields | ✅ Complete |

---

*Frontend Architecture Team — 2026-05-10*
