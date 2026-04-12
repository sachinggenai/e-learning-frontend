/**
 * Course Slice
 *
 * Manages course-level state including pages, templates, and persistence status.
 * Uses CourseService (httpClient) for all API communication.
 *
 * Migration notes:
 *   - fetchCourses / fetchCourse / saveCourse now use courseService
 *   - Legacy Page (templateType + content) is still maintained for V1 compat
 *   - The adapter layer in pageAdapter.ts bridges backend ↔ frontend Page models
 */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { courseService } from "../../services/CourseService";
import { pageService } from "../../services/PageService";
import { Course as ApiCourse } from "../../types/course";
import logger from "../../utils/logger";
import { Page } from "./editorSlice";
import { mapBackendPageToPage } from "../adapters/pageAdapter";

// ─── Slice-local types (kept for V1 compat; consumers will migrate to types/course.ts) ──
export interface Course {
  id?: number;
  courseId: string;
  title: string;
  author?: string;
  description?: string;
  status: "draft" | "published";
  pages: Page[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: number;
  templateId: string;
  type: string;
  title: string;
  order: number;
  data: Record<string, any>;
}

export interface CourseState {
  currentCourse: Course | null;
  courses: Course[];
  templates: Template[];
  rawTemplates?: any[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveStatus: "idle" | "saving" | "saved" | "error";
  lastSaved: string | null;
}

const initialState: CourseState = {
  currentCourse: null,
  courses: [],
  templates: [],
  rawTemplates: [],
  isLoading: false,
  isSaving: false,
  error: null,
  saveStatus: "idle",
  lastSaved: null,
};

// ─── Helpers ───────────────────────────────────────────────────────

/** Convert API Course to slice-local Course (legacy Page model). */
function apiCourseToSliceCourse(apiCourse: ApiCourse): Course {
  const pages: Page[] = (apiCourse.pages ?? []).map((p, idx) => {
    // If the page already looks like a legacy Page, keep it.
    if ((p as any).templateType) {
      return p as unknown as Page;
    }
    // Otherwise, map from backend DTO
    return mapBackendPageToPage({
      id: String(p.pageId ?? (p as any).id ?? idx),
      course_id: apiCourse.courseId,
      title: p.title ?? `Page ${idx + 1}`,
      type: (p as any).type ?? 'content-text',
      content: (p as any).content ?? {},
      page_order: p.order ?? idx,
      is_published: true,
      created_at: (p as any).createdAt,
      updated_at: (p as any).updatedAt,
    });
  });

  return {
    id: (apiCourse as any).id,
    courseId: apiCourse.courseId,
    title: apiCourse.title,
    author: apiCourse.author ?? "Course Author",
    description: apiCourse.description ?? undefined,
    status: apiCourse.status as "draft" | "published",
    pages,
    createdAt: apiCourse.createdAt,
    updatedAt: apiCourse.updatedAt,
  };
}

// ─── Async Thunks ──────────────────────────────────────────────────

export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async () => {
    const result = await courseService.listCourses();
    // result is CourseListResponse { courses, total, page, limit }
    return (result as any).courses ?? result;
  }
);

export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (courseId: string) => {
    const apiCourse = await courseService.getCourse(courseId);
    return apiCourse;
  }
);

