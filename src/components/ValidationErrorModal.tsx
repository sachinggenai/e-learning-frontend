/**
 * ValidationErrorModal Component - Professional validation error display
 *
 * Features:
 * - Categorized error display (critical, warnings, info)
 * - Expandable error details with line numbers and context
 * - Quick navigation to problematic elements
 * - Bulk actions (ignore warnings, fix automatically)
 * - Export validation report
 * - Validation statistics and summary
 */

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Info,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { t } from "../i18n/strings";
import "./ValidationErrorModal.css";

// Types
interface ValidationError {
  id: string;
  level: "error" | "warning" | "info";
  message: string;
  elementType?: string;
  elementId?: string;
  pageId?: string;
  line?: number;
  column?: number;
  context?: string;
  suggestion?: string;
  autoFixable?: boolean;
}

interface ValidationCategory {
  name: string;
  count: number;
  errors: ValidationError[];
}

interface ValidationErrorModalProps {
  errors: ValidationError[];
  onClose: () => void;
  onNavigateToElement?: (elementId: string, pageId?: string) => void;
  onAutoFix?: (errorId: string) => void;
  onIgnoreWarning?: (errorId: string) => void;
  onExportReport?: (errors: ValidationError[]) => void;
}

// Utility functions
const getErrorIcon = (level: ValidationError["level"]) => {
  switch (level) {
    case "error":
      return <AlertCircle />;
    case "warning":
      return <AlertTriangle />;
    case "info":
      return <Info />;
    default:
      return <Info />;
  }
};

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  errors,
  onClose,
  onNavigateToElement,
  onAutoFix,
  onIgnoreWarning,
  onExportReport,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Errors"]),
  );
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<
    "all" | "errors" | "warnings" | "info"
  >("all");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedBeforeOpen = useRef<HTMLElement | null>(null);

  // Focus management: capture last focus and focus first interactive element
  useEffect(() => {
    lastFocusedBeforeOpen.current = document.activeElement as HTMLElement;
    queueMicrotask(() => {
      if (!containerRef.current) return;
      const firstButton = containerRef.current.querySelector<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      firstButton?.focus();
    });
    return () => {
      lastFocusedBeforeOpen.current?.focus();
    };
  }, []);

  // Keyboard navigation over Navigate buttons (ArrowUp/Down) + ESC close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const navButtons = Array.from(
          containerRef.current.querySelectorAll<HTMLButtonElement>(
            'button[data-nav="navigate"]',
          ),
        );
        if (navButtons.length === 0) return;
        const idx = navButtons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        if (idx === -1) return;
        e.preventDefault();
        const delta = e.key === "ArrowDown" ? 1 : -1;
        const next = (idx + delta + navButtons.length) % navButtons.length;
        navButtons[next].focus();
      }
    };
    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [onClose]);

  // Categorize and filter errors
  const { categorizedErrors, stats, filteredErrors } = useMemo(() => {
    const severityWeight: Record<ValidationError["level"], number> = {
      error: 0,
      warning: 1,
      info: 2,
    };
    const sorted = [...errors].sort((a, b) => {
      if (severityWeight[a.level] !== severityWeight[b.level]) {
        return severityWeight[a.level] - severityWeight[b.level];
      }
      return a.message.localeCompare(b.message);
    });
    const stats = {
      total: errors.length,
      errors: errors.filter((e) => e.level === "error").length,
      warnings: errors.filter((e) => e.level === "warning").length,
      info: errors.filter((e) => e.level === "info").length,
      autoFixable: errors.filter((e) => e.autoFixable).length,
    };

    const filtered =
      activeTab === "all"
        ? sorted
        : sorted.filter((e) => e.level === activeTab);

    const categories: ValidationCategory[] = [];
    const groupings = new Map<string, ValidationError[]>();

    filtered.forEach((error) => {
      const key = `${error.level}-${error.elementType || "General"}`;
      if (!groupings.has(key)) {
        groupings.set(key, []);
      }
      groupings.get(key)!.push(error);
    });

    groupings.forEach((errorList, key) => {
      const [level, elementType] = key.split("-");
      categories.push({
        name: `${level.charAt(0).toUpperCase() + level.slice(1)} - ${elementType}`,
        count: errorList.length,
        errors: errorList.sort((a, b) => a.message.localeCompare(b.message)),
      });
    });

    categories.sort((a, b) => {
      const levelPriority = { Error: 0, Warning: 1, Info: 2 };
      const aLevel = a.name.split(" - ")[0] as keyof typeof levelPriority;
      const bLevel = b.name.split(" - ")[0] as keyof typeof levelPriority;

      if (levelPriority[aLevel] !== levelPriority[bLevel]) {
        return levelPriority[aLevel] - levelPriority[bLevel];
      }
      return b.count - a.count;
    });

    return { categorizedErrors: categories, stats, filteredErrors: filtered };
  }, [errors, activeTab]);

  // Event handlers
  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleErrorDetails = (errorId: string) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  const handleAutoFixAll = () => {
    const autoFixableErrors = filteredErrors.filter((e) => e.autoFixable);
    autoFixableErrors.forEach((error) => onAutoFix?.(error.id));
  };

  const handleIgnoreAllWarnings = () => {
    const warnings = filteredErrors.filter((e) => e.level === "warning");
    warnings.forEach((warning) => onIgnoreWarning?.(warning.id));
  };

  const handleExportReport = () => {
    onExportReport?.(filteredErrors);
  };

  return (
    <div className="vem-overlay" role="dialog" aria-modal="true">
      <div
        ref={containerRef}
        className="vem-container"
        data-testid="validation-error-modal"
      >
        {/* Header */}
        <div className="vem-header">
          <div className="vem-header__left">
            <span className="vem-header__icon"><AlertTriangle /></span>
            <div>
              <h2 className="vem-header__title">
                {t("validation.report.title", "Validation Report")}
              </h2>
              <p className="vem-header__subtitle">
                {stats.total} {t("validation.issues.found", "issues found")} •{" "}
                {stats.errors} {t("validation.errors", "errors")},{" "}
                {stats.warnings} {t("validation.warnings", "warnings")},{" "}
                {stats.info} {t("validation.info", "info")}
              </p>
            </div>
          </div>

          <div className="vem-header__actions">
            {stats.autoFixable > 0 && (
              <button
                onClick={handleAutoFixAll}
                className="vem-btn--autofix"
                title={`Auto-fix ${stats.autoFixable} issues`}
              >
                {t("validation.autofix", "Auto-fix")} ({stats.autoFixable})
              </button>
            )}

            <button
              onClick={handleExportReport}
              className="vem-btn--icon"
              title={t("validation.export.report", "Export validation report")}
            >
              <Download />
            </button>

            <button onClick={onClose} className="vem-btn--icon vem-btn--icon-lg">
              <X />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="vem-tabs" aria-label="Tabs">
          {[
            { key: "all", label: t("validation.tab.all", "All Issues"), count: stats.total },
            { key: "errors", label: t("validation.tab.errors", "Errors"), count: stats.errors },
            { key: "warnings", label: t("validation.tab.warnings", "Warnings"), count: stats.warnings },
            { key: "info", label: t("validation.tab.info", "Info"), count: stats.info },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`vem-tab ${activeTab === tab.key ? "vem-tab--active" : ""}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="vem-tab__badge">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="vem-content">
          {filteredErrors.length === 0 ? (
            <div className="vem-empty">
              <span className="vem-empty__icon"><CheckCircle /></span>
              <h3 className="vem-empty__title">
                {t("validation.none.title", "No Issues Found")}
              </h3>
              <p className="vem-empty__text">
                {activeTab === "all"
                  ? t("validation.none.allPass", "Your course passes all validation checks!")
                  : t("validation.none.tabEmpty", `No ${activeTab} found in your course.`)}
              </p>
            </div>
          ) : (
            <>
              {/* Action Bar */}
              <div className="vem-action-bar">
                <span>
                  {filteredErrors.length} {t("validation.issues.in", "issues in")}{" "}
                  {categorizedErrors.length} {t("validation.categories", "categories")}
                </span>
                <div className="vem-action-bar__actions">
                  {stats.warnings > 0 && activeTab !== "errors" && (
                    <button onClick={handleIgnoreAllWarnings} className="vem-btn--sm vem-btn--warning">
                      {t("validation.ignoreAllWarnings", "Ignore All Warnings")}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const allCategories = new Set(categorizedErrors.map((c) => c.name));
                      setExpandedCategories(
                        expandedCategories.size === categorizedErrors.length ? new Set() : allCategories,
                      );
                    }}
                    className="vem-btn--sm vem-btn--neutral"
                  >
                    {expandedCategories.size === categorizedErrors.length
                      ? t("actions.collapseAll", "Collapse All")
                      : t("actions.expandAll", "Expand All")}
                  </button>
                </div>
              </div>

              {/* Error Categories */}
              <div className="vem-scroll">
                <div className="vem-categories">
                  {categorizedErrors.map((category) => {
                    const isExpanded = expandedCategories.has(category.name);
                    return (
                      <div key={category.name} className="vem-category" role="group" aria-label={category.name}>
                        <button onClick={() => toggleCategory(category.name)} className="vem-category__header">
                          <div className="vem-category__header-left">
                            <span className="vem-category__chevron">
                              {isExpanded ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <span className="vem-category__name">{category.name}</span>
                            <span className="vem-category__count">{category.count}</span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="vem-errors">
                            {category.errors.map((error) => {
                              const isErrorExpanded = expandedErrors.has(error.id);
                              return (
                                <div
                                  key={error.id}
                                  className={`vem-error vem-error--${error.level}`}
                                  data-error-id={error.id}
                                  data-severity={error.level}
                                >
                                  <div className="vem-error__row">
                                    <span className={`vem-error__icon vem-error__icon--${error.level}`}>
                                      {getErrorIcon(error.level)}
                                    </span>
                                    <div className="vem-error__body">
                                      <div className="vem-error__top">
                                        <p className="vem-error__message">{error.message}</p>
                                        <div className="vem-error__actions">
                                          {error.autoFixable && (
                                            <button onClick={() => onAutoFix?.(error.id)} className="vem-btn--pill vem-btn--green">
                                              {t("validation.autofix", "Auto-fix")}
                                            </button>
                                          )}
                                          {error.level === "warning" && (
                                            <button onClick={() => onIgnoreWarning?.(error.id)} className="vem-btn--pill vem-btn--gray">
                                              {t("actions.ignore", "Ignore")}
                                            </button>
                                          )}
                                          {(error.elementId || error.pageId) && (
                                            <button
                                              data-nav="navigate"
                                              onClick={() => onNavigateToElement?.(error.elementId!, error.pageId)}
                                              className="vem-btn--pill vem-btn--blue"
                                            >
                                              {t("actions.navigate", "Navigate")}
                                            </button>
                                          )}
                                          <button onClick={() => toggleErrorDetails(error.id)} className="vem-btn--icon">
                                            {isErrorExpanded ? <ChevronDown /> : <ChevronRight />}
                                          </button>
                                        </div>
                                      </div>
                                      <div className="vem-error__meta">
                                        {error.elementType && <span>Element: {error.elementType}</span>}
                                        {error.elementId && <span>ID: {error.elementId}</span>}
                                        {error.pageId && <span>Page: {error.pageId}</span>}
                                        {error.line && <span>Line: {error.line}</span>}
                                      </div>
                                    </div>
                                  </div>

                                  {isErrorExpanded && (
                                    <div className="vem-error__details">
                                      {error.context && (
                                        <div>
                                          <h4 className="vem-detail__label">{t("validation.context", "Context")}</h4>
                                          <pre className="vem-detail__pre">{error.context}</pre>
                                        </div>
                                      )}
                                      {error.suggestion && (
                                        <div>
                                          <h4 className="vem-detail__label">{t("validation.suggestion", "Suggestion")}</h4>
                                          <p className="vem-detail__suggestion">{error.suggestion}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="vem-footer">
          <div className="vem-footer__status">
            {stats.errors > 0 && (
              <span className="vem-footer__status--error">
                {stats.errors} {t("validation.errors", "error")}{stats.errors !== 1 ? "s" : ""}{" "}
                {t("validation.mustFixBefore", "must be fixed before publishing")}
              </span>
            )}
            {stats.errors === 0 && stats.warnings > 0 && (
              <span className="vem-footer__status--warning">
                {stats.warnings} {t("validation.warnings", "warning")}{stats.warnings !== 1 ? "s" : ""}{" "}
                {t("validation.shouldReview", "should be reviewed")}
              </span>
            )}
            {stats.errors === 0 && stats.warnings === 0 && (
              <span className="vem-footer__status--success">
                {t("validation.allPassed", "All validation checks passed!")}
              </span>
            )}
          </div>

          <div className="vem-footer__buttons">
            <button onClick={onClose} className="vem-btn--close">
              {t("actions.close", "Close")}
            </button>
            {stats.errors === 0 && (
              <button onClick={onClose} className="vem-btn--continue">
                {t("actions.continue", "Continue")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
