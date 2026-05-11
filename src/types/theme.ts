/**
 * Theme Type Definitions
 *
 * Covers the two-section theming architecture:
 * 1. Layout System — page structure (grid presets, custom grids)
 * 2. Color System — visual styling (colors, typography, component styles)
 *
 * Re-exports core theme types from course.ts and adds UI-specific ones.
 */

export type {
  ThemeColors,
  ThemeTypography,
  ThemeComponentStyles,
  ThemeOverrides,
  HeadingSizes,
  FontWeights,
  ButtonStyle,
  CardStyle,
  TabsStyle,
  AccordionStyle,
  InputStyle,
  ProgressBarStyle,
  Theme,
  ResolvedThemeResponse,
  PageThemeConfig,
} from "./course";

// ─── CSS Variable Contract ───────────────────────────────────────
/**
 * Maps ThemeColors tokens → CSS custom property names.
 * Used by ThemeProvider to inject variables onto :root or a scoped container.
 */
export const COLOR_TOKEN_CSS_MAP: Record<string, string> = {
  primary: "--theme-primary",
  secondary: "--theme-secondary",
  background: "--theme-background",
  surface: "--theme-surface",
  text: "--theme-text",
  textSecondary: "--theme-text-secondary",
  accent: "--theme-accent",
  error: "--theme-error",
  success: "--theme-success",
  warning: "--theme-warning",
  info: "--theme-info",
  border: "--theme-border",
};

export const TYPOGRAPHY_CSS_MAP: Record<string, string> = {
  fontFamily: "--theme-font-family",
  headingFont: "--theme-heading-font",
  baseFontSize: "--theme-base-font-size",
  lineHeight: "--theme-line-height",
};

// ─── Theme Context Shape ─────────────────────────────────────────
export interface ThemeContextValue {
  /** Fully resolved theme (preset → course → page) */
  colors: import("./course").ThemeColors;
  typography: import("./course").ThemeTypography;
  componentStyles?: import("./course").ThemeComponentStyles;
  /** Source of inheritance */
  inheritedFrom: "preset" | "course" | "page";
  /** Whether the theme is loading from API */
  isLoading: boolean;
  /** Update the course-level theme override */
  updateCourseTheme: (
    overrides: import("./course").ThemeOverrides,
  ) => Promise<void>;
  /** Update the page-level theme override */
  updatePageTheme: (
    pageId: string,
    overrides: import("./course").ThemeOverrides,
  ) => Promise<void>;
}

// ─── Default Theme Values ────────────────────────────────────────
export const DEFAULT_COLORS: import("./course").ThemeColors = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#1E293B",
  textSecondary: "#64748B",
  accent: "#F59E0B",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  info: "#3B82F6",
  border: "#E2E8F0",
};

export const DEFAULT_TYPOGRAPHY: import("./course").ThemeTypography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  baseFontSize: 16,
  headingSizes: { h1: 32, h2: 24, h3: 20, h4: 16 },
  lineHeight: 1.6,
  fontWeight: { normal: 400, medium: 500, bold: 700 },
};