export const saveCourse = createAsyncThunk(
  "course/saveCourse",
  async (course: Partial<Course>, { getState }) => {
    logger.info({
      event: "course.save.started",
      message: "Course save operation initiated",
      context: { courseId: course.courseId, pagesCount: course.pages?.length || 0 },
    });

    if (!course.courseId?.trim()) throw new Error("Course ID is required");
    if (!course.title?.trim()) throw new Error("Course title is required");

    const state: any = getState();
    const componentsByPage: Record<string, any[]> = state?.components?.byPage || {};

    const pagesPayload = (course.pages ?? []).map((p: any) => {
      const fromComponentStore = Array.isArray(componentsByPage[p.id])
        ? componentsByPage[p.id]
        : [];

      const normalizedComponents = fromComponentStore.length
        ? fromComponentStore.map((c: any) => ({
            componentType: c.componentType || c.typeId || p.templateType || "content-text",
            data: c.data || {},
            audioConfig: c.audioConfig,
            completionCriteria: c.completionCriteria,
            styling: c.styling,
          }))
        : Array.isArray(p.components) && p.components.length
          ? p.components.map((c: any) => ({
              componentType: c.componentType || c.typeId || p.templateType || "content-text",
              data: c.data || {},
              audioConfig: c.audioConfig,
              completionCriteria: c.completionCriteria,
              styling: c.styling,
            }))
          : [
              {
                // Legacy editor pages store content at page-level; preserve it as a single component.
                componentType: p.templateType || "content-text",
                data: p.content || {},
              },
            ];

      return {
        pageId: p.id,
        title: p.title,
        order: typeof p.order === "number" ? p.order : 0,
        components: normalizedComponents,
      };
    });

    // Build an ApiCourse payload from the slice-local Course
    const payload: Partial<ApiCourse> = {
      courseId: course.courseId!,
      title: course.title!,
      author: course.author ?? "Course Author",
      description: course.description ?? "",
      status: course.status ?? "draft",
      pages: pagesPayload,
    };

    const saved = await courseService.saveCourse(payload as ApiCourse);

    logger.info({
      event: "course.save.success",
      message: "Course saved via CourseService",
      context: { courseId: saved.courseId, title: saved.title },
    });

    return {
      id: (saved as any).id ?? course.id,
      courseId: saved.courseId ?? course.courseId!,
      title: saved.title ?? course.title!,
      author: (saved as any).author ?? course.author ?? "Course Author",
      description: saved.description ?? course.description,
      status: (saved.status ?? course.status ?? "draft") as "draft" | "published",
      pages: course.pages ?? [],
      createdAt: saved.createdAt ?? course.createdAt,
      updatedAt: saved.updatedAt ?? new Date().toISOString(),
    } as Course;
  }
);

export const fetchTemplates = createAsyncThunk(
  "course/fetchTemplates",
  async (_: any) => {
    const backendTemplates = await courseService.listAvailableTemplates();

    const legacyNormalize = (tpls: any[]): Template[] => {
      const categoryToType: Record<string, string> = {
        introduction: "content-text",
        lab: "content-text",
        assessment: "mcq",
      };
      return tpls.map((tpl: any, index: number) => {
        const content: Record<string, any> = {};
        if (Array.isArray(tpl.fields)) {
          tpl.fields.forEach((f: any) => { content[f.name] = ""; });
        }
        const mappedType = categoryToType[tpl.category] || "content-text";
        return {
          id: tpl.id,
          templateId: tpl.id,
          type: mappedType,
          title: tpl.name,
          order: index,
          data: {
            content,
            rawFields: tpl.fields || [],
            description: tpl.description,
            category: tpl.category,
          },
        };
      });
    };

    return { raw: backendTemplates, legacy: legacyNormalize(backendTemplates) };
  }
);

