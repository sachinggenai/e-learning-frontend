/**
 * Page Manager Component
 *
 * Manages the list of pages in a course with add, edit, delete, and reorder functionality.
 * Integrates with template selector for adding new pages.
 */

import React, { memo, useRef, useState } from "react";
import { normalizeTemplateType } from "../constants/templateTypes";
import { t } from "../i18n/strings";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createPageFromTemplate,
  removePage,
  reorderPages,
  updatePage,
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

  // Helper function to capture complete state snapshot
  const logStateSnapshot = (label: string) => {
    console.log(`\n📸 STATE SNAPSHOT: ${label}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🗂️ courseSlice.currentCourse.pages:");
    currentCourse?.pages?.forEach((p: Page, idx: number) => {
      console.log(`   [${idx}] ID: ${p.id}, Title: "${p.title}"`);
      console.log(
        `       Content: ${JSON.stringify(p.content).substring(0, 150)}...`
      );
      console.log(
        `       Content keys: ${Object.keys(p.content || {}).join(", ")}`
      );
    });
    console.log("\n📋 editorSlice.currentPage:");
    if (currentEditorPage) {
      console.log(
        `   ID: ${currentEditorPage.id}, Title: "${currentEditorPage.title}"`
      );
      console.log(
        `   Content: ${JSON.stringify(currentEditorPage.content).substring(0, 150)}...`
      );
      console.log(
        `   Content keys: ${Object.keys(currentEditorPage.content || {}).join(", ")}`
      );
    } else {
      console.log("   (null)");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  };

  // Track render count for debugging
  const renderCountRef = React.useRef(0);
  React.useEffect(() => {
    renderCountRef.current += 1;
    console.log(`\n🔄 PageManager RENDER #${renderCountRef.current}`);
    console.log(
      "   currentCourse pages count:",
      currentCourse?.pages?.length || 0
    );
    console.log("   currentEditorPage ID:", currentEditorPage?.id || "null");
  });

  // Deduplicate pages by ID to prevent React key warnings
  const pages = React.useMemo(() => {
    console.log("🔄 PageManager: pages useMemo recalculating...");
    const rawPages = currentCourse?.pages || [];
    console.log("   Raw pages count:", rawPages.length);
    console.log(
      "   Raw pages snapshot:",
      rawPages.map((p: Page) => ({
        id: p.id,
        title: p.title,
        contentKeys: Object.keys(p.content || {}),
        contentSample: JSON.stringify(p.content).substring(0, 100),
      }))
    );

    const pageMap = new Map<string, Page>();

    rawPages.forEach((page: Page) => {
      if (!pageMap.has(page.id)) {
        pageMap.set(page.id, page);
      }
    });

    const result = Array.from(pageMap.values()).sort(
      (a, b) => a.order - b.order
    );
    console.log("   Deduplicated pages count:", result.length);
    return result;
  }, [currentCourse?.pages]);

  const handleAddPage = () => {
    // console.log("handleAddPage clicked. Checking for current course..."); // Removed debug log
    if (currentCourse?.id) {
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
    console.log("═══════════════════════════════════════════════════");
    console.log("🆕 PageManager.handleTemplateSelect INITIATED");
    console.log("═══════════════════════════════════════════════════");
    console.log("📌 Template:", template.type || template.templateType);
    console.log("📌 Page Title:", pageTitle);

    if (!currentCourse) return;
    const templateId = (template.templateId ||
      template.id ||
      template.template_id) as string;
    const customizationFields =
      template.defaults || template.data?.content || {};

    console.log("📤 Dispatching createPageFromTemplate...");
    // Dispatch the page creation action
    dispatch(
      createPageFromTemplate({
        courseId: currentCourse.id!,
        templateId,
        pageTitle,
        customizations: customizationFields,
        pageOrder: pages.length,
      }) as any
    )
      .then((res: any) => {
        console.log("📥 createPageFromTemplate response received");
        const raw = res?.payload;
        console.log("📌 Raw response:", JSON.stringify(raw, null, 2));
        if (raw) {
          // Normalize template type from backend response
          const normalizedType = normalizeTemplateType(
            raw.type || template.type
          );

          const newPage: Page = {
            id: raw.id,
            templateType: normalizedType,
            title: raw.title,
            content: raw.content || {},
            order: raw.page_order || pages.length,
            isDraft: raw.is_published === false,
            lastModified:
              raw.updated_at || raw.created_at || new Date().toISOString(),
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
      console.log("═══════════════════════════════════════════════════");
      console.log("🖱️ PAGE SELECT INITIATED");
      console.log("═══════════════════════════════════════════════════");
      console.log("📌 Clicked Page ID:", page.id);
      console.log("📌 Clicked Page Title:", page.title);
      console.log(
        "📌 Clicked Page Content:",
        JSON.stringify(page.content, null, 2)
      );

      logStateSnapshot("BEFORE page switch");

      // Before switching pages, sync the current editor page back to course state
      if (currentEditorPage && currentCourse) {
        console.log("💾 Saving current editor page before switch...");
        console.log("   Current Editor Page ID:", currentEditorPage.id);
        console.log(
          "   Current Editor Page Content:",
          JSON.stringify(currentEditorPage.content, null, 2)
        );

        // Update the course state with the current editor page data
        await dispatch(updatePage(currentEditorPage));

        console.log("✅ Current page saved to courseSlice");
        logStateSnapshot("AFTER saving current page");
      } else {
        console.log("⚠️ No current editor page to save");
      }

      // CRITICAL: Look up the latest version of the page from currentCourse.pages
      console.log("\n🔍 Looking up latest version from courseSlice...");
      console.log(
        "   Total pages in currentCourse:",
        currentCourse?.pages?.length || 0
      );
      console.log(
        "   All page IDs in currentCourse:",
        currentCourse?.pages?.map((p: Page) => p.id) || []
      );

      const latestPage =
        currentCourse?.pages.find((p: Page) => p.id === page.id) || page;

      console.log("\n📊 CRITICAL COMPARISON:");
      console.log("   ┌─ Clicked Page (from render/event):");
      console.log("   │  ID:", page.id);
      console.log("   │  Title:", page.title);
      console.log("   │  Content:", JSON.stringify(page.content, null, 2));
      console.log("   │  Object reference:", page);
      console.log("   │");
      console.log("   └─ Latest Page (from courseSlice.currentCourse.pages):");
      console.log("      ID:", latestPage.id);
      console.log("      Title:", latestPage.title);
      console.log(
        "      Content:",
        JSON.stringify(latestPage.content, null, 2)
      );
      console.log("      Object reference:", latestPage);
      console.log("");
      console.log("   🔬 Analysis:");
      console.log("      Same object reference?", page === latestPage);
      console.log(
        "      Content strings equal?",
        JSON.stringify(page.content) === JSON.stringify(latestPage.content)
      );
      console.log(
        "      Content has data (clicked)?",
        Object.keys(page.content || {}).length > 0
      );
      console.log(
        "      Content has data (latest)?",
        Object.keys(latestPage.content || {}).length > 0
      );

      if (
        page !== latestPage &&
        JSON.stringify(page.content) !== JSON.stringify(latestPage.content)
      ) {
        console.log("   ⚠️⚠️⚠️ STALE DATA DETECTED ⚠️⚠️⚠️");
        console.log(
          "   The clicked page object has different content than courseSlice!"
        );
      }

      console.log("\n💾 About to dispatch setCurrentPage...");
      console.log("   Dispatching page ID:", latestPage.id);
      console.log(
        "   Dispatching page content:",
        JSON.stringify(latestPage.content, null, 2)
      );

      dispatch(setCurrentPage(latestPage));

      console.log("✅ setCurrentPage dispatched");

      // Give Redux a moment to update, then snapshot
      setTimeout(() => {
        logStateSnapshot("AFTER setCurrentPage (async check)");
      }, 100);

      console.log("═══════════════════════════════════════════════════\n");

      logger.info({
        event: "page.selected",
        message: "Page selected",
        context: {
          pageId: latestPage.id,
          templateType: latestPage.templateType,
        },
      });
    },
    [currentEditorPage, currentCourse, dispatch, logStateSnapshot]
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
      dispatch(removePage(pageId));

      // If deleting the current page, clear the editor
      if (currentPage?.id === pageId) {
        dispatch(clearCurrentPage());
      }
    }
  };

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
        return "👋";
      case "content-text":
        return "📝";
      case "content-video":
        return "🎥";
      case "mcq":
        return "❓";
      case "content-image":
        return "🖼️";
      case "interactive":
        return "🎯";
      default:
        return "📄";
    }
  };

  const getPageStatusIndicator = (page: Page) => {
    if (page.isDraft) {
      return (
        <span className="status-indicator draft" title="Draft">
          Draft
        </span>
      );
    }
    if (page.isValid) {
      return (
        <span className="status-indicator valid" title="Valid">
          ✓
        </span>
      );
    }
    if (page.isValid === false) {
      return (
        <span className="status-indicator invalid" title="Has errors">
          !
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
                onSelect={handlePageSelect}
                onDelete={handleDeletePage}
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
  onSelect: (p: Page) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onDragStart: (p: Page, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onDragEnd: () => void;
  getPageIcon: (type: string) => string;
  getPageStatusIndicator: (p: Page) => React.ReactNode;
}

const PageItem: React.FC<PageItemProps> = ({
  page,
  index,
  active,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  getPageIcon,
  getPageStatusIndicator,
}) => {
  return (
    <div
      className={`page-item ${active ? "active" : ""}`}
      onClick={() => onSelect(page)}
      draggable
      onDragStart={(e) => onDragStart(page, e)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(page.id, e)}
      onDragEnd={onDragEnd}
    >
      <div className="page-order">{index + 1}</div>
      <div className="page-icon">{getPageIcon(page.templateType)}</div>
      <div className="page-info">
        <div className="page-title">{page.title}</div>
        <div className="page-meta">
          <span className="page-type">{page.templateType}</span>
          {getPageStatusIndicator(page)}
        </div>
      </div>
      <div className="page-actions">
        <button
          className="delete-page-button"
          onClick={(e) => onDelete(page.id, e)}
          title="Delete page"
          aria-label={`Delete ${page.title}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

const MemoPageItem = memo(PageItem);
