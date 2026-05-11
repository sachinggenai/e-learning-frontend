/**
 * Component Registry Type Definitions
 *
 * Defines the shape of component registrations, categories,
 * and the contracts components must satisfy.
 *
 * Single Responsibility: Only registry-specific types live here.
 * Open/Closed: New component types register without modifying this file.
 */

import React from "react";
import { AudioConfig, CompletionCriteria, ComponentStyling } from "./course";

// ─── Completion & Scoring Capabilities ───────────────────────────
export type CompletionCapability = "view" | "interact" | "audio" | "score";

export type AudioSupportMode =
  | { perComponent: true; perInteraction: false }
  | { perComponent: false; perInteraction: true; interactionLabel?: string }
  | { perComponent: false; perInteraction: false }; // no audio

// ─── Component Definition ────────────────────────────────────────
export interface ComponentDefinition {
  /** Unique type identifier, e.g. "accordion", "tabs", "mcq" */
  typeId: string;
  /** Human-readable name */
  displayName: string;
  /** Short description for Component Picker */
  description: string;
  /** Category this component belongs to */
  category: string;
  /** Lucide icon name or SVG path */
  icon: string;
  /** Optional thumbnail URL */
  thumbnail?: string;
  /** Tags for search */
  tags: string[];
  /** Which completion types this component can produce */
  completionCapabilities: CompletionCapability[];
  /** Whether this component produces a score */
  scoringEnabled: boolean;
  /** Audio support configuration */
  audioSupport: AudioSupportMode;
  /** Default data when component is first added to a page */
  defaultData: Record<string, any>;
  /** Default completion criteria */
  defaultCompletionCriteria?: CompletionCriteria;
  /** JSON Schema for validating component data */
  schema?: Record<string, any>;
  /** Sort order within category */
  sortOrder?: number;
  /** Estimated duration in minutes */
  estimatedDuration?: number;
  /** Lazy-loaded editor component */
  editorComponent: React.LazyExoticComponent<
    React.ComponentType<ComponentEditorProps>
  >;
  /** Lazy-loaded preview/player component */
  previewComponent: React.LazyExoticComponent<
    React.ComponentType<ComponentPreviewProps>
  >;
}

// ─── Category Definition ─────────────────────────────────────────
export interface CategoryDefinition {
  categoryId: string;
  displayName: string;
  description: string;
  icon: string;
  sortOrder: number;
}

// ─── Component Props Contracts ───────────────────────────────────
/** Props every editor component receives */
export interface ComponentEditorProps {
  componentId?: string;
  componentType?: string;
  data: Record<string, any>;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
  onChange: (updates: Partial<ComponentDataUpdate>) => void;
  readOnly?: boolean;
}

/** Props every preview component receives */
export interface ComponentPreviewProps {
  componentId?: string;
  componentType?: string;
  data: Record<string, any>;
  readOnly?: boolean;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
  onInteraction?: (event: ComponentInteractionEvent) => void;
  onComplete?: (componentId?: string) => void;
}

/** Partial update payload from editor onChange  */
export interface ComponentDataUpdate {
  data: Record<string, any>;
  audioConfig?: AudioConfig;
  completionCriteria?: CompletionCriteria;
  styling?: ComponentStyling;
}

/** Interaction event emitted by preview components */
export interface ComponentInteractionEvent {
  componentId?: string;
  interactionType: string;
  interactionId?: string;
  value?: any;
  score?: number;
  maxScore?: number;
  isCorrect?: boolean;
  completed?: boolean;
}

// ─── Registry Query Types ────────────────────────────────────────
export interface RegistrySearchParams {
  query?: string;
  category?: string;
  scoringEnabled?: boolean;
  tags?: string[];
}

export interface RegistrySearchResult {
  items: ComponentDefinition[];
  total: number;
}
