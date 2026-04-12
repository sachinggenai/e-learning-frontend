import { ExportCoursePayload, ExportPagePayload } from "../contracts/payload";
import { ExportRendererContext } from "../contracts/renderer";
import { renderUnsupportedComponent } from "../renderers/unsupportedRenderer";
import { renderRichText, sanitizeText } from "../utils/html";
import { createDefaultRendererRegistry, RendererRegistry } from "./rendererRegistry";
import { buildThemeVariablesStyle } from "./theme";

export interface ExportRuntime {
  renderPage: (course: ExportCoursePayload, page: ExportPagePayload) => string;
  renderCoursePages: (course: ExportCoursePayload) => string[];
  renderThemeStyle: (course: ExportCoursePayload) => string;
  getSupportedTypes: () => string[];
}

export function createExportRuntime(registry: RendererRegistry = createDefaultRendererRegistry()): ExportRuntime {
  const buildContext = (course: ExportCoursePayload, page: ExportPagePayload): ExportRendererContext => ({
    course,
    page,
    sanitizeText,
    renderRichText,
  });

  const renderPage = (course: ExportCoursePayload, page: ExportPagePayload): string => {
    const context = buildContext(course, page);

    const componentMarkup = page.components
      .slice()
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
      .map((component) => {
        const renderer = registry.get(component.componentType);
        if (!renderer) {
          return renderUnsupportedComponent(component, context);
        }

        return renderer.render(component, context);
      })
      .join("\n");

    return [
      `<article class="rt-page" data-page-id="${sanitizeText(page.pageId)}">`,
      page.title ? `<h1 class="rt-page__title">${sanitizeText(page.title)}</h1>` : "",
      '<div class="rt-page__components">',
      componentMarkup,
      "</div>",
      "</article>",
    ].join("\n");
  };

  const renderCoursePages = (course: ExportCoursePayload): string[] =>
    course.pages
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((page) => renderPage(course, page));

  return {
    renderPage,
    renderCoursePages,
    renderThemeStyle: (course: ExportCoursePayload) => buildThemeVariablesStyle(course.themeTokens),
    getSupportedTypes: () => registry.getRegisteredTypes(),
  };
}
