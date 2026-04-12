import { ExportRenderer } from "../contracts/renderer";

function renderList(items: unknown, sanitizeText: (value: unknown) => string): string {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  const rows = items
    .map((item) => {
      if (typeof item === "string") {
        return `<li>${sanitizeText(item)}</li>`;
      }
      if (typeof item === "object" && item !== null) {
        const maybeTitle = (item as Record<string, unknown>).title ?? (item as Record<string, unknown>).label;
        return `<li>${sanitizeText(maybeTitle ?? "Item")}</li>`;
      }
      return "";
    })
    .join("");

  if (!rows) {
    return "";
  }

  return `<ul class=\"rt-navigation__list\">${rows}</ul>`;
}

function createSimpleNavigationRenderer(type: string, fallbackTitle: string): ExportRenderer {
  return {
    type,
    render: (component, context) => {
      const title = context.sanitizeText(component.title ?? fallbackTitle);
      const description = context.renderRichText(component.data.description ?? component.data.content);
      const listMarkup = renderList(component.data.items ?? component.data.modules ?? component.data.resources, context.sanitizeText);

      return [
        `<section class=\"rt-component rt-navigation rt-navigation--${type}\" data-component-type=\"${type}\">`,
        `<h2 class=\"rt-navigation__title\">${title}</h2>`,
        description ? `<div class=\"rt-navigation__description\">${description}</div>` : "",
        listMarkup,
        "</section>",
      ].join("");
    },
  };
}

export const courseMenuRenderer = createSimpleNavigationRenderer("course-menu", "Course Menu");
export const resourcesDownloadsRenderer = createSimpleNavigationRenderer("resources-downloads", "Resources & Downloads");
export const moduleOverviewRenderer = createSimpleNavigationRenderer("module-overview", "Module Overview");
export const learningRoadmapRenderer = createSimpleNavigationRenderer("learning-roadmap", "Learning Roadmap");
export const summaryTakeawaysRenderer = createSimpleNavigationRenderer("summary-takeaways", "Summary & Takeaways");
