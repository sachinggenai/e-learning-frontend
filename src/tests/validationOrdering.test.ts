import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import ValidationErrorModal from "../components/ValidationErrorModal";

const sampleErrors: any[] = [
  { id: "e2", level: "error", message: "Zeta error", elementType: "Field" },
  { id: "w1", level: "warning", message: "Alpha warn", elementType: "Field" },
  { id: "i1", level: "info", message: "Info msg", elementType: "Meta" },
  { id: "e1", level: "error", message: "Alpha error", elementType: "Field" },
];

// Provide deterministic validation errors ordering by mocking props consumer if necessary
describe("ValidationErrorModal ordering", () => {
  test("errors before warnings before info; alphabetical within severity", async () => {
    render(
      React.createElement(ValidationErrorModal, {
        errors: sampleErrors as any,
        onClose: () => {},
      }),
    );
    // Click Expand All action button to ensure categories expanded
    const expandAllBtn = screen.getByText(/Expand All/i);
    expandAllBtn.click();
    // Wait for error blocks to render
    const blocks: Element[] = await waitFor(() => {
      const els = Array.from(document.querySelectorAll("[data-error-id]"));
      if (els.length === sampleErrors.length) return els;
      throw new Error("not yet");
    });
    const messages = blocks
      .map((block) => {
        const p = block.querySelector("p");
        return p ? p.textContent || "" : "";
      })
      .filter(Boolean);

    const alphaErrorIndex = messages.indexOf("Alpha error");
    const zetaErrorIndex = messages.indexOf("Zeta error");
    const alphaWarnIndex = messages.indexOf("Alpha warn");
    const infoIndex = messages.indexOf("Info msg");

    // Ensure all messages rendered
    expect(alphaErrorIndex).toBeGreaterThanOrEqual(0);
    expect(zetaErrorIndex).toBeGreaterThanOrEqual(0);
    expect(alphaWarnIndex).toBeGreaterThanOrEqual(0);
    expect(infoIndex).toBeGreaterThanOrEqual(0);

    // Alphabetical within errors: Alpha error should come before Zeta error
    expect(alphaErrorIndex).toBeLessThan(zetaErrorIndex);
    // All errors before any warnings
    expect(zetaErrorIndex).toBeLessThan(alphaWarnIndex);
    // Warnings before info
    expect(alphaWarnIndex).toBeLessThan(infoIndex);
  });
});
