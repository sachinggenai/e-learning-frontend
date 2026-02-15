/**
 * Layout Utilities
 *
 * Functions for generating CSS grid styles from PageLayout configurations.
 * Supports 8 layout presets and custom grid definitions.
 */

import { CustomGrid, LayoutPreset, LayoutSpacing, PageLayout } from '../types/course';

// ─── Spacing Constants ────────────────────────────────────────────

const SPACING_VALUES: Record<LayoutSpacing, string> = {
  compact: '8px',
  normal: '16px',
  spacious: '24px',
};

// ─── Preset Definitions ──────────────────────────────────────────

interface PresetGridConfig {
  columns: string;
  rows: string;
  areas?: string[][];
  gap: string;
}

const LAYOUT_PRESETS: Record<LayoutPreset, (spacing: LayoutSpacing) => PresetGridConfig> = {
  'single-column': (spacing) => ({
    columns: '1fr',
    rows: 'auto',
    gap: SPACING_VALUES[spacing],
  }),

  'two-column': (spacing) => ({
    columns: '1fr 1fr',
    rows: 'auto',
    gap: SPACING_VALUES[spacing],
  }),

  'three-column': (spacing) => ({
    columns: '1fr 1fr 1fr',
    rows: 'auto',
    gap: SPACING_VALUES[spacing],
  }),

  'sidebar-left': (spacing) => ({
    columns: '280px 1fr',
    rows: 'auto',
    areas: [['sidebar', 'main']],
    gap: SPACING_VALUES[spacing],
  }),

  'sidebar-right': (spacing) => ({
    columns: '1fr 280px',
    rows: 'auto',
    areas: [['main', 'sidebar']],
    gap: SPACING_VALUES[spacing],
  }),

  'grid-2x2': (spacing) => ({
    columns: '1fr 1fr',
    rows: 'auto auto',
    gap: SPACING_VALUES[spacing],
  }),

  'hero-content': (spacing) => ({
    columns: '1fr',
    rows: 'auto 1fr',
    areas: [['hero'], ['content']],
    gap: SPACING_VALUES[spacing],
  }),

  'full-width': (_spacing) => ({
    columns: '1fr',
    rows: 'auto',
    gap: '0',
  }),
};

// ─── CSS Generation ──────────────────────────────────────────────

export interface LayoutStyles {
  display: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridTemplateAreas?: string;
  gap: string;
}

/**
 * Generate CSS grid styles from a PageLayout configuration.
 */
export function generateGridStyles(layout: PageLayout): LayoutStyles {
  const spacing = layout.spacing || 'normal';

  if (layout.customGrid) {
    return generateCustomGridStyles(layout.customGrid);
  }

  const preset = layout.preset || 'single-column';
  const config = LAYOUT_PRESETS[preset]?.(spacing);

  if (!config) {
    // Fallback to single column
    return {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
      gap: SPACING_VALUES[spacing],
    };
  }

  const styles: LayoutStyles = {
    display: 'grid',
    gridTemplateColumns: config.columns,
    gridTemplateRows: config.rows,
    gap: config.gap,
  };

  if (config.areas) {
    styles.gridTemplateAreas = config.areas
      .map((row) => `"${row.join(' ')}"`)
      .join(' ');
  }

  return styles;
}

/**
 * Generate CSS grid styles from a custom grid definition.
 */
function generateCustomGridStyles(grid: CustomGrid): LayoutStyles {
  const styles: LayoutStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
    gridTemplateRows: grid.rows || 'auto',
    gap: grid.gap || '16px',
  };

  if (grid.areas && grid.areas.length > 0) {
    styles.gridTemplateAreas = grid.areas
      .map((row) => `"${row.join(' ')}"`)
      .join(' ');
  }

  return styles;
}

/**
 * Convert LayoutStyles object to a React inline style object.
 */
export function layoutToInlineStyle(layout: PageLayout): React.CSSProperties {
  const gridStyles = generateGridStyles(layout);
  return {
    display: gridStyles.display,
    gridTemplateColumns: gridStyles.gridTemplateColumns,
    gridTemplateRows: gridStyles.gridTemplateRows,
    gridTemplateAreas: gridStyles.gridTemplateAreas,
    gap: gridStyles.gap,
    width: '100%',
  };
}

/**
 * Generate a CSS class string for responsive layout.
 * Layouts stack to single column on mobile.
 */
export function generateLayoutCSS(layout: PageLayout, className: string): string {
  const gridStyles = generateGridStyles(layout);
  const areasRule = gridStyles.gridTemplateAreas
    ? `grid-template-areas: ${gridStyles.gridTemplateAreas};`
    : '';

  return `
.${className} {
  display: ${gridStyles.display};
  grid-template-columns: ${gridStyles.gridTemplateColumns};
  grid-template-rows: ${gridStyles.gridTemplateRows};
  ${areasRule}
  gap: ${gridStyles.gap};
  width: 100%;
}

@media (max-width: 768px) {
  .${className} {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: none;
  }
}
  `.trim();
}

/**
 * Get a human-readable label for a layout preset.
 */
export function getPresetLabel(preset: LayoutPreset): string {
  const labels: Record<LayoutPreset, string> = {
    'single-column': 'Single Column',
    'two-column': 'Two Columns',
    'three-column': 'Three Columns',
    'sidebar-left': 'Sidebar Left',
    'sidebar-right': 'Sidebar Right',
    'grid-2x2': '2×2 Grid',
    'hero-content': 'Hero + Content',
    'full-width': 'Full Width',
  };
  return labels[preset] || preset;
}

/**
 * Get all available layout presets.
 */
export function getAllPresets(): Array<{ id: LayoutPreset; label: string }> {
  return (Object.keys(LAYOUT_PRESETS) as LayoutPreset[]).map((id) => ({
    id,
    label: getPresetLabel(id),
  }));
}

/**
 * Calculate the number of grid slots available for a given layout.
 */
export function getSlotCount(layout: PageLayout): number {
  if (layout.customGrid) {
    return layout.customGrid.columns * (layout.customGrid.areas?.length || 1);
  }
  const preset = layout.preset || 'single-column';
  switch (preset) {
    case 'single-column':
    case 'full-width':
    case 'hero-content':
      return 1;
    case 'two-column':
    case 'sidebar-left':
    case 'sidebar-right':
      return 2;
    case 'three-column':
      return 3;
    case 'grid-2x2':
      return 4;
    default:
      return 1;
  }
}
