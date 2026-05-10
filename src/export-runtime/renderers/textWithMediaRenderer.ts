import { ExportRenderer } from "../contracts/renderer";

export const textWithMediaRenderer: ExportRenderer = {
  type: "text-with-media",
  render: (component, context) => {
    const title = context.sanitizeText(component.title ?? "Text with Media");
    const mediaUrl = context.sanitizeText(component.data.mediaUrl ?? "");
    const mediaType = context.sanitizeText(component.data.mediaType ?? "none");
    const body = context.renderRichText(component.data.body ?? component.data.content);

    let mediaElement = "";
    if (mediaUrl.length > 0) {
      if (mediaType === "video") {
        mediaElement = `<video class="rt-text-media__video" src="${mediaUrl}" controls></video>`;
      } else {
        mediaElement = `<img class="rt-text-media__image" src="${mediaUrl}" alt="${title}" />`;
      }
    }
    const mediaBlock =
      mediaElement.length > 0
        ? `<div class="rt-text-media__media" data-media-type="${mediaType}">${mediaElement}</div>`
        : "";

    return [
      '<section class="rt-component rt-text-media" data-component-type="text-with-media">',
      `<h2 class="rt-text-media__title">${title}</h2>`,
      '<div class="rt-text-media__layout">',
      `<div class="rt-text-media__body">${body}</div>`,
      mediaBlock,
      "</div>",
      "</section>",
    ].join("");
  },
};
