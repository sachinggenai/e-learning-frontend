/**
 * EditorV2
 *
 * New-architecture editor that replaces the legacy switch-based PageEditor.
 * Uses ComponentList + DynamicComponentRenderer + ComponentPicker.
 *
 * Layout: sidebar (PageManager) + main area (ComponentList for selected page)
 */

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Plus, Palette, Edit3, Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import type { AppDispatch, RootState } from "../store";
import { fetchComponents, addComponent } from "../store/slices/componentsSlice";
import {
  setCurrentPage,
  clearCurrentPage,
  updatePageTitle,
} from "../store/slices/editorSlice";
import { updatePageTitleThunk } from "../store/slices/courseSlice";
import { featureFlags } from "../utils/featureFlags";
import { EditorV2Props } from "../types/comprehensive";
import { ComponentList } from "./ComponentList";
import { ComponentSettings } from "./ComponentSettings";
import CustomTemplateEditor from "./CustomTemplateEditor";
import PageManager from "./PageManager";
import "./Editor.css";

const EditorV2: React.FC<EditorV2Props> = ({
  showCustomTemplateEditor = false,
  onCloseTemplateEditor = () => {},
}) => {
  const dispatch = useAppDispatch();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const courseState = useAppSelector((state) => (state as any).course);
  const currentCourse = courseState?.currentCourse ?? null;

  const currentPage = useAppSelector((state) => {
    const editorState = (state as any).editor;
    return editorState?.present?.currentPage ?? null;
  });

  const courseId = currentCourse?.courseId ?? String(currentCourse?.id ?? "");
  const pageId = currentPage?.id ?? "";

  const selectedComponent = useAppSelector((state) => {
    if (!selectedComponentId) return null;
    const comps = (state as any).components?.byPage?.[pageId] ?? [];
    return (
      comps.find((c: any) => c.componentId === selectedComponentId) ?? null
    );
  });

  const componentError = useAppSelector(
    (state) => (state as any).components?.error ?? null,
  );

  // Fetch components when page changes
  useEffect(() => {
    if (courseId && pageId) {
      dispatch(fetchComponents({ courseId, pageId }));
    }
  }, [dispatch, courseId, pageId]);

  // Cleanup title debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (titleDebounceRef.current) {
        clearTimeout(titleDebounceRef.current);
      }
    };
  }, []);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  // Enter edit mode
  const handleEditTitle = () => {
    setEditingTitle(currentPage?.title ?? "Untitled Page");
    setIsEditingTitle(true);
  };

  // Save title
  const handleSaveTitle = () => {
    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle || trimmedTitle === currentPage?.title) {
      setIsEditingTitle(false);
      return;
    }

    dispatch(updatePageTitle(trimmedTitle));

    if (currentPage && courseId) {
      dispatch(
        updatePageTitleThunk({
          courseId,
          pageId: currentPage.id,
          title: trimmedTitle,
        }),
      );
    }

    setIsEditingTitle(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditingTitle("");
  };

  // Handle key press in input
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  /* ── No course loaded ──────────────────────────────────────── */
  if (!currentCourse) {
    return (
      <div className="editor">
        <div className="editor-empty">
          <div className="empty-content">
            <h2>No Course Loaded</h2>
            <p>Click "Load Example" in the header to start editing a course.</p>
            <div className="getting-started">
              <h3>Getting Started:</h3>
              <ol>
                <li>Click "Load Example" to load a sample course</li>
                <li>Use the Page Manager to add pages from templates</li>
                <li>Edit page content in the main editor area</li>
                <li>Preview your course anytime</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      {/* Custom Template Editor Modal */}
      {featureFlags.isEnabled("custom-template") && (
        <CustomTemplateEditor
          isOpen={showCustomTemplateEditor}
          onClose={onCloseTemplateEditor}
        />
      )}

      <div className="editor-layout">
        {/* Left Sidebar - Page Manager */}
        <div className="editor-sidebar">
          <PageManager />
        </div>

        {/* Main Content Area */}
        <div className="editor-main">
          {pageId ? (
            <div className="editor-v2__component-area">
              <div className="editor-v2__page-header">
                {isEditingTitle ? (
                  <div className="editor-v2__title-edit-mode">
                    <input
                      ref={inputRef}
                      type="text"
                      className="editor-v2__page-title-input"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={handleTitleKeyDown}
                      placeholder="Enter page title..."
                      aria-label="Page title"
                    />
                    <button
                      className="editor-v2__title-save-btn"
                      onClick={handleSaveTitle}
                      title="Save title (Enter)"
                      aria-label="Save title"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      className="editor-v2__title-cancel-btn"
                      onClick={handleCancelEdit}
                      title="Cancel (Esc)"
                      aria-label="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="editor-v2__title-view-mode">
                    <span className="editor-v2__page-title">
                      {currentPage?.title ?? "Untitled Page"}
                    </span>
                    <button
                      className="editor-v2__title-edit-btn"
                      onClick={handleEditTitle}
                      title="Edit title"
                      aria-label="Edit title"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                )}
              </div>
              {componentError && (
                <div className="editor-v2__error-banner" role="alert">
                  <span className="editor-v2__error-icon">⚠</span>
                  <span>{componentError}</span>
                </div>
              )}
              <ComponentList
                pageId={pageId}
                courseId={courseId}
                mode="edit"
                onComponentSelect={(id: string) => setSelectedComponentId(id)}
              />
            </div>
          ) : (
            <div className="editor-placeholder">
              <div className="placeholder-content">
                <h2>Welcome to {currentCourse.title}</h2>
                <p>
                  <strong>Course Status:</strong>{" "}
                  {currentCourse?.status || "draft"}
                </p>
                <p>
                  <strong>Total Pages:</strong>{" "}
                  {currentCourse?.pages?.length || 0}
                </p>

                <div className="quick-start">
                  <h3>Quick Start:</h3>
                  <div className="quick-actions">
                    <div className="action-card">
                      <div className="action-icon">
                        <Plus size={24} />
                      </div>
                      <h4>Add Your First Page</h4>
                      <p>
                        Click the "<strong>+ Add Page</strong>" button in the
                        Page Manager to create a page from a template.
                      </p>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">
                        <Palette size={24} />
                      </div>
                      <h4>Choose Components</h4>
                      <p>
                        Add text, images, video, quizzes, and interactive
                        components to your pages.
                      </p>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">
                        <Edit3 size={24} />
                      </div>
                      <h4>Edit Content</h4>
                      <p>
                        Click any page in the Page Manager to start editing its
                        content.
                      </p>
                    </div>
                  </div>
                </div>

                {currentCourse?.pages && currentCourse.pages.length > 0 && (
                  <div className="existing-pages">
                    <h3>Existing Pages</h3>
                    <p>Click any page in the Page Manager to edit it:</p>
                    <ul className="page-preview-list">
                      {currentCourse.pages.map((page: any, index: number) => (
                        <li
                          key={page?.id || index}
                          className="page-preview-item"
                        >
                          <strong>{page?.title || `Page ${index + 1}`}</strong>
                          <span className="page-type">
                            ({page?.templateType || "unknown"})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Component Settings */}
        {selectedComponent && (
          <div className="editor-sidebar editor-sidebar--right">
            <ComponentSettings
              component={selectedComponent}
              courseId={courseId}
              pageId={pageId}
              onClose={() => setSelectedComponentId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorV2;
