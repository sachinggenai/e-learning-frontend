import { ExportRenderer } from "../contracts/renderer";

interface TimelineEvent {
  id?: string;
  title?: string;
  body?: string;
  date?: string;
}

export const timelineRenderer: ExportRenderer = {
  type: "timeline",
  render(component, { sanitizeText, renderRichText }) {
    const events: TimelineEvent[] = Array.isArray(component.data?.events)
      ? (component.data.events as TimelineEvent[])
      : [];

    const items = events
      .map((ev, i) => {
        const title = sanitizeText(ev.title ?? `Event ${i + 1}`);
        const body = renderRichText(ev.body ?? "");
        const dateHtml = ev.date
          ? `<time class="rt-timeline__date">${sanitizeText(ev.date)}</time>`
          : "";
        return `<li class="rt-timeline__item">
      ${dateHtml}
      <h3 class="rt-timeline__title">${title}</h3>
      <div class="rt-timeline__body">${body}</div>
    </li>`;
      })
      .join("\n");

    return `<section class="rt-component rt-timeline" data-component-type="timeline">\n<ol class="rt-timeline">\n${items}\n</ol>\n</section>`;
  },
};
