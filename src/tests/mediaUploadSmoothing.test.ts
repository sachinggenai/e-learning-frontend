import { act, fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import MediaUpload from "../components/MediaUpload";

// Helper to extract numeric percentage from text like "45% uploaded"
const extractPercent = (el: HTMLElement | null): number | null => {
  if (!el) return null;
  const m = el.textContent?.match(/(\d+)%/);
  return m ? parseInt(m[1], 10) : null;
};

describe("MediaUpload progress smoothing", () => {
  let originalXMLHttpRequest: any;

  beforeEach(() => {
    originalXMLHttpRequest = (global as any).XMLHttpRequest;
  });

  afterEach(() => {
    (global as any).XMLHttpRequest = originalXMLHttpRequest;
    jest.useRealTimers();
  });

  it("limits large raw progress jump with gradual displayProgress easing to target", async () => {
    jest.useFakeTimers();

    class MockXHR {
      public status = 200;
      public responseText = JSON.stringify({ url: "mock://file" });
      private progressCb: any;
      private loadCb: any;
      upload = {
        addEventListener: (evt: string, cb: any) => {
          if (evt === "progress") this.progressCb = cb;
        },
      };
      addEventListener = (evt: string, cb: any) => {
        if (evt === "load") this.loadCb = cb;
      };
      open() {}
      send() {
        act(() => {
          this.progressCb({ lengthComputable: true, loaded: 90, total: 100 });
        });
        setTimeout(() => {
          this.status = 200;
          act(() => this.loadCb());
        }, 700);
      }
    }
    (global as any).XMLHttpRequest = MockXHR as any;

    const { container, getByText } = render(
      React.createElement(MediaUpload, {}),
    );
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    // Use a small text file (faster, no thumbnail generation) to simplify timing
    const testFile = new File(["hello world"], "test.txt", {
      type: "text/plain",
    });

    act(() => {
      fireEvent.change(fileInput, { target: { files: [testFile] } });
    });

    // Button text may include full phrase e.g. 'Upload 1 Files'; use regex flexible
    const uploadBtn = (await waitFor(
      () => {
        const btns = Array.from(container.querySelectorAll("button"));
        const found = btns.find((b) =>
          /Upload\s+\d+/.test(b.textContent || ""),
        );
        if (!found) throw new Error("not yet");
        return found as HTMLButtonElement;
      },
      { timeout: 1500 },
    )) as HTMLButtonElement;
    act(() => {
      fireEvent.click(uploadBtn);
    });

    let progressLabel = container.querySelector(
      "p.text-xs.text-gray-500.mt-1",
    ) as HTMLElement | null;
    let initialPct = extractPercent(progressLabel);
    expect(initialPct).toBe(0);

    act(() => {
      jest.advanceTimersByTime(110);
    });
    progressLabel = container.querySelector(
      "p.text-xs.text-gray-500.mt-1",
    ) as HTMLElement | null;
    const pctAfter1 = extractPercent(progressLabel)!;
    expect(pctAfter1).toBeGreaterThanOrEqual(1);
    // Should not jump directly to 90 (raw target); smoothing ensures intermediate value
    expect(pctAfter1).toBeLessThan(90);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    const pctAfter6 = extractPercent(
      container.querySelector(
        "p.text-xs.text-gray-500.mt-1",
      ) as HTMLElement | null,
    )!;
    expect(pctAfter6).toBe(90);

    act(() => {
      jest.advanceTimersByTime(400); // exceed total 900ms (100 + 500 + 300) to ensure load handled
    });
    // Progress label removed after success; verify uploaded summary text present
    const heading = container.querySelector("h3") as HTMLElement;
    expect(heading.textContent).toMatch(/1 uploaded/i);
    // No progress label now
    expect(container.querySelector("p.text-xs.text-gray-500.mt-1")).toBeNull();
  });
});
