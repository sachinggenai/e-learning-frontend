/**
 * PreviewV2
 *
 * New-architecture course preview player.
 * Uses PageWrapper → CompletionProvider → ComponentList → DynamicComponentRenderer
 * for registry-based rendering with completion tracking.
 *
 * Features:
 *  - Page-by-page navigation with progress bar
 *  - Course-level scoring summary on last page
 *  - Completion tracking per page
 *  - Keyboard navigation (arrow keys)
 *  - SCORM-style interaction event recording
 *  - Theme application
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchComponents } from '../store/slices/componentsSlice';
import { recordInteraction, submitPageComplete } from '../store/slices/completionSlice';
import { calculateScore } from '../store/slices/scoringSlice';
import { handleApiError } from '../services/errorHandler';
import type { Page } from '../types/course';
import type { ComponentInteractionEvent } from '../types/registry';
import { PageWrapper } from './PageWrapper';
import { ScoreSummary } from './ScoringUI';
import './Preview.css';
import './PreviewV2.css';

interface PreviewV2Props {}

/**
 * Normalize a page from courseSlice (editorSlice.Page shape with `.id`)
 * to the types/course.ts Page shape (`.pageId`, `.components`).
 */
function normalizePageForPreview(raw: any): Page {
  return {
    pageId: raw.pageId ?? raw.id ?? '',
    title: raw.title ?? 'Untitled Page',
    order: raw.order ?? 0,
    components: raw.components ?? [],
    audioConfig: raw.audioConfig,
    pageCompletion: raw.pageCompletion,
    layout: raw.layout,
    theme: raw.theme,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function buildScoreResponsesFromEvent(
  sourceComponent: any,
  event: ComponentInteractionEvent,
): Array<{ questionId: string; selectedOptionIds: string[]; textAnswer?: string | null }> {
  const componentType = sourceComponent?.componentType || sourceComponent?.typeId || 'unknown';
  const value = event.value;

  if (componentType === 'fill-blanks' && value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).map(([questionId, answerValue]) => ({
      questionId,
      selectedOptionIds: [],
      textAnswer: answerValue == null ? null : String(answerValue),
    }));
  }

  if (componentType === 'knowledge-check' && value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).map(([questionId, answerValue]) => ({
      questionId,
      selectedOptionIds: answerValue == null ? [] : [String(answerValue)],
      textAnswer: null,
    }));
  }

  if (Array.isArray(value)) {
    return [
      {
        questionId: event.interactionId || `${sourceComponent?.componentId || sourceComponent?.id || 'component'}-question`,
        selectedOptionIds: value.map((entry) => String(entry)),
        textAnswer: null,
      },
    ];
  }

  if (typeof value === 'boolean') {
    return [
      {
        questionId: event.interactionId || `${sourceComponent?.componentId || sourceComponent?.id || 'component'}-question`,
        selectedOptionIds: [String(value)],
        textAnswer: null,
      },
    ];
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([questionId, answerValue]) => ({
      questionId,
      selectedOptionIds: Array.isArray(answerValue)
        ? answerValue.map((entry) => String(entry))
        : answerValue == null
        ? []
        : [String(answerValue)],
      textAnswer: null,
    }));
  }

  return [
    {
      questionId: event.interactionId || `${sourceComponent?.componentId || sourceComponent?.id || 'component'}-question`,
      selectedOptionIds: value == null ? [] : [String(value)],
      textAnswer: null,
    },
  ];
}

