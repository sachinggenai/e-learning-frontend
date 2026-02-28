/**
 * EditorV2
 *
 * New-architecture editor that replaces the legacy switch-based PageEditor.
 * Uses ComponentList + DynamicComponentRenderer + ComponentPicker.
 *
 * Layout: sidebar (PageManager) + main area (ComponentList for selected page)
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Palette, Edit3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import type { AppDispatch, RootState } from '../store';
import { fetchComponents, addComponent } from '../store/slices/componentsSlice';
import { setCurrentPage, clearCurrentPage, updatePageTitle } from '../store/slices/editorSlice';
import { updatePageTitleThunk } from '../store/slices/courseSlice';
import { featureFlags } from '../utils/featureFlags';
import { EditorV2Props } from '../types/comprehensive';
import { ComponentList } from './ComponentList';
import { ComponentSettings } from './ComponentSettings';
import CustomTemplateEditor from './CustomTemplateEditor';
import PageManager from './PageManager';
import './Editor.css';

const EditorV2: React.FC<EditorV2Props> = ({
  showCustomTemplateEditor = false,
  onCloseTemplateEditor = () => {},
}) => {
  const dispatch = useAppDispatch();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  const courseState = useAppSelector((state) => (state as any).course);
  const currentCourse = courseState?.currentCourse ?? null;

  const currentPage = useAppSelector((state) => {
    const editorState = (state as any).editor;
    return editorState?.present?.currentPage ?? null;
  });

  const courseId = currentCourse?.courseId ?? String(currentCourse?.id ?? '');
  const pageId = currentPage?.id ?? '';

  const selectedComponent = useAppSelector((state) => {
    if (!selectedComponentId) return null;
    const comps = (state as any).components?.byPage?.[pageId] ?? [];
    return comps.find((c: any) => c.componentId === selectedComponentId) ?? null;
  });

  const componentError = useAppSelector((state) => (state as any).components?.error ?? null);

  // Fetch components when page changes
  useEffect(() => {
    if (courseId && pageId) {
      dispatch(fetchComponents({ courseId, pageId }));
    }
  }, [dispatch, courseId, pageId]);

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
      {featureFlags.isEnabled('custom-template') && (
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
                <input
                  className="editor-v2__page-title-input"
                  value={currentPage?.title ?? 'Untitled Page'}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    // Update local editor state immediately
                    dispatch(updatePageTitle(newTitle));
                    // Persist to backend
                    if (currentPage && courseId) {
                      dispatch(updatePageTitleThunk({
                        courseId,
                        pageId: currentPage.id,
                        title: newTitle
                      }));
                    }
                  }}
                  placeholder="Enter page title..."
                  aria-label="Page title"
                />
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
                <p><strong>Course Status:</strong> {currentCourse?.status || 'draft'}</p>
                <p><strong>Total Pages:</strong> {currentCourse?.pages?.length || 0}</p>

                <div className="quick-start">
                  <h3>Quick Start:</h3>
                  <div className="quick-actions">
                    <div className="action-card">
                      <div className="action-icon">
                        <Plus size={24} />
                      </div>
                      <h4>Add Your First Page</h4>
                      <p>Click the "<strong>+ Add Page</strong>" button in the Page Manager to create a page from a template.</p>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">
                        <Palette size={24} />
                      </div>
                      <h4>Choose Components</h4>
                      <p>Add text, images, video, quizzes, and interactive components to your pages.</p>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">
                        <Edit3 size={24} />
                      </div>
                      <h4>Edit Content</h4>
                      <p>Click any page in the Page Manager to start editing its content.</p>
                    </div>
                  </div>
                </div>

                {currentCourse?.pages && currentCourse.pages.length > 0 && (
                  <div className="existing-pages">
                    <h3>Existing Pages</h3>
                    <p>Click any page in the Page Manager to edit it:</p>
                    <ul className="page-preview-list">
                      {currentCourse.pages.map((page: any, index: number) => (
                        <li key={page?.id || index} className="page-preview-item">
                          <strong>{page?.title || `Page ${index + 1}`}</strong>
                          <span className="page-type">({page?.templateType || 'unknown'})</span>
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
