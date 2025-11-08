/**
 * Simple Editor Component
 * Redux-only version without Context API dependencies
 */

import React from "react";
import { useAppSelector } from "../store";
import "./Editor.css";

const Editor: React.FC = () => {
  const courseState = useAppSelector((state) => (state as any).course);
  const { currentCourse } = courseState;

  if (!currentCourse) {
    return (
      <div className="editor">
        <div className="editor-empty">
          <h2>No Course Loaded</h2>
          <p>Please click "Example" in the header to start editing a course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <h2>Course Editor</h2>
        <p>Editing: {currentCourse.title}</p>
      </div>

      <div className="editor-content">
        <div className="course-info">
          <h3>Course Information</h3>
          <p>
            <strong>Title:</strong> {currentCourse.title}
          </p>
          <p>
            <strong>Description:</strong> {currentCourse.description}
          </p>
          <p>
            <strong>Status:</strong> {currentCourse.status}
          </p>
          <p>
            <strong>Pages:</strong> {currentCourse.pages?.length || 0}
          </p>
        </div>

        {currentCourse.pages && currentCourse.pages.length > 0 && (
          <div className="pages-list">
            <h3>Course Pages</h3>
            {currentCourse.pages.map((page: any, index: number) => (
              <div key={page.id} className="page-item">
                <h4>{page.title}</h4>
                <p>Template: {page.templateType}</p>
                <p>Order: {page.order}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
