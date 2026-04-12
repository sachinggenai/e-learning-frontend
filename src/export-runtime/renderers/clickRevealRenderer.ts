import { ExportRenderer } from "../contracts/renderer";

interface ClickRevealItem {
  id?: string;
  title?: string;
  body?: string;
}

export const clickRevealRenderer: ExportRenderer = {
  type: "click-reveal",
  render(component, { sanitizeText, renderRichText }) {
    const items: ClickRevealItem[] = Array.isArray(component.data?.items)
      ? (component.data.items as ClickRevealItem[])
      : [];

    const cards = items
      .map((item, i) => {
        const panelId = `${component.componentId}-reveal-${i}`;
        const title = sanitizeText(item.title ?? "Item");
        const body = renderRichText(item.body ?? "");
        return `<div class="rt-click-reveal__card">
      <button
        class="rt-click-reveal__trigger"
        aria-expanded="false"
        aria-controls="${panelId}"
        data-rt-reveal-target="${panelId}"
      >${title}</button>
      <div id="${panelId}" class="rt-click-reveal__panel" hidden>
        ${body}
      </div>
    </div>`;
      })
      .join("\n");

    return `<section class="rt-component rt-click-reveal" data-component-type="click-reveal">\n${cards}\n</section>`;
  },
};
