/**
 * Editor Slice with Undo/Redo Support
 *
 * Manages editor state with undo/redo functionality using redux-undo.
 * Tracks page editing, content changes, and action history.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import undoable, {
  excludeAction,
  ActionCreators as UndoActionCreators,
} from "redux-undo";

// Types for editor state
export interface Page {
  id: string;
  templateType: string;
  title: string;
  content: Record<string, any>;
  order: number;
  isValid?: boolean;
  isDraft?: boolean;
  lastModified: string;
}

export interface EditorState {
  currentPage: Page | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  validationErrors: string[];
}

const initialState: EditorState = {
  currentPage: null,
  isEditing: false,
  hasUnsavedChanges: false,
  validationErrors: [],
};

// Regular slice (will be wrapped with undoable)
const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // Page Management
    setCurrentPage: (state, action: PayloadAction<Page>) => {
      console.log("═══════════════════════════════════════════════════");
      console.log("📝 editorSlice.setCurrentPage REDUCER");
      console.log("═══════════════════════════════════════════════════");
      console.log("📌 Previous currentPage ID:", state.currentPage?.id);
      console.log(
        "📌 Previous currentPage content:",
        JSON.stringify(state.currentPage?.content, null, 2)
      );
      console.log("📌 New page ID:", action.payload.id);
      console.log("📌 New page title:", action.payload.title);
      console.log(
        "📌 New page content:",
        JSON.stringify(action.payload.content, null, 2)
      );

      state.currentPage = action.payload;
      state.isEditing = true;

      console.log("✅ editorSlice.currentPage updated");
      console.log("═══════════════════════════════════════════════════\n");
    },

    clearCurrentPage: (state) => {
      state.currentPage = null;
      state.isEditing = false;
      state.hasUnsavedChanges = false;
      state.validationErrors = [];
    },

    setCurrentPageToNull: (state) => {
      state.currentPage = null;
      state.isEditing = false;
    },

    // Content Editing (these actions will be undoable)
    updatePageContent: (
      state,
      action: PayloadAction<{
        field: string;
        value: any;
        pageId?: string;
      }>
    ) => {
      if (state.currentPage) {
        const { field, value } = action.payload;
        state.currentPage.content[field] = value;
        state.currentPage.lastModified = new Date().toISOString();
        state.currentPage.isDraft = true;
        state.hasUnsavedChanges = true;
      }
    },

    updatePageTitle: (state, action: PayloadAction<string>) => {
      if (state.currentPage) {
        state.currentPage.title = action.payload;
        state.currentPage.lastModified = new Date().toISOString();
        state.currentPage.isDraft = true;
        state.hasUnsavedChanges = true;
      }
    },

    // Validation
    setValidationErrors: (state, action: PayloadAction<string[]>) => {
      state.validationErrors = action.payload;
      if (state.currentPage) {
        state.currentPage.isValid = action.payload.length === 0;
      }
    },

    clearValidationErrors: (state) => {
      state.validationErrors = [];
      if (state.currentPage) {
        state.currentPage.isValid = true;
      }
    },

    // Draft Management
    markAsDraft: (state) => {
      if (state.currentPage) {
        state.currentPage.isDraft = true;
      }
    },

    markAsPublished: (state) => {
      if (state.currentPage) {
        state.currentPage.isDraft = false;
      }
    },
  },
});

// Export regular actions
export const {
  setCurrentPage,
  clearCurrentPage,
  setCurrentPageToNull,
  updatePageContent,
  updatePageTitle,
  setValidationErrors,
  clearValidationErrors,
  markAsDraft,
  markAsPublished,
} = editorSlice.actions;

// Export undo/redo actions for use in components
export const { undo, redo, clearHistory } = UndoActionCreators;

// Undoable configuration
// Batching edits: collapse rapid successive updates to same field within threshold
let lastActionTime = 0;
let lastActionKey: string | null = null;
const BATCH_WINDOW_MS = 500;

const undoableConfig = {
  limit: 200, // Cap history length to 200 per spec
  groupBy: (action: any, currentState: any, previousHistory: any) => {
    const groupable = ["editor/updatePageContent", "editor/updatePageTitle"];
    if (!groupable.includes(action.type)) return null;
    const now = Date.now();
    const field =
      action.payload?.field ||
      (action.type === "editor/updatePageTitle" ? "__title__" : "__unknown__");
    const key = `${action.type}:${field}`;
    if (lastActionKey === key && now - lastActionTime <= BATCH_WINDOW_MS) {
      lastActionTime = now;
      return key; // Same group → merged history entry
    }
    lastActionKey = key;
    lastActionTime = now;
    return key + ":" + now; // New distinct group instance
  },
  // Use excludeAction to prevent page selection from cluttering undo history
  // This allows setCurrentPage to update state and trigger re-renders
  filter: excludeAction([
    "editor/setCurrentPage",
    "editor/clearCurrentPage",
    "editor/setCurrentPageToNull",
    "editor/setValidationErrors",
    "editor/clearValidationErrors",
    "editor/markAsDraft",
    "editor/markAsPublished",
  ]),
  initTypes: ["@@INIT"],
  clearHistoryType: "editor/clearHistory",
};

// Create undoable reducer
const undoableEditorReducer = undoable(editorSlice.reducer, undoableConfig);

export default undoableEditorReducer;
