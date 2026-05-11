/**
 * AudioPlayer
 *
 * Reusable audio player component for page-level narration
 * and component-level audio support.
 *
 * Features:
 *  - Play / pause / seek / scrub
 *  - Progress bar with buffered indicator
 *  - Time display (current / duration)
 *  - Playback speed selector
 *  - Volume control
 *  - Completion tracking at 90% threshold
 *  - Keyboard accessible (Space = play/pause)
 *  - ARIA labels throughout
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO_COMPLETION_THRESHOLD } from "../types/audio";
import "./AudioPlayer.css";

interface AudioPlayerProps {
  /** URL to the audio file */
  src: string;
  /** Optional display title */
  title?: string;
  /** Called when audio reaches the completion threshold */
  onComplete?: () => void;
  /** Called on time update with current time (seconds) */
  onTimeUpdate?: (currentTime: number) => void;
  /** Auto-play on mount */
  autoPlay?: boolean;
  /** CSS class override */
  className?: string;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const AudioPlayer: React.FC<AudioPlayerProps> = React.memo(
  ({ src, title, onComplete, onTimeUpdate, autoPlay = false, className }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const completionFiredRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [speed, setSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);

    /* ── Playback state sync ─────────────────────────────────── */
    const handleTimeUpdate = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);

      // Buffer progress
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }

      // Completion check
      if (
        !completionFiredRef.current &&
        audio.duration > 0 &&
        audio.currentTime / audio.duration >= AUDIO_COMPLETION_THRESHOLD
      ) {
        completionFiredRef.current = true;
        onComplete?.();
      }
    }, [onComplete, onTimeUpdate]);

    const handleLoadedMetadata = useCallback(() => {
      const audio = audioRef.current;
      if (audio) {
        setDuration(audio.duration);
      }
    }, []);

    const handleEnded = useCallback(() => {
      setIsPlaying(false);
    }, []);

    /* ── Controls ────────────────────────────────────────────── */
    const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play().catch(() => {
          /* autoplay policy */
        });
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }, []);

    const handleVolumeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        const v = parseFloat(e.target.value);
        if (audio) audio.volume = v;
        setVolume(v);
      },
      [],
    );

    const handleSpeedChange = useCallback((spd: number) => {
      const audio = audioRef.current;
      if (audio) audio.playbackRate = spd;
      setSpeed(spd);
      setShowSpeedMenu(false);
    }, []);

    /* ── Keyboard ────────────────────────────────────────────── */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "k") {
          e.preventDefault();
          togglePlay();
        }
      },
      [togglePlay],
    );

    /* ── Reset on src change ─────────────────────────────────── */
    useEffect(() => {
      completionFiredRef.current = false;
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }, [src]);

    /* ── Format time ─────────────────────────────────────────── */
    const formatTime = (seconds: number): string => {
      if (!isFinite(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
      <div
        className={`audio-player ${className ?? ""}`}
        role="region"
        aria-label={title ? `Audio player: ${title}` : "Audio player"}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          autoPlay={autoPlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {title && <div className="audio-player__title">{title}</div>}

        <div className="audio-player__controls">
          {/* Play / Pause */}
          <button
            className="audio-player__play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* Time */}
          <span className="audio-player__time">{formatTime(currentTime)}</span>

          {/* Progress bar */}
          <div className="audio-player__progress-wrapper">
            <div
              className="audio-player__buffered"
              style={{ width: `${bufferedPercent}%` }}
            />
            <div
              className="audio-player__filled"
              style={{ width: `${progressPercent}%` }}
            />
            <input
              className="audio-player__seek"
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek"
            />
          </div>

          <span className="audio-player__time">{formatTime(duration)}</span>

          {/* Speed */}
          <div className="audio-player__speed-wrapper">
            <button
              className="audio-player__speed-btn"
              onClick={() => setShowSpeedMenu((prev) => !prev)}
              aria-label={`Playback speed: ${speed}x`}
            >
              {speed}x
            </button>
            {showSpeedMenu && (
              <div className="audio-player__speed-menu" role="menu">
                {PLAYBACK_SPEEDS.map((s) => (
                  <button
                    key={s}
                    className={`audio-player__speed-option ${s === speed ? "audio-player__speed-option--active" : ""}`}
                    onClick={() => handleSpeedChange(s)}
                    role="menuitem"
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="audio-player__volume">
            <span className="audio-player__volume-icon">
              {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </span>
            <input
              className="audio-player__volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    );
  },
);

AudioPlayer.displayName = "AudioPlayer";
