/**
 * Custom Template Editor Component
 * Allows users to create and edit custom templates with flexible fields and layouts.
 */

import React, { useState } from "react";
import { apiService } from "../services/api";
import { useAppDispatch, useAppSelector } from "../store";
import {
  EnhancedTemplate,
  FieldDefinition,
  FieldType,
  LayoutDefinition,
} from "../types/course";
import "./CustomTemplateEditor.css";

interface CustomTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  existingTemplate?: EnhancedTemplate;
}

const CustomTemplateEditor: React.FC<CustomTemplateEditorProps> = ({
  isOpen,
  onClose,
  existingTemplate,
}) => {
  const dispatch = useAppDispatch();
  const courseId = useAppSelector(
    (state) => (state as any).course.currentCourse?.id,
  );

  const [template, setTemplate] = useState<Partial<EnhancedTemplate>>(
    existingTemplate || {
      type: "custom",
      category: "custom",
      name: "",
      fields: [],
      layout: { type: "single-column" },
      metadata: {
        description: "",
        tags: [],
      },
    },
  );

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fieldTypes: FieldType[] = [
    "text",
    "textarea",
    "rich-text",
    "select",
    "multiselect",
    "media",
    "number",
    "boolean",
    "date",
    "email",
    "url",
  ];

  const handleAddField = () => {
    setTemplate({
      ...template,
      fields: [
        ...(template.fields || []),
        {
          id: `field_${Date.now()}`,
          name: "",
          type: "text",
          label: "",
          required: false,
          order: template.fields?.length || 0,
        },
      ],
    });
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...(template.fields || [])];
    updatedFields.splice(index, 1);
    // Reorder remaining fields
    updatedFields.forEach((field, idx) => {
      field.order = idx;
    });
    setTemplate({ ...template, fields: updatedFields });
  };

  const handleFieldChange = (
    index: number,
    field: Partial<FieldDefinition>,
  ) => {
    const updatedFields = [...(template.fields || [])];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setTemplate({ ...template, fields: updatedFields });
  };

  const handleLayoutChange = (layout: Partial<LayoutDefinition>) => {
    setTemplate({
      ...template,
      layout: { ...template.layout, ...layout } as LayoutDefinition,
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!template.name?.trim()) {
      setError("Template name is required");
      return;
    }
    if (!template.fields?.length) {
      setError("At least one field is required");
      return;
    }

    // Validate all fields have names and labels
    const invalidFields = template.fields.filter(
      (f) => !f.name?.trim() || !f.label?.trim(),
    );
    if (invalidFields.length > 0) {
      setError("All fields must have a name and label");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const templateData: EnhancedTemplate = {
        ...template,
        id: existingTemplate?.id || `custom_${Date.now()}`,
        templateId: existingTemplate?.templateId || `custom_${Date.now()}`,
        name: template.name!,
        type: "custom",
        category: "custom",
        fields: template.fields!,
        layout: template.layout!,
        courseId: courseId?.toString(),
      } as EnhancedTemplate;

      if (existingTemplate) {
        await apiService.updateEnhancedTemplate(
          existingTemplate.id,
          templateData,
        );
      } else {
        await apiService.createEnhancedTemplate(templateData);
      }

      // Success - close the editor
      onClose();
    } catch (err) {
      setError("Failed to save template: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="custom-template-editor-overlay" onClick={onClose}>
      <div
        className="custom-template-editor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editor-header">
          <h2>{existingTemplate ? "Edit" : "Create"} Custom Template</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="editor-body">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {/* Template Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="template-name">
              Template Name <span className="required">*</span>
            </label>
            <input
              id="template-name"
              className="form-input"
              value={template.name || ""}
              onChange={(e) =>
                setTemplate({ ...template, name: e.target.value })
              }
              placeholder="e.g., Interactive Quiz, Content Page"
              required
            />
          </div>

          {/* Template Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="template-description">
              Description
            </label>
            <textarea
              id="template-description"
              className="form-input"
              rows={3}
              value={template.metadata?.description || ""}
              onChange={(e) =>
                setTemplate({
                  ...template,
                  metadata: {
                    ...template.metadata,
                    description: e.target.value,
                  },
                })
              }
              placeholder="Describe what this template is for..."
            />
          </div>

          {/* Layout Configuration */}
          <div className="form-group">
            <label className="form-label">Layout Type</label>
            <div className="layout-selector">
              <button
                type="button"
                className={`layout-option ${template.layout?.type === "single-column" ? "active" : ""}`}
                onClick={() => handleLayoutChange({ type: "single-column" })}
              >
                <div className="layout-icon single-column" />
                <span>Single Column</span>
              </button>
              <button
                type="button"
                className={`layout-option ${template.layout?.type === "two-column" ? "active" : ""}`}
                onClick={() => handleLayoutChange({ type: "two-column" })}
              >
                <div className="layout-icon two-column" />
                <span>Two Column</span>
              </button>
              <button
                type="button"
                className={`layout-option ${template.layout?.type === "grid" ? "active" : ""}`}
                onClick={() => handleLayoutChange({ type: "grid" })}
              >
                <div className="layout-icon grid" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {/* Fields Configuration */}
          <div className="form-group">
            <div className="section-header">
              <h3>
                Fields <span className="required">*</span>
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddField}
              >
                + Add Field
              </button>
            </div>

            {template.fields && template.fields.length > 0 ? (
              <div className="fields-list">
                {template.fields.map((field, index) => (
                  <div key={field.id} className="field-item">
                    <div className="field-header">
                      <span className="field-number">Field {index + 1}</span>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleRemoveField(index)}
                        aria-label="Remove field"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="field-row">
                      <div className="form-group-inline">
                        <label htmlFor={`field-name-${index}`}>
                          Name <span className="required">*</span>
                        </label>
                        <input
                          id={`field-name-${index}`}
                          className="form-input"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldChange(index, { name: e.target.value })
                          }
                          placeholder="e.g., question, answer"
                        />
                      </div>

                      <div className="form-group-inline">
                        <label htmlFor={`field-label-${index}`}>
                          Label <span className="required">*</span>
                        </label>
                        <input
                          id={`field-label-${index}`}
                          className="form-input"
                          value={field.label}
                          onChange={(e) =>
                            handleFieldChange(index, { label: e.target.value })
                          }
                          placeholder="e.g., Question Text"
                        />
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="form-group-inline">
                        <label htmlFor={`field-type-${index}`}>Type</label>
                        <select
                          id={`field-type-${index}`}
                          className="form-select"
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, {
                              type: e.target.value as FieldType,
                            })
                          }
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group-inline">
                        <label htmlFor={`field-placeholder-${index}`}>
                          Placeholder
                        </label>
                        <input
                          id={`field-placeholder-${index}`}
                          className="form-input"
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            handleFieldChange(index, {
                              placeholder: e.target.value,
                            })
                          }
                          placeholder="Hint text..."
                        />
                      </div>
                    </div>

                    <div className="field-row">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldChange(index, {
                              required: e.target.checked,
                            })
                          }
                        />
                        <span>Required field</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No fields added yet. Click "Add Field" to get started.</p>
              </div>
            )}
          </div>
        </div>

        <div className="editor-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : existingTemplate
                ? "Update Template"
                : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTemplateEditor;
