/**
 * Course Slice
 *
 * Manages course-level state including pages, templates, and persistence status.
 * Handles communication with the backend API for course operations.
 */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import {
  Course as ApiCourse,
  Template as ApiTemplate,
  ContentData,
  MCQData,
  SummaryData,
  WelcomeData,
} from "../../types/course";
import logger from "../../utils/logger";
import { Page } from "./editorSlice";

// Types for course state
export interface Course {
  id?: number;
  courseId: string;
  title: string;
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
  // Raw backend template DTOs (Phase 1: baseline capture before adapter layer)
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

// Validation helper
const validateCourseForSave = (course: Partial<Course>): string | null => {
  if (!course.courseId?.trim()) return "Course ID is required";
  if (!course.title?.trim()) return "Course title is required";
  if (!course.pages?.length) return "Course must have at least one page";

  for (const page of course.pages) {
    if (!page.title?.trim()) return `Page "${page.id}" needs a title`;
    if (!page.templateType)
      return `Page "${page.title || page.id}" needs a template type`;
  }

  return null; // Valid
};

// Safe data access helpers
const safeGet = (obj: any, key: string, defaultValue: any = "") => {
  return obj && typeof obj === "object" && obj[key] !== undefined
    ? obj[key]
    : defaultValue;
};

const safeGetArray = (obj: any, key: string, defaultValue: any[] = []) => {
  const value = safeGet(obj, key, defaultValue);
  return Array.isArray(value) ? value : defaultValue;
};

// Template type mapping
const TEMPLATE_TYPE_MAPPING = {
  "content-text": "content_text",
  "content-video": "content_video",
  mcq: "mcq",
  welcome: "welcome",
  summary: "summary",
} as const;

const mapTemplateType = (frontendType: string): string => {
  return (
    TEMPLATE_TYPE_MAPPING[frontendType as keyof typeof TEMPLATE_TYPE_MAPPING] ||
    frontendType
  );
};

// Async thunks for API operations
export const fetchCourses = createAsyncThunk(
  "course/fetchCourses",
  async () => {
    const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
    const response = await fetch(`${apiBase}/courses`);
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return response.json();
  }
);

export const fetchCourse = createAsyncThunk(
  "course/fetchCourse",
  async (courseId: string) => {
    const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
    const response = await fetch(`${apiBase}/courses/${courseId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch course");
    }
    return response.json();
  }
);

export const saveCourse = createAsyncThunk(
  "course/saveCourse",
  async (course: Partial<Course>) => {
    logger.info({
      event: "course.save.started",
      message: "Course save operation initiated",
      context: {
        courseId: course.courseId,
        title: course.title,
        pagesCount: course.pages?.length || 0,
      },
    });

    // Validate course data
    const validationError = validateCourseForSave(course);
    if (validationError) {
      logger.warn({
        event: "course.save.validation.failed",
        message: validationError,
        context: { courseId: course.courseId },
      });
      throw new Error(validationError);
    }

    // Convert courseSlice Course to API Course structure
    const apiCourse: ApiCourse = {
      courseId: course.courseId || "",
      title: course.title || "",
      description: course.description || "",
      author: "User", // Default author
      version: "1.0",
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templates: (course.pages || []).map((page, index): ApiTemplate => {
        let data: WelcomeData | ContentData | MCQData | SummaryData;

        switch (page.templateType) {
          case "welcome":
            data = {
              title: page.title,
              subtitle: safeGet(page.content, "subtitle", ""),
              description: safeGet(page.content, "description", ""),
            } as WelcomeData;
            break;
          case "mcq":
            data = {
              question: safeGet(page.content, "question", ""),
              options: safeGetArray(page.content, "options", []),
            } as MCQData;
            break;
          case "summary":
            data = {
              title: page.title,
              keyPoints: safeGetArray(page.content, "keyPoints", []),
            } as SummaryData;
            break;
          case "content-text":
          case "content-video":
          default:
            data = {
              title: page.title,
              body: safeGet(page.content, "content", ""),
              videoUrl: safeGet(page.content, "videoUrl"),
              imageUrl: safeGet(page.content, "imageUrl"),
            } as ContentData;
            break;
        }

        return {
          id: page.id,
          type: mapTemplateType(page.templateType) as any,
          templateType: mapTemplateType(page.templateType) as any,
          title: page.title,
          order: page.order || index,
          data,
        };
      }),
      assets: [],
      navigation: {
        allowSkip: true,
        showProgress: true,
        lockProgression: false,
      },
      language: "en",
      settings: {
        theme: "default",
        autoplay: false,
      },
    };

    logger.info({
      event: "course.save.api.converted",
      message: "Course converted to API structure",
      context: {
        apiCourseId: apiCourse.courseId,
        apiCourseTitle: apiCourse.title,
        templatesCount: apiCourse.templates.length,
      },
    });

    const result = await apiService.saveCourse(apiCourse);

    if (!result.success) {
      logger.error({
        event: "course.save.api.failed",
        message: "API save operation failed",
        context: { error: result.error },
      });
      throw new Error(result.error);
    }

    logger.info({
      event: "course.save.api.success",
      message: "Course saved successfully via API",
      context: {
        returnedCourseId: result.course.courseId || result.course.id,
        returnedCourseTitle: result.course.title,
        isNew: result.isNew,
      },
    });

    // Convert back to courseSlice format for Redux state
    const savedCourse: Course = {
      id: result.course.id || course.id,
      courseId: result.course.courseId || course.courseId || "",
      title: result.course.title || course.title || "",
      description: result.course.description || course.description,
      status: result.course.status || course.status || "draft",
      pages: course.pages || [], // Keep original pages since API doesn't return them
      createdAt: result.course.createdAt || course.createdAt,
      updatedAt: result.course.updatedAt || new Date().toISOString(),
    };

    return savedCourse;
  }
);

export const fetchTemplates = createAsyncThunk(
  "course/fetchTemplates",
  async (_: any) => {
    // Accept courseId but don't use it since templates are global
    const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
    const response = await fetch(`${apiBase}/courses/templates/available`);
    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }
    const data = await response.json();
    const backendTemplates = data.templates || [];

    // Phase 1: Return both raw backend DTOs and legacy normalized structure (to avoid breaking UI);
    // Adapter layer will replace this in a later phase.
    const legacyNormalize = (tpls: any[]): Template[] => {
      const categoryToType: Record<string, string> = {
        introduction: "content-text",
        lab: "content-text",
        assessment: "mcq",
      };
      return tpls.map((tpl: any, index: number) => {
        const content: Record<string, any> = {};
        if (Array.isArray(tpl.data?.content)) {
          // If backend already shaped things differently, skip array assumption
        }
        if (Array.isArray(tpl.fields)) {
          tpl.fields.forEach((f: any) => {
            content[f.name] = ""; // default empty values
          });
        }
        const mappedType = categoryToType[tpl.category] || "content-text";
        if (mappedType === "mcq") {
          content.question = content.question || "";
          content.options = content.options || ["", "", "", ""];
          content.correctAnswer = content.correctAnswer || "";
        } else if (mappedType === "content-text") {
          if (!content.content) content.content = "";
          if (!content.title) content.title = tpl.name;
        }
        return {
          id: tpl.id,
          templateId: tpl.id,
          // maintain old field for UI usage until adapter introduced
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

// Deprecated local createPage thunk removed (backend-driven creation supersedes it)

// Phase 3: backend-driven page creation
export const createPageFromTemplate = createAsyncThunk(
  "course/createPageFromTemplate",
  async (params: {
    courseId: number | string;
    templateId: string;
    pageTitle: string;
    customizations?: Record<string, any>;
    pageOrder?: number;
  }) => {
    const {
      courseId,
      templateId,
      pageTitle,
      customizations = {},
      pageOrder,
    } = params;
    const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";
    const response = await fetch(
      `${apiBase}/courses/${courseId}/pages/from-template`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: templateId,
          page_title: pageTitle,
          customizations,
          page_order: pageOrder,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create page from template");
    }
    const data = await response.json();
    return data.page; // raw backend page DTO
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Course Management
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },

    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },

    // Page Management (addPage removed)

    updatePage: (state, action: PayloadAction<Page>) => {
      console.log("═══════════════════════════════════════════════════");
      console.log("📝 courseSlice.updatePage REDUCER");
      console.log("═══════════════════════════════════════════════════");
      console.log("📌 Page ID:", action.payload.id);
      console.log("📌 Page Title:", action.payload.title);
      console.log(
        "📌 Page Content:",
        JSON.stringify(action.payload.content, null, 2)
      );

      if (state.currentCourse) {
        const index = state.currentCourse.pages.findIndex(
          (p) => p.id === action.payload.id
        );
        console.log("📌 Found at index:", index);

        if (index !== -1) {
          console.log(
            "📌 Old content:",
            JSON.stringify(state.currentCourse.pages[index].content, null, 2)
          );
          state.currentCourse.pages[index] = action.payload;
          console.log("✅ Page updated in courseSlice");
          console.log(
            "📌 New content:",
            JSON.stringify(state.currentCourse.pages[index].content, null, 2)
          );
        } else {
          console.log("❌ Page not found in pages array!");
        }
      } else {
        console.log("❌ No currentCourse!");
      }
      console.log("═══════════════════════════════════════════════════\n");
    },

    removePage: (state, action: PayloadAction<string>) => {
      if (state.currentCourse) {
        state.currentCourse.pages = state.currentCourse.pages.filter(
          (p) => p.id !== action.payload
        );
        // Reorder remaining pages
        state.currentCourse.pages.forEach((page, index) => {
          page.order = index;
        });
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

        // Update order indices
        state.currentCourse.pages.forEach((page, index) => {
          page.order = index;
        });
      }
    },

    // Status Management
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
        logger.info({
          event: "courses.loaded",
          message: "Courses list loaded",
          context: { count: action.payload.length },
        });
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
        const courseData = action.payload;

        // Transform pages to ensure compatibility with PageEditor
        const transformedPages = (courseData.data?.pages || []).map(
          (page: any) => ({
            ...page,
            // Ensure templateType field exists for PageEditor compatibility
            templateType: page.templateType || page.type || "content-text",
            // Ensure other required fields
            order: page.order || page.page_order || 0,
            isDraft: page.isDraft || !page.is_published,
            lastModified:
              page.lastModified || page.updated_at || new Date().toISOString(),
          })
        );

        state.currentCourse = {
          id: courseData.id,
          courseId: courseData.courseId,
          title: courseData.title,
          description: courseData.description,
          status: courseData.status,
          pages: transformedPages,
          createdAt: courseData.createdAt,
          updatedAt: courseData.updatedAt,
        };
        logger.info({
          event: "course.loaded",
          message: "Course loaded from backend",
          context: {
            id: courseData.id,
            courseId: courseData.courseId,
            pages: (courseData.data?.pages || []).length,
          },
        });
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch course";
      });

    // Save Course
    builder
      .addCase(saveCourse.pending, (state) => {
        logger.info({
          event: "course.save.pending",
          message: "Course save operation started",
          context: {
            currentCourseId: state.currentCourse?.id,
            currentCourseCourseId: state.currentCourse?.courseId,
            previousSaveStatus: state.saveStatus,
          },
        });
        state.isSaving = true;
        state.saveStatus = "saving";
        state.error = null;
      })
      .addCase(saveCourse.fulfilled, (state, action) => {
        logger.info({
          event: "course.save.fulfilled",
          message: "Course save completed successfully",
          context: {
            savedCourseId: action.payload.id,
            savedCourseCourseId: action.payload.courseId,
            savedCourseTitle: action.payload.title,
            currentCourseBefore: {
              id: state.currentCourse?.id,
              courseId: state.currentCourse?.courseId,
            },
          },
        });

        state.isSaving = false;
        state.saveStatus = "saved";
        state.lastSaved = new Date().toISOString();

        const savedCourse = action.payload;
        if (state.currentCourse) {
          logger.debug({
            event: "course.save.state.updated",
            message: "Current course state updated with saved data",
            context: {
              before: {
                id: state.currentCourse.id,
                updatedAt: state.currentCourse.updatedAt,
              },
              after: { id: savedCourse.id, updatedAt: savedCourse.updatedAt },
            },
          });
          state.currentCourse.id = savedCourse.id;
          state.currentCourse.updatedAt = savedCourse.updatedAt;
        }
      })
      .addCase(saveCourse.rejected, (state, action) => {
        logger.error({
          event: "course.save.rejected",
          message: "Course save operation failed",
          context: {
            error: action.error?.message,
            currentCourseId: state.currentCourse?.id,
            currentCourseCourseId: state.currentCourse?.courseId,
            previousSaveStatus: state.saveStatus,
          },
        });

        state.isSaving = false;
        state.saveStatus = "error";
        state.error = action.error.message || "Failed to save course";
      });

    // Fetch Templates
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      // Support both legacy UI and upcoming adapter pipeline
      if (action.payload && Array.isArray(action.payload)) {
        // Backwards safety: if older frontend version expects array
        state.templates = action.payload as any;
      } else if (action.payload && action.payload.raw) {
        state.rawTemplates = action.payload.raw;
        state.templates = action.payload.legacy; // keep UI operational
      }
    });

    // (Removed legacy createPage handler)
    // Backend page creation
    builder.addCase(createPageFromTemplate.fulfilled, (state, action) => {
      console.log("═══════════════════════════════════════════════════");
      console.log("🆕 createPageFromTemplate.fulfilled REDUCER");
      console.log("═══════════════════════════════════════════════════");
      console.log("📌 Raw payload:", JSON.stringify(action.payload, null, 2));

      if (state.currentCourse) {
        const raw = action.payload as any;
        const mapped = {
          id: raw.id,
          // backend provides type directly
          templateType: raw.type || raw.templateType || "content-text",
          title: raw.title,
          content: raw.content || {},
          order:
            typeof raw.page_order === "number"
              ? raw.page_order
              : state.currentCourse.pages.length,
          isDraft: raw.is_published === false,
          lastModified:
            raw.updated_at || raw.created_at || new Date().toISOString(),
        } as Page;

        console.log("📌 Mapped page:", JSON.stringify(mapped, null, 2));

        // Prevent duplicate pages
        const existingIndex = state.currentCourse.pages.findIndex(
          (p) => p.id === mapped.id
        );
        console.log("📌 Existing index:", existingIndex);

        if (existingIndex !== -1) {
          console.log("⚠️ Duplicate page - updating existing");
          state.currentCourse.pages[existingIndex] = mapped;
        } else {
          console.log("✅ New page - adding to array");
          state.currentCourse.pages.push(mapped);
        }

        console.log("📌 Total pages now:", state.currentCourse.pages.length);
        console.log(
          "📌 All page IDs:",
          state.currentCourse.pages.map((p) => p.id)
        );
      } else {
        console.log("❌ No currentCourse!");
      }
      console.log("═══════════════════════════════════════════════════\n");
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
