/**
 * Course Context for global state management
 * Implements React Context pattern for course data and editor state
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { apiService } from "../services/api";
import {
  Course,
  EditorState,
  Template,
  ValidationError,
} from "../types/course";
import logger from "../utils/logger";
import { transformCourseForBackend } from "../utils/transform";
import { validateCourseFull } from "../utils/validation";

// Default course structure with unique ID generation
const createDefaultCourse = (): Course => {
  // Generate unique course ID with timestamp + random suffix to prevent collisions
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const courseId = `course_${timestamp}_${randomSuffix}`;

  return {
    courseId,
    title: "New Course",
    description: "Enter course description here",
    author: "Author Name",
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templates: [
      {
        id: `template_${timestamp}_${randomSuffix}_welcome`,
        type: "welcome",
        title: "Welcome",
        order: 0,
        data: {
          title: "Work in Progress",
          subtitle: "Work in Progress",
          description: "Work in Progress: This is an introduction to your eLearning course.",
        },
      },
    ],
    assets: [],
    navigation: {
      allowSkip: false,
      showProgress: true,
      lockProgression: false, // Will be transformed to linearProgression
    },
    settings: {
      theme: "default" as const,
      autoplay: false,
      duration: undefined,
    },
    // Note: data field will be added to Course type in future update
  };
};

// Course Context State
interface CourseContextState {
  course: Course;
  editorState: EditorState;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
}

// Action types
type CourseAction =
  | { type: "SET_COURSE"; payload: Course }
  | { type: "UPDATE_COURSE_INFO"; payload: Partial<Course> }
  | { type: "ADD_TEMPLATE"; payload: Template }
  | { type: "UPDATE_TEMPLATE"; payload: { index: number; template: Template } }
  | { type: "DELETE_TEMPLATE"; payload: number }
  | {
      type: "REORDER_TEMPLATES";
      payload: { fromIndex: number; toIndex: number };
    }
  | { type: "SET_CURRENT_TEMPLATE"; payload: number }
  | { type: "SET_PREVIEW_MODE"; payload: boolean }
  | { type: "SET_DIRTY"; payload: boolean }
  | { type: "SET_VALIDATION_ERRORS"; payload: ValidationError[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_COURSE" };

// Initial state
const initialState: CourseContextState = {
  course: createDefaultCourse(),
  editorState: {
    currentTemplate: 0,
    isPreviewMode: false,
    isDirty: false,
    validationErrors: [],
  },
  isLoading: false,
  error: null,
  validationErrors: [],
};

// Validation helpers (following SRP)
const validateCourseData = (course: Partial<Course>): boolean => {
  return !!(course.courseId && course.title);
};

const validateTemplateData = (template: Template): boolean => {
  return !!(template.id && template.type);
};

const validateTemplateIndex = (
  index: number,
  templates: Template[],
): boolean => {
  return index >= 0 && index < templates.length;
};

// Reducer function with validation
const courseReducer = (
  state: CourseContextState,
  action: CourseAction,
): CourseContextState => {
  switch (action.type) {
    case "SET_COURSE":
      if (!validateCourseData(action.payload)) {
        console.warn("Invalid course data provided to SET_COURSE");
        return state;
      }
      return {
        ...state,
        course: action.payload,
        editorState: {
          ...state.editorState,
          isDirty: false,
          validationErrors: [],
        },
      };

    case "UPDATE_COURSE_INFO":
      if (!validateCourseData({ ...state.course, ...action.payload })) {
        console.warn("Invalid course info update");
        return state;
      }
      return {
        ...state,
        course: {
          ...state.course,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
        editorState: {
          ...state.editorState,
          isDirty: true,
        },
      };

    case "ADD_TEMPLATE":
      if (!validateTemplateData(action.payload)) {
        console.warn("Invalid template data provided to ADD_TEMPLATE");
        return state;
      }
      const newTemplates = [...state.course.templates, action.payload];
      return {
        ...state,
        course: {
          ...state.course,
          templates: newTemplates,
          updatedAt: new Date().toISOString(),
        },
        editorState: {
          ...state.editorState,
          isDirty: true,
        },
      };

    case "UPDATE_TEMPLATE":
      if (
        !validateTemplateIndex(action.payload.index, state.course.templates)
      ) {
        console.warn("Invalid template index for UPDATE_TEMPLATE");
        return state;
      }
      if (!validateTemplateData(action.payload.template)) {
        console.warn("Invalid template data for UPDATE_TEMPLATE");
        return state;
      }
      const updatedTemplates = [...state.course.templates];
      updatedTemplates[action.payload.index] = action.payload.template;
      return {
        ...state,
        course: {
          ...state.course,
          templates: updatedTemplates,
          updatedAt: new Date().toISOString(),
        },
        editorState: {
          ...state.editorState,
          isDirty: true,
        },
      };

    case "DELETE_TEMPLATE":
      if (!validateTemplateIndex(action.payload, state.course.templates)) {
        console.warn("Invalid template index for DELETE_TEMPLATE");
        return state;
      }
      if (state.course.templates.length <= 1) {
        console.warn("Cannot delete last template");
        return state;
      }
      const filteredTemplates = state.course.templates.filter(
        (_, index) => index !== action.payload,
      );
      // Reorder remaining templates
      const reorderedTemplates = filteredTemplates.map((template, index) => ({
        ...template,
        order: index,
      }));

      return {
        ...state,
        course: {
          ...state.course,
          templates: reorderedTemplates,
          updatedAt: new Date().toISOString(),
        },
        editorState: {
          ...state.editorState,
          currentTemplate: Math.min(
            state.editorState.currentTemplate,
            reorderedTemplates.length - 1,
          ),
          isDirty: true,
        },
      };

    case "REORDER_TEMPLATES":
      const { fromIndex, toIndex } = action.payload;
      if (
        !validateTemplateIndex(fromIndex, state.course.templates) ||
        !validateTemplateIndex(toIndex, state.course.templates)
      ) {
        console.warn("Invalid indices for REORDER_TEMPLATES");
        return state;
      }
      const templatesForReorder = [...state.course.templates];
      const [removed] = templatesForReorder.splice(fromIndex, 1);
      templatesForReorder.splice(toIndex, 0, removed);

      // Update order property
      const reorderedForOrder = templatesForReorder.map((template, index) => ({
        ...template,
        order: index,
      }));

      return {
        ...state,
        course: {
          ...state.course,
          templates: reorderedForOrder,
          updatedAt: new Date().toISOString(),
        },
        editorState: {
          ...state.editorState,
          currentTemplate: toIndex,
          isDirty: true,
        },
      };

    case "SET_CURRENT_TEMPLATE":
      if (!validateTemplateIndex(action.payload, state.course.templates)) {
        console.warn("Invalid template index for SET_CURRENT_TEMPLATE");
        return state;
      }
      return {
        ...state,
        editorState: {
          ...state.editorState,
          currentTemplate: action.payload,
        },
      };

    case "SET_PREVIEW_MODE":
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isPreviewMode: action.payload,
        },
      };

    case "SET_DIRTY":
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isDirty: action.payload,
        },
      };

    case "SET_VALIDATION_ERRORS":
      return {
        ...state,
        editorState: {
          ...state.editorState,
          validationErrors: action.payload,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "RESET_COURSE":
      return {
        ...initialState,
        course: createDefaultCourse(),
      };

    default:
      return state;
  }
};

// Context interface
interface CourseContextType extends CourseContextState {
  // Course actions
  setCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  updateCourseInfo: (info: Partial<Course>) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (index: number, template: Template) => void;
  deleteTemplate: (index: number) => void;
  reorderTemplates: (fromIndex: number, toIndex: number) => void;

  // Editor actions
  setCurrentTemplate: (index: number) => void;
  setPreviewMode: (isPreview: boolean) => void;

  // Validation
  validateCourse: () => Promise<boolean>;
  validationErrors: ValidationError[];

  // File operations
  loadCourse: (courseData: Course) => void;
  saveCourse: () => Promise<void>;
  exportCourse: (format: string, includeAssets: boolean) => Promise<void>;

  // Utility
  resetCourse: () => void;
}

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Provider component
interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  // Course actions
  const setCourse = useCallback((course: Course) => {
    dispatch({ type: "SET_COURSE", payload: course });
  }, []);

  const updateCourseInfo = useCallback((info: Partial<Course>) => {
    dispatch({ type: "UPDATE_COURSE_INFO", payload: info });
  }, []);

  const addTemplate = useCallback((template: Template) => {
    dispatch({ type: "ADD_TEMPLATE", payload: template });
  }, []);

  const updateTemplate = useCallback((index: number, template: Template) => {
    dispatch({ type: "UPDATE_TEMPLATE", payload: { index, template } });
  }, []);

  const deleteTemplate = useCallback(
    (index: number) => {
      if (state.course.templates.length > 1) {
        dispatch({ type: "DELETE_TEMPLATE", payload: index });
      }
    },
    [state.course.templates.length],
  );

  const reorderTemplates = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: "REORDER_TEMPLATES", payload: { fromIndex, toIndex } });
  }, []);

  // Editor actions
  const setCurrentTemplate = useCallback((index: number) => {
    dispatch({ type: "SET_CURRENT_TEMPLATE", payload: index });
  }, []);

  const setPreviewMode = useCallback((isPreview: boolean) => {
    dispatch({ type: "SET_PREVIEW_MODE", payload: isPreview });
  }, []);

  // Validation
  const validateCourse = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Client-side validation
      const clientValidation = validateCourseFull(state.course);

      // Transform course data for backend validation
      const backendCourseData = transformCourseForBackend(state.course);
      const serverValidation = await apiService.validateCourse(
        JSON.stringify(backendCourseData),
      );

      const merged = [...clientValidation.errors, ...serverValidation.errors];
      // Categorize based on heuristic (type added for server 422; client errors have no type)
      const structural: ValidationError[] = [];
      const business: ValidationError[] = [];
      const other: ValidationError[] = [];
      (merged as any[]).forEach((err) => {
        const t = (err as any).type;
        if (t === "value_error" || t === "type_error") structural.push(err);
        else if (t === "business_rule_error") business.push(err);
        else other.push(err);
      });
      const ordered = [...structural, ...business, ...other];
      dispatch({ type: "SET_VALIDATION_ERRORS", payload: ordered });
      return ordered.length === 0;
    } catch (error) {
      console.error("Validation failed:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to validate course" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.course]);

  // File operations
  const loadCourse = useCallback(
    (courseData: Course) => {
      try {
        // Validate loaded course data
        if (!validateCourseData(courseData)) {
          throw new Error("Invalid course data structure");
        }

        // Validate templates
        if (!courseData.templates || !Array.isArray(courseData.templates)) {
          throw new Error("Course templates must be an array");
        }

        // Validate each template
        for (const template of courseData.templates) {
          if (!validateTemplateData(template)) {
            console.warn("Invalid template data found:", template);
            // Continue loading but log warning
          }
        }

        setCourse(courseData);
        logger.info({
          event: "course.load.success",
          message: "Course loaded with validation",
          context: {
            title: courseData.title,
            id: courseData.courseId,
            templates: courseData.templates.length,
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load course";
        logger.error({
          event: "course.load.error",
          message: errorMessage,
          error,
          context: { courseData },
        });
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [setCourse],
  );

  const saveCourse = useCallback(async () => {
    console.log("🎯 CourseContext.saveCourse called", {
      courseId: state.course.courseId,
      courseTitle: state.course.title,
      templatesCount: state.course.templates?.length || 0,
      assetsCount: state.course.assets?.length || 0,
    });

    try {
      console.log("⏳ CourseContext.saveCourse - Setting loading state");
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Validate course before saving
      console.log("🔍 CourseContext.saveCourse - Starting validation");
      const isValid = await validateCourse();
      console.log("✅ CourseContext.saveCourse - Validation result:", {
        isValid,
      });

      if (!isValid) {
        throw new Error(
          "Course validation failed. Please fix errors before saving.",
        );
      }

      // Transform course data for backend
      console.log("🔄 CourseContext.saveCourse - Transforming course data");
      const backendCourseData = transformCourseForBackend(state.course);

      // Use the existing saveCourse method
      console.log(
        "📡 CourseContext.saveCourse - Calling apiService.saveCourse",
      );
      const response = await apiService.saveCourse(state.course);

      console.log("📥 CourseContext.saveCourse - API response received:", {
        success: response.success,
        hasCourseData: !!response.course,
        returnedId: response.course?.id,
        error: response.error,
      });

      if (response.success) {
        // Update local state with server response if available
        if (response.course) {
          console.log(
            "🔄 CourseContext.saveCourse - Updating local state with server response",
          );
          dispatch({ type: "SET_COURSE", payload: response.course });
        }

        console.log(
          "✅ CourseContext.saveCourse - Setting dirty flag to false",
        );
        dispatch({ type: "SET_DIRTY", payload: false });

        logger.info({
          event: "course.save.success",
          message: `Course ${response.isNew ? "created" : "updated"} successfully`,
          context: {
            id: response.course?.courseId || state.course.courseId,
            isNew: response.isNew,
          },
        });
      } else {
        console.error(
          "❌ CourseContext.saveCourse - API returned error:",
          response.error,
        );
        throw new Error(response.error || "Failed to save course");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save course";
      console.error("💥 CourseContext.saveCourse - Exception caught:", {
        error: errorMessage,
        courseId: state.course.courseId,
        courseTitle: state.course.title,
      });

      logger.error({
        event: "course.save.error",
        message: errorMessage,
        error,
        context: { id: state.course.courseId },
      });
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error; // Re-throw to allow caller to handle
    } finally {
      console.log("🏁 CourseContext.saveCourse - Setting loading to false");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.course, validateCourse]);

  // Transform frontend course data to backend-expected format
  // Removed local transform; using shared utility in utils/transform.ts

  const exportCourse = useCallback(
    async (format: string = "scorm", includeAssets: boolean = true) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        // Validate format parameter
        const validFormats = ["scorm", "html", "pdf"];
        if (!validFormats.includes(format.toLowerCase())) {
          throw new Error(
            `Invalid export format: ${format}. Supported formats: ${validFormats.join(", ")}`,
          );
        }

        // Validate course has content to export
        if (!state.course.templates || state.course.templates.length === 0) {
          throw new Error("Cannot export course with no templates");
        }

        // Transform course data to backend format
        const backendCourseData = transformCourseForBackend(state.course);

        const response = await apiService.exportCourse({
          courseData: JSON.stringify(backendCourseData),
          format: format.toLowerCase(),
          includeAssets,
        });

        if (response.success && response.downloadUrl) {
          // Trigger download with better error handling
          try {
            const link = document.createElement("a");
            link.href = response.downloadUrl;
            link.download = response.filename || `course-export-${format}.zip`;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up object URL after a delay to ensure download starts
            setTimeout(() => {
              if (response.downloadUrl) {
                window.URL.revokeObjectURL(response.downloadUrl);
              }
            }, 1000);

            logger.info({
              event: "export.success",
              message: "Course export completed",
              context: {
                format: format.toLowerCase(),
                includeAssets,
                filename: response.filename,
                courseId: state.course.courseId,
              },
            });
          } catch (downloadError) {
            console.error("Download trigger failed:", downloadError);
            // Fallback: open in new tab
            window.open(response.downloadUrl, "_blank");
          }
        } else {
          throw new Error(response.error || "Export failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to export course";
        logger.error({
          event: "export.error",
          message: errorMessage,
          error,
          context: {
            format,
            includeAssets,
            courseId: state.course.courseId,
          },
        });
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.course],
  );

  const resetCourse = useCallback(() => {
    dispatch({ type: "RESET_COURSE" });
  }, []);

  const updateCourse = useCallback((course: Course) => {
    dispatch({ type: "SET_COURSE", payload: course });
  }, []);

  const contextValue: CourseContextType = {
    ...state,
    setCourse,
    updateCourse,
    updateCourseInfo,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    reorderTemplates,
    setCurrentTemplate,
    setPreviewMode,
    validateCourse,
    validationErrors: state.validationErrors || [],
    loadCourse,
    saveCourse,
    exportCourse,
    resetCourse,
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

export default CourseContext;
