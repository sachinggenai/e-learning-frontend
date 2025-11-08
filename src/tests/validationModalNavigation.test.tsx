import { fireEvent, render, screen } from "@testing-library/react";
import ValidationErrorModal from "../components/ValidationErrorModal";

const sampleErrors = [
  {
    id: "e1",
    level: "error",
    message: "First error",
    elementType: "Title",
    elementId: "title-1",
  },
  {
    id: "e2",
    level: "error",
    message: "Second error",
    elementType: "Body",
    elementId: "body-1",
  },
  {
    id: "e3",
    level: "warning",
    message: "Warn issue",
    elementType: "Summary",
    elementId: "summary-1",
  },
];

describe("ValidationErrorModal keyboard navigation", () => {
  test("ArrowDown / ArrowUp move focus across navigate buttons and ESC closes", () => {
    const onNavigate = jest.fn();
    const onClose = jest.fn();

    render(
      <ValidationErrorModal
        errors={sampleErrors as any}
        onClose={onClose}
        onNavigateToElement={onNavigate}
      />,
    );

    // Expand all categories so Navigate buttons render
    const expandAllBtn = screen.getByText(/Expand All/i);
    fireEvent.click(expandAllBtn);

    const navigateButtons = () => screen.getAllByText(/Navigate/i);
    const buttons = navigateButtons();
    expect(buttons.length).toBeGreaterThan(1);

    // Focus first navigate button
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[1]);

    fireEvent.keyDown(document, { key: "ArrowDown" });
    // Wrap to third
    expect(document.activeElement).toBe(buttons[2]);

    fireEvent.keyDown(document, { key: "ArrowDown" });
    // Wrap back to first
    expect(document.activeElement).toBe(buttons[0]);

    fireEvent.keyDown(document, { key: "ArrowUp" });
    // Move to last (wrap upward)
    expect(document.activeElement).toBe(buttons[2]);

    // ESC closes
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
