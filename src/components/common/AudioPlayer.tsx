/**
 * AudioPlayer Component
 *
 * Full-featured audio player with:
 *   - Play/pause/seek/volume controls
 *   - Progress bar with time display
 *   - 90% listen threshold detection for completion
 *   - Multiple format support (mp3, wav, ogg, m4a)
 *   - Keyboard accessible (Space toggle, Arrow seek)
 *   - Label and duration display
 *   - Auto-advance for sequential audio items
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface AudioPlayerProps {
  src: string;
  audioId?: string;
  label?: string;
  autoplay?: boolean;
  completionThreshold?: number; // 0-1, default 0.9 (90%)
  onComplete?: (audioId: string) => void;
  onProgress?: (audioId: string, progress: number) => void;
  onPlay?: (audioId: string) => void;
  onPause?: (audioId: string) => void;
  className?: string;
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  hasCompleted: boolean;
  error: string | null;
  maxReached: number; // Furthest point reached (for completion tracking)
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  audioId = '',
  label,
  autoplay = false,
  completionThreshold = 0.9,
  onComplete,
  onProgress,
  onPlay,
  onPause,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLoading: true,
    hasCompleted: false,
    error: null,
    maxReached: 0,
  });

  // ─── Audio Event Handlers ──────────────────────────────────────

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setState((prev) => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const maxReached = Math.max(state.maxReached, currentTime);
    const progress = duration > 0 ? maxReached / duration : 0;

    setState((prev) => ({
      ...prev,
      currentTime,
      maxReached,
    }));

    onProgress?.(audioId, progress);

    // Check completion threshold
    if (!state.hasCompleted && progress >= completionThreshold) {
      setState((prev) => ({ ...prev, hasCompleted: true }));
      onComplete?.(audioId);
    }
  }, [audioId, completionThreshold, onComplete, onProgress, state.hasCompleted, state.maxReached]);

  const handleEnded = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    // Mark as complete if reached end
    if (!state.hasCompleted) {
      setState((prev) => ({ ...prev, hasCompleted: true }));
      onComplete?.(audioId);
    }
  }, [audioId, onComplete, state.hasCompleted]);

  const handleError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isPlaying: false,
      error: 'Failed to load audio file',
    }));
  }, []);

  // ─── Controls ──────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
      onPause?.(audioId);
    } else {
      audio.play().catch(() => {
        setState((prev) => ({
          ...prev,
          error: 'Playback blocked by browser. Click to retry.',
        }));
      });
      setState((prev) => ({ ...prev, isPlaying: true, error: null }));
      onPlay?.(audioId);
    }
  }, [audioId, onPause, onPlay, state.isPlaying]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
    }
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const fraction = (e.clientX - rect.left) / rect.width;
      seek(fraction * state.duration);
    },
    [seek, state.duration]
  );

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = vol;
    }
    setState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isMuted) {
      audio.muted = false;
      setState((prev) => ({ ...prev, isMuted: false }));
    } else {
      audio.muted = true;
      setState((prev) => ({ ...prev, isMuted: true }));
    }
  }, [state.isMuted]);

  // ─── Keyboard Handling ─────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(state.currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(state.currentTime - 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange({ target: { value: String(Math.min(1, state.volume + 0.1)) } } as any);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange({ target: { value: String(Math.max(0, state.volume - 0.1)) } } as any);
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
      }
    },
    [handleVolumeChange, seek, state.currentTime, state.volume, toggleMute, togglePlay]
  );

  // ─── Effects ───────────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handleEnded, handleError]);

  // ─── Render ────────────────────────────────────────────────────

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div
      className={`audio-player ${className} ${state.hasCompleted ? 'audio-player--completed' : ''}`}
      role="region"
      aria-label={label ? `Audio player: ${label}` : 'Audio player'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <audio ref={audioRef} src={src} preload="metadata" autoPlay={autoplay} />

      {/* Label */}
      {label && (
        <div className="audio-player__label">
          {label}
          {state.hasCompleted && (
            <span className="audio-player__completed-badge" aria-label="Completed">
              ✓
            </span>
          )}
        </div>
      )}

      {/* Error state */}
      {state.error && (
        <div className="audio-player__error" role="alert">
          {state.error}
        </div>
      )}

      {/* Controls row */}
      <div className="audio-player__controls">
        {/* Play/Pause button */}
        <button
          className="audio-player__play-btn"
          onClick={togglePlay}
          disabled={state.isLoading || !!state.error}
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isLoading ? '⏳' : state.isPlaying ? '⏸' : '▶'}
        </button>

        {/* Time display */}
        <span className="audio-player__time">
          {formatTime(state.currentTime)}
        </span>

        {/* Progress bar */}
        <div
          className="audio-player__progress"
          ref={progressRef}
          onClick={handleProgressClick}
          role="slider"
          aria-label="Audio progress"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="audio-player__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="audio-player__progress-thumb"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Duration */}
        <span className="audio-player__time">
          {formatTime(state.duration)}
        </span>

        {/* Volume */}
        <button
          className="audio-player__mute-btn"
          onClick={toggleMute}
          aria-label={state.isMuted ? 'Unmute' : 'Mute'}
        >
          {state.isMuted || state.volume === 0 ? '🔇' : state.volume < 0.5 ? '🔉' : '🔊'}
        </button>

        <input
          type="range"
          className="audio-player__volume"
          min="0"
          max="1"
          step="0.05"
          value={state.isMuted ? 0 : state.volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