export const createPageFromTemplate = createAsyncThunk(
  "course/createPageFromTemplate",
  async (params: {
    courseId: number | string;
    templateId: string;
    pageTitle: string;
    customizations?: Record<string, any>;
    pageOrder?: number;
  }, { getState, rejectWithValue }) => {
    const { courseId, templateId, pageTitle, customizations = {} } = params;
    const courseIdStr = String(courseId);

    const ensureCoursePersisted = async () => {
      try {
        await courseService.getCourse(courseIdStr);
        return;
      } catch (error: any) {
        if (error?.status !== 404) {
          throw error;
        }
      }

      const state: any = getState();
      const currentCourse = state?.course?.currentCourse;
      const title = currentCourse?.title || "Untitled Course";

      await courseService.createCourse({
        courseId: courseIdStr,
        title,
        author: currentCourse?.author || "Course Author",
        description: currentCourse?.description || "",
        status: currentCourse?.status || "draft",
        pages: [],
      } as any);
    };

    // Build a spec-compliant PageCreateRequest (POST /courses/{courseId}/pages)
    // The template's componentType and customization data are sent as the initial component.
    const pageCreateRequest: {
      title: string;
      components: Array<{ componentType: string; data: Record<string, any> }>;
    } = {
      title: pageTitle,
      components: [
        {
          componentType: templateId,
          data: customizations,
        },
      ],
    };

    try {
      await ensureCoursePersisted();

      const data = await pageService.createPage(courseIdStr, pageCreateRequest);

      // Backend returns a PageResponse directly
      return data;
    } catch (error: any) {
      // Some backends can return 500 on FK violation when course record is missing.
      // Retry once after creating the parent course record.
      const message = JSON.stringify(error?.raw || error || "").toLowerCase();
      const fkLikeError =
        error?.status === 500 &&
        (message.includes("foreign key") ||
          message.includes("constraint") ||
          message.includes("course") ||
          message.includes("not found"));

      if (fkLikeError) {
        try {
          const retry = await pageService.createPage(courseIdStr, pageCreateRequest);
          return retry;
        } catch (retryError: any) {
          return rejectWithValue(
            retryError?.message || "Failed to create page after course bootstrap"
          );
        }
      }

      return rejectWithValue(error?.message || "Failed to create page from template");
    }
  }
);

export const deletePageFromCourse = createAsyncThunk(
  "course/deletePageFromCourse",
  async ({ courseId, pageId }: { courseId: string; pageId: string }) => {
    await pageService.deletePage(courseId, pageId);
    return { pageId };
  }
);

