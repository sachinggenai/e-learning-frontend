/**
 * Error Boundary Component
 * Catches React errors and provides fallback UI
 */

import React from "react";
import { t } from "../i18n/strings";
import logger from "../utils/logger";
import "./ErrorBoundary.css";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    logger.error({
      event: "app.error",
      message: "Unhandled runtime error",
      error,
      context: { componentStack: errorInfo.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-boundary"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="error-content" tabIndex={-1}>
            <h1 className="error-title">
              🚨 {t("error.app.title", "Application Error")}
            </h1>
            <p className="error-message">
              {t(
                "error.app.message",
                "The application encountered an unexpected error. You can try recovering below. If the problem persists, share the copied error details with support.",
              )}
            </p>
            <div className="error-actions">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="error-button primary"
              >
                🔄 {t("actions.reloadApp", "Reload App")}
              </button>
              <button
                onClick={() => {
                  const details = `${this.state.error?.message}\n\n${this.state.error?.stack}`;
                  navigator.clipboard
                    .writeText(details)
                    .catch(() => console.warn("Clipboard copy failed"));
                }}
                className="error-button"
              >
                📋 {t("actions.copyErrorDetails", "Copy Error Details")}
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="error-button"
              >
                ↩️ {t("actions.dismiss", "Dismiss")}
              </button>
            </div>
            <details className="error-details">
              <summary>
                {t("error.technical.details", "Technical details")}
              </summary>
              <pre className="error-text">{this.state.error?.message}</pre>
              <pre className="error-stack">{this.state.error?.stack}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
