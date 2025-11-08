/**
 * TemplateList Component - Placeholder Implementation
 * This will be fully implemented in the next iteration
 */

import React from "react";

interface TemplateListProps {
  templates: any[];
  currentIndex: number;
  onTemplateSelect: (index: number) => void;
  onTemplateDelete: (index: number) => void;
  onTemplateReorder: (fromIndex: number, toIndex: number) => void;
  validationErrors: any[];
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  currentIndex,
  onTemplateSelect,
  onTemplateDelete,
  onTemplateReorder,
  validationErrors,
}) => {
  return (
    <div className="template-list">
      <h4>Template List</h4>
      {templates.map((template, index) => (
        <div
          key={template.id}
          className={`template-item ${index === currentIndex ? "active" : ""}`}
          onClick={() => onTemplateSelect(index)}
        >
          <span>
            {index + 1}. {template.title}
          </span>
          <small>({template.type})</small>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTemplateDelete(index);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      <p>
        <em>Full template list implementation coming in next iteration...</em>
      </p>
    </div>
  );
};

export default TemplateList;
