import { wave1SmokeCourseFixture } from "../fixtures/wave1SmokeCourse.fixture";
import { bindRuntimeInteractions } from "./interactions";
import { buildCourseDocument } from "./documentBuilder";
import { createExportRuntime } from "./runtime";

describe("export runtime smoke", () => {
  it("renders Wave 1 fixture without unsupported components", () => {
    const runtime = createExportRuntime();

    const html = runtime.renderCoursePages(wave1SmokeCourseFixture)[0];
    expect(html).toContain('data-component-type="tabs"');
    expect(html).toContain('data-component-type="accordion"');
    expect(html).toContain('data-component-type="mcq"');
    expect(html).toContain('data-component-type="course-menu"');
    expect(html).toContain('data-component-type="text-with-media"');
    expect(html).not.toContain("Unsupported export component type:");
  });

  it("renders Wave 2 fixture without unsupported components", () => {
    const runtime = createExportRuntime();

    const html = runtime.renderCoursePages(wave1SmokeCourseFixture)[1];
    expect(html).toContain('data-component-type="click-reveal"');
    expect(html).toContain('data-component-type="timeline"');
    expect(html).toContain('data-component-type="multiple-select"');
    expect(html).toContain('data-component-type="true-false"');
    expect(html).toContain('data-component-type="step-by-step"');
    expect(html).toContain('data-component-type="comparison-table"');
    expect(html).toContain('data-component-type="video-slide"');
    expect(html).not.toContain("Unsupported export component type:");
  });

  it("applies theme style variables for runtime shell", () => {
    const runtime = createExportRuntime();
    const view = runtime.renderThemeStyle(wave1SmokeCourseFixture);

    expect(view).toContain("--theme-primary: #155eef");
    expect(view).toContain("data-rt-theme");
  });

  it("binds interactions for Wave 1 fixture components", () => {
    const runtime = createExportRuntime();
    document.body.innerHTML = runtime.renderCoursePages(wave1SmokeCourseFixture)[0];
    bindRuntimeInteractions(document);

    const tabs = document.querySelectorAll(".rt-tabs__button");
    expect(tabs.length).toBeGreaterThan(1);
    (tabs[1] as HTMLButtonElement).click();
    expect(tabs[1].classList.contains("rt-tabs__button--active")).toBe(true);

    const accordionTriggers = document.querySelectorAll(".rt-accordion__trigger");
    expect(accordionTriggers.length).toBeGreaterThan(1);
    (accordionTriggers[0] as HTMLButtonElement).click();

    const firstPanel = document.querySelector(".rt-accordion__panel") as HTMLElement | null;
    expect(firstPanel).not.toBeNull();
    expect(firstPanel?.hasAttribute("hidden")).toBe(false);
  });

  it("binds click-reveal interactions for Wave 2 fixture", () => {
    const runtime = createExportRuntime();
    document.body.innerHTML = runtime.renderCoursePages(wave1SmokeCourseFixture)[1];
    bindRuntimeInteractions(document);

    const triggers = document.querySelectorAll<HTMLButtonElement>(".rt-click-reveal__trigger");
    expect(triggers.length).toBeGreaterThan(0);

    const firstTrigger = triggers[0];
    const panelId = firstTrigger.dataset.rtRevealTarget!;
    const panel = document.getElementById(panelId) as HTMLElement;

    expect(panel.hasAttribute("hidden")).toBe(true);
    firstTrigger.click();
    expect(panel.hasAttribute("hidden")).toBe(false);
    expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("buildCourseDocument returns valid HTML shell with theme and pages", () => {
    const doc = buildCourseDocument(wave1SmokeCourseFixture, {
      inlineCss: "body { margin: 0; }",
    });

    expect(doc).toContain("<!DOCTYPE html>");
    expect(doc).toContain('<html lang="en">');
    expect(doc).toContain("<title>Wave 1 Smoke Course</title>");
    expect(doc).toContain("data-rt-theme");
    expect(doc).toContain("data-rt-base");
    expect(doc).toContain("body { margin: 0; }");
    expect(doc).toContain('id="rt-course-root"');
    // Both pages rendered
    expect(doc).toContain('data-component-type="tabs"');
    expect(doc).toContain('data-component-type="video-slide"');
  });
});
