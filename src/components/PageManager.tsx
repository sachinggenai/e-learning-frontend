/**
 * Page Manager Component
 *
 * Manages the list of pages in a course with add, edit, delete, and reorder functionality.
 * Integrates with template selector for adding new pages.
 */

import React, { memo, useRef, useState } from "react";
import { FileText, Home, Video, Image, HelpCircle, Zap, Box, Trash2, Check, AlertCircle } from 'lucide-react';
import { normalizeTemplateType } from "../constants/templateTypes";
import { t } from "../i18n/strings";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createPageFromTemplate,
  deletePageFromCourse,
  removePage,
  reorderPages,
  updatePage,
  updatePageTitleThunk,
} from "../store/slices/courseSlice";
import { clearCurrentPage, setCurrentPage } from "../store/slices/editorSlice";
import logger from "../utils/logger";
import "./PageManager.css";
import TemplateSelector from "./TemplateSelector";

// Interfaces are kept as-is, assuming they are correct for the application context

interface Page {
  id: string;
  templateType: string;
  title: string;
  content: Record<string, any>;
  order: number;
  isValid?: boolean;
  isDraft?: boolean;
  lastModified: string;
  // Additional fields for template-created pages
  type?: string;
  template_id?: string;
  page_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Template {
  id: string;
  templateId: string;
  type: string;
  title: string;
  order: number;
  data: {
    content: Record<string, any>;
    rawFields?: any[];
    description?: string;
    category?: string;
  };
}

const PageManager: React.FC = () => {
  const dispatch = useAppDispatch();
  // Casting is kept to match original structure, but should be fixed in useAppSelector hook definition
  const courseState = useAppSelector((state) => (state as any).course);
  const editorState = useAppSelector((state) => (state as any).editor);

  const { currentCourse } = courseState;
  const editorPresent = editorState.present || editorState;
  const { currentPage } = editorPresent;

  // Extract current editor page for use in handlePageSelect
  const currentEditorPage = editorPresent?.currentPage;

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);

  // Deduplicate pages by ID to prevent React key warnings
  const pages = React.useMemo(() => {
    const rawPages = currentCourse?.pages || [];
    const pageMap = new Map<string, Page>();

    rawPages.forEach((coursePage: any) => {
      // Transform course page to PageManager Page format
      const page: Page = {
        id: coursePage.pageId || coursePage.id,
        templateType: 'component-page', // Default template type for component-based pages
        title: coursePage.title,
        content: { components: coursePage.components || [] },
        order: coursePage.order,
        isValid: true,
        isDraft: false,
        lastModified: coursePage.updatedAt || new Date().toISOString(),
      };
      
      if (!pageMap.has(page.id)) {
        pageMap.set(page.id, page);
      }
    });

    return Array.from(pageMap.values()).sort(
      (a, b) => a.order - b.order
    );
  }, [currentCourse?.pages]);

  const handleAddPage = () => {
    // console.log("handleAddPage clicked. Checking for current course..."); // Removed debug log
    if (currentCourse?.courseId || currentCourse?.id) {
      // console.log("Course found. Opening template selector.", currentCourse); // Removed debug log
      setShowTemplateSelector(true);
      logger.info({
        event: "template.selector.open",
        message: "Template selector opened",
      });
    } else {
      console.error("No current course found. Cannot add a page.");
    }
  };

  // Accept loose shape to accommodate both legacy Template and new TemplateVM
  const handleTemplateSelect = (template: any, pageTitle: string) => {
    if (!currentCourse) return;
    const templateId = (template.templateId ||
      template.id ||
      template.template_id) as string;
    const customizationFields =
      template.defaultData || template.defaults || template.data?.content || {};

    // Use courseId (string) not id (number) for API calls
    const apiCourseId = currentCourse.courseId || String(currentCourse.id);
    dispatch(
      createPageFromTemplate({
        courseId: apiCourseId,
        templateId,
        pageTitle,
        customizations: customizationFields,
        pageOrder: pages.length,
      }) as any
    )
      .then((res: any) => {
        const raw = res?.payload;
        if (raw) {
          // Response is a PageResponse
          const componentType =
            raw.components?.[0]?.componentType || template.type;
          const normalizedType = normalizeTemplateType(componentType);

          const newPage: Page = {
            id: raw.pageId || raw.id,
            templateType: normalizedType,
            title: raw.title,
            content: raw.components?.[0]?.data || {},
            order: typeof raw.order === "number" ? raw.order : pages.length,
            isDraft: false,
            lastModified:
              raw.updatedAt || raw.createdAt || new Date().toISOString(),
          };

          logger.info({
            event: "page.created",
            message: "Page created from template (backend)",
            context: { pageId: newPage.id, templateType: newPage.templateType },
          });

          // Optionally set the new page as current
          dispatch(setCurrentPage(newPage));
        }
      })
      .catch((error: any) => {
        logger.error({
          event: "page.create_failed",
          message: "Failed to create page from template",
          context: { error: error?.message || String(error), templateId },
        });
      })
      .finally(() => {
        setShowTemplateSelector(false);
      });
  };

