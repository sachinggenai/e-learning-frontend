/**
 * Template Selector Modal
 *
 * Modal component for selecting page templates when adding new pages to a course.
 * Shows template previews, descriptions, and allows users to choose and customize.
 */

import React, { useEffect, useRef, useState } from "react";
import { normalizeTemplateType } from "../constants/templateTypes";
import { t } from "../i18n/strings";
import { useAppDispatch, useAppSelector } from "../store";
import {
  mapTemplateList,
  TemplateDTO,
  TemplateVM,
} from "../store/adapters/templateAdapter";
import { fetchTemplates } from "../store/slices/courseSlice";
import "./TemplateSelector.css";
import "./common/visuallyHidden.css";

// Legacy Template interface kept temporarily for backward compatibility with existing state shape
interface LegacyTemplateShape {
  id: string;
  templateId: string;
  type: string;
  title: string;
  order: number;
  data: {
    content: Record<string, any>;
    rawFields: Array<any>;
    description?: string;
    category?: string;
  };
}

type Template = LegacyTemplateShape | (TemplateVM & { data?: any });

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: Template, pageTitle: string) => void;
  courseId: number;
  /** Optional override for loading templates (used for deterministic testing) */
  loadTemplates?: () => Promise<any[]>;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  courseId,
  loadTemplates,
}) => {
  const dispatch = useAppDispatch();
  const { templates, rawTemplates, isLoading } = useAppSelector((state) => {
    const course = (state as any).course;
    return {
      templates: course.templates,
      rawTemplates: course.rawTemplates,
      isLoading: course.isLoading,
    };
  });

  // Derive unified view model list (Phase 2): prefer adapter over legacy
  let vmTemplates: TemplateVM[] = [];
  try {
    if (Array.isArray(rawTemplates) && rawTemplates.length > 0) {
      vmTemplates = mapTemplateList(rawTemplates as TemplateDTO[]);
    }
  } catch (e) {
    // Fallback: ignore adapter failure to avoid breaking UI
    // console.debug("Adapter mapping failed, falling back to legacy", e);
    vmTemplates = [];
  }

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [pageTitle, setPageTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Capture previously focused element & focus first element on open
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      // Delay to ensure elements rendered
      requestAnimationFrame(() => {
        if (!modalRef.current) return;
        const focusable = getFocusableElements();
        if (focusable.length) {
          // Prefer search input
          const search =
            modalRef.current.querySelector<HTMLInputElement>(
              ".template-search",
            );
          if (search) {
            search.focus();
          } else {
            focusable[0].focus();
          }
        }
      });
    } else if (!isOpen && previouslyFocusedElement.current) {
      // Restore focus when closing
      previouslyFocusedElement.current.focus();
    }
  }, [isOpen]);

  // Helper to get focusable elements inside modal
  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.current) return [];
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(selectors.join(",")),
    ).filter((el) => !el.hasAttribute("aria-hidden"));
  };

  // Focus trap (Tab / Shift+Tab) & global Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const currentIndex = focusable.indexOf(
          document.activeElement as HTMLElement,
        );
        let nextIndex = currentIndex;
        if (e.shiftKey) {
          nextIndex =
            currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        } else {
          nextIndex =
            currentIndex === focusable.length - 1 ? 0 : currentIndex + 1;
        }
        if (currentIndex === -1) {
          // If focus somehow escaped, reset to first
          nextIndex = 0;
        }
        e.preventDefault();
        focusable[nextIndex].focus();
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [isOpen, onClose]);

  // Load templates when modal opens
  useEffect(() => {
    if (isOpen && courseId) {
      setLoadError(null);
      const performLoad = async () => {
        try {
          if (loadTemplates) {
            await loadTemplates();
          } else {
            const result: any = dispatch(fetchTemplates(courseId) as any);
            if (result && typeof result.then === "function") {
              await result;
            }
          }
        } catch (e: any) {
          setLoadError(e?.message || "Failed to load templates");
        }
      };
      performLoad();
    }
  }, [isOpen, courseId, dispatch, retryCount, loadTemplates]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTemplate(null);
      setPageTitle("");
      setSearchTerm("");
      setLoadError(null);
    }
  }, [isOpen]);

  // Filter templates by search term (defensive against undefined values)
  const normalizedSearch = (searchTerm || "").toLowerCase();
  // Choose source: adapter VMs if available else legacy templates
  const sourceTemplates: Template[] =
    vmTemplates.length > 0 ? (vmTemplates as any) : templates || [];

  const filteredTemplates = (sourceTemplates || []).filter(
    (template: Template) => {
      if (!template) return false;
      const title = (template as any).title?.toLowerCase?.() || "";
      const type = (template as any).type?.toLowerCase?.() || "";
      const category = (
        (template as any).category ||
        (template as any).data?.category ||
        ""
      ).toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        type.includes(normalizedSearch) ||
        category.includes(normalizedSearch)
      );
    },
  );

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template as any);
    setPageTitle((template as any).title); // Default to template title
  };

  const safeTrim = (val: string) => (typeof val === "string" ? val.trim() : "");
  const handleCreatePage = () => {
    const trimmed = safeTrim(pageTitle);
    if (selectedTemplate && trimmed) {
      onTemplateSelect(selectedTemplate, trimmed);
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const trimmed = safeTrim(pageTitle);
      if (selectedTemplate && trimmed) handleCreatePage();
    }
  };

  const getTemplateIcon = (type: string) => {
    const t = normalizeTemplateType(type);
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

  const getTemplateDescription = (template: Template) => {
    const descriptions: Record<string, string> = {
      welcome:
        "Create a welcome page with learning objectives and course overview",
      "content-text": "Add text-based content with formatting and navigation",
      "content-video":
        "Embed videos with descriptions and interactive controls",
      mcq: "Create assessments with multiple choice questions",
      "content-image": "Combine images with text content in various layouts",
      interactive: "Add interactive hotspots and clickable elements",
    };
    return (
      descriptions[normalizeTemplateType(template.type)] ||
      "A customizable page template"
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="template-selector-overlay"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        className="template-selector-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-selector-title"
        aria-describedby="template-selector-desc"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2 id="template-selector-title">{t("menu.insert.addPage")}</h2>
          <p id="template-selector-desc" className="visually-hidden">
            {t("templates.available", "Available Templates")}
          </p>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close template selector"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Search bar */}
          <div className="search-section">
            <input
              type="text"
              className="template-search"
              placeholder={t(
                "templates.search.placeholder",
                "Search templates...",
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="selector-body">
            {/* Template list */}
            <div className="template-list">
              <h3>{t("templates.available", "Available Templates")}</h3>
              {isLoading && !loadError && (
                <div className="loading-state">
                  {t("loading.templates", "Loading templates...")}
                </div>
              )}
              {loadError && (
                <div className="error-state" role="alert">
                  <p className="error-message">{loadError}</p>
                  <button
                    className="retry-button"
                    onClick={() => {
                      setRetryCount((c) => c + 1);
                    }}
                  >
                    {t("actions.retry", "Retry")}
                  </button>
                </div>
              )}
              {!isLoading && !loadError && filteredTemplates.length === 0 && (
                <div className="empty-state">
                  {searchTerm
                    ? t(
                        "templates.none.match",
                        "No templates match your search",
                      )
                    : t("templates.none.available", "No templates available")}
                </div>
              )}
              {!isLoading && !loadError && filteredTemplates.length > 0 && (
                <div className="template-grid">
                  {filteredTemplates.map((template: Template) => (
                    <div
                      key={template.id}
                      className={`template-card ${
                        selectedTemplate?.id === template.id ? "selected" : ""
                      }`}
                      onClick={() => handleTemplateClick(template)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleTemplateClick(template);
                        }
                      }}
                    >
                      <div className="template-icon">
                        {getTemplateIcon((template as any).type)}
                      </div>
                      <div className="template-info">
                        <h4>{(template as any).title}</h4>
                        <p className="template-type">
                          {(template as any).type}
                        </p>
                        <p className="template-description">
                          {getTemplateDescription(template as any)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview and configuration (page title input shown only after a template is selected) */}
            <div className="template-preview">
              <h3>{t("templates.configure", "Configure Your Page")}</h3>
              <div className="preview-content">
                {selectedTemplate ? (
                  <div className="template-details">
                    <div className="detail-header">
                      <span className="template-icon large">
                        {getTemplateIcon(selectedTemplate.type)}
                      </span>
                      <div>
                        <h4>{selectedTemplate.title}</h4>
                        <p>{selectedTemplate.type}</p>
                      </div>
                    </div>
                    <p className="description">
                      {getTemplateDescription(selectedTemplate)}
                    </p>
                  </div>
                ) : (
                  <div className="template-details placeholder">
                    <p className="description text-gray-500">
                      {t(
                        "templates.select.template.prompt",
                        "Select a template to view details and enter a page title.",
                      )}
                    </p>
                  </div>
                )}
                {selectedTemplate && (
                  <>
                    <div className="page-config">
                      <label htmlFor="page-title" className="config-label">
                        {t("page.title.label", "Page Title")}
                      </label>
                      <input
                        id="page-title"
                        type="text"
                        className="page-title-input"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        placeholder={t(
                          "page.title.placeholder",
                          "Enter page title...",
                        )}
                      />
                    </div>
                    <div className="template-structure">
                      <h5>{t("templates.structure", "Template Structure:")}</h5>
                      <ul className="structure-list">
                        {(() => {
                          // Support both legacy (data.rawFields) and adapter VM (fields)
                          const legacyRaw = (selectedTemplate as any).data
                            ?.rawFields;
                          const vmFields = (selectedTemplate as any).fields;
                          const list = Array.isArray(legacyRaw)
                            ? legacyRaw
                            : Array.isArray(vmFields)
                              ? vmFields
                              : [];
                          if (list.length === 0)
                            return <li>No structured fields</li>;
                          return list.map((f: any) => (
                            <li key={f.id || f.name}>
                              <strong>{f.label || f.name}</strong>: {f.type}
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {t("actions.cancel", "Cancel")}
          </button>
          <button
            className="create-button"
            onClick={handleCreatePage}
            disabled={!selectedTemplate || !safeTrim(pageTitle)}
          >
            {t("actions.createPage", "Create Page")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
