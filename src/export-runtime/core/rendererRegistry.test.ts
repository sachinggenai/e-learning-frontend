import { createExportRuntime } from "./runtime";
import { ExportCoursePayload } from "../contracts/payload";

describe("export runtime registry", () => {
  it("renders known component types through registered renderers", () => {
    const runtime = createExportRuntime();

    const payload: ExportCoursePayload = {
      courseId: "course-1",
      title: "Registry Test",
      pages: [
        {
          pageId: "page-1",
          order: 0,
          components: [
            {
              componentId: "cmp-1",
              componentType: "tabs",
              pageId: "page-1",
              data: {
                tabs: [{ id: "t1", title: "Tab 1", body: "<p>Tab body</p>" }],
              },
            },
          ],
        },
      ],
    };

    const html = runtime.renderCoursePages(payload)[0];
    expect(html).toContain('data-component-type="tabs"');
    expect(html).toContain("Tab body");
  });

  it("falls back to unsupported markup when renderer is missing", () => {
    const runtime = createExportRuntime();

    const payload: ExportCoursePayload = {
      courseId: "course-2",
      title: "Fallback Test",
      pages: [
        {
          pageId: "page-2",
          order: 0,
          components: [
            {
              componentId: "cmp-2",
              componentType: "mystery-template",
              pageId: "page-2",
              data: {
                text: "Unknown",
              },
            },
          ],
        },
      ],
    };

    const html = runtime.renderCoursePages(payload)[0];
    expect(html).toContain("Unsupported export component type: mystery-template");
  });

  it("renders accordion through registered renderer", () => {
    const runtime = createExportRuntime();

    const payload: ExportCoursePayload = {
      courseId: "course-3",
      title: "Accordion Test",
      pages: [
        {
          pageId: "page-3",
          order: 0,
          components: [
            {
              componentId: "cmp-3",
              componentType: "accordion",
              pageId: "page-3",
              data: {
                panels: [{ id: "p-1", title: "Panel 1", body: "<p>Panel body</p>" }],
              },
            },
          ],
        },
      ],
    };

    const html = runtime.renderCoursePages(payload)[0];
    expect(html).toContain('data-component-type="accordion"');
    expect(html).toContain("Panel 1");
  });
});
