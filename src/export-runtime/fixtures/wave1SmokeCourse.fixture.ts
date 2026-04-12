import { ExportCoursePayload } from "../contracts/payload";

export const wave1SmokeCourseFixture: ExportCoursePayload = {
  courseId: "course-wave1",
  title: "Wave 1 Smoke Course",
  themeTokens: {
    primary: "#155eef",
    background: "#ffffff",
    text: "#101828",
    border: "#d0d5dd",
  },
  pages: [
    {
      pageId: "page-wave1",
      title: "Wave 1 Components",
      order: 0,
      components: [
        {
          componentId: "cmp-tabs",
          componentType: "tabs",
          pageId: "page-wave1",
          order: 0,
          data: {
            tabs: [
              { id: "tab-1", title: "Tab 1", body: "<p>Tab body 1</p>" },
              { id: "tab-2", title: "Tab 2", body: "<p>Tab body 2</p>" },
            ],
          },
        },
        {
          componentId: "cmp-accordion",
          componentType: "accordion",
          pageId: "page-wave1",
          order: 1,
          data: {
            allowMultipleOpen: false,
            panels: [
              { id: "panel-1", title: "Panel 1", body: "<p>Accordion panel 1</p>" },
              { id: "panel-2", title: "Panel 2", body: "<p>Accordion panel 2</p>" },
            ],
          },
        },
        {
          componentId: "cmp-mcq",
          componentType: "mcq",
          pageId: "page-wave1",
          order: 2,
          data: {
            questions: [
              {
                id: "q-1",
                question: "Select one option",
                options: [
                  { id: "o-1", text: "Option A" },
                  { id: "o-2", text: "Option B" },
                ],
              },
            ],
          },
        },
        {
          componentId: "cmp-navigation",
          componentType: "course-menu",
          pageId: "page-wave1",
          order: 3,
          data: {
            description: "<p>Course modules</p>",
            modules: [{ title: "Intro" }, { title: "Safety" }],
          },
        },
        {
          componentId: "cmp-text-media",
          componentType: "text-with-media",
          pageId: "page-wave1",
          order: 4,
          data: {
            body: "<p>Body with media</p>",
            mediaUrl: "https://example.com/video.mp4",
            mediaType: "video",
          },
        },
      ],
    },
    {
      pageId: "page-wave2",
      title: "Wave 2 Components",
      order: 1,
      components: [
        {
          componentId: "cmp-click-reveal",
          componentType: "click-reveal",
          pageId: "page-wave2",
          order: 0,
          data: {
            items: [
              { id: "cr-1", title: "Reveal A", body: "<p>Hidden body A</p>" },
              { id: "cr-2", title: "Reveal B", body: "<p>Hidden body B</p>" },
            ],
          },
        },
        {
          componentId: "cmp-timeline",
          componentType: "timeline",
          pageId: "page-wave2",
          order: 1,
          data: {
            events: [
              { id: "ev-1", title: "Phase 1", date: "Jan 2025", body: "<p>Kickoff</p>" },
              { id: "ev-2", title: "Phase 2", date: "Mar 2025", body: "<p>Execution</p>" },
            ],
          },
        },
        {
          componentId: "cmp-multiple-select",
          componentType: "multiple-select",
          pageId: "page-wave2",
          order: 2,
          data: {
            questions: [
              {
                id: "msq-1",
                question: "Select all that apply",
                options: [
                  { id: "ms-1", text: "Alpha" },
                  { id: "ms-2", text: "Beta" },
                  { id: "ms-3", text: "Gamma" },
                ],
              },
            ],
          },
        },
        {
          componentId: "cmp-true-false",
          componentType: "true-false",
          pageId: "page-wave2",
          order: 3,
          data: {
            questions: [
              { id: "tf-1", question: "The sky is blue." },
              { id: "tf-2", question: "Water is dry." },
            ],
          },
        },
        {
          componentId: "cmp-step-by-step",
          componentType: "step-by-step",
          pageId: "page-wave2",
          order: 4,
          data: {
            steps: [
              { title: "Open the app", body: "<p>Launch the application.</p>" },
              { title: "Log in", body: "<p>Enter your credentials.</p>" },
              { title: "Begin", body: "<p>Click Start.</p>" },
            ],
          },
        },
        {
          componentId: "cmp-comparison",
          componentType: "comparison-table",
          pageId: "page-wave2",
          order: 5,
          data: {
            columns: [{ header: "Feature" }, { header: "Plan A" }, { header: "Plan B" }],
            rows: [
              { cells: ["Storage", "10 GB", "100 GB"] },
              { cells: ["Users", "5", "Unlimited"] },
            ],
          },
        },
        {
          componentId: "cmp-video",
          componentType: "video-slide",
          pageId: "page-wave2",
          order: 6,
          data: {
            title: "Introduction Video",
            videoUrl: "https://example.com/intro.mp4",
            caption: "Watch the intro",
          },
        },
      ],
    },
  ],
};
