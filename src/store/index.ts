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
import componentsReducer from "./slices/componentsSlice";
import themeReducer from "./slices/themeSlice";
import completionReducer from "./slices/completionSlice";
import scoringReducer from "./slices/scoringSlice";

// Create root reducer type first
const rootReducer = {
  editor: editorReducer,
  course: courseReducer,
  components: componentsReducer,
  theme: themeReducer,
  completion: completionReducer,
  scoring: scoringReducer,
};

export type RootState = {
  editor: ReturnType<typeof editorReducer>;
  course: ReturnType<typeof courseReducer>;
  components: ReturnType<typeof componentsReducer>;
  theme: ReturnType<typeof themeReducer>;
  completion: ReturnType<typeof completionReducer>;
  scoring: ReturnType<typeof scoringReducer>;
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

// Expose store for export flush polling (Header.tsx pendingSaveCount check)
(window as any).__REDUX_STORE__ = store;

export type AppDispatch = typeof store.dispatch;

// Pre-typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
