/**
 * Audio Type Definitions
 *
 * Per-interaction audio model supporting both component-level
 * and interaction-point-level audio assignment.
 * Re-exports core audio types from course.ts and adds UI-specific ones.
 */

export type {
  AudioItem,
  AudioConfig,
  AudioAssetResponse,
} from './course';

// ─── Audio Player State ──────────────────────────────────────────
export interface AudioPlayerState {
  audioId: string;
  audioUrl: string;
  label?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0..1
  hasReachedThreshold: boolean; // true when >= 90% listened
}

export const AUDIO_COMPLETION_THRESHOLD = 0.9; // 90%

// ─── Audio Interaction Point ─────────────────────────────────────
/**
 * Maps a named interaction point within a component to its audio items.
 * Example: for Tabs with 3 tabs, each tab is an interaction point.
 */
export interface AudioInteractionPoint {
  interactionId: string;
  label: string;
  audioItems: import('./course').AudioItem[];
}

// ─── Supported Audio Formats ─────────────────────────────────────
export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',     // mp3
  'audio/wav',      // wav
  'audio/ogg',      // ogg
  'audio/mp4',      // m4a
  'audio/x-m4a',    // m4a alt
] as const;

export const MAX_AUDIO_FILE_SIZE = 50 * 1024 * 1024; // 50MB
