/**
 * Theme Slice — Redux state for theme management.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Theme,
  ThemeOverrides,
  ResolvedThemeResponse,
} from '../../types/course';
import { themeService } from '../../services/ThemeService';

export interface ThemeState {
  presets: Theme[];
  courseTheme: ResolvedThemeResponse | null;
  pageThemes: Record<string, ResolvedThemeResponse>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ThemeState = {
  presets: [],
  courseTheme: null,
  pageThemes: {},
  isLoading: false,
  error: null,
};

export const fetchPresets = createAsyncThunk('theme/fetchPresets', async () => {
  return await themeService.getPresets();
});

export const fetchCourseTheme = createAsyncThunk(
  'theme/fetchCourseTheme',
  async (courseId: string) => {
    return await themeService.getCourseTheme(courseId);
  }
);

export const updateCourseTheme = createAsyncThunk(
  'theme/updateCourseTheme',
  async ({ courseId, overrides }: { courseId: string; overrides: ThemeOverrides }) => {
    return await themeService.updateCourseTheme(courseId, overrides);
  }
);

export const fetchPageTheme = createAsyncThunk(
  'theme/fetchPageTheme',
  async ({ courseId, pageId }: { courseId: string; pageId: string }) => {
    const theme = await themeService.getPageTheme(courseId, pageId);
    return { pageId, theme };
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    clearThemeState: () => initialState,
    setLocalOverrides: (state, action: PayloadAction<{ pageId?: string; overrides: ThemeOverrides }>) => {
      // Optimistic local update
      if (action.payload.pageId && state.pageThemes[action.payload.pageId]) {
        state.pageThemes[action.payload.pageId].overrides = action.payload.overrides;
      } else if (state.courseTheme) {
        state.courseTheme.overrides = action.payload.overrides;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPresets.fulfilled, (state, action) => {
      state.presets = action.payload;
    });
    builder.addCase(fetchCourseTheme.pending, (state) => { state.isLoading = true; });
    builder.addCase(fetchCourseTheme.fulfilled, (state, action) => {
      state.courseTheme = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchCourseTheme.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load theme';
    });
    builder.addCase(updateCourseTheme.fulfilled, (state, action) => {
      state.courseTheme = action.payload;
    });
    builder.addCase(fetchPageTheme.fulfilled, (state, action) => {
      state.pageThemes[action.payload.pageId] = action.payload.theme;
    });
  },
});

export const { clearThemeState, setLocalOverrides } = themeSlice.actions;
export default themeSlice.reducer;
