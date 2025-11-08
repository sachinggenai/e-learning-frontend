import React from "react";
import { ValidationError } from "../types/comprehensive";

interface ValidationPanelProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  onErrorClick?: (error: ValidationError) => void;
  className?: string;
}

/**
 * ValidationPanel component for displaying validation errors and warnings
 * Provides categorized display with actionable error messages
 */
export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors,
  warnings,
  onErrorClick,
  className = "",
}) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  if (!hasErrors && !hasWarnings) {
    return null;
  }

  const handleErrorClick = (error: ValidationError) => {
    if (onErrorClick) {
      onErrorClick(error);
    }
  };

  return (
    <div className={`validation-panel ${className}`}>
      <div className="validation-panel__header">
        <h3>Validation Issues</h3>
        <div className="validation-panel__summary">
          {hasErrors && (
            <span className="validation-panel__count validation-panel__count--error">
              {errors.length} error{errors.length !== 1 ? "s" : ""}
            </span>
          )}
          {hasWarnings && (
            <span className="validation-panel__count validation-panel__count--warning">
              {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="validation-panel__content">
        {hasErrors && (
          <div className="validation-panel__section">
            <h4 className="validation-panel__section-title validation-panel__section-title--error">
              Errors
            </h4>
            <ul className="validation-panel__list">
              {errors.map((error, index) => (
                <li
                  key={`${error.field}-${index}`}
                  className="validation-panel__item validation-panel__item--error"
                  onClick={() => handleErrorClick(error)}
                  style={{ cursor: onErrorClick ? "pointer" : "default" }}
                >
                  <div className="validation-panel__item-header">
                    <span className="validation-panel__category">
                      {error.category}
                    </span>
                    <span className="validation-panel__field">
                      {error.field}
                    </span>
                  </div>
                  <div className="validation-panel__message">
                    {error.message}
                  </div>
                  {error.context?.suggestion && (
                    <div className="validation-panel__suggestion">
                      💡 {error.context.suggestion}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasWarnings && (
          <div className="validation-panel__section">
            <h4 className="validation-panel__section-title validation-panel__section-title--warning">
              Warnings
            </h4>
            <ul className="validation-panel__list">
              {warnings.map((warning, index) => (
                <li
                  key={`${warning.field}-${index}`}
                  className="validation-panel__item validation-panel__item--warning"
                  onClick={() => handleErrorClick(warning)}
                  style={{ cursor: onErrorClick ? "pointer" : "default" }}
                >
                  <div className="validation-panel__item-header">
                    <span className="validation-panel__category">
                      {warning.category}
                    </span>
                    <span className="validation-panel__field">
                      {warning.field}
                    </span>
                  </div>
                  <div className="validation-panel__message">
                    {warning.message}
                  </div>
                  {warning.context?.suggestion && (
                    <div className="validation-panel__suggestion">
                      💡 {warning.context.suggestion}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Styles should be moved to external CSS file */}
    </div>
  );
};
