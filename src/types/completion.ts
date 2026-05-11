/**
 * Completion Type Definitions
 *
 * Page-level completion strategies and component completion state.
 * Re-exports core completion types from course.ts and adds context/UI types.
 */

export type {
  CompletionType,
  CompletionCriteria,
  PageCompletionStrategy,
  PageCompletionConfig,
  ComponentCompletionStatus,
  PageCompletionResponse,
  CourseCompletionStatus,
  CourseCompletionResponse,
} from "./course";

// ─── Completion Context State ────────────────────────────────────
export interface ComponentCompletionState {
  componentId: string;
  viewed: boolean;
  interacted: boolean;
  interactionsCompleted: string[]; // IDs of completed interactions
  audiosCompleted: string[]; // audioIds that reached 90% threshold
  scoreMet: boolean;
  overallCompleted: boolean;
}

export interface PageCompletionState {
  pageId: string;
  totalComponents: number;
  completedComponents: number;
  percentComplete: number;
  isComplete: boolean;
}

export interface CompletionContextValue {
  /** Per-component completion states keyed by componentId */
  componentStates: Record<string, ComponentCompletionState>;
  /** Aggregated page completion */
  pageCompletion: PageCompletionState;
  /** Mark a component as viewed */
  markViewed: (componentId: string) => void;
  /** Mark a component as interacted */
  markInteracted: (componentId: string) => void;
  /** Record a specific interaction completion */
  markInteractionCompleted: (
    componentId: string,
    interactionId: string,
  ) => void;
  /** Record audio listen completion */
  markAudioCompleted: (componentId: string, audioId: string) => void;
  /** Record score threshold met */
  markScoreMet: (componentId: string) => void;
  /** Mark the component as fully completed */
  markComponentCompleted: (componentId: string) => void;
  /** Reset all completion state */
  reset: () => void;
}
