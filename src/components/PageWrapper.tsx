/**
 * PageWrapper
 *
 * Top-level wrapper for rendering a single page in preview mode.
 * Provides:
 *  - ThemeProvider scoped to the page's theme overrides
 *  - CompletionProvider with the page's completion strategy
 *  - Page-level audio narration (AudioPlayer)
 *  - Progress indicator bar
 *  - ComponentList in preview mode
 */

import React, { useCallback, useMemo } from "react";
import type { Page, Component } from "../types/course";
import type { ThemeOverrides } from "../types/course";
import type { ComponentInteractionEvent } from "../types/registry";
import { ThemeProvider } from "../context/ThemeContext";
import {
  CompletionProvider,
  useCompletion,
} from "../context/CompletionContext";
import { AudioPlayer } from "./AudioPlayer";
import { CompletionBanner } from "./common/CompletionBanner";
import { ComponentList } from "./ComponentList";
import "./PageWrapper.css";

/* ─── Props ────────────────────────────────────────────────────── */

interface PageWrapperProps {
  page: Page;
  courseId: string;
  /** Course-level theme overrides (from Redux themeSlice) */
  courseTheme?: ThemeOverrides;
  /** Called when the entire page is complete */
  onPageComplete?: (pageId: string) => void;
  /** Called on any component interaction (for analytics / SCORM) */
  onInteraction?: (event: ComponentInteractionEvent) => void;
}

/* ─── Inner content (needs CompletionProvider context) ──────── */

interface PageContentProps {
  page: Page;
  courseId: string;
  onInteraction?: (event: ComponentInteractionEvent) => void;
}

const PageContent: React.FC<PageContentProps> = ({
  page,
  courseId,
  onInteraction,
}) => {
  const { pageCompletion, markComponentCompleted } = useCompletion();

  const handleComponentComplete = useCallback(
    (componentId: string) => {
      markComponentCompleted(componentId);
    },
    [markComponentCompleted],
  );

  return (
    <div className="page-wrapper__content">
      {/* Page title */}
      <header className="page-wrapper__header">
        <h2 className="page-wrapper__title">{page.title}</h2>
      </header>

      {/* Page audio narration */}
      {page.audioConfig?.enabled && page.audioConfig.audioItems?.length > 0 && (
        <div className="page-wrapper__audio">
          <AudioPlayer
            src={page.audioConfig.audioItems[0].audioUrl ?? ""}
            title="Page narration"
          />
        </div>
      )}

      {/* Progress bar */}
      <div
        className="page-wrapper__progress"
        role="progressbar"
        aria-valuenow={pageCompletion.percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Page progress: ${pageCompletion.percentComplete}%`}
      >
        <div
          className="page-wrapper__progress-fill"
          style={{ width: `${pageCompletion.percentComplete}%` }}
        />
      </div>

      {/* Components */}
      <ComponentList
        pageId={page.pageId}
        courseId={courseId}
        mode="preview"
        onInteraction={onInteraction}
        onComponentComplete={handleComponentComplete}
      />

      {/* Completion badge */}
      {pageCompletion.isComplete && (
        <div className="page-wrapper__complete-badge" role="status">
          ✓ Page Complete
        </div>
      )}

      {/* Sticky completion banner at bottom */}
      <CompletionBanner pageId={page.pageId} position="bottom" />
    </div>
  );
};

/* ─── Main Wrapper ─────────────────────────────────────────────── */

export const PageWrapper: React.FC<PageWrapperProps> = React.memo(
  ({ page, courseId, courseTheme, onPageComplete, onInteraction }) => {
    // Derive completion strategy from page's pageCompletion config
    const strategy = useMemo(() => {
      const config = page.pageCompletion;
      if (!config?.enabled) return "all" as const;

      switch (config.strategy) {
        case "all":
          return "all" as const;
        case "any":
          return "any" as const;
        case "percentage":
          return "score" as const;
        case "custom":
          return "none" as const;
        default:
          return "all" as const;
      }
    }, [page.pageCompletion]);

    const scoreThreshold = page.pageCompletion?.completionThreshold ?? 80;

    // Page-level theme overrides
    const pageTheme: ThemeOverrides | undefined = page.theme?.overrides;

    const handlePageComplete = useCallback(() => {
      onPageComplete?.(page.pageId);
    }, [onPageComplete, page.pageId]);

    return (
      <ThemeProvider courseOverrides={courseTheme} pageOverrides={pageTheme}>
        <CompletionProvider
          strategy={strategy}
          scoreThreshold={scoreThreshold}
          onPageComplete={handlePageComplete}
        >
          <article
            className="page-wrapper"
            aria-label={`Page: ${page.title}`}
            data-page-id={page.pageId}
          >
            <PageContent
              page={page}
              courseId={courseId}
              onInteraction={onInteraction}
            />
          </article>
        </CompletionProvider>
      </ThemeProvider>
    );
  },
);

PageWrapper.displayName = "PageWrapper";
