/**
 * DynamicComponentRenderer
 *
 * Core rendering engine that resolves component types via the registry
 * and renders the correct Editor or Preview component.
 *
 * Replaces the legacy switch-based PageEditor approach with an
 * Open/Closed registry lookup.
 *
 * Features:
 *  - React.lazy code-splitting for every component type
 *  - Suspense fallback with skeleton loader
 *  - FallbackComponent for unknown/unregistered types
 *  - Forwards editor & preview props contracts
 */

import React, { Suspense, useCallback, useMemo } from 'react';
import type { Component } from '../types/course';
import type { ComponentEditorProps, ComponentPreviewProps, ComponentDataUpdate, ComponentInteractionEvent } from '../types/registry';
import { registry } from './registry';
import { resolveComponentType } from './registry/registrations';
import { FallbackPreview, FallbackEditor } from './templates/FallbackComponent';
import './DynamicComponentRenderer.css';

/**
 * Normalises the Component from the API (componentId / componentType)
 * into the renderer's expected shape (id / typeId).
 * Handles both naming conventions gracefully.
 */
function normaliseComponent(c: Component & Record<string, any>): { id: string; typeId: string; data: Record<string, any> } & Component {
  return {
    ...c,
    id: (c as any).id ?? c.componentId,
    typeId: (c as any).typeId ?? c.componentType,
    data: c.data ?? {},
  };
}

/* ─── Shared Props ─────────────────────────────────────────────── */

interface BaseProps {
  /** The component data (from API / Redux store) */
  component: Component;
  /** 'edit' renders the editor, 'preview' renders the preview */
  mode: 'edit' | 'preview';
}

interface EditorModeProps extends BaseProps {
  mode: 'edit';
  /** Called when the editor changes any data field */
  onChange: (update: Partial<ComponentDataUpdate>) => void;
}

interface PreviewModeProps extends BaseProps {
  mode: 'preview';
  /** Called when the user interacts with the component (quiz answer, video watch, etc.) */
  onInteraction?: (event: ComponentInteractionEvent) => void;
  /** Called when the component marks itself as completed */
  onComplete?: (componentId: string) => void;
}

export type DynamicComponentRendererProps = EditorModeProps | PreviewModeProps;

/* ─── Skeleton Loader ──────────────────────────────────────────── */

const SuspenseFallback: React.FC = () => (
  <div className="dcr-skeleton" role="status" aria-label="Loading component…">
    <div className="dcr-skeleton__bar dcr-skeleton__bar--title" />
    <div className="dcr-skeleton__bar dcr-skeleton__bar--body" />
    <div className="dcr-skeleton__bar dcr-skeleton__bar--body dcr-skeleton__bar--short" />
  </div>
);

/* ─── Error Boundary (lightweight, per-component) ──────────────── */

interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; componentId: string },
  ErrorState
> {
  state: ErrorState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(`[DynamicComponentRenderer] Error in component ${this.props.componentId}:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="dcr-error" role="alert">
          <strong>Component Error</strong>
          <p>{this.state.error?.message ?? 'Unknown error rendering this component.'}</p>
          <button
            className="dcr-error__retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Main Renderer ────────────────────────────────────────────── */

export const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = React.memo((props) => {
  const { component: rawComponent, mode } = props;

  // Normalise API component shape to renderer's expected shape
  const component = useMemo(() => normaliseComponent(rawComponent), [rawComponent]);

  // Resolve legacy type names to canonical ones
  const resolvedType = useMemo(
    () => resolveComponentType(component.typeId),
    [component.typeId],
  );

  /* --- Editor mode ----------------------------------------------- */
  const handleChange = useCallback((update: Partial<ComponentDataUpdate>) => {
    if (mode === 'edit') {
      (props as EditorModeProps).onChange(update);
    }
  }, [mode, props]);

  /* --- Preview mode ---------------------------------------------- */
  const handleInteraction = useCallback((event: ComponentInteractionEvent) => {
    if (mode === 'preview') {
      (props as PreviewModeProps).onInteraction?.(event);
    }
  }, [mode, props]);

  const handleComplete = useCallback(() => {
    if (mode === 'preview') {
      (props as PreviewModeProps).onComplete?.(component.id);
    }
  }, [mode, props, component.id]);

  /* --- Helper: build flat props from normalised component --------- */
  const flatProps = useMemo(() => ({
    componentId: component.id,
    componentType: component.typeId,
    data: component.data,
    audioConfig: component.audioConfig,
    completionCriteria: component.completionCriteria,
    styling: component.styling,
  }), [component]);

  /* --- Registration lookup --------------------------------------- */
  const definition = registry.get(resolvedType);

  if (!definition) {
    // Unregistered type → fallback
    if (mode === 'edit') {
      return <FallbackEditor {...flatProps} onChange={handleChange} />;
    }
    return <FallbackPreview {...flatProps} />;
  }

  /* --- Render ---------------------------------------------------- */
  if (mode === 'edit') {
    const EditorComp = definition.editorComponent;
    if (!EditorComp) {
      return <FallbackEditor {...flatProps} onChange={handleChange} />;
    }
    const editorProps: ComponentEditorProps = {
      ...flatProps,
      onChange: handleChange,
    };

    return (
      <ComponentErrorBoundary componentId={component.id}>
        <Suspense fallback={<SuspenseFallback />}>
          <div className="dcr-wrapper" data-component-type={resolvedType}>
            <EditorComp {...editorProps} />
          </div>
        </Suspense>
      </ComponentErrorBoundary>
    );
  }

  // Preview mode
  const PreviewComp = definition.previewComponent;
  if (!PreviewComp) {
    return <FallbackPreview {...flatProps} />;
  }
  const previewProps: ComponentPreviewProps = {
    ...flatProps,
    onInteraction: handleInteraction,
    onComplete: handleComplete,
  };

  return (
    <ComponentErrorBoundary componentId={component.id}>
      <Suspense fallback={<SuspenseFallback />}>
        <div className="dcr-wrapper" data-component-type={resolvedType}>
          <PreviewComp {...previewProps} />
        </div>
      </Suspense>
    </ComponentErrorBoundary>
  );
});

DynamicComponentRenderer.displayName = 'DynamicComponentRenderer';

export default DynamicComponentRenderer;