const PreviewV2: React.FC<PreviewV2Props> = () => {
  const dispatch = useAppDispatch();
  const courseState = useAppSelector((state) => (state as any).course);
  const currentCourse = courseState?.currentCourse ?? null;
  const themeState = useAppSelector((state) => state.theme);
  const componentsByPage = useAppSelector((state) => (state as any).components?.byPage ?? {});

  // Normalize pages so both id & pageId shapes work
  const pages: Page[] = useMemo(
    () => (currentCourse?.pages ?? []).map(normalizePageForPreview),
    [currentCourse?.pages],
  );

  // Fetch components for ALL pages when entering preview
  useEffect(() => {
    if (!currentCourse) return;
    const courseId = currentCourse.courseId || String(currentCourse.id ?? '');
    if (!courseId) return;

    pages.forEach((page) => {
      const pid = page.pageId;
      // Only fetch if not already loaded in Redux
      if (pid && !componentsByPage[pid]) {
        dispatch(fetchComponents({ courseId, pageId: pid }));
      }
    });
  }, [dispatch, currentCourse, pages, componentsByPage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set());
  const [interactions, setInteractions] = useState<ComponentInteractionEvent[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentPage = pages[currentIndex] ?? null;
  const courseIdForApi = currentCourse?.courseId || String(currentCourse?.id ?? '');
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex >= pages.length - 1;
  const progressPercent = pages.length > 0 ? ((currentIndex + 1) / pages.length) * 100 : 0;

  /* ── Navigation ──────────────────────────────────────────── */
  const goNext = useCallback(() => {
    if (!isLastPage) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  }, [isLastPage]);

  const goPrev = useCallback(() => {
    if (!isFirstPage) {
      setCurrentIndex(prev => prev - 1);
      setShowResults(false);
    }
  }, [isFirstPage]);

  const goToPage = useCallback((idx: number) => {
    if (idx >= 0 && idx < pages.length) {
      setCurrentIndex(idx);
      setShowResults(false);
    }
  }, [pages.length]);

  /* ── Keyboard ────────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture arrow keys when user is in a form element
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  /* ── Callbacks ───────────────────────────────────────────── */
  const handlePageComplete = useCallback((pageId: string) => {
    setCompletedPages(prev => new Set(prev).add(pageId));

    const pageComponents = componentsByPage[pageId] || [];
    if (!courseIdForApi || pageComponents.length === 0) return;

    const componentStates = pageComponents
      .map((component: any) => ({
        componentId: component?.componentId || component?.id,
        completed: true,
        interactionsCompleted: [],
        audiosCompleted: [],
        score: null,
      }))
      .filter((state: any) => Boolean(state.componentId));

    if (componentStates.length === 0) return;

    dispatch(
      submitPageComplete({
        courseId: courseIdForApi,
        pageId,
        componentStates,
      })
    )
      .unwrap()
      .catch((error: unknown) => {
        const handled = handleApiError(error);
        console.warn('[PreviewV2] submitPageComplete failed:', handled.message);
      });
  }, [componentsByPage, courseIdForApi, dispatch]);

  const handleInteraction = useCallback((event: ComponentInteractionEvent) => {
    setInteractions(prev => [...prev, event]);
    console.log('[PreviewV2] Interaction:', event);

    if (!courseIdForApi || !currentPage?.pageId) return;

    const componentId = event.componentId || 'unknown-component';

    dispatch(
      recordInteraction({
        courseId: courseIdForApi,
        event: {
          pageId: currentPage.pageId,
          componentId,
          interactionType: event.interactionType,
          learnerId: null,
          data: {
            interactionId: event.interactionId || null,
            value: event.value,
            score: event.score ?? null,
            maxScore: event.maxScore ?? null,
            isCorrect: event.isCorrect ?? null,
          },
          completed: event.completed ?? false,
        },
      })
    )
      .unwrap()
      .catch((error: unknown) => {
        const handled = handleApiError(error);
        console.warn('[PreviewV2] recordInteraction failed:', handled.message);
      });

    if (!event.completed) return;

    if (event.interactionType === 'submit' && componentId !== 'unknown-component') {
      const pageComponents = componentsByPage[currentPage.pageId] || [];
      const sourceComponent = pageComponents.find(
        (component: any) => (component?.componentId || component?.id) === componentId
      );
      const componentType = sourceComponent?.componentType || sourceComponent?.typeId || 'unknown';
      const responses = buildScoreResponsesFromEvent(sourceComponent, event);

      dispatch(
        calculateScore({
          courseId: courseIdForApi,
          answers: [
            {
              componentId,
              componentType,
              responses,
            },
          ],
        })
      )
        .unwrap()
        .catch((error: unknown) => {
          const handled = handleApiError(error);
          console.warn('[PreviewV2] calculateScore failed:', handled.message);
        });
    }

    dispatch(
      submitPageComplete({
        courseId: courseIdForApi,
        pageId: currentPage.pageId,
        componentStates: [
          {
            componentId,
            completed: true,
            interactionsCompleted: event.interactionId ? [event.interactionId] : [],
            audiosCompleted: [],
            score: event.score ?? null,
          },
        ],
      })
    )
      .unwrap()
      .catch((error: unknown) => {
        const handled = handleApiError(error);
        console.warn('[PreviewV2] submitPageComplete(component) failed:', handled.message);
      });
  }, [componentsByPage, courseIdForApi, currentPage?.pageId, dispatch]);

  /* ── Score aggregation ───────────────────────────────────── */
  const scoreData = useMemo(() => {
    // Simple aggregation from scored interactions
    const scoredEvents = interactions.filter(e => e.interactionType === 'quiz_answer');
    const earned = scoredEvents.filter(e => (e as any).isCorrect).length;
    const total = scoredEvents.length;
    return { earned, total };
  }, [interactions]);

  /* ── Course theme ────────────────────────────────────────── */
  const courseTheme = themeState.courseTheme?.overrides ?? undefined;

  /* ── No course / no pages ────────────────────────────────── */
  if (!currentCourse) {
    return (
      <div className="preview-container">
        <div className="preview-error">
          <h2>No Course Available</h2>
          <p>Please load a course in the editor first.</p>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="preview-container">
        <div className="preview-error">
          <h2>No Pages</h2>
          <p>This course has no pages yet. Add pages in the editor to preview.</p>
        </div>
      </div>
    );
  }

  /* ── Results screen ──────────────────────────────────────── */
  if (showResults) {
    return (
      <div className="preview-container">
        <div className="preview-v2__results">
          <h2 className="preview-v2__results-title">Course Complete!</h2>
          <p className="preview-v2__results-subtitle">
            You've completed all {pages.length} pages.
          </p>

          {scoreData.total > 0 && (
            <ScoreSummary
              earned={scoreData.earned}
              total={scoreData.total}
              title="Quiz Results"
            />
          )}

          <div className="preview-v2__results-stats">
            <div className="preview-v2__stat">
              <span className="preview-v2__stat-value">{pages.length}</span>
              <span className="preview-v2__stat-label">Pages</span>
            </div>
            <div className="preview-v2__stat">
              <span className="preview-v2__stat-value">{completedPages.size}</span>
              <span className="preview-v2__stat-label">Completed</span>
            </div>
            <div className="preview-v2__stat">
              <span className="preview-v2__stat-value">{interactions.length}</span>
              <span className="preview-v2__stat-label">Interactions</span>
            </div>
          </div>

          <button
            className="preview-v2__restart-btn"
            onClick={() => { setCurrentIndex(0); setShowResults(false); }}
          >
            ↻ Restart Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      {/* ── Top bar ────────────────────────────────────────── */}
      <div className="preview-v2__topbar">
        <div className="preview-v2__course-title">
          {currentCourse.title}
        </div>
        <div className="preview-v2__page-indicator">
          Page {currentIndex + 1} of {pages.length}
        </div>
      </div>

      {/* ── Progress ───────────────────────────────────────── */}
      <div
        className="preview-v2__progress"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="preview-v2__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Page thumbnail nav ─────────────────────────────── */}
      <div className="preview-v2__page-nav" role="tablist" aria-label="Page navigation">
        {pages.map((p, i) => (
          <button
            key={p.pageId}
            className={[
              'preview-v2__page-dot',
              i === currentIndex && 'preview-v2__page-dot--active',
              completedPages.has(p.pageId) && 'preview-v2__page-dot--completed',
            ].filter(Boolean).join(' ')}
            onClick={() => goToPage(i)}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`${p.title}, page ${i + 1}`}
            title={p.title}
          />
        ))}
      </div>

      {/* ── Page content ───────────────────────────────────── */}
      <div className="preview-v2__content">
        {currentPage && (
          <PageWrapper
            key={currentPage.pageId}
            page={currentPage}
            courseId={courseIdForApi}
            courseTheme={courseTheme}
            onPageComplete={handlePageComplete}
            onInteraction={handleInteraction}
          />
        )}
      </div>

      {/* ── Navigation buttons ─────────────────────────────── */}
      <div className="preview-v2__nav-buttons">
        <button
          className="preview-v2__nav-btn preview-v2__nav-btn--prev"
          onClick={goPrev}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          ← Previous
        </button>

        {isLastPage ? (
          <button
            className="preview-v2__nav-btn preview-v2__nav-btn--finish"
            onClick={goNext}
          >
            Finish Course ✓
          </button>
        ) : (
          <button
            className="preview-v2__nav-btn preview-v2__nav-btn--next"
            onClick={goNext}
            aria-label="Next page"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewV2;
