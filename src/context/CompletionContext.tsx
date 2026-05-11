/**
 * CompletionContext
 *
 * Provides per-page component completion state tracking.
 * Components report their completion status via the context,
 * and the page wrapper aggregates them.
 *
 * Completion strategies (configurable per page):
 *  - 'all'   → every component must be completed
 *  - 'any'   → at least one component completed
 *  - 'score' → minimum score threshold met
 *  - 'none'  → always complete (informational page)
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type {
  ComponentCompletionState,
  PageCompletionState,
  CompletionContextValue,
} from "../types/completion";

/* ─── State ────────────────────────────────────────────────────── */

interface CompletionState {
  /** Per-component completion state keyed by componentId */
  components: Record<string, ComponentCompletionState>;
  /** Page-level completion strategy */
  strategy: "all" | "any" | "score" | "none";
  /** scoreThreshold for 'score' strategy (0-100) */
  scoreThreshold: number;
}

type CompletionAction =
  | { type: "COMPONENT_VIEWED"; componentId: string }
  | { type: "COMPONENT_INTERACTED"; componentId: string }
  | {
      type: "INTERACTION_COMPLETED";
      componentId: string;
      interactionId: string;
    }
  | { type: "AUDIO_COMPLETED"; componentId: string; audioId: string }
  | { type: "SCORE_MET"; componentId: string }
  | { type: "COMPONENT_COMPLETED"; componentId: string }
  | { type: "RESET" }
  | {
      type: "SET_STRATEGY";
      strategy: CompletionState["strategy"];
      scoreThreshold?: number;
    };

function ensureComponentState(
  state: CompletionState,
  componentId: string,
): ComponentCompletionState {
  return (
    state.components[componentId] ?? {
      componentId,
      viewed: false,
      interacted: false,
      interactionsCompleted: [],
      audiosCompleted: [],
      scoreMet: false,
      overallCompleted: false,
    }
  );
}

function completionReducer(
  state: CompletionState,
  action: CompletionAction,
): CompletionState {
  switch (action.type) {
    case "COMPONENT_VIEWED": {
      const prev = ensureComponentState(state, action.componentId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: { ...prev, viewed: true },
        },
      };
    }

    case "COMPONENT_INTERACTED": {
      const prev = ensureComponentState(state, action.componentId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: { ...prev, interacted: true },
        },
      };
    }

    case "INTERACTION_COMPLETED": {
      const prev = ensureComponentState(state, action.componentId);
      const ids = new Set(prev.interactionsCompleted);
      ids.add(action.interactionId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: {
            ...prev,
            interactionsCompleted: Array.from(ids),
          },
        },
      };
    }

    case "AUDIO_COMPLETED": {
      const prev = ensureComponentState(state, action.componentId);
      const ids = new Set(prev.audiosCompleted);
      ids.add(action.audioId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: {
            ...prev,
            audiosCompleted: Array.from(ids),
          },
        },
      };
    }

    case "SCORE_MET": {
      const prev = ensureComponentState(state, action.componentId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: { ...prev, scoreMet: true },
        },
      };
    }

    case "COMPONENT_COMPLETED": {
      const prev = ensureComponentState(state, action.componentId);
      return {
        ...state,
        components: {
          ...state.components,
          [action.componentId]: { ...prev, overallCompleted: true },
        },
      };
    }

    case "SET_STRATEGY":
      return {
        ...state,
        strategy: action.strategy,
        scoreThreshold: action.scoreThreshold ?? state.scoreThreshold,
      };

    case "RESET":
      return {
        components: {},
        strategy: state.strategy,
        scoreThreshold: state.scoreThreshold,
      };

    default:
      return state;
  }
}

/* ─── Context ──────────────────────────────────────────────────── */

const CompletionCtx = createContext<CompletionContextValue | null>(null);

interface CompletionProviderProps {
  /** Page-level completion strategy */
  strategy?: "all" | "any" | "score" | "none";
  /** Score threshold for the 'score' strategy */
  scoreThreshold?: number;
  /** Called when the page is considered complete */
  onPageComplete?: () => void;
  children: React.ReactNode;
}

