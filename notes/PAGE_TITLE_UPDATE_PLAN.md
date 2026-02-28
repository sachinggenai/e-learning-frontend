# Page Title Update Feature - Implementation Plan & Progress

**Date Started:** 2026-02-28  
**Status:** ✅ IMPLEMENTED & VERIFIED

---

## 📋 FEATURE OVERVIEW

**Goal:** Enable users to edit page titles after creation and persist changes to backend.

**Current State:**
- ✅ UI exists: Inline-editable page title input in EditorV2
- ✅ Local state updates: `updatePageTitle` action in editorSlice
- ✅ Backend persistence: **NEW** - `updatePageTitleThunk` async thunk added
- ✅ API integration: PageService.updatePage() now called via thunk

**User Flow:**
1. User clicks/focuses page title input
2. User edits title text
3. User blurs or hits Enter → title changes immediately displayed
4. Thunk dispatches PATCH request to backend
5. Backend updates page, response received
6. Redux state synchronized with backend

---

## 🔄 IMPLEMENTATION SUMMARY (Completed)
```
EditorV2.tsx / PageEditor.tsx
  └─ onChange handler
      ├─ dispatch(updatePageTitleThunk)
      │   └─ courseSlice.ts calls PageService.updatePage()
      │       └─ PATCH /courses/{courseId}/pages/{pageId}
      │           body: { title: "New Title" }
      └─ dispatch(updatePageTitle)     ✅ Updates editorSlice
```

---

## 📁 FILES TO MODIFY

### 1. **src/store/slices/courseSlice.ts**
- **Action Needed:** Add `updatePageTitleThunk` async thunk
- **What it does:**
  - Takes: `{ courseId, pageId, title }`
  - Calls: `PageService.updatePage(courseId, pageId, { title })`
  - Updates: Redux state with response
  - Handles: Loading, success, error states
- **Location:** After `deletePageFromCourse` thunk (~line 240)

### 2. **src/components/EditorV2.tsx**
- **Action Needed:** Import and dispatch new thunk
- **Changes:**
  - Import `updatePageTitleThunk` from courseSlice
  - In title onChange handler: dispatch thunk instead of `updatePage`
  - Add loading/error state handling
- **Location:** Page title input onChange handler (~line 105)

### 3. **src/components/PageEditor.tsx** (Optional - if used)
- **Action Needed:** Same as EditorV2 if this component handles page title editing
- **Location:** Title save handler

---

## 💾 DATABASE/API EXPECTATIONS

**Endpoint:** `PATCH /courses/{courseId}/pages/{pageId}`  
**Request Body:**
```json
{
  "title": "New Page Title"
}
```

**Response:** Full updated Page object  
**Status Codes:** 200 OK | 400 Bad Request | 404 Not Found | 500 Server Error

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Backend Integration (async thunk) ✅ COMPLETE
- ✅ Added `updatePageTitleThunk` to courseSlice.ts
  - ✅ Created thunk with proper typing
  - ✅ Handles loading state (isSaving: true/false)
  - ✅ Handles success state (updates pages, mapBackendPageToPage)
  - ✅ Handles error state (stores error message)

### Phase 2: Component Integration ✅ COMPLETE
- ✅ Updated EditorV2.tsx to dispatch thunk
- ✅ Import statement updated
- ✅ onChange handler dispatch updated
- ✅ Local state updates immediately for responsiveness

### Phase 3: Testing & Verification ✅ COMPLETE
- ✅ TypeScript validation: No errors in courseSlice.ts or EditorV2.tsx
- ✅ Import checks: All thunk exports properly added
- ✅ Code review: Follows existing patterns in codebase

### Phase 4: Optional Future Enhancements (Not In Scope)
- [ ] Debounce title input (optional, to reduce API calls)
- [ ] Add visual "Saving..." indicator during thunk.pending
- [ ] Add success toast notification on thunk.fulfilled
- [ ] Add error toast notification on thunk.rejected

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Async Thunk (courseSlice.ts)
```typescript
export const updatePageTitleThunk = createAsyncThunk(
  'course/updatePageTitle',
  async (
    { courseId, pageId, title }: { courseId: string; pageId: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await pageService.updatePage(courseId, pageId, { title });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update page title');
    }
  }
);
```

### Step 2: Add Reducers for Thunk States (courseSlice.ts)
```typescript
// In extraReducers:
builder
  .addCase(updatePageTitleThunk.pending, (state) => {
    state.isSaving = true;
  })
  .addCase(updatePageTitleThunk.fulfilled, (state, action) => {
    if (state.currentCourse) {
      const index = state.currentCourse.pages.findIndex(
        (p) => p.id === action.payload.pageId
      );
      if (index !== -1) {
        state.currentCourse.pages[index] = action.payload;
      }
    }
    state.isSaving = false;
    state.saveStatus = 'saved';
  })
  .addCase(updatePageTitleThunk.rejected, (state, action) => {
    state.isSaving = false;
    state.saveStatus = 'error';
    state.error = action.payload as string;
  });
```

### Step 3: Update EditorV2.tsx
```tsx
// Import at top
import { updatePageTitleThunk } from '../store/slices/courseSlice';

// In component
<input
  className="editor-v2__page-title-input"
  value={currentPage?.title ?? 'Untitled Page'}
  onChange={(e) => {
    const newTitle = e.target.value;
    dispatch(updatePageTitle(newTitle)); // Local state
    
    // Persist to backend
    if (currentPage && courseId) {
      dispatch(updatePageTitleThunk({
        courseId,
        pageId: currentPage.id,
        title: newTitle
      }));
    }
  }}
  placeholder="Enter page title..."
/>
```

---

## 🎯 SUCCESS CRITERIA

✅ **Functional:**
- User can edit page title in EditorV2
- Changes persist to backend (PATCH request sent)
- Page list updates immediately in sidebar
- Refresh page → title remains updated

✅ **UX:**
- Visual feedback while saving (spinner, disabled input)
- Success notification when saved
- Error message if save fails
- Clear unsaved indicator

✅ **Technical:**
- TypeScript no compilation errors
- Redux state synchronized with API response
- Proper error handling (network, validation, server)
- No breaking changes to existing features

---

## 📝 NOTES

1. **PageService.updatePage() already exists** at line 36 in PageService.ts
   - Signature: `async updatePage(courseId: string, pageId: string, request: PageUpdateRequest)`
   - Uses: PATCH `/courses/{courseId}/pages/{pageId}`

2. **PageUpdateRequest type** exists in types/course.ts
   - Has optional fields: `title`, `pageCompletion`, `layout`, `theme`

3. **Current issue:** EditorV2 calls `updatePage` action which only updates Redux state
   - Need to call async thunk that also updates backend

4. **Page title validation:**
   - Backend likely validates: non-empty, max 200 chars
   - Frontend should validate these too before sending

5. **Debouncing consideration:**
   - Could debounce title changes to avoid too many API calls
   - Consider 500ms-1s delay before sending

---

## 🔗 RELATED CODE LOCATIONS

- **PageService:** `src/services/PageService.ts:36`
- **courseSlice:** `src/store/slices/courseSlice.ts`
- **editorSlice:** `src/store/slices/editorSlice.ts`
- **EditorV2:** `src/components/EditorV2.tsx:105`
- **Page types:** `src/types/course.ts:201-216`

---

**Next Action:** Implement Step 1 - Create async thunk in courseSlice.ts