  const handlePageSelect = React.useCallback(
    async (page: Page) => {
      // Before switching pages, sync the current editor page back to course state
      if (currentEditorPage && currentCourse) {
        await dispatch(updatePage(currentEditorPage));
      }

      // Look up the latest version of the page from currentCourse.pages
      const coursePage = currentCourse?.pages.find((p: any) => p.pageId === page.id);
      
      // Transform course page to editor Page format
      const editorPage: Page = coursePage ? {
        id: coursePage.pageId,
        templateType: 'component-page',
        title: coursePage.title,
        content: { components: coursePage.components || [] },
        order: coursePage.order,
        isValid: true,
        isDraft: false,
        lastModified: coursePage.updatedAt || new Date().toISOString(),
      } : page;

      dispatch(setCurrentPage(editorPage));

      logger.info({
        event: "page.selected",
        message: "Page selected",
        context: {
          pageId: editorPage.id,
          templateType: editorPage.templateType,
        },
      });
    },
    [currentEditorPage, currentCourse, dispatch]
  );

  const handleDeletePage = (pageId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const page = pages.find((p: Page) => p.id === pageId);
    if (
      page &&
      window.confirm(
        t(
          "confirm.delete.page",
          'Delete "{title}"? This action cannot be undone.'
        ).replace("{title}", page.title)
      )
    ) {
      // Optimistic local removal
      dispatch(removePage(pageId));

      // API persistence: delete from backend
      const apiCourseId = currentCourse?.courseId || String(currentCourse?.id ?? '');
      if (apiCourseId) {
        dispatch(deletePageFromCourse({ courseId: apiCourseId, pageId }));
      }

      // If deleting the current page, clear the editor
      if (currentPage?.id === pageId) {
        dispatch(clearCurrentPage());
      }
    }
  };

  const handlePageTitleEdit = React.useCallback(
    (pageId: string, newTitle: string) => {
      const apiCourseId = currentCourse?.courseId || String(currentCourse?.id ?? '');
      if (!apiCourseId) return;

      dispatch(
        updatePageTitleThunk({
          courseId: apiCourseId,
          pageId,
          title: newTitle,
        })
      );

      logger.info({
        event: "page.title.updated",
        message: "Page title updated from PageManager",
        context: { pageId, newTitle },
      });
    },
    [currentCourse, dispatch]
  );

  const dragImageRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (page: Page, ev: React.DragEvent) => {
    setDraggedPageId(page.id);
    // Create a lightweight drag image for better UX
    const ghost = document.createElement("div");
    ghost.className = "drag-ghost";
    ghost.textContent = page.title || "Page";
    document.body.appendChild(ghost);
    dragImageRef.current = ghost;
    ev.dataTransfer.setDragImage(ghost, 10, 10);
  };

  const handleDragEnd = () => {
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current);
      dragImageRef.current = null;
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (targetPageId: string, event: React.DragEvent) => {
    event.preventDefault();

    if (draggedPageId && draggedPageId !== targetPageId) {
      const draggedIndex = pages.findIndex((p: Page) => p.id === draggedPageId);
      const targetIndex = pages.findIndex((p: Page) => p.id === targetPageId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const reorderedPages = [...pages];
        const [draggedPage] = reorderedPages.splice(draggedIndex, 1);
        reorderedPages.splice(targetIndex, 0, draggedPage);

        const pageIds = reorderedPages.map((p: Page) => p.id);
        dispatch(reorderPages(pageIds));
        logger.info({
          event: "page.reorder",
          message: "Pages reordered",
          context: { newOrder: pageIds },
        });
      }
    }

    setDraggedPageId(null);
  };

  const getPageIcon = (templateType: string) => {
    const t = normalizeTemplateType(templateType);
    switch (t) {
      case "welcome":
        return <Home size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Welcome" />;
      case "content-text":
        return <FileText size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Text" />;
      case "content-video":
        return <Video size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Video" />;
      case "mcq":
        return <HelpCircle size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Quiz" />;
      case "content-image":
        return <Image size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Image" />;
      case "interactive":
        return <Zap size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Interactive" />;
      default:
        return <Box size={20} color="var(--sidebar-accent)" strokeWidth={2} aria-label="Page" />;
    }
  };

  const getPageStatusIndicator = (page: Page) => {
    if (page.isDraft) {
      return (
        <span className="status-indicator draft" title="Draft">
          <AlertCircle size={16} color="var(--sidebar-text-muted)" strokeWidth={2} aria-label="Draft" />
        </span>
      );
    }
    if (page.isValid) {
      return (
        <span className="status-indicator valid" title="Valid">
          <Check size={16} color="var(--success, #22c55e)" strokeWidth={2} aria-label="Valid" />
        </span>
      );
    }
    if (page.isValid === false) {
      return (
        <span className="status-indicator invalid" title="Has errors">
          <AlertCircle size={16} color="var(--error, #ef4444)" strokeWidth={2} aria-label="Error" />
        </span>
      );
    }
    return null;
  };

