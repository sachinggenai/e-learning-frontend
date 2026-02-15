/**
 * Theme Presets Master Data
 *
 * Pre-built theme configurations matching the Theme interface from types/course.ts.
 * Consumed by ThemeService mock and theme selector UI.
 */

import type {
  Theme,
  ThemeColors,
  ThemeTypography,
  ThemeComponentStyles,
  ResolvedThemeResponse,
} from '../types/course';

// ─── Color Palettes ──────────────────────────────────────────────

const lightColors: ThemeColors = {
  primary: '#2563EB',
  secondary: '#7C3AED',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

const darkColors: ThemeColors = {
  primary: '#60A5FA',
  secondary: '#A78BFA',
  accent: '#FBBF24',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
};

const corporateColors: ThemeColors = {
  primary: '#1E40AF',
  secondary: '#374151',
  accent: '#D97706',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
};

const vibrantColors: ThemeColors = {
  primary: '#EC4899',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  background: '#FFFBEB',
  surface: '#FFF7ED',
  text: '#1C1917',
  textSecondary: '#78716C',
  border: '#FED7AA',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#06B6D4',
};

const minimalColors: ThemeColors = {
  primary: '#171717',
  secondary: '#525252',
  accent: '#A3A3A3',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#171717',
  textSecondary: '#737373',
  border: '#E5E5E5',
  success: '#16A34A',
  warning: '#CA8A04',
  error: '#DC2626',
  info: '#404040',
};

// ─── Shared Typography Presets ───────────────────────────────────

const sansTypography: ThemeTypography = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headingFont: 'Inter, system-ui, -apple-system, sans-serif',
  baseFontSize: 16,
  headingSizes: { h1: 32, h2: 26, h3: 22, h4: 18 },
  lineHeight: 1.6,
  fontWeight: { normal: 400, medium: 500, bold: 700 },
};

const serifTypography: ThemeTypography = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  headingFont: 'Georgia, "Times New Roman", serif',
  baseFontSize: 17,
  headingSizes: { h1: 34, h2: 28, h3: 22, h4: 18 },
  lineHeight: 1.7,
  fontWeight: { normal: 400, medium: 500, bold: 700 },
};

const modernTypography: ThemeTypography = {
  fontFamily: '"DM Sans", sans-serif',
  headingFont: '"DM Sans", sans-serif',
  baseFontSize: 16,
  headingSizes: { h1: 36, h2: 28, h3: 22, h4: 18 },
  lineHeight: 1.5,
  fontWeight: { normal: 400, medium: 500, bold: 600 },
};

const monoTypography: ThemeTypography = {
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  headingFont: 'Inter, system-ui, sans-serif',
  baseFontSize: 15,
  headingSizes: { h1: 30, h2: 24, h3: 20, h4: 17 },
  lineHeight: 1.6,
  fontWeight: { normal: 400, medium: 500, bold: 700 },
};

// ─── Component Styles ────────────────────────────────────────────

const roundedStyles: ThemeComponentStyles = {
  button: { borderRadius: 12, padding: '10px 20px', fontWeight: 600, textTransform: 'none' },
  card: { borderRadius: 12, shadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)', borderWidth: 1, padding: '20px' },
  tabs: { style: 'pill', borderRadius: 8 },
  accordion: { style: 'card', iconPosition: 'right', spacing: 8 },
  input: { borderRadius: 8, borderColor: '#E2E8F0', focusColor: '#2563EB' },
  progressBar: { height: 8, borderRadius: 4 },
};

const sharpStyles: ThemeComponentStyles = {
  button: { borderRadius: 4, padding: '10px 20px', fontWeight: 600, textTransform: 'uppercase' },
  card: { borderRadius: 4, shadow: '0 1px 2px rgba(0,0,0,0.1)', borderWidth: 1, padding: '16px' },
  tabs: { style: 'underline' },
  accordion: { style: 'bordered', iconPosition: 'right', spacing: 4 },
  input: { borderRadius: 4, borderColor: '#D1D5DB', focusColor: '#1E40AF' },
  progressBar: { height: 6, borderRadius: 2 },
};

const pillStyles: ThemeComponentStyles = {
  button: { borderRadius: 9999, padding: '12px 28px', fontWeight: 600, textTransform: 'capitalize' },
  card: { borderRadius: 20, shadow: '0 4px 14px rgba(0,0,0,0.1)', borderWidth: 0, padding: '24px' },
  tabs: { style: 'pill', borderRadius: 9999 },
  accordion: { style: 'minimal', iconPosition: 'left', spacing: 12 },
  input: { borderRadius: 12, borderColor: '#FED7AA', focusColor: '#EC4899' },
  progressBar: { height: 10, borderRadius: 9999 },
};

const flatStyles: ThemeComponentStyles = {
  button: { borderRadius: 0, padding: '10px 24px', fontWeight: 500, textTransform: 'none' },
  card: { borderRadius: 0, shadow: 'none', borderWidth: 1, padding: '24px' },
  tabs: { style: 'boxed' },
  accordion: { style: 'minimal', iconPosition: 'right', spacing: 0 },
  input: { borderRadius: 0, borderColor: '#E5E5E5', focusColor: '#171717' },
  progressBar: { height: 4, borderRadius: 0 },
};

// ─── Theme Presets ───────────────────────────────────────────────

export const THEME_PRESETS: Theme[] = [
  {
    themeId: 'preset-light',
    name: 'Modern Light',
    isPreset: true,
    colors: lightColors,
    typography: sansTypography,
    componentStyles: roundedStyles,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    themeId: 'preset-dark',
    name: 'Dark Mode',
    isPreset: true,
    colors: darkColors,
    typography: sansTypography,
    componentStyles: roundedStyles,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    themeId: 'preset-corporate',
    name: 'Corporate Blue',
    isPreset: true,
    colors: corporateColors,
    typography: serifTypography,
    componentStyles: sharpStyles,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    themeId: 'preset-vibrant',
    name: 'Vibrant & Playful',
    isPreset: true,
    colors: vibrantColors,
    typography: modernTypography,
    componentStyles: pillStyles,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    themeId: 'preset-minimal',
    name: 'Minimal Mono',
    isPreset: true,
    colors: minimalColors,
    typography: monoTypography,
    componentStyles: flatStyles,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// ─── Lookup Helpers ──────────────────────────────────────────────

export function getThemeById(themeId: string): Theme | undefined {
  return THEME_PRESETS.find(t => t.themeId === themeId);
}

/** Simulate resolving the effective theme for a page (cascade: page → course → default) */
export function resolveTheme(
  pageThemeId?: string | null,
  courseThemeId?: string | null,
): ResolvedThemeResponse {
  const effectiveId = pageThemeId ?? courseThemeId ?? 'preset-light';
  const theme = getThemeById(effectiveId) ?? THEME_PRESETS[0];
  return {
    resolved: {
      colors: theme.colors,
      typography: theme.typography,
      componentStyles: theme.componentStyles,
    },
    inheritedFrom: pageThemeId ? 'page' : courseThemeId ? 'course' : 'preset',
    courseThemeId: courseThemeId ?? null,
    courseThemeName: courseThemeId ? (getThemeById(courseThemeId)?.name ?? null) : null,
  };
}
