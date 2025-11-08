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
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

const getErrorColor = (level: ValidationError["level"]) => {
  switch (level) {
    case "error":
      return "border-red-200 bg-red-50";
    case "warning":
      return "border-yellow-200 bg-yellow-50";
    case "info":
      return "border-blue-200 bg-blue-50";
    default:
      return "border-gray-200 bg-gray-50";
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
    // Microtask to ensure DOM rendered
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
        if (idx === -1) return; // Only intercept when already on a navigate button
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
    // Primary severity weight ordering applied early so any consumers get sorted list
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

    // Group by element type and level
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
      // Sort by level priority (errors first), then by count
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        data-testid="validation-error-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("validation.report.title", "Validation Report")}
              </h2>
              <p className="text-sm text-gray-500">
                {stats.total} {t("validation.issues.found", "issues found")} •{" "}
                {stats.errors} {t("validation.errors", "errors")},{" "}
                {stats.warnings} {t("validation.warnings", "warnings")},{" "}
                {stats.info} {t("validation.info", "info")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {stats.autoFixable > 0 && (
              <button
                onClick={handleAutoFixAll}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                title={`Auto-fix ${stats.autoFixable} issues`}
              >
                {t("validation.autofix", "Auto-fix")} ({stats.autoFixable})
              </button>
            )}

            <button
              onClick={handleExportReport}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={t("validation.export.report", "Export validation report")}
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              {
                key: "all",
                label: t("validation.tab.all", "All Issues"),
                count: stats.total,
              },
              {
                key: "errors",
                label: t("validation.tab.errors", "Errors"),
                count: stats.errors,
              },
              {
                key: "warnings",
                label: t("validation.tab.warnings", "Warnings"),
                count: stats.warnings,
              },
              {
                key: "info",
                label: t("validation.tab.info", "Info"),
                count: stats.info,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`
                    ml-2 py-0.5 px-2 rounded-full text-xs
                    ${
                      activeTab === tab.key
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-900"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {filteredErrors.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("validation.none.title", "No Issues Found")}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "all"
                    ? t(
                        "validation.none.allPass",
                        "Your course passes all validation checks!",
                      )
                    : t(
                        "validation.none.tabEmpty",
                        `No ${activeTab} found in your course.`,
                      )}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-96 overflow-y-auto">
              {/* Action Bar */}
              {filteredErrors.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div className="text-sm text-gray-600">
                    {filteredErrors.length}{" "}
                    {t("validation.issues.in", "issues in")}{" "}
                    {categorizedErrors.length}{" "}
                    {t("validation.categories", "categories")}
                  </div>

                  <div className="flex space-x-2">
                    {stats.warnings > 0 && activeTab !== "errors" && (
                      <button
                        onClick={handleIgnoreAllWarnings}
                        className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
                      >
                        {t(
                          "validation.ignoreAllWarnings",
                          "Ignore All Warnings",
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const allCategories = new Set(
                          categorizedErrors.map((c) => c.name),
                        );
                        setExpandedCategories(
                          expandedCategories.size === categorizedErrors.length
                            ? new Set()
                            : allCategories,
                        );
                      }}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {expandedCategories.size === categorizedErrors.length
                        ? t("actions.collapseAll", "Collapse All")
                        : t("actions.expandAll", "Expand All")}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Categories */}
              <div className="p-4 space-y-4">
                {categorizedErrors.map((category) => {
                  const isExpanded = expandedCategories.has(category.name);

                  return (
                    <div
                      key={category.name}
                      className="border rounded-lg overflow-hidden"
                      role="group"
                      aria-label={category.name}
                    >
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                            {category.count}
                          </span>
                        </div>
                      </button>

                      {/* Category Errors */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-200">
                          {category.errors.map((error) => {
                            const isErrorExpanded = expandedErrors.has(
                              error.id,
                            );

                            return (
                              <div
                                key={error.id}
                                className={`p-4 ${getErrorColor(error.level)}`}
                                data-error-id={error.id}
                                data-severity={error.level}
                              >
                                {/* Error Summary */}
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 pt-1">
                                    {getErrorIcon(error.level)}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900">
                                        {error.message}
                                      </p>

                                      <div className="flex items-center space-x-2">
                                        {error.autoFixable && (
                                          <button
                                            onClick={() =>
                                              onAutoFix?.(error.id)
                                            }
                                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                          >
                                            {t(
                                              "validation.autofix",
                                              "Auto-fix",
                                            )}
                                          </button>
                                        )}

                                        {error.level === "warning" && (
                                          <button
                                            onClick={() =>
                                              onIgnoreWarning?.(error.id)
                                            }
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                          >
                                            {t("actions.ignore", "Ignore")}
                                          </button>
                                        )}

                                        {(error.elementId || error.pageId) && (
                                          <button
                                            data-nav="navigate"
                                            onClick={() =>
                                              onNavigateToElement?.(
                                                error.elementId!,
                                                error.pageId,
                                              )
                                            }
                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                          >
                                            {t("actions.navigate", "Navigate")}
                                          </button>
                                        )}

                                        <button
                                          onClick={() =>
                                            toggleErrorDetails(error.id)
                                          }
                                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                          {isErrorExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Error Metadata */}
                                    <div className="mt-1 text-xs text-gray-500 space-x-4">
                                      {error.elementType && (
                                        <span>
                                          Element: {error.elementType}
                                        </span>
                                      )}
                                      {error.elementId && (
                                        <span>ID: {error.elementId}</span>
                                      )}
                                      {error.pageId && (
                                        <span>Page: {error.pageId}</span>
                                      )}
                                      {error.line && (
                                        <span>Line: {error.line}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded Error Details */}
                                {isErrorExpanded && (
                                  <div className="mt-4 pl-8 space-y-3">
                                    {error.context && (
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                                          {t("validation.context", "Context")}
                                        </h4>
                                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                          {error.context}
                                        </pre>
                                      </div>
                                    )}

                                    {error.suggestion && (
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                                          {t(
                                            "validation.suggestion",
                                            "Suggestion",
                                          )}
                                        </h4>
                                        <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                                          {error.suggestion}
                                        </p>
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
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {stats.errors > 0 && (
              <span className="text-red-600 font-medium">
                {stats.errors} {t("validation.errors", "error")}
                {stats.errors !== 1 ? "s" : ""}{" "}
                {t(
                  "validation.mustFixBefore",
                  "must be fixed before publishing",
                )}
              </span>
            )}
            {stats.errors === 0 && stats.warnings > 0 && (
              <span className="text-yellow-600">
                {stats.warnings} {t("validation.warnings", "warning")}
                {stats.warnings !== 1 ? "s" : ""}{" "}
                {t("validation.shouldReview", "should be reviewed")}
              </span>
            )}
            {stats.errors === 0 && stats.warnings === 0 && (
              <span className="text-green-600 font-medium">
                {t("validation.allPassed", "All validation checks passed!")}
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("actions.close", "Close")}
            </button>

            {stats.errors === 0 && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
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
