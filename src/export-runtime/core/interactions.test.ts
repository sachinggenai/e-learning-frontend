import { bindRuntimeInteractions } from "./interactions";
import { createExportRuntime } from "./runtime";
import { ExportCoursePayload } from "../contracts/payload";

describe("export runtime interactions", () => {
  it("activates tab panel on click", () => {
    const runtime = createExportRuntime();
    const payload: ExportCoursePayload = {
      courseId: "course-tabs",
      title: "Tabs Course",
      pages: [
        {
          pageId: "page-tabs",
          order: 0,
          components: [
            {
              componentId: "cmp-tabs",
              componentType: "tabs",
              pageId: "page-tabs",
              data: {
                tabs: [
                  { id: "t1", title: "Tab 1", body: "<p>Body 1</p>" },
                  { id: "t2", title: "Tab 2", body: "<p>Body 2</p>" },
                ],
              },
            },
          ],
        },
      ],
    };

    document.body.innerHTML = runtime.renderCoursePages(payload)[0];
    bindRuntimeInteractions(document);

    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".rt-tabs__button"));
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".rt-tabs__panel"));

    expect(buttons[0].classList.contains("rt-tabs__button--active")).toBe(true);
    expect(panels[1].classList.contains("rt-tabs__panel--active")).toBe(false);

    buttons[1].click();

    expect(buttons[1].classList.contains("rt-tabs__button--active")).toBe(true);
    expect(panels[1].classList.contains("rt-tabs__panel--active")).toBe(true);
  });

  it("toggles accordion panels and closes others in single mode", () => {
    const runtime = createExportRuntime();
    const payload: ExportCoursePayload = {
      courseId: "course-accordion",
      title: "Accordion Course",
      pages: [
        {
          pageId: "page-accordion",
          order: 0,
          components: [
            {
              componentId: "cmp-accordion",
              componentType: "accordion",
              pageId: "page-accordion",
              data: {
                allowMultipleOpen: false,
                panels: [
                  { id: "p1", title: "Panel 1", body: "<p>Body 1</p>" },
                  { id: "p2", title: "Panel 2", body: "<p>Body 2</p>" },
                ],
              },
            },
          ],
        },
      ],
    };

    document.body.innerHTML = runtime.renderCoursePages(payload)[0];
    bindRuntimeInteractions(document);

    const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>(".rt-accordion__trigger"));
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".rt-accordion__panel"));

    expect(panels[0].hasAttribute("hidden")).toBe(true);
    expect(panels[1].hasAttribute("hidden")).toBe(true);

    triggers[0].click();
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(panels[0].hasAttribute("hidden")).toBe(false);

    triggers[1].click();
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(panels[1].hasAttribute("hidden")).toBe(false);
    expect(panels[0].hasAttribute("hidden")).toBe(true);
  });
});
