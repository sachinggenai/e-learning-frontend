/**
 * ThemeContext — Provides resolved theme values via React Context.
 *
 * Implements the two-section theme architecture:
 * Resolution chain: preset → course overrides → page overrides
 * Injects CSS custom properties for all theme tokens.
 *
 * Single Responsibility: Only manages theme state + CSS variable injection.
 * Liskov Substitution: Any ThemeContextValue consumer works regardless of source.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ThemeColors,
  ThemeTypography,
  ThemeComponentStyles,
  ThemeOverrides,
} from "../types/course";
import {
  ThemeContextValue,
  DEFAULT_COLORS,
  DEFAULT_TYPOGRAPHY,
  COLOR_TOKEN_CSS_MAP,
  TYPOGRAPHY_CSS_MAP,
} from "../types/theme";

// ─── Context ─────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

// Optional: use without throwing (for components that may be outside provider)
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

// ─── Theme Resolver ──────────────────────────────────────────────
function mergeColors(
  base: ThemeColors,
  overrides?: Record<string, string>,
): ThemeColors {
  if (!overrides) return base;
  return { ...base, ...overrides } as ThemeColors;
}

function mergeTypography(
  base: ThemeTypography,
  overrides?: Record<string, any>,
): ThemeTypography {
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    headingSizes: { ...base.headingSizes, ...(overrides.headingSizes || {}) },
    fontWeight: { ...base.fontWeight, ...(overrides.fontWeight || {}) },
  };
}

function mergeComponentStyles(
  base?: ThemeComponentStyles,
  overrides?: Record<string, any>,
): ThemeComponentStyles | undefined {
  if (!overrides) return base;
  if (!base) return overrides as ThemeComponentStyles;
  return {
    ...base,
    ...overrides,
    button: { ...base.button, ...(overrides.button || {}) },
    card: { ...base.card, ...(overrides.card || {}) },
    tabs: { ...base.tabs, ...(overrides.tabs || {}) },
    accordion: { ...base.accordion, ...(overrides.accordion || {}) },
    input: { ...base.input, ...(overrides.input || {}) },
    progressBar: { ...base.progressBar, ...(overrides.progressBar || {}) },
  } as ThemeComponentStyles;
}

// ─── CSS Variable Injection ──────────────────────────────────────
function injectCSSVariables(
  container: HTMLElement,
  colors: ThemeColors,
  typography: ThemeTypography,
): void {
  // Color tokens
  Object.entries(COLOR_TOKEN_CSS_MAP).forEach(([key, cssVar]) => {
    const value = colors[key as keyof ThemeColors];
    if (value) container.style.setProperty(cssVar, value);
  });

  // Typography tokens
  container.style.setProperty(
    TYPOGRAPHY_CSS_MAP.fontFamily,
    typography.fontFamily,
  );
  if (typography.headingFont) {
    container.style.setProperty(
      TYPOGRAPHY_CSS_MAP.headingFont,
      typography.headingFont,
    );
  }
  container.style.setProperty(
    TYPOGRAPHY_CSS_MAP.baseFontSize,
    `${typography.baseFontSize}px`,
  );
  container.style.setProperty(
    TYPOGRAPHY_CSS_MAP.lineHeight,
    String(typography.lineHeight),
  );

  // Heading sizes
  container.style.setProperty(
    "--theme-h1-size",
    `${typography.headingSizes.h1}px`,
  );
  container.style.setProperty(
    "--theme-h2-size",
    `${typography.headingSizes.h2}px`,
  );
  container.style.setProperty(
    "--theme-h3-size",
    `${typography.headingSizes.h3}px`,
  );
  container.style.setProperty(
    "--theme-h4-size",
    `${typography.headingSizes.h4}px`,
  );

  // Font weights
  container.style.setProperty(
    "--theme-font-weight-normal",
    String(typography.fontWeight.normal),
  );
  container.style.setProperty(
    "--theme-font-weight-medium",
    String(typography.fontWeight.medium),
  );
  container.style.setProperty(
    "--theme-font-weight-bold",
    String(typography.fontWeight.bold),
  );
}

// ─── Provider Props ──────────────────────────────────────────────
interface ThemeProviderProps {
  children: React.ReactNode;
  courseId?: string;
  /** Pre-loaded course-level overrides */
  courseOverrides?: ThemeOverrides;
  /** Current page ID for page-level overrides */
  currentPageId?: string;
  /** Pre-loaded page-level overrides */
  pageOverrides?: ThemeOverrides;
}

// ─── Provider ────────────────────────────────────────────────────
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  courseOverrides: initialCourseOverrides,
  pageOverrides: initialPageOverrides,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [courseOverrides, setCourseOverrides] = useState<
    ThemeOverrides | undefined
  >(initialCourseOverrides);
  const [pageOverrides, setPageOverrides] = useState<
    ThemeOverrides | undefined
  >(initialPageOverrides);
  const [isLoading] = useState(false);

  // Resolve theme: preset → course → page
  const resolved = useMemo(() => {
    // Step 1: Start with defaults (preset)
    let colors = DEFAULT_COLORS;
    let typography = DEFAULT_TYPOGRAPHY;
    let componentStyles: ThemeComponentStyles | undefined;
    let inheritedFrom: "preset" | "course" | "page" = "preset";

    // Step 2: Apply course overrides
    if (courseOverrides) {
      colors = mergeColors(colors, courseOverrides.colors);
      typography = mergeTypography(typography, courseOverrides.typography);
      componentStyles = mergeComponentStyles(
        componentStyles,
        courseOverrides.componentStyles,
      );
      inheritedFrom = "course";
    }

    // Step 3: Apply page overrides
    if (pageOverrides) {
      colors = mergeColors(colors, pageOverrides.colors);
      typography = mergeTypography(typography, pageOverrides.typography);
      componentStyles = mergeComponentStyles(
        componentStyles,
        pageOverrides.componentStyles,
      );
      inheritedFrom = "page";
    }

    return { colors, typography, componentStyles, inheritedFrom };
  }, [courseOverrides, pageOverrides]);

  // Inject CSS variables whenever theme changes
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      injectCSSVariables(el, resolved.colors, resolved.typography);
    }
  }, [resolved]);

  // Update handlers (will integrate with ThemeService API)
  const updateCourseTheme = useCallback(async (overrides: ThemeOverrides) => {
    setCourseOverrides(overrides);
    // TODO: API call - await themeService.updateCourseTheme(courseId, overrides);
  }, []);

  const updatePageTheme = useCallback(
    async (_pageId: string, overrides: ThemeOverrides) => {
      setPageOverrides(overrides);
      // TODO: API call - await themeService.updatePageTheme(courseId, pageId, overrides);
    },
    [],
  );

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      colors: resolved.colors,
      typography: resolved.typography,
      componentStyles: resolved.componentStyles,
      inheritedFrom: resolved.inheritedFrom,
      isLoading,
      updateCourseTheme,
      updatePageTheme,
    }),
    [resolved, isLoading, updateCourseTheme, updatePageTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div ref={containerRef} className="theme-provider">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
