import { ExportCoursePayload } from "../contracts/payload";
import { createExportRuntime } from "./runtime";

export interface DocumentBuildOptions {
  /**
   * Inline CSS string to embed in a `<style data-rt-base>` tag.
   * Takes priority over cssHref when both are supplied.
   */
  inlineCss?: string;
  /**
   * Path / URL for an external `<link rel="stylesheet">` tag.
   * Only used when inlineCss is not provided.
   */
  cssHref?: string;
  /** HTML lang attribute value (default: "en") */
  lang?: string;
}

/**
 * Assembles a self-contained HTML document string for a course.
 *
 * Usage:
 *   const html = buildCourseDocument(coursePayload, { inlineCss: baseCssString });
 */
export function buildCourseDocument(
  course: ExportCoursePayload,
  options: DocumentBuildOptions = {}
): string {
  const runtime = createExportRuntime();
  const themeStyle = runtime.renderThemeStyle(course);
  const pages = runtime.renderCoursePages(course);
  const lang = escapeAttr(options.lang ?? "en");

  let cssBlock = "";
  if (options.inlineCss) {
    cssBlock = `<style data-rt-base="true">\n${options.inlineCss}\n</style>`;
  } else if (options.cssHref) {
    const safeSrc = sanitizeCssHref(options.cssHref);
    cssBlock = safeSrc ? `<link rel="stylesheet" href="${safeSrc}">` : "";
  }

  const courseTitle = escapeHtml(course.title ?? "Course");
  const pagesHtml = pages.join("\n");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${courseTitle}</title>
  ${cssBlock}
  ${themeStyle}
</head>
<body>
  <main id="rt-course-root">
${pagesHtml}
  </main>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Allow only relative CSS paths or http/https URLs to prevent JS injection. */
function sanitizeCssHref(href: string): string {
  if (/^(https?:\/\/|[a-zA-Z0-9_./-]*\.css)/.test(href)) {
    return href.replace(/"/g, "");
  }
  return "";
}
