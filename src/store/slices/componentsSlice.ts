/**
 * Component Slice — Redux state for component-level operations.
 *
 * Manages components within pages: add, update, remove, reorder.
 * Integrates with ComponentService for API persistence.
 *
 * Single Responsibility: Only component state management.
 * Separated from page concerns following SRP.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Component,
  ComponentCreateRequest,
  ComponentUpdateRequest,
} from '../../types/course';
import { componentService } from '../../services/ComponentService';

// ─── State ───────────────────────────────────────────────────────
export interface ComponentsState {
  /** Components keyed by pageId → componentId */
  byPage: Record<string, Component[]>;
  /** Currently selected component for editing */
  selectedComponentId: string | null;
  /** Loading state per page */
  loading: Record<string, boolean>;
  error: string | null;
  /** Number of in-flight updateComponent PATCH requests (debounced saves in progress) */
  pendingSaveCount: number;
  /** Number of debounce timers that have been set but not yet fired (pending saves not yet in-flight) */
  pendingDebounceCount: number;
}

const initialState: ComponentsState = {
  byPage: {},
  selectedComponentId: null,
  loading: {},
  error: null,
  pendingSaveCount: 0,
  pendingDebounceCount: 0,
};

// ─── Async Thunks ────────────────────────────────────────────────
export const fetchComponents = createAsyncThunk(
  'components/fetch',
  async ({ courseId, pageId }: { courseId: string; pageId: string }) => {
    const components = await componentService.listComponents(courseId, pageId);
    return { pageId, components };
  }
);

export const addComponent = createAsyncThunk(
  'components/add',
  async ({
    courseId,
    pageId,
    request,
  }: {
    courseId: string;
    pageId: string;
    request: ComponentCreateRequest;
  }) => {
    const component = await componentService.addComponent(courseId, pageId, request);
    return { pageId, component };
  }
);

export const updateComponent = createAsyncThunk(
  'components/update',
  async ({
    courseId,
    pageId,
    componentId,
    request,
  }: {
    courseId: string;
    pageId: string;
    componentId: string;
    request: ComponentUpdateRequest;
  }) => {
    const component = await componentService.updateComponent(courseId, pageId, componentId, request);
    return { pageId, componentId, component };
  }
);

export const removeComponent = createAsyncThunk(
  'components/remove',
  async ({
    courseId,
    pageId,
    componentId,
  }: {
    courseId: string;
    pageId: string;
    componentId: string;
  }) => {
    await componentService.deleteComponent(courseId, pageId, componentId);
    return { pageId, componentId };
  }
);

export const reorderComponents = createAsyncThunk(
  'components/reorder',
  async ({
    courseId,
    pageId,
    orderedIds,
  }: {
    courseId: string;
    pageId: string;
    orderedIds: string[];
  }) => {
    await componentService.reorderComponents(courseId, pageId, orderedIds);
    return { pageId, orderedIds };
  }
);

// ─── Slice ───────────────────────────────────────────────────────
const componentsSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload;
    },

    /** Called when a debounce save timer is started (before the 800ms fires) */
    debounceStarted: (state) => {
      state.pendingDebounceCount += 1;
    },

    /** Called when a debounce save timer fires or is cancelled */
    debounceSettled: (state) => {
      state.pendingDebounceCount = Math.max(0, state.pendingDebounceCount - 1);
    },

    /** Optimistic local update (no API call) for real-time editing */
    updateComponentLocal: (
      state,
      action: PayloadAction<{
        pageId: string;
        componentId: string;
        updates: Partial<Component>;
      }>
    ) => {
      const { pageId, componentId, updates } = action.payload;
      const components = state.byPage[pageId];
      if (components) {
        const index = components.findIndex((c) => c.componentId === componentId);
        if (index !== -1) {
          components[index] = { ...components[index], ...updates };
        }
      }
    },

    /** Set components for a page (used when loading course data) */
    setPageComponents: (
      state,
      action: PayloadAction<{ pageId: string; components: Component[] }>
    ) => {
      state.byPage[action.payload.pageId] = action.payload.components;
    },

    /** Clear all component state */
    clearComponents: (state) => {
      state.byPage = {};
      state.selectedComponentId = null;
      state.loading = {};
      state.error = null;
    },

    /** Duplicate a component locally */
    duplicateComponentLocal: (
      state,
      action: PayloadAction<{ pageId: string; componentId: string; newComponentId: string }>
    ) => {
      const { pageId, componentId, newComponentId } = action.payload;
      const components = state.byPage[pageId];
      if (components) {
        const source = components.find((c) => c.componentId === componentId);
        if (source) {
          const duplicate: Component = {
            ...source,
            componentId: newComponentId,
            order: components.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          components.push(duplicate);
        }
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchComponents.pending, (state, action) => {
      state.loading[action.meta.arg.pageId] = true;
      state.error = null;
    });
    builder.addCase(fetchComponents.fulfilled, (state, action) => {
      state.byPage[action.payload.pageId] = action.payload.components;
      state.loading[action.payload.pageId] = false;
    });
    builder.addCase(fetchComponents.rejected, (state, action) => {
      state.loading[action.meta.arg.pageId] = false;
      state.error = action.error.message || 'Failed to fetch components';
    });

    // Add
    builder.addCase(addComponent.fulfilled, (state, action) => {
      const { pageId, component } = action.payload;
      if (!state.byPage[pageId]) state.byPage[pageId] = [];
      state.byPage[pageId].push(component);
      state.selectedComponentId = component.componentId;
    });

    // Update
    builder.addCase(updateComponent.pending, (state) => {
      state.pendingSaveCount += 1;
    });
    builder.addCase(updateComponent.fulfilled, (state, action) => {
      state.pendingSaveCount = Math.max(0, state.pendingSaveCount - 1);
      const { pageId, componentId, component } = action.payload;
      const components = state.byPage[pageId];
      if (components) {
        const index = components.findIndex((c) => c.componentId === componentId);
        if (index !== -1) components[index] = component;
      }
    });
    builder.addCase(updateComponent.rejected, (state, action) => {
      state.pendingSaveCount = Math.max(0, state.pendingSaveCount - 1);
      state.error = action.error.message || 'Failed to save component';
      console.error('[componentsSlice] updateComponent failed:', action.error.message);
    });

    // Remove
    builder.addCase(removeComponent.fulfilled, (state, action) => {
      const { pageId, componentId } = action.payload;
      const components = state.byPage[pageId];
      if (components) {
        state.byPage[pageId] = components.filter((c) => c.componentId !== componentId);
      }
      if (state.selectedComponentId === componentId) {
        state.selectedComponentId = null;
      }
    });

    // Reorder
    builder.addCase(reorderComponents.fulfilled, (state, action) => {
      const { pageId, orderedIds } = action.payload;
      const components = state.byPage[pageId];
      if (components) {
        const sorted = orderedIds
          .map((id) => components.find((c) => c.componentId === id))
          .filter(Boolean) as Component[];
        sorted.forEach((c, i) => { c.order = i; });
        state.byPage[pageId] = sorted;
      }
    });
  },
});

export const {
  selectComponent,
  updateComponentLocal,
  setPageComponents,
  clearComponents,
  duplicateComponentLocal,
  debounceStarted,
  debounceSettled,
} = componentsSlice.actions;

export default componentsSlice.reducer;