// Update page title with backend persistence
export const updatePageTitleThunk = createAsyncThunk(
  "course/updatePageTitle",
  async (
    { courseId, pageId, title }: { courseId: string; pageId: string; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await pageService.updatePage(courseId, pageId, { title });
      return response;
    } catch (error: any) {
      logger.error({
        event: "updatePageTitleThunk.error",
        message: "Failed to update page title",
        context: { courseId, pageId, title, error: error.message },
      });
      return rejectWithValue(
        error.response?.data?.message || "Failed to update page title"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
      // Mark dirty so Save button enables
      if (state.saveStatus === "saved") {
        state.saveStatus = "idle";
      }
    },

    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.saveStatus = "idle";
    },

    updatePage: (state, action: PayloadAction<Page>) => {
      if (state.currentCourse) {
        const index = state.currentCourse.pages.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.currentCourse.pages[index] = action.payload;
          state.saveStatus = "idle";
        }
      }
    },

    removePage: (state, action: PayloadAction<string>) => {
      if (state.currentCourse) {
        state.currentCourse.pages = state.currentCourse.pages.filter(
          (p) => p.id !== action.payload
        );
        state.currentCourse.pages.forEach((page, index) => {
          page.order = index;
        });
        state.saveStatus = "idle";
      }
    },

    reorderPages: (state, action: PayloadAction<string[]>) => {
      if (state.currentCourse) {
        const pageMap = new Map(
          state.currentCourse.pages.map((page) => [page.id, page])
        );
        state.currentCourse.pages = action.payload
          .map((id) => pageMap.get(id))
          .filter(Boolean) as Page[];
        state.currentCourse.pages.forEach((page, index) => {
          page.order = index;
        });
        state.saveStatus = "idle";
      }
    },

    setSaveStatus: (
      state,
      action: PayloadAction<CourseState["saveStatus"]>
    ) => {
      state.saveStatus = action.payload;
      if (action.payload === "saved") {
        state.lastSaved = new Date().toISOString();
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch courses";
      });

    // Fetch Course
    builder
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = apiCourseToSliceCourse(action.payload);
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch course";
      });

    // Save Course
    builder
      .addCase(saveCourse.pending, (state) => {
        state.isSaving = true;
        state.saveStatus = "saving";
        state.error = null;
      })
      .addCase(saveCourse.fulfilled, (state, action) => {
        state.isSaving = false;
        state.saveStatus = "saved";
        state.lastSaved = new Date().toISOString();
        if (state.currentCourse) {
          state.currentCourse.id = action.payload.id;
          state.currentCourse.updatedAt = action.payload.updatedAt;
        }
      })
      .addCase(saveCourse.rejected, (state, action) => {
        state.isSaving = false;
        state.saveStatus = "error";
        state.error = action.error.message || "Failed to save course";
      });

    // Fetch Templates
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      if (action.payload && Array.isArray(action.payload)) {
        state.templates = action.payload as any;
      } else if (action.payload && action.payload.raw) {
        state.rawTemplates = action.payload.raw;
        state.templates = action.payload.legacy;
      }
    });

    // Create Page from Template (via standard POST /courses/{courseId}/pages)
    builder.addCase(createPageFromTemplate.fulfilled, (state, action) => {
      if (state.currentCourse) {
        const raw = action.payload as any;
        // Response is a PageResponse: { pageId, title, order, components[], ... }
        const componentType =
          raw.components?.[0]?.componentType || "content-text";
        const mapped = mapBackendPageToPage({
          id: raw.pageId || raw.id,
          course_id: raw.courseId || raw.course_id || "",
          title: raw.title,
          type: componentType,
          content: raw.components?.[0]?.data || {},
          page_order: typeof raw.order === "number"
            ? raw.order
            : state.currentCourse.pages.length,
          is_published: true,
          created_at: raw.createdAt || raw.created_at,
          updated_at: raw.updatedAt || raw.updated_at,
        });

        const existingIndex = state.currentCourse.pages.findIndex(
          (p) => p.id === mapped.id
        );
        if (existingIndex !== -1) {
          state.currentCourse.pages[existingIndex] = mapped;
        } else {
          state.currentCourse.pages.push(mapped);
        }
      }
    });

    // Delete Page from Course (via DELETE /courses/{courseId}/pages/{pageId})
    builder.addCase(deletePageFromCourse.fulfilled, (state, action) => {
      if (state.currentCourse) {
        state.currentCourse.pages = state.currentCourse.pages.filter(
          (p) => p.id !== action.payload.pageId
        );
        state.currentCourse.pages.forEach((page, index) => {
          page.order = index;
        });
        state.saveStatus = "idle";
      }
    });

    // Update Page Title (via PATCH /courses/{courseId}/pages/{pageId})
    builder
      .addCase(updatePageTitleThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updatePageTitleThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        if (state.currentCourse) {
          const pageIndex = state.currentCourse.pages.findIndex(
            (p) => p.id === action.payload.pageId || p.id === (action.payload as any).id
          );
          if (pageIndex !== -1) {
            // Map backend response to frontend Page model
            const responsePage = action.payload as any;
            state.currentCourse.pages[pageIndex] = mapBackendPageToPage({
              id: responsePage.pageId || responsePage.id,
              course_id: responsePage.courseId || responsePage.course_id || "",
              title: responsePage.title,
              type: state.currentCourse.pages[pageIndex].templateType,
              content: state.currentCourse.pages[pageIndex].content,
              page_order: state.currentCourse.pages[pageIndex].order,
              is_published: true,
              created_at: responsePage.createdAt || state.currentCourse.pages[pageIndex].lastModified,
              updated_at: responsePage.updatedAt || new Date().toISOString(),
            });
          }
        }
      })
      .addCase(updatePageTitleThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentCourse,
  clearCurrentCourse,
  updatePage,
  removePage,
  reorderPages,
  setSaveStatus,
  clearError,
} = courseSlice.actions;

export default courseSlice.reducer;
