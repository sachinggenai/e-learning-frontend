/**
 * Menu Bar Component
 *
 * Implements industry-standard menu bar with File, Edit, Insert, Tools, View, Help menus.
 * Provides access to course management, undo/redo, validation, and other editor features.
 */

import React, { useEffect, useRef, useState } from "react";
import { normalizeTemplateType } from "../constants/templateTypes";
import { t, translateMenuName } from "../i18n/strings";
import { useAppDispatch, useAppSelector } from "../store";
import {
  Course,
  fetchCourses,
  saveCourse,
  setCurrentCourse,
} from "../store/slices/courseSlice";
import {
  clearCurrentPage,
  setValidationErrors,
} from "../store/slices/editorSlice";
import logger from "../utils/logger";
import MediaUpload from "./MediaUpload";
import "./MenuBar.css";
import ValidationErrorModal from "./ValidationErrorModal";

interface MenuItem {
  label?: string;
  action?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

// Utility function for URL validation
const isValidVideoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();

    // Explicit protocol guard (security hardening)
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }

    // Check for common video platforms
    return (
      domain.includes("youtube.com") ||
      domain.includes("youtu.be") ||
      domain.includes("vimeo.com") ||
      domain.includes("dailymotion.com") ||
      url.match(/\.(mp4|webm|ogg|avi|mov)$/i) !== null
    );
  } catch {
    return false;
  }
};

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveAttempts, setSaveAttempts] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const courseState = useAppSelector((state) => (state as any).course);
  const editorState = useAppSelector((state) => (state as any).editor);
  const { currentCourse } = courseState;
  const editorPresent = editorState.present || editorState;
  const { hasUnsavedChanges } = editorPresent;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrorsState] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(-1);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "n":
            event.preventDefault();
            handleNewCourse();
            break;
          case "s":
            event.preventDefault();
            handleSaveCourse();
            break;
          case "o":
            event.preventDefault();
            handleOpenCourse();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNewCourse = async () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm(
        t(
          "unsaved.changes.confirm",
          "You have unsaved changes. Save before creating a new course?"
        )
      );
      if (shouldSave) {
        await handleSaveCourse();
      }
    }

    const title = prompt(t("course.prompt.title", "Enter course title:"));
    if (title) {
      const courseId = `course_${Date.now()}`;
      const newCourse: Course = {
        id: Date.now(), // Temporary ID for client-side
        courseId,
        title,
        description: "A new course",
        status: "draft",
        pages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(setCurrentCourse(newCourse));
      dispatch(clearCurrentPage());
      logger.info({
        event: "course.created",
        message: "New course created (client-side)",
        context: { courseId: newCourse.courseId },
      });
    }
    setOpenMenu(null);
  };

  const handleOpenCourse = async () => {
    dispatch(fetchCourses());
    // In a real app, this would show a course selection dialog
    alert(
      t("course.open.placeholder", "Course selection dialog would appear here")
    );
    setOpenMenu(null);
  };

  const handleSaveCourse = async () => {
    if (!currentCourse) {
      console.log("🚫 MenuBar.handleSaveCourse - No current course, aborting");
      return;
    }

    console.log("🎯 MenuBar.handleSaveCourse - Save initiated from UI", {
      courseId: currentCourse.courseId,
      courseTitle: currentCourse.title,
      pagesCount: currentCourse.pages.length,
      hasId: !!currentCourse.id,
      saveAttempts: saveAttempts,
    });

    try {
      console.log(
        "🔄 MenuBar.handleSaveCourse - Clearing errors and setting loading"
      );
      setSaveError(null);
      setIsSaving(true);

      console.log("📡 MenuBar.handleSaveCourse - Dispatching saveCourse thunk");
      await dispatch(saveCourse(currentCourse)).unwrap();

      console.log("✅ MenuBar.handleSaveCourse - Save completed successfully");
      setSaveAttempts(0);
      logger.info({
        event: "course.save.success",
        message: "Course saved successfully",
      });
    } catch (err: any) {
      const attempt = saveAttempts + 1;
      setSaveAttempts(attempt);
      const message = err?.message || "Save failed";

      console.error("❌ MenuBar.handleSaveCourse - Save failed", {
        error: message,
        attempt,
        courseId: currentCourse.courseId,
        courseTitle: currentCourse.title,
      });

      setSaveError(message);
      logger.error({
        event: "course.save.error",
        message: "Course save failed",
        error: err,
        context: { attempt },
      });

      // Exponential backoff auto-retry up to 3 attempts
      if (attempt < 3) {
        const delay = Math.min(4000, 500 * 2 ** (attempt - 1));
        console.log("🔄 MenuBar.handleSaveCourse - Scheduling retry", {
          attempt: attempt + 1,
          delay,
        });

        logger.info({
          event: "course.save.retry.scheduled",
          message: "Scheduling retry",
          context: { attempt: attempt + 1, delay },
        });
        setTimeout(() => {
          handleSaveCourse();
        }, delay);
      }
    } finally {
      console.log("🏁 MenuBar.handleSaveCourse - Setting loading to false");
      setIsSaving(false);
      setOpenMenu(null);
    }
  };

  const handleExport = () => {
    if (currentCourse) {
      logger.info({
        event: "export_initiated",
        message: "User initiated export",
        context: {
          courseId: currentCourse.id,
          pageCount: currentCourse.pages.length,
        },
      });
      // Placeholder alert retains UX until real export wired
      alert(t("export.placeholder", "Export initiated (placeholder)"));
    }
    setOpenMenu(null);
  };

  const handleAddPageFromTemplate = () => {
    // This will be handled by the PageManager component
    alert(
      t(
        "add.page.via.manager",
        "Use the Page Manager panel to add pages from templates"
      )
    );
    setOpenMenu(null);
  };

  const handleValidatePage = () => {
    // Enhanced validation with detailed error objects
    const errors: any[] = [];
    let errorId = 0;

    if (editorPresent.currentPage) {
      const { title, content, templateType, id } = editorPresent.currentPage;
      const normalizedTemplateType = normalizeTemplateType(templateType);

      if (!title || title.trim() === "") {
        errors.push({
          id: `error-${++errorId}`,
          level: "error",
          message: t("validation.pageTitleRequired"),
          elementType: "Page Title",
          elementId: "page-title",
          pageId: id,
          suggestion:
            "Add a descriptive title to help learners understand the page content",
          autoFixable: false,
        });
      }

      // Template-specific validation
      if (normalizedTemplateType === "welcome") {
        if (!content.objectives || content.objectives.length === 0) {
          errors.push({
            id: `error-${++errorId}`,
            level: "error",
            message: "Welcome page must have at least one learning objective",
            elementType: "Learning Objectives",
            elementId: "objectives",
            pageId: id,
            suggestion:
              "Add learning objectives to help learners understand what they will achieve",
            autoFixable: false,
          });
        }

        if (content.objectives && content.objectives.length > 5) {
          errors.push({
            id: `warning-${++errorId}`,
            level: "warning",
            message: "Too many learning objectives may overwhelm learners",
            elementType: "Learning Objectives",
            elementId: "objectives",
            pageId: id,
            suggestion: "Consider limiting to 3-5 key learning objectives",
            autoFixable: false,
          });
        }
      }

      if (normalizedTemplateType === "content-video") {
        if (!content.videoUrl || content.videoUrl.trim() === "") {
          errors.push({
            id: `error-${++errorId}`,
            level: "error",
            message: "Video URL is required for video pages",
            elementType: "Video Component",
            elementId: "video-url",
            pageId: id,
            suggestion:
              "Add a valid video URL (YouTube, Vimeo, or direct video file)",
            autoFixable: false,
          });
        } else if (!isValidVideoUrl(content.videoUrl)) {
          errors.push({
            id: `warning-${++errorId}`,
            level: "warning",
            message: "Video URL format may not be supported",
            elementType: "Video Component",
            elementId: "video-url",
            pageId: id,
            context: content.videoUrl,
            suggestion:
              "Ensure the URL is from a supported platform or is a direct video file",
            autoFixable: false,
          });
        }

        if (!content.transcript) {
          errors.push({
            id: `info-${++errorId}`,
            level: "info",
            message: "Consider adding a video transcript for accessibility",
            elementType: "Video Component",
            elementId: "transcript",
            pageId: id,
            suggestion:
              "Transcripts improve accessibility and help with comprehension",
            autoFixable: false,
          });
        }
      }

      if (normalizedTemplateType === "mcq") {
        if (!content.questions || content.questions.length === 0) {
          errors.push({
            id: `error-${++errorId}`,
            level: "error",
            message: "Quiz must have at least one question",
            elementType: "Quiz Questions",
            elementId: "questions",
            pageId: id,
            suggestion: "Add questions to assess learner understanding",
            autoFixable: false,
          });
        }

        content.questions?.forEach((q: any, index: number) => {
          if (!q.question || q.question.trim() === "") {
            errors.push({
              id: `error-${++errorId}`,
              level: "error",
              message: `Question ${index + 1} is missing question text`,
              elementType: "Quiz Question",
              elementId: `question-${index}`,
              pageId: id,
              line: index + 1,
              suggestion: "Add clear, specific question text",
              autoFixable: false,
            });
          }

          if (!q.options || q.options.length < 2) {
            errors.push({
              id: `error-${++errorId}`,
              level: "error",
              message: `Question ${index + 1} must have at least 2 answer options`,
              elementType: "Quiz Question",
              elementId: `question-${index}-options`,
              pageId: id,
              line: index + 1,
              suggestion: "Add at least 2 answer options for each question",
              autoFixable: false,
            });
          }
        });
      }

      // General accessibility checks
      if (content.description && content.description.length > 500) {
        errors.push({
          id: `info-${++errorId}`,
          level: "info",
          message: "Page description is quite long",
          elementType: "Page Description",
          elementId: "description",
          pageId: id,
          suggestion:
            "Consider breaking long content into smaller, digestible sections",
          autoFixable: false,
        });
      }
    } else {
      errors.push({
        id: `error-${++errorId}`,
        level: "error",
        message: t("validation.noPageSelected"),
        elementType: "Page Selection",
        suggestion: "Select a page from the Page Manager to validate",
        autoFixable: false,
      });
    }

    dispatch(setValidationErrors(errors.map((e) => e.message)));
    // Sort errors by severity (error -> warning -> info) before displaying
    const severityRank: Record<string, number> = {
      error: 0,
      warning: 1,
      info: 2,
    };
    const sortedErrors = errors.sort((a, b) => {
      const r = severityRank[a.level] - severityRank[b.level];
      if (r !== 0) return r;
      return a.message.localeCompare(b.message);
    });
    setValidationErrorsState(sortedErrors);
    logger.info({
      event: "validation.page",
      message: "Page validation completed",
      context: {
        errorCount: sortedErrors.filter((e) => e.level === "error").length,
        warningCount: sortedErrors.filter((e) => e.level === "warning").length,
        infoCount: sortedErrors.filter((e) => e.level === "info").length,
      },
    });
    setShowValidationModal(true);
    logger.info({
      event: "validation.modal.open",
      message: "Validation modal opened",
      context: { scope: "page" },
    });
    setOpenMenu(null);
  };

  const handleValidateCourse = () => {
    const errors: any[] = [];
    let errorId = 0;

    if (!currentCourse) {
      errors.push({
        id: `error-${++errorId}`,
        level: "error",
        message: "No course loaded for validation",
        elementType: "Course",
        suggestion: "Create or load a course first",
        autoFixable: false,
      });
    } else {
      // Basic course structure validation
      if (!currentCourse.title || currentCourse.title.trim() === "") {
        errors.push({
          id: `error-${++errorId}`,
          level: "error",
          message: "Course title is required",
          elementType: "Course Title",
          elementId: "course-title",
          suggestion: "Add a descriptive title for your course",
          autoFixable: false,
        });
      }

      if (
        !currentCourse.description ||
        currentCourse.description.trim() === ""
      ) {
        errors.push({
          id: `warning-${++errorId}`,
          level: "warning",
          message: "Course description is recommended",
          elementType: "Course Description",
          elementId: "course-description",
          suggestion:
            "Add a description to help learners understand what they'll learn",
          autoFixable: false,
        });
      }

      if (currentCourse.pages.length === 0) {
        errors.push({
          id: `error-${++errorId}`,
          level: "error",
          message: "Course must have at least one page",
          elementType: "Course Pages",
          elementId: "course-pages",
          suggestion: "Add pages using the Page Manager or templates",
          autoFixable: false,
        });
      } else {
        // Page structure validation
        const hasWelcomePage = currentCourse.pages.some(
          (p: any) => normalizeTemplateType(p.templateType) === "welcome"
        );
        if (!hasWelcomePage) {
          errors.push({
            id: `warning-${++errorId}`,
            level: "warning",
            message: "Course should have a welcome page",
            elementType: "Course Structure",
            suggestion: "Add a welcome page to introduce the course",
            autoFixable: false,
          });
        }

        // Aggregate counts using normalized canonical types
        const rawTypeCount = currentCourse.pages.reduce(
          (acc: any, page: any) => {
            const norm = normalizeTemplateType(page.templateType);
            acc[norm] = (acc[norm] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        // Derive aggregated buckets (e.g., all content-* types count as content)
        const aggregatedCounts: Record<string, number> = { ...rawTypeCount };
        aggregatedCounts.content = Object.entries(rawTypeCount)
          .filter(([k]) => k.startsWith("content-"))
          .reduce((sum, [, v]) => sum + (v as number), 0);

        if (
          aggregatedCounts.mcq &&
          aggregatedCounts.content &&
          aggregatedCounts.content / aggregatedCounts.mcq > 10
        ) {
          errors.push({
            id: `info-${++errorId}`,
            level: "info",
            message: "Consider adding more assessment pages",
            elementType: "Course Structure",
            suggestion:
              "Balance content pages with quizzes to improve learning retention",
            autoFixable: false,
          });
        }

        // Check for duplicate page titles
        const titles = currentCourse.pages
          .map((p: any) => p.title)
          .filter(Boolean);
        const duplicateTitles = titles.filter(
          (title: string, index: number) => titles.indexOf(title) !== index
        );
        if (duplicateTitles.length > 0) {
          errors.push({
            id: `warning-${++errorId}`,
            level: "warning",
            message: `Duplicate page titles found: ${Array.from(new Set(duplicateTitles)).join(", ")}`,
            elementType: "Page Titles",
            suggestion: "Use unique titles for each page to improve navigation",
            autoFixable: false,
          });
        }
      }

      // Accessibility validation
      const totalPages = currentCourse.pages.length;
      const pagesWithTranscripts = currentCourse.pages.filter(
        (p: any) =>
          normalizeTemplateType(p.templateType) === "content-video" &&
          p.content?.transcript
      ).length;
      const videoPagesCount = currentCourse.pages.filter(
        (p: any) => normalizeTemplateType(p.templateType) === "content-video"
      ).length;

      if (videoPagesCount > 0 && pagesWithTranscripts / videoPagesCount < 0.8) {
        errors.push({
          id: `info-${++errorId}`,
          level: "info",
          message: `${videoPagesCount - pagesWithTranscripts} video pages missing transcripts`,
          elementType: "Accessibility",
          suggestion: "Add transcripts to video pages for better accessibility",
          autoFixable: false,
        });
      }

      // Course length validation
      if (totalPages > 50) {
        errors.push({
          id: `warning-${++errorId}`,
          level: "warning",
          message: "Course has many pages - consider breaking into modules",
          elementType: "Course Length",
          suggestion:
            "Long courses may overwhelm learners. Consider organizing into smaller modules.",
          autoFixable: false,
        });
      }

      if (totalPages < 3) {
        errors.push({
          id: `info-${++errorId}`,
          level: "info",
          message: "Course seems quite short",
          elementType: "Course Length",
          suggestion:
            "Consider adding more content to provide comprehensive learning experience",
          autoFixable: false,
        });
      }
    }

    setValidationErrorsState(errors);
    logger.info({
      event: "validation.course",
      message: "Course validation completed",
      context: {
        errorCount: errors.filter((e) => e.level === "error").length,
        warningCount: errors.filter((e) => e.level === "warning").length,
        infoCount: errors.filter((e) => e.level === "info").length,
      },
    });
    setShowValidationModal(true);
    logger.info({
      event: "validation.modal.open",
      message: "Validation modal opened",
      context: { scope: "course" },
    });
    setOpenMenu(null);
  };

  const menus: Record<string, MenuItem[]> = {
    File: [
      {
        label: t("menu.file.newCourse"),
        action: handleNewCourse,
        shortcut: "Ctrl+N",
      },
      {
        label: t("menu.file.openCourse") + " (WIP)",
        action: handleOpenCourse,
        shortcut: "Ctrl+O",
        disabled: true,
      },
      { separator: true },
      {
        label: t("menu.file.save") + " (WIP)",
        action: handleSaveCourse,
        disabled: true,
        shortcut: "Ctrl+S",
      },
      {
        label: t("menu.file.saveAs") + " (WIP)",
        action: () => {
          alert("Save As not implemented yet");
          setOpenMenu(null);
        },
        disabled: true,
      },
      { separator: true },
      {
        label: t("menu.file.export") + " (WIP)",
        action: handleExport,
        disabled: true,
      },
    ],
    Edit: [
      {
        label: t("menu.edit.cut", "Cut") + " (WIP)",
        action: () => {
          alert("Cut not implemented yet");
          setOpenMenu(null);
        },
        shortcut: "Ctrl+X",
        disabled: true,
      },
      {
        label: t("menu.edit.copy", "Copy") + " (WIP)",
        action: () => {
          alert("Copy not implemented yet");
          setOpenMenu(null);
        },
        shortcut: "Ctrl+C",
        disabled: true,
      },
      {
        label: t("menu.edit.paste", "Paste") + " (WIP)",
        action: () => {
          alert("Paste not implemented yet");
          setOpenMenu(null);
        },
        shortcut: "Ctrl+V",
        disabled: true,
      },
    ],
    Insert: [
      {
        label: t("menu.insert.addPage") + " (WIP)",
        action: handleAddPageFromTemplate,
        disabled: true,
      },
      {
        label: t("menu.insert.uploadMedia") + " (WIP)",
        action: () => {
          setShowMediaUpload(true);
          setOpenMenu(null);
        },
        disabled: true,
      },
    ],
    Tools: [
      {
        label: t("menu.tools.validatePage") + " (WIP)",
        action: handleValidatePage,
        disabled: true,
      },
      {
        label: t("menu.tools.validateCourse") + " (WIP)",
        action: handleValidateCourse,
        disabled: true,
      },
      { separator: true },
      {
        label: t("menu.tools.previewCourse") + " (WIP)",
        action: () => {
          alert("Preview functionality would be implemented here");
          setOpenMenu(null);
        },
        disabled: true,
      },
    ],
    View: [
      {
        label: t("menu.view.zoomIn") + " (WIP)",
        action: () => {
          alert("Zoom functionality would be implemented here");
          setOpenMenu(null);
        },
        disabled: true,
      },
      {
        label: t("menu.view.zoomOut") + " (WIP)",
        action: () => {
          alert("Zoom functionality would be implemented here");
          setOpenMenu(null);
        },
        disabled: true,
      },
      {
        label: t("menu.view.resetZoom") + " (WIP)",
        action: () => {
          alert("Zoom functionality would be implemented here");
          setOpenMenu(null);
        },
        disabled: true,
      },
      { separator: true },
      {
        label: t("menu.view.themeSettings") + " (WIP)",
        action: () => {
          alert("Theme settings would be implemented here");
          setOpenMenu(null);
        },
        disabled: true,
      },
    ],
    Help: [
      {
        label: t("menu.help.documentation") + " (WIP)",
        action: () => {
          window.open("https://docs.example.com", "_blank");
          setOpenMenu(null);
        },
        disabled: true,
      },
      {
        label: t("menu.help.keyboardShortcuts") + " (WIP)",
        action: () => {
          alert(
            "Shortcuts:\\nCtrl+N - New Course\\nCtrl+O - Open Course\\nCtrl+S - Save"
          );
          setOpenMenu(null);
        },
        disabled: true,
      },
      { separator: true },
      {
        label: t("menu.help.about") + " (WIP)",
        action: () => {
          alert(
            "eLearning Authoring Tool v1.0.0\\nBuilt with React and FastAPI"
          );
          setOpenMenu(null);
        },
        disabled: true,
      },
    ],
  };

  const menuNames = Object.keys(menus);

  // Focus management for menu buttons
  useEffect(() => {
    if (focusedMenuIndex >= 0) {
      const name = menuNames[focusedMenuIndex];
      const btn = menuButtonRefs.current[name];
      if (btn) btn.focus();
    }
  }, [focusedMenuIndex, menuNames]);

  // Focus management for dropdown items when open
  useEffect(() => {
    if (openMenu) {
      const selector = `.dropdown-menu[data-menu="${openMenu}"] .dropdown-item:not(.disabled)`;
      const focusable = Array.from(
        (menuRef.current || document).querySelectorAll<HTMLButtonElement>(
          selector
        )
      );
      if (focusable.length && focusedItemIndex >= 0) {
        const idx = Math.min(focusedItemIndex, focusable.length - 1);
        focusable[idx].focus();
      }
    }
  }, [openMenu, focusedItemIndex]);

  const moveToAdjacentMenu = (direction: 1 | -1, preserveOpen: boolean) => {
    if (!menuNames.length) return;
    setFocusedMenuIndex((prev) => {
      const next = (prev + direction + menuNames.length) % menuNames.length;
      if (preserveOpen) {
        setOpenMenu(menuNames[next]);
        setFocusedItemIndex(0);
      }
      return next;
    });
  };

  const handleMenuButtonKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    menuName: string,
    index: number
  ) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveToAdjacentMenu(1, openMenu === menuName);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveToAdjacentMenu(-1, openMenu === menuName);
        break;
      case "ArrowDown":
        e.preventDefault();
        setOpenMenu(menuName);
        setFocusedMenuIndex(index);
        setFocusedItemIndex(0);
        break;
      case "Enter":
      case " ": // Space
        e.preventDefault();
        if (openMenu === menuName) {
          setOpenMenu(null);
        } else {
          setOpenMenu(menuName);
          setFocusedItemIndex(0);
        }
        setFocusedMenuIndex(index);
        break;
      case "Escape":
        if (openMenu === menuName) {
          e.preventDefault();
          setOpenMenu(null);
        }
        break;
      default:
        break;
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!openMenu) return;
    const currentItems = menus[openMenu];
    const focusable = currentItems
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => !it.separator && !it.disabled);
    if (!focusable.length) return;
    const maxIndex = focusable.length - 1;
    const currentFocusPos = focusable.findIndex(
      ({ i }) => i === focusable[focusedItemIndex]?.i
    );

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next =
          currentFocusPos < 0 ? 0 : (currentFocusPos + 1) % (maxIndex + 1);
        setFocusedItemIndex(focusable[next].i);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev =
          currentFocusPos < 0
            ? maxIndex
            : (currentFocusPos - 1 + (maxIndex + 1)) % (maxIndex + 1);
        setFocusedItemIndex(focusable[prev].i);
        break;
      }
      case "Home":
        e.preventDefault();
        setFocusedItemIndex(focusable[0].i);
        break;
      case "End":
        e.preventDefault();
        setFocusedItemIndex(focusable[maxIndex].i);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveToAdjacentMenu(1, true);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveToAdjacentMenu(-1, true);
        break;
      case "Escape":
        e.preventDefault();
        setOpenMenu(null);
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.disabled && item.action) {
      item.action();
    }
  };

  return (
    <div className="menu-bar" ref={menuRef}>
      {Object.entries(menus).map(([menuName, items], idx) => (
        <div key={menuName} className="menu-item">
          <button
            ref={(el) => (menuButtonRefs.current[menuName] = el)}
            className={`menu-button ${openMenu === menuName ? "active" : ""}`}
            onClick={() => {
              setFocusedMenuIndex(idx);
              handleMenuClick(menuName);
            }}
            onKeyDown={(e) => handleMenuButtonKeyDown(e, menuName, idx)}
            aria-haspopup="true"
            aria-expanded={openMenu === menuName}
            tabIndex={0}
          >
            {translateMenuName(menuName)}
          </button>

          {openMenu === menuName && (
            <div
              className="dropdown-menu"
              role="menu"
              data-menu={menuName}
              onKeyDown={handleDropdownKeyDown}
            >
              {items.map((item, index) =>
                item.separator ? (
                  <div
                    key={index}
                    className="menu-separator"
                    role="separator"
                  />
                ) : (
                  <button
                    key={index}
                    className={`dropdown-item ${item.disabled ? "disabled" : ""}`}
                    onClick={() => handleMenuItemClick(item)}
                    disabled={!!item.disabled}
                    aria-disabled={!!item.disabled}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <span className="menu-label">{item.label}</span>
                    {item.shortcut && (
                      <span className="menu-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}

      {/* Status indicator */}
      <div className="menu-status">
        {isSaving && <span className="saving-indicator">Saving...</span>}
        {hasUnsavedChanges && !isSaving && (
          <span className="unsaved-indicator">●</span>
        )}
        {saveError && !isSaving && (
          <button
            className="retry-save-button"
            onClick={() => handleSaveCourse()}
            aria-label={t("menu.file.save", "Save") + " (retry)"}
            title={t("menu.file.save", "Save") + " - " + saveError + " (retry)"}
          >
            {t("menu.file.save", "Save")} ⟳
          </button>
        )}
      </div>

      {/* Media Upload Modal */}
      {showMediaUpload && (
        <MediaUpload
          onClose={() => {
            setShowMediaUpload(false);
            logger.info({
              event: "media.upload.close",
              message: "Media upload dialog closed",
            });
          }}
          onUploadComplete={(files) => {
            console.log("Files uploaded successfully:", files);
            // TODO: Add files to course media library or current page
            setShowMediaUpload(false);
            logger.info({
              event: "media.upload.close",
              message: "Media upload dialog closed (escape/button)",
            });
          }}
          courseId={currentCourse?.id}
          maxFiles={10}
          maxFileSize={50}
        />
      )}

      {/* Validation Error Modal */}
      {showValidationModal && (
        <ValidationErrorModal
          errors={validationErrors}
          onClose={() => {
            setShowValidationModal(false);
            logger.info({
              event: "validation.modal.close",
              message: "Validation modal closed",
            });
          }}
          onNavigateToElement={(elementId: string, pageId?: string) => {
            // Attempt to focus the target element in the editor
            requestAnimationFrame(() => {
              const selector = `[data-element-id="${elementId}"]`;
              const el = document.querySelector<HTMLElement>(selector);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.focus({ preventScroll: true });
              } else {
                console.warn(
                  "Validation navigation: element not found",
                  elementId
                );
              }
            });
            setShowValidationModal(false);
            logger.info({
              event: "validation.modal.close",
              message: "Validation modal closed (action)",
            });
          }}
          onAutoFix={(errorId: string) => {
            console.log("Auto-fix error:", errorId);
            // TODO: Implement auto-fix functionality
          }}
          onIgnoreWarning={(errorId: string) => {
            console.log("Ignore warning:", errorId);
            // Remove warning from list
            setValidationErrorsState((prev) =>
              prev.filter((e) => e.id !== errorId)
            );
          }}
          onExportReport={(errors) => {
            console.log("Export validation report:", errors);
            logger.info({
              event: "validation.report.export",
              message: "Validation report exported",
              context: {
                total: errors.length,
                errors: errors.filter((e) => e.level === "error").length,
                warnings: errors.filter((e) => e.level === "warning").length,
                info: errors.filter((e) => e.level === "info").length,
              },
            });
            const report = {
              timestamp: new Date().toISOString(),
              courseId: currentCourse?.id,
              courseTitle: currentCourse?.title,
              totalErrors: errors.length,
              errors: errors,
            };

            const blob = new Blob([JSON.stringify(report, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `validation-report-${currentCourse?.title || "course"}-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        />
      )}
    </div>
  );
};

export default MenuBar;