  return (
    <div className="page-manager">
      <div className="page-manager-header">
        <h3>{t("pagemanager.header")}</h3>
        <button
          className="add-page-button"
          onClick={handleAddPage}
          disabled={!currentCourse}
          title={t("pagemanager.addPage")}
        >
          <span className="button-icon">+</span>
          {t("pagemanager.addPage")}
        </button>
      </div>

      <div className="page-list">
        {pages.length === 0 ? (
          <div className="empty-state">
            <p>{t("pagemanager.emptyState")}</p>
            <p className="empty-hint">{t("pagemanager.emptyHint")}</p>
          </div>
        ) : (
          <div className="pages">
            {pages.map((page: Page, index: number) => (
              <MemoPageItem
                key={page.id}
                page={page}
                index={index}
                active={currentPage?.id === page.id}
                courseId={currentCourse?.courseId || String(currentCourse?.id ?? '')}
                onSelect={handlePageSelect}
                onDelete={handleDeletePage}
                onTitleEdit={handlePageTitleEdit}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                getPageIcon={getPageIcon}
                getPageStatusIndicator={getPageStatusIndicator}
              />
            ))}
          </div>
        )}
      </div>

      <div className="page-manager-footer">
        <div className="page-count">
          {pages.length} {pages.length === 1 ? "page" : "pages"}
        </div>
        {currentCourse && (
          <div className="course-status">
            Course: <strong>{currentCourse.title}</strong>
          </div>
        )}
      </div>

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => {
          setShowTemplateSelector(false);
          logger.info({
            event: "template.selector.close",
            message: "Template selector closed",
          });
        }}
        onTemplateSelect={handleTemplateSelect}
        courseId={currentCourse?.id || 0}
      />
    </div>
  );
};

export default PageManager;

// Memoized page list item to minimize re-renders
interface PageItemProps {
  page: Page;
  index: number;
  active: boolean;
  courseId: string;
  onSelect: (p: Page) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onTitleEdit: (pageId: string, newTitle: string) => void;
  onDragStart: (p: Page, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onDragEnd: () => void;
  getPageIcon: (type: string) => JSX.Element;
  getPageStatusIndicator: (p: Page) => React.ReactNode;
}

const PageItem: React.FC<PageItemProps> = ({
  page,
  index,
  active,
  courseId,
  onSelect,
  onDelete,
  onTitleEdit,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  getPageIcon,
  getPageStatusIndicator,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingValue, setEditingValue] = useState(page.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update editingValue when page.title changes externally
  React.useEffect(() => {
    if (!isEditingTitle) {
      setEditingValue(page.title);
    }
  }, [page.title, isEditingTitle]);

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
    setEditingValue(page.title);
  };

  const handleSave = React.useCallback(() => {
    const trimmedTitle = editingValue.trim();
    
    // Don't save if empty or unchanged
    if (!trimmedTitle || trimmedTitle === page.title) {
      setIsEditingTitle(false);
      setEditingValue(page.title);
      return;
    }

    setIsSaving(true);
    onTitleEdit(page.id, trimmedTitle);
    setIsEditingTitle(false);
    // Note: isSaving gets reset in parent component after API response
  }, [editingValue, page.title, page.id, onTitleEdit]);

  const handleCancel = React.useCallback(() => {
    setIsEditingTitle(false);
    setEditingValue(page.title);
  }, [page.title]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleBlur = React.useCallback(() => {
    // Debounce blur to avoid closing edit mode immediately
    // Only save if user truly clicked outside and stays outside for 100ms
    blurTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 100);
  }, [handleSave]);

  const handleInputFocus = React.useCallback(() => {
    // If focus returns to input, cancel the blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`page-item ${active ? "active" : ""} ${isSaving ? "saving" : ""}`}
      onClick={() => !isEditingTitle && onSelect(page)}
      draggable={!isEditingTitle}
      onDragStart={(e) => onDragStart(page, e)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(page.id, e)}
      onDragEnd={onDragEnd}
    >
      <div className="page-top-row">
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div className="page-icon">{getPageIcon(page.templateType)}</div>
          <span className="page-type">{page.templateType}</span>
        </div>
        <div className="page-actions">
          <button
            className="delete-page-button"
            onClick={(e) => onDelete(page.id, e)}
            title="Delete page"
            aria-label={`Delete ${page.title}`}
          >
            <Trash2 size={16} color="#f87171" strokeWidth={2} aria-label="Delete" />
          </button>
        </div>
      </div>
      <div className="page-bottom-row">
        <div className="page-order" aria-label={`Page order ${index + 1}`}>{index + 1}</div>
        <div className="page-info">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              className="page-title-input"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onFocus={handleInputFocus}
              onClick={(e) => e.stopPropagation()}
              disabled={isSaving}
              autoComplete="off"
              style={{ textAlign: 'left' }}
            />
          ) : (
            <div
              className="page-title"
              onDoubleClick={handleDoubleClick}
              title="Double-click to edit"
              style={{ textAlign: 'left' }}
            >
              {page.title}
            </div>
          )}
          <div className="page-meta">
            {getPageStatusIndicator(page)}
            {isSaving && <span className="saving-indicator">Saving...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoPageItem = memo(PageItem);
