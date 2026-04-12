import { ExportThemeTokens } from "../contracts/payload";

const TOKEN_TO_CSS_VAR: Array<[keyof ExportThemeTokens, string]> = [
  ["primary", "--theme-primary"],
  ["secondary", "--theme-secondary"],
  ["accent", "--theme-accent"],
  ["background", "--theme-background"],
  ["surface", "--theme-surface"],
  ["text", "--theme-text"],
  ["textSecondary", "--theme-text-secondary"],
  ["border", "--theme-border"],
  ["success", "--theme-success"],
  ["warning", "--theme-warning"],
  ["error", "--theme-error"],
  ["info", "--theme-info"],
  ["fontFamily", "--theme-font-family"],
  ["headingFont", "--theme-heading-font"],
  ["baseFontSize", "--theme-base-font-size"],
];

function sanitizeCssValue(value: string): string {
  return value.replace(/<|>|\{|\}|;/g, "").trim();
}

export function buildThemeVariablesStyle(themeTokens?: ExportThemeTokens): string {
  if (!themeTokens) {
    return "";
  }

  const declarations = TOKEN_TO_CSS_VAR.flatMap(([tokenKey, cssVar]) => {
    const tokenValue = themeTokens[tokenKey];
    if (!tokenValue) {
      return [];
    }

    const safeValue = sanitizeCssValue(tokenValue);
    if (!safeValue) {
      return [];
    }

    return [`${cssVar}: ${safeValue};`];
  });

  if (declarations.length === 0) {
    return "";
  }

  return `<style data-rt-theme=\"true\">:root{${declarations.join("")}}</style>`;
}
