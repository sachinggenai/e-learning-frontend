/**
 * Scoring Slice — Redux state for scoring configuration and results.
 *
 * Manages course-level scoring config, per-component scores,
 * attempt tracking, and pass/fail status.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { scoringService } from '../../services/ScoringService';
import { handleApiError } from '../../services/errorHandler';
import {
  ComponentAnswer,
  ComponentResult,
  ScoreCalculateResponse,
  ScoringConfig,
} from '../../types/course';

// ─── State Types ──────────────────────────────────────────────────

export interface AttemptRecord {
  attemptNumber: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
  componentResults: ComponentResult[];
}

export interface ScoringSliceState {
  /** Course-level scoring config fetched from backend. */
  config: ScoringConfig | null;
  /** Most recent score calculation result. */
  currentResult: ScoreCalculateResponse | null;
  /** History of all attempts. */
  attempts: AttemptRecord[];
  /** Best score across all attempts. */
  bestScore: number | null;
  /** Answers currently being composed (before submission). */
  pendingAnswers: Record<string, ComponentAnswer>;
  isLoading: boolean;
  isCalculating: boolean;
  error: string | null;
}

const initialState: ScoringSliceState = {
  config: null,
  currentResult: null,
  attempts: [],
  bestScore: null,
  pendingAnswers: {},
  isLoading: false,
  isCalculating: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────────

export const fetchScoringConfig = createAsyncThunk(
  'scoring/fetchConfig',
  async (courseId: string, { rejectWithValue }) => {
    try {
      return await scoringService.getScoringConfig(courseId);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const updateScoringConfig = createAsyncThunk(
  'scoring/updateConfig',
  async ({ courseId, config }: { courseId: string; config: ScoringConfig }, { rejectWithValue }) => {
    try {
      return await scoringService.updateScoringConfig(courseId, config);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const calculateScore = createAsyncThunk(
  'scoring/calculate',
  async ({
    courseId,
    answers,
    attemptNumber,
  }: {
    courseId: string;
    answers: ComponentAnswer[];
    attemptNumber?: number;
  }, { rejectWithValue }) => {
    try {
      return await scoringService.calculateScore(courseId, {
        answers,
        attemptNumber,
      });
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

export const validateScoringConfig = createAsyncThunk(
  'scoring/validate',
  async ({ courseId, config }: { courseId: string; config: ScoringConfig }, { rejectWithValue }) => {
    try {
      return await scoringService.validateScoringConfig(courseId);
    } catch (error) {
      const handled = handleApiError(error);
      return rejectWithValue(handled.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────

const scoringSlice = createSlice({
  name: 'scoring',
  initialState,
  reducers: {
    /** Set a pending answer for a component (before submission). */
    setPendingAnswer(state, action: PayloadAction<ComponentAnswer>) {
      state.pendingAnswers[action.payload.componentId] = action.payload;
    },

    /** Clear a single pending answer. */
    clearPendingAnswer(state, action: PayloadAction<string>) {
      delete state.pendingAnswers[action.payload];
    },

    /** Clear all pending answers. */
    clearAllPendingAnswers(state) {
      state.pendingAnswers = {};
    },

    /** Reset scoring state for a new course. */
    resetScoring(state) {
      state.config = null;
      state.currentResult = null;
      state.attempts = [];
      state.bestScore = null;
      state.pendingAnswers = {};
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch scoring config
    builder
      .addCase(fetchScoringConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScoringConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
      })
      .addCase(fetchScoringConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch scoring config';
      });

    // Update scoring config
    builder
      .addCase(updateScoringConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      .addCase(updateScoringConfig.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error.message || 'Failed to update scoring config';
      });

    // Calculate score
    builder
      .addCase(calculateScore.pending, (state) => {
        state.isCalculating = true;
        state.error = null;
      })
      .addCase(calculateScore.fulfilled, (state, action) => {
        state.isCalculating = false;
        state.currentResult = action.payload;

        // Track attempt
        const attempt: AttemptRecord = {
          attemptNumber: action.payload.attemptNumber,
          score: action.payload.totalScore,
          maxScore: action.payload.maxScore,
          percentage: action.payload.percentage,
          passed: action.payload.passed,
          timestamp: new Date().toISOString(),
          componentResults: action.payload.componentResults,
        };
        state.attempts.push(attempt);

        // Update best score
        if (state.bestScore === null || action.payload.percentage > state.bestScore) {
          state.bestScore = action.payload.percentage;
        }

        // Clear pending answers after submission
        state.pendingAnswers = {};
      })
      .addCase(calculateScore.rejected, (state, action) => {
        state.isCalculating = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to calculate score';
      });
  },
});

export const {
  setPendingAnswer,
  clearPendingAnswer,
  clearAllPendingAnswers,
  resetScoring,
} = scoringSlice.actions;

export default scoringSlice.reducer;