export const CompletionProvider: React.FC<CompletionProviderProps> = ({
  strategy = "all",
  scoreThreshold = 80,
  onPageComplete,
  children,
}) => {
  const [state, dispatch] = useReducer(completionReducer, {
    components: {},
    strategy,
    scoreThreshold,
  });

  /* ── Actions ─────────────────────────────────────────────── */
  const markViewed = useCallback((componentId: string) => {
    dispatch({ type: "COMPONENT_VIEWED", componentId });
  }, []);

  const markInteracted = useCallback((componentId: string) => {
    dispatch({ type: "COMPONENT_INTERACTED", componentId });
  }, []);

  const markInteractionCompleted = useCallback(
    (componentId: string, interactionId: string) => {
      dispatch({ type: "INTERACTION_COMPLETED", componentId, interactionId });
    },
    [],
  );

  const markAudioCompleted = useCallback(
    (componentId: string, audioId: string) => {
      dispatch({ type: "AUDIO_COMPLETED", componentId, audioId });
    },
    [],
  );

  const markScoreMet = useCallback((componentId: string) => {
    dispatch({ type: "SCORE_MET", componentId });
  }, []);

  const markComponentCompleted = useCallback((componentId: string) => {
    dispatch({ type: "COMPONENT_COMPLETED", componentId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  /* ── Page completion derivation ──────────────────────────── */
  const pageCompletion = useMemo((): PageCompletionState => {
    const entries = Object.values(state.components);
    const total = entries.length;

    if (total === 0) {
      return {
        pageId: "",
        totalComponents: 0,
        completedComponents: 0,
        percentComplete: state.strategy === "none" ? 100 : 0,
        isComplete: state.strategy === "none",
      };
    }

    const completed = entries.filter((c) => c.overallCompleted).length;
    const pct = Math.round((completed / total) * 100);

    let isComplete = false;
    switch (state.strategy) {
      case "all":
        isComplete = completed === total;
        break;
      case "any":
        isComplete = completed > 0;
        break;
      case "score":
        isComplete = pct >= state.scoreThreshold;
        break;
      case "none":
        isComplete = true;
        break;
    }

    return {
      pageId: "",
      totalComponents: total,
      completedComponents: completed,
      percentComplete: pct,
      isComplete,
    };
  }, [state.components, state.strategy, state.scoreThreshold]);

  /* ── Fire page complete callback ─────────────────────────── */
  const prevCompleteRef = React.useRef(false);
  React.useEffect(() => {
    if (pageCompletion.isComplete && !prevCompleteRef.current) {
      onPageComplete?.();
    }
    prevCompleteRef.current = pageCompletion.isComplete;
  }, [pageCompletion.isComplete, onPageComplete]);

  /* ── Context Value ───────────────────────────────────────── */
  const value = useMemo(
    (): CompletionContextValue => ({
      componentStates: state.components,
      pageCompletion,
      markViewed,
      markInteracted,
      markInteractionCompleted,
      markAudioCompleted,
      markScoreMet,
      markComponentCompleted,
      reset,
    }),
    [
      state.components,
      pageCompletion,
      markViewed,
      markInteracted,
      markInteractionCompleted,
      markAudioCompleted,
      markScoreMet,
      markComponentCompleted,
      reset,
    ],
  );

  return (
    <CompletionCtx.Provider value={value}>{children}</CompletionCtx.Provider>
  );
};

/* ─── Hooks ────────────────────────────────────────────────────── */

export function useCompletion(): CompletionContextValue {
  const ctx = useContext(CompletionCtx);
  if (!ctx) {
    throw new Error("useCompletion must be used inside <CompletionProvider>");
  }
  return ctx;
}

export function useCompletionOptional(): CompletionContextValue | null {
  return useContext(CompletionCtx);
}

export function useComponentCompletion(componentId: string) {
  const ctx = useCompletion();
  return ctx.componentStates[componentId] ?? null;
}
