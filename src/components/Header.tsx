/**
 * Header Component
 * Implements navigation, course info, and action buttons as specified in Phase 1
 */

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useValidation } from "../hooks/useValidation";
import { t } from "../i18n/strings";
import { apiService } from "../services/api";
import { RootState, useAppDispatch } from "../store/index";
import {
  clearCurrentCourse,
  clearError,
  saveCourse,
  setCurrentCourse,
} from "../store/slices/courseSlice";
import { Course, HeaderProps } from "../types/comprehensive";
import logger from "../utils/logger";
import "./Header.css";
import { ValidationPanel } from "./ValidationPanel";

const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isBackendConnected,
}) => {
  const dispatch = useAppDispatch();
  const { validate, errors, warnings, hasErrors, hasWarnings, isValidating } =
    useValidation();

  // Safe Redux selectors with null checking
  const courseState = useSelector((state: RootState) => (state as any).course);
  const course = courseState?.currentCourse || null;
  const isDirty = courseState?.saveStatus !== "saved";
  const validationErrors = courseState?.error
    ? [{ message: courseState.error }]
    : [];
  const isLoading = courseState?.isLoading || false;

  // Clear any stale errors when component mounts
  React.useEffect(() => {
    if (courseState?.error) {
      dispatch(clearError());
    }
  }, []);

  // Handle save and export operations
  const handleSave = async () => {
    if (!course) return;
    try {
      await dispatch(saveCourse(course)).unwrap();
      console.log("Course saved successfully");
    } catch (error) {
      console.error("Failed to save course:", error);
      alert(t("save.error", "Failed to save course. Please try again."));
    }
  };

  const handleExport = async () => {
    if (!course) {
      alert(t("export.no.course", "Please load a course before exporting."));
      return;
    }
    try {
      // Check validation errors first
      if (validationErrors.length > 0) {
        alert(
          t(
            "export.validation.block",
            "Please fix {count} validation error(s) before exporting"
          ).replace("{count}", String(validationErrors.length))
        );
        return;
      }

      // Confirm SCORM export
      const confirmExport = confirm(
        t(
          "export.confirm",
          'Export "{title}" as SCORM package?\n\nThis will download a ZIP file ready for LMS upload.'
        ).replace("{title}", course?.title || "course")
      );
      if (!confirmExport) return;

      console.log("Starting SCORM export for course:", course.courseId);

      // Pass the raw frontend course to apiService - it will handle transformation
      // (Just like saveCourse does - no manual transformation needed)
      const result = await apiService.exportCourse({
        courseData: course, // Pass raw course, api.ts will transform it
        format: "scorm_1_2",
        includeAssets: true,
      });

      if (result.success && result.downloadUrl) {
        // Trigger download of the ZIP file
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", result.downloadUrl);
        linkElement.setAttribute(
          "download",
          result.filename || `${course.courseId}_scorm.zip`
        );
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        // Clean up the blob URL
        window.URL.revokeObjectURL(result.downloadUrl);

        console.log("SCORM package exported successfully:", result.filename);
        alert(t("export.success", "SCORM package downloaded successfully!"));
      } else {
        throw new Error(result.error || "Export failed");
      }
    } catch (error: any) {
      console.error("Export failed:", error);
      alert(
        t("export.error", "Failed to export course: {error}").replace(
          "{error}",
          error.message || "Unknown error"
        )
      );
      logger.error({
        event: "course.export.error",
        message: "Course export failed",
        context: { courseId: course?.courseId, error: error.message },
      });
    }
  };

  const handleValidate = async () => {
    if (!course) {
      alert(t("validate.no.course", "Please load a course before validating."));
      return;
    }

    try {
      const result = await validate(course);
      // The validation results are now available through the useValidation hook
      // UI will update automatically via the hook state
    } catch (error) {
      console.error("Validation failed:", error);
      alert(t("validate.error", "Validation failed. Please try again."));
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        t(
          "confirm.reset.course",
          "Are you sure you want to reset the course? All changes will be lost."
        )
      )
    ) {
      const existing = course;
      dispatch(clearCurrentCourse());
      logger.info({
        event: "course.reset",
        message: "Course reset by user",
        context: { courseId: existing?.courseId },
      });
    }
  };

  const handleLoadExample = async () => {
    // Create a simple example course that matches the Course interface
    const timestamp = Date.now();
    const exampleCourse: Course = {
      courseId: `example_course_${timestamp}`,
      title: "Sample eLearning Course",
      description: "This is an example course demonstrating all template types",
      author: "eLearning Team",
      version: "1.0.0",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [
        {
          id: `welcome_${timestamp}`,
          templateType: "welcome",
          title: "Welcome Page",
          order: 0,
          lastModified: new Date().toISOString(),
          content: {
            title: "Work in Progress",
            subtitle: "Work in Progress",
            description:
              "Work in Progress",
          },
        },
        {
          id: `content_${timestamp}`,
          templateType: "content-text",
          title: "Introduction Page",
          order: 1,
          lastModified: new Date().toISOString(),
          content: {
            title: "Course Introduction",
            body: "In this section, we will cover the fundamental concepts that form the foundation of this subject matter.",
          },
        },
      ],
    };

    try {
      // Set the course in Redux first
      dispatch(setCurrentCourse(exampleCourse));
      // Then save it to the backend
      await dispatch(saveCourse(exampleCourse)).unwrap();
      console.log("Example course loaded and saved successfully");
    } catch (error) {
      console.error("Failed to save example course:", error);
      alert(
        t(
          "load.example.error",
          "Failed to load example course. Please try again."
        )
      );
    }
  };
  const structuralCount = useMemo(
    () =>
      validationErrors.filter(
        (e) =>
          (e as any).type === "value_error" || (e as any).type === "type_error"
      ).length,
    [validationErrors]
  );
  const businessCount = useMemo(
    () =>
      validationErrors.filter((e) => (e as any).type === "business_rule_error")
        .length,
    [validationErrors]
  );
  const blockingErrors = structuralCount + businessCount;

  if (!course) {
    return (
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">eLearning Authoring Tool</h1>
          <div className="course-info">
            <span className="course-title">No Course Loaded</span>
          </div>
        </div>
        <div className="header-right">
          <div className="action-buttons">
            <button
              className="action-button primary"
              onClick={handleLoadExample}
              disabled={isLoading}
              title="Load example course"
            >
              📄 Load Example
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">eLearning Authoring Tool</h1>
        <div className="course-info">
          <span className="course-title">
            {course?.title || "Untitled Course"}
          </span>
          <span className="course-meta">
            by {course?.author || "Unknown"} • v{course?.version || "1.0.0"}
            {isDirty && <span className="dirty-indicator">*</span>}
          </span>
        </div>
      </div>

      <div className="header-center">
        <nav className="view-switcher">
          <button
            className={`nav-button ${currentView === "editor" ? "active" : ""}`}
            onClick={() => onViewChange("editor")}
            disabled={isLoading}
          >
            <span className="nav-icon">✏️</span>
            Editor
          </button>
          <button
            className={`nav-button ${currentView === "preview" ? "active" : ""}`}
            onClick={() => onViewChange("preview")}
            disabled={isLoading}
          >
            <span className="nav-icon">👁️</span>
            Preview
          </button>
        </nav>
      </div>

      <div className="header-right">
        <div className="action-buttons">
          <button
            className="action-button primary"
            onClick={handleExport}
            disabled={isLoading || !isBackendConnected || blockingErrors > 0}
            title={
              blockingErrors > 0
                ? "Fix errors before exporting"
                : "Export as SCORM"
            }
          >
            📦 Export
          </button>
        </div>

        {/* Connection status */}
        <div
          className={`connection-indicator ${isBackendConnected ? "connected" : "disconnected"}`}
        >
          <span className="status-dot"></span>
          <span className="status-text">
            {isBackendConnected ? "API Connected" : "API Offline"}
          </span>
        </div>
      </div>

      {/* Validation Panel */}
      {(hasErrors || hasWarnings) && (
        <div className="validation-container">
          <ValidationPanel
            errors={errors}
            warnings={warnings}
            onErrorClick={(error) => {
              // TODO: Implement navigation to error location
              console.log("Navigate to error:", error);
            }}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
