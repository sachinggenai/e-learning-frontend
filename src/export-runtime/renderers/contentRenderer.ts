import { ExportRenderer } from "../contracts/renderer";

export const contentRenderer: ExportRenderer = {
  type: "content-text",
  render: (component, context) => {
    const data = component.data;
    const title = context.sanitizeText(component.title ?? "Untitled");
    const content = context.renderRichText(data.content);

    return [
      '<section class="rt-component rt-content" data-component-type="content-text">',
      `<h2 class="rt-content__title">${title}</h2>`,
      `<div class="rt-content__body">${content}</div>`,
      "</section>",
    ].join("");
  },
};

export const legacyContentRenderer: ExportRenderer = {
  type: "content",
  render: contentRenderer.render,
};
