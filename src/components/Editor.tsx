/**
 * Complete Editor Component with PageManager Integration
 * Production-ready version with sidebar layout and page management
 */

import React, { useState } from "react";
import { useAppSelector } from "../store";
import { featureFlags } from "../utils/featureFlags";
import CustomTemplateEditor from "./CustomTemplateEditor";
import "./Editor.css";
import PageEditor from "./PageEditor";
import PageManager from "./PageManager";

const Editor: React.FC = () => {
  const [showCustomTemplateEditor, setShowCustomTemplateEditor] =
    useState(false);

  // Safe Redux selector with null checking
  const courseState = useAppSelector((state) => (state as any).course);

  // FIX: Create a specific selector for currentPage to ensure reactivity
  const currentPage = useAppSelector((state) => {
    const editorState = (state as any).editor;
    return editorState?.present?.currentPage || null;
  });

  const editorState = useAppSelector((state) => (state as any).editor);

  const currentCourse = courseState?.currentCourse || null;

  // Track when currentPage changes in Editor component
  const lastCurrentPageIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (currentPage?.id !== lastCurrentPageIdRef.current) {
      console.log("\n🔄 Editor: currentPage changed in Redux selector");
      console.log("   Previous ID:", lastCurrentPageIdRef.current || "null");
      console.log("   New ID:", currentPage?.id || "null");
      console.log(
        "   New content:",
        currentPage
          ? JSON.stringify(currentPage.content).substring(0, 100)
          : "null"
      );
      console.log("   This will trigger PageEditor re-render with new prop\n");
      lastCurrentPageIdRef.current = currentPage?.id || null;
    }
  }, [currentPage?.id, currentPage?.content]);

  if (!currentCourse) {
    return (
      <div className="editor">
        <div className="editor-empty">
          <div className="empty-content">
            <h2>No Course Loaded</h2>
            <p>
              Please click "Example" in the header to start editing a course.
            </p>
            <div className="getting-started">
              <h3>Getting Started:</h3>
              <ol>
                <li>Click "Example" to load a sample course</li>
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
          onClose={() => setShowCustomTemplateEditor(false)}
        />
      )}

      <div className="editor-layout">
        {/* Left Sidebar - Page Manager */}
        <div className="editor-sidebar">
          <PageManager />
        </div>

        {/* Main Content Area */}
        <div className="editor-main">
          {/* Custom Template Button */}
          {featureFlags.isEnabled("custom-template") && (
            <div className="editor-toolbar">
              <button
                className="btn btn-custom-template"
                onClick={() => setShowCustomTemplateEditor(true)}
                title="Create custom template"
              >
                ✨ Create Custom Template
              </button>
            </div>
          )}
          {/* DEBUG: Check conditional rendering */}
          {currentPage ? (
            <PageEditor key={currentPage.id} page={currentPage} />
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
                      <h4>📝 Add Your First Page</h4>
                      <p>
                        Click the "<strong>+ Add Page</strong>" button in the
                        Page Manager to create a page from a template.
                      </p>
                    </div>
                    <div className="action-card">
                      <h4>🎨 Choose a Template</h4>
                      <p>
                        Select from welcome, video, quiz, content, and more
                        template types.
                      </p>
                    </div>
                    <div className="action-card">
                      <h4>✏️ Edit Content</h4>
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
      </div>
    </div>
  );
};

export default Editor;
