/**
 * Completion Slice — Redux state for completion tracking.
 *
 * Manages per-component, per-page, and course-level completion state.
 * Syncs with backend via CompletionService.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { completionService } from '../../services/CompletionService';
import { handleApiError } from '../../services/errorHandler';
import {
  CompletionType,
  CourseCompletionResponse,
  CourseCompletionStatus,
  InteractionEvent,
  PageCompletionResponse,
  PageCompletionStrategy,
} from '../../types/course';

// ─── State Types ──────────────────────────────────────────────────

export interface ComponentCompletionState {
  componentId: string;
  completed: boolean;
  completionType: CompletionType;
  viewed: boolean;
  interacted: boolean;
  interactionsCompleted: string[];
  audiosCompleted: string[];
  scoreAchieved: number | null;
}

export interface PageCompletionState {
  pageId: string;
  completed: boolean;
  strategy: PageCompletionStrategy;
  components: Record<string, ComponentCompletionState>;
  progress: number; // 0-100
}

export interface CompletionSliceState {
  courseId: string | null;
  courseStatus: CourseCompletionStatus;
  overallProgress: number;
  pages: Record<string, PageCompletionState>;
  isLoading: boolean;
  error: string | null;
}

const initialState: CompletionSliceState = {
  courseId: null,
  courseStatus: 'not-started',
  overallProgress: 0,
  pages: {},
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────

export const fetchCourseCompletion = createAsyncThunk(
  'completion/fetchCourseCompletion',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await completionService.getCourseCompletion(courseId);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const fetchPageCompletion = createAsyncThunk(
  'completion/fetchPageCompletion',
  async ({ courseId, pageId }: { courseId: string; pageId: string }, { rejectWithValue }) => {
    try {
      return await completionService.getPageCompletion(courseId, pageId);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const recordInteraction = createAsyncThunk(
  'completion/recordInteraction',
  async ({ courseId, event }: { courseId: string; event: InteractionEvent }, { rejectWithValue }) => {
    try {
      return await completionService.recordInteraction(courseId, event);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const submitPageComplete = createAsyncThunk(
  'completion/submitPageComplete',
  async (
    {
      courseId,
      pageId,
      componentStates,
    }: {
      courseId: string;
      pageId: string;
      componentStates: Array<{
        componentId: string;
        completed: boolean;
        interactionsCompleted?: string[];
        audiosCompleted?: string[];
        score?: number | null;
      }>;
    },
    { rejectWithValue }
  ) => {
    try {
      return await completionService.submitPageCompletion(courseId, pageId, {
        componentStates,
      });
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────

const completionSlice = createSlice({
  name: 'completion',
  initialState,
  reducers: {
    /** Initialize completion tracking for a course. */
    initCompletion(state, action: PayloadAction<string>) {
      state.courseId = action.payload;
      state.courseStatus = 'not-started';
      state.overallProgress = 0;
      state.pages = {};
    },

    /** Mark a component as viewed (local optimistic update). */
    markComponentViewed(
      state,
      action: PayloadAction<{ pageId: string; componentId: string }>
    ) {
      const { pageId, componentId } = action.payload;
      const page = state.pages[pageId];
      if (page?.components[componentId]) {
        page.components[componentId].viewed = true;
        if (page.components[componentId].completionType === 'view') {
          page.components[componentId].completed = true;
        }
      }
    },

    /** Mark a component interaction as completed (local optimistic update). */
    markInteractionCompleted(
      state,
      action: PayloadAction<{
        pageId: string;
        componentId: string;
        interactionId: string;
      }>
    ) {
      const { pageId, componentId, interactionId } = action.payload;
      const page = state.pages[pageId];
      if (page?.components[componentId]) {
        const comp = page.components[componentId];
        if (!comp.interactionsCompleted.includes(interactionId)) {
          comp.interactionsCompleted.push(interactionId);
        }
        comp.interacted = true;
      }
    },

    /** Mark an audio item as listened (local optimistic update). */
    markAudioCompleted(
      state,
      action: PayloadAction<{
        pageId: string;
        componentId: string;
        audioId: string;
      }>
    ) {
      const { pageId, componentId, audioId } = action.payload;
      const page = state.pages[pageId];
      if (page?.components[componentId]) {
        const comp = page.components[componentId];
        if (!comp.audiosCompleted.includes(audioId)) {
          comp.audiosCompleted.push(audioId);
        }
      }
    },

    /** Update a component's score (local optimistic update). */
    setComponentScore(
      state,
      action: PayloadAction<{
        pageId: string;
        componentId: string;
        score: number;
      }>
    ) {
      const { pageId, componentId, score } = action.payload;
      const page = state.pages[pageId];
      if (page?.components[componentId]) {
        page.components[componentId].scoreAchieved = score;
      }
    },

    /** Reset completion for an entire course. */
    resetCompletion(state) {
      state.courseStatus = 'not-started';
      state.overallProgress = 0;
      state.pages = {};
    },
  },

  extraReducers: (builder) => {
    // Fetch course completion
    builder
      .addCase(fetchCourseCompletion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseCompletion.fulfilled, (state, action) => {
        state.isLoading = false;
        const resp: CourseCompletionResponse = action.payload;
        state.courseId = resp.courseId;
        state.courseStatus = resp.status;
        state.overallProgress = resp.overallProgress;

        // Hydrate page completion from server response
        for (const pageResp of resp.pages) {
          const components: Record<string, ComponentCompletionState> = {};
          for (const comp of pageResp.components) {
            components[comp.componentId] = {
              componentId: comp.componentId,
              completed: comp.completed,
              completionType: comp.completionType,
              viewed: comp.completed || false,
              interacted: comp.completed || false,
              interactionsCompleted: [],
              audiosCompleted: [],
              scoreAchieved: null,
            };
          }
          state.pages[pageResp.pageId] = {
            pageId: pageResp.pageId,
            completed: pageResp.completed,
            strategy: pageResp.strategy,
            components,
            progress: pageResp.completed ? 100 : 0,
          };
        }
      })
      .addCase(fetchCourseCompletion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch completion';
      });

    // Fetch page completion
    builder.addCase(fetchPageCompletion.fulfilled, (state, action) => {
      const resp: PageCompletionResponse = action.payload;
      const components: Record<string, ComponentCompletionState> = {};
      for (const comp of resp.components) {
        components[comp.componentId] = {
          componentId: comp.componentId,
          completed: comp.completed,
          completionType: comp.completionType,
          viewed: comp.completed || false,
          interacted: comp.completed || false,
          interactionsCompleted: [],
          audiosCompleted: [],
          scoreAchieved: null,
        };
      }
      state.pages[resp.pageId] = {
        pageId: resp.pageId,
        completed: resp.completed,
        strategy: resp.strategy,
        components,
        progress: resp.completed ? 100 : 0,
      };
    });

    builder
      .addCase(submitPageComplete.pending, (state) => {
        state.error = null;
      })
      .addCase(submitPageComplete.fulfilled, (state, action) => {
        const resp: PageCompletionResponse = action.payload;
        const existing = state.pages[resp.pageId];
        const components = existing?.components || {};

        for (const comp of resp.components) {
          const current = components[comp.componentId];
          components[comp.componentId] = {
            componentId: comp.componentId,
            completed: comp.completed,
            completionType: comp.completionType,
            viewed: current?.viewed ?? comp.completed,
            interacted: current?.interacted ?? comp.completed,
            interactionsCompleted: current?.interactionsCompleted ?? [],
            audiosCompleted: current?.audiosCompleted ?? [],
            scoreAchieved: current?.scoreAchieved ?? null,
          };
        }

        state.pages[resp.pageId] = {
          pageId: resp.pageId,
          completed: resp.completed,
          strategy: resp.strategy,
          components,
          progress: resp.completed ? 100 : existing?.progress ?? 0,
        };
      })
      .addCase(submitPageComplete.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Failed to submit page completion';
      });

    // Record interaction — optimistic update already done via local reducers
    builder
      .addCase(recordInteraction.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Failed to record interaction';
      });
  },
});

export const {
  initCompletion,
  markComponentViewed,
  markInteractionCompleted,
  markAudioCompleted,
  setComponentScore,
  resetCompletion,
} = completionSlice.actions;

export default completionSlice.reducer;
