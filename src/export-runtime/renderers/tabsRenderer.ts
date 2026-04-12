import { ExportRenderer } from "../contracts/renderer";

interface TabData {
  id?: string;
  title?: string;
  body?: string;
}

function isTabData(value: unknown): value is TabData {
  return typeof value === "object" && value !== null;
}

export const tabsRenderer: ExportRenderer = {
  type: "tabs",
  render: (component, context) => {
    const title = context.sanitizeText(component.title ?? "Tabs");
    const rawTabs = Array.isArray(component.data.tabs) ? component.data.tabs : [];
    const tabs = rawTabs.filter(isTabData);

    if (tabs.length === 0) {
      const fallback = context.renderRichText(component.data.content);
      return [
        '<section class="rt-component rt-tabs" data-component-type="tabs">',
        `<h2 class="rt-tabs__title">${title}</h2>`,
        `<div class="rt-tabs__fallback">${fallback}</div>`,
        "</section>",
      ].join("");
    }

    const nav = tabs
      .map((tab, index) => {
        const tabTitle = context.sanitizeText(tab.title ?? `Tab ${index + 1}`);
        const activeClass = index === 0 ? " rt-tabs__button--active" : "";
        return `<button type="button" class="rt-tabs__button${activeClass}" data-rt-tab-index="${index}">${tabTitle}</button>`;
      })
      .join("");

    const panels = tabs
      .map((tab, index) => {
        const activeClass = index === 0 ? " rt-tabs__panel--active" : "";
        const body = context.renderRichText(tab.body);
        return `<div class="rt-tabs__panel${activeClass}" data-rt-tab-panel="${index}">${body}</div>`;
      })
      .join("");

    return [
      '<section class="rt-component rt-tabs" data-component-type="tabs">',
      `<h2 class="rt-tabs__title">${title}</h2>`,
      `<div class="rt-tabs__nav">${nav}</div>`,
      `<div class="rt-tabs__panels">${panels}</div>`,
      "</section>",
    ].join("");
  },
};
