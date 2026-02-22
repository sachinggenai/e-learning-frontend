/**
 * Header Component
 * Implements navigation, course info, and action buttons as specified in Phase 1
 */

import {
  CheckCircle,
  Download,
  Edit3,
  Eye,
  FileText,
  Loader,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useValidation } from "../hooks/useValidation";
import { t } from "../i18n/strings";
import { exportService } from "../services/ExportService";
import { RootState, useAppDispatch } from "../store/index";
import {
  clearCurrentCourse,
  clearError,
  saveCourse,
  setCurrentCourse,
} from "../store/slices/courseSlice";
import { Course, HeaderProps } from "../types/comprehensive";
import logger from "../utils/logger";
import logoSvg from "../assets/logo.svg";
import "./Header.css";
import { useToast } from "./Toast";
import { ValidationPanel } from "./ValidationPanel";

const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  isBackendConnected,
}) => {
  const dispatch = useAppDispatch();
  const { validate, errors, warnings, hasErrors, hasWarnings, isValidating } =
    useValidation();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  // Safe Redux selectors with null checking
  const courseState = useSelector((state: RootState) => (state as any).course);
  const course = courseState?.currentCourse || null;
  const isDirty = courseState?.saveStatus !== "saved";
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
      showToast(t("save.success", "Course saved successfully!"), "success");
    } catch (error) {
      console.error("Failed to save course:", error);
      showToast(t("save.error", "Failed to save course. Please try again."), "error");
    }
  };

  const handleExport = async () => {
    if (!course) {
      showToast(t("export.no.course", "Please load a course before exporting."), "warning");
      return;
    }
    try {
      // Check validation errors first (from useValidation hook, not API errors)
      if (errors.length > 0) {
        showToast(
          t(
            "export.validation.block",
            "Please fix {count} validation error(s) before exporting"
          ).replace("{count}", String(errors.length)),
          "error"
        );
        return;
      }

      setIsExporting(true);

      // Confirm SCORM export
      const confirmExport = confirm(
        t(
          "export.confirm",
          'Export "{title}" as SCORM package?\n\nThis will download a ZIP file ready for LMS upload.'
        ).replace("{title}", course?.title || "course")
      );
      if (!confirmExport) return;

      console.log("Starting SCORM export for course:", course.courseId);

      const result = await exportService.exportScorm(course.courseId, 'scorm_1_2');

      if (result.success && result.downloadUrl) {
        // Trigger download of the ZIP file
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", result.downloadUrl);
        linkElement.setAttribute(
          "download",
          result.fileName || `${course.courseId}_scorm.zip`
        );
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);

        // Clean up the blob URL
        window.URL.revokeObjectURL(result.downloadUrl);

        console.log("SCORM package exported successfully:", result.fileName);
        showToast(t("export.success", "SCORM package downloaded successfully!"), "success");
      } else {
        throw new Error(result.error || "Export failed");
      }
    } catch (error: any) {
      console.error("Export failed:", error);
      showToast(
        t("export.error", "Failed to export course: {error}").replace(
          "{error}",
          error.message || "Unknown error"
        ),
        "error"
      );
      logger.error({
        event: "course.export.error",
        message: "Course export failed",
        context: { courseId: course?.courseId, error: error.message },
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleValidate = async () => {
    if (!course) {
      showToast(t("validate.no.course", "Please load a course before validating."), "warning");
      return;
    }

    try {
      const result = await validate(course);
      if (result.valid) {
        showToast(t("validate.success", "Validation passed — no issues found!"), "success");
      } else {
        const errorCount = result.errors.filter(e => e.level === "error").length;
        const warnCount = result.errors.filter(e => e.level === "warning").length;
        const parts: string[] = [];
        if (errorCount > 0) parts.push(`${errorCount} error${errorCount > 1 ? "s" : ""}`);
        if (warnCount > 0) parts.push(`${warnCount} warning${warnCount > 1 ? "s" : ""}`);
        showToast(
          t("validate.issues", "Validation found {issues}").replace("{issues}", parts.join(", ")),
          errorCount > 0 ? "error" : "warning"
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
      showToast(t("validate.error", "Validation failed. Please try again."), "error");
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
      language: "en",
      version: "1.0.0",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: [
        {
          pageId: `welcome_${timestamp}`,
          title: "Welcome Page",
          order: 0,
          components: [
            {
              componentId: `welcome_comp_${timestamp}`,
              componentType: "welcome",
              order: 0,
              data: {
                title: "Welcome to Your Course",
                subtitle: "An interactive learning experience",
                description: "Get started by exploring the pages and adding your own content.",
              },
            },
          ],
        },
        {
          pageId: `content_${timestamp}`,
          title: "Introduction Page",
          order: 1,
          components: [
            {
              componentId: `content_comp_${timestamp}`,
              componentType: "content-text",
              order: 0,
              data: {
                title: "Course Introduction",
                body: "In this section, we will cover the fundamental concepts that form the foundation of this subject matter.",
              },
            },
          ],
        },
      ],
    };

    try {
      // Set the course in Redux first
      dispatch(setCurrentCourse(exampleCourse as any));
      // Then save it to the backend
      await dispatch(saveCourse(exampleCourse as any)).unwrap();
      showToast(t("load.example.success", "Example course loaded successfully!"), "success");
      console.log("Example course loaded and saved successfully");
    } catch (error) {
      console.error("Failed to save example course:", error);
      showToast(
        t(
          "load.example.error",
          "Failed to load example course. Please try again."
        ),
        "error"
      );
    }
  };
  // Block export when there are real validation errors (from useValidation hook)
  const blockingErrors = errors.length;

  if (!course) {
    return (
      <header className="header">
        <div className="header-left">
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
              <FileText size={14} /> Load Example
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-left">
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

      <div className="header-nav-and-actions">
        <nav className="view-switcher">
          <button
            className={`nav-button ${currentView === "editor" ? "active" : ""}`}
            onClick={() => onViewChange("editor")}
            disabled={isLoading}
          >
            <Edit3 size={14} />
            Editor
          </button>
          <button
            className={`nav-button ${currentView === "preview" ? "active" : ""}`}
            onClick={() => onViewChange("preview")}
            disabled={isLoading}
          >
            <Eye size={14} />
            Preview
          </button>
        </nav>

        <div className="header-right">
          <div className="action-buttons">
          <button
            className="action-button"
            onClick={handleSave}
            disabled={isLoading || !isDirty}
            title="Save course (Ctrl+S)"
          >
            <Save size={14} /> Save
          </button>
          <button
            className="action-button"
            onClick={handleValidate}
            disabled={isLoading || isValidating}
            title="Validate course"
          >
            {isValidating ? <Loader size={14} className="spin-icon" /> : <ShieldCheck size={14} />} Validate
          </button>
          <button
            className="action-button primary"
            onClick={handleExport}
            disabled={isLoading || isExporting || !isBackendConnected || blockingErrors > 0}
            title={
              blockingErrors > 0
                ? "Fix errors before exporting"
                : isExporting
                ? "Exporting..."
                : "Export as SCORM"
            }
          >
            {isExporting ? <Loader size={14} className="spin-icon" /> : <Download size={14} />}
            {isExporting ? " Exporting..." : " Export"}
          </button>
          <button
            className="action-button"
            onClick={handleReset}
            disabled={isLoading}
            title="Reset course"
          >
            <RotateCcw size={14} /> Reset
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
      </div>

      {/* Validation Panel */}
      {(hasErrors || hasWarnings) && (
        <div className="validation-container">
          <ValidationPanel
            errors={errors}
            warnings={warnings}
            onErrorClick={(error) => {
              // TODO: Implement navigation to error location
            }}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
