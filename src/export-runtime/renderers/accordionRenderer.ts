import { ExportRenderer } from "../contracts/renderer";
import { toDomIdSegment } from "../utils/html";

interface AccordionPanel {
  id?: string;
  title?: string;
  body?: string;
}

function isAccordionPanel(value: unknown): value is AccordionPanel {
  return typeof value === "object" && value !== null;
}

export const accordionRenderer: ExportRenderer = {
  type: "accordion",
  render: (component, context) => {
    const title = context.sanitizeText(component.title ?? "Accordion");
    const rawPanels = Array.isArray(component.data.panels) ? component.data.panels : [];
    const panels = rawPanels.filter(isAccordionPanel);
    const allowMultipleOpen = component.data.allowMultipleOpen === true;

    if (panels.length === 0) {
      const fallback = context.renderRichText(component.data.content);
      return [
        '<section class="rt-component rt-accordion" data-component-type="accordion">',
        `<h2 class="rt-accordion__title">${title}</h2>`,
        `<div class="rt-accordion__fallback">${fallback}</div>`,
        "</section>",
      ].join("");
    }

    const componentId = toDomIdSegment(component.componentId);
    const panelsHtml = panels
      .map((panel, index) => {
        const panelId = toDomIdSegment(panel.id ?? `panel-${index + 1}`);
        const domId = `rt-acc-${componentId}-${panelId}-${index}`;
        const panelTitle = context.sanitizeText(panel.title ?? `Panel ${index + 1}`);
        const panelBody = context.renderRichText(panel.body);

        return [
          '<div class="rt-accordion__item">',
          `<button type="button" class="rt-accordion__trigger" data-rt-accordion-target="${domId}" aria-expanded="false">${panelTitle}</button>`,
          `<div id="${domId}" class="rt-accordion__panel" hidden>${panelBody}</div>`,
          "</div>",
        ].join("");
      })
      .join("");

    return [
      `<section class="rt-component rt-accordion" data-component-type="accordion" data-rt-accordion-multi="${allowMultipleOpen}">`,
      `<h2 class="rt-accordion__title">${title}</h2>`,
      `<div class="rt-accordion__items">${panelsHtml}</div>`,
      "</section>",
    ].join("");
  },
};
