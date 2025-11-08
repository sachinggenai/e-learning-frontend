/**
 * Redux Store Configuration
 *
 * Configures the main Redux store with RTK and undo/redo functionality.
 * Supports auto-save, draft management, and action history tracking.
 */

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import courseReducer from "./slices/courseSlice";
import editorReducer from "./slices/editorSlice";
// Create root reducer type first
const rootReducer = {
  editor: editorReducer,
  course: courseReducer,
};

export type RootState = {
  editor: ReturnType<typeof editorReducer>;
  course: ReturnType<typeof courseReducer>;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["editor.past", "editor.future"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;

// Pre-typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
