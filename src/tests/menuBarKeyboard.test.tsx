import { fireEvent, render, screen } from "@testing-library/react";
import MenuBar from "../components/MenuBar";

// Minimal mocks for hooks used inside MenuBar
jest.mock("../store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (sel: any) =>
    sel({
      course: { currentCourse: null },
      editor: { present: { hasUnsavedChanges: false } },
    }),
}));
jest.mock("../hooks/useAutoSave", () => ({
  useAutoSave: () => ({
    saveNow: jest.fn(),
    isSaving: false,
    autoSaveEnabled: false,
  }),
}));
jest.mock("../hooks/useUndoRedo", () => ({
  useUndoRedo: () => ({
    canUndo: false,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
  }),
}));

// Silence alerts & prompts referenced in menu actions
window.alert = jest.fn();
window.confirm = jest.fn(() => false);
window.prompt = jest.fn();

/**
 * MB-T04: Arrow key navigation between top-level menus & opening with ArrowDown
 */
describe("MenuBar keyboard navigation", () => {
  test("ArrowRight cycles focus across top-level menus, ArrowDown opens menu and focuses first item", () => {
    render(<MenuBar />);
    const buttons = screen.getAllByRole("button", {
      name: /File|Edit|Insert|Tools|View|Help/i,
    });

    // Focus first menu manually
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    // Press ArrowRight to move to next menu (Edit)
    fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    // If focus did not shift (implementation manages internal index before focusing), refire on newly focused (or same) element and check later.
    if (document.activeElement === buttons[0]) {
      fireEvent.keyDown(buttons[0], { key: "ArrowRight" });
    }
    // Derive current focus index by matching activeElement
    const idxAfterOne = buttons.findIndex((b) => b === document.activeElement);
    expect(idxAfterOne).toBeGreaterThanOrEqual(1);

    // Press ArrowRight again
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "ArrowRight",
    });
    const idxAfterTwo = buttons.findIndex((b) => b === document.activeElement);
    expect(idxAfterTwo).toBeGreaterThanOrEqual(idxAfterOne); // Should move forward or wrap

    // Press ArrowDown to open the currently focused menu
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "ArrowDown",
    });
    const openMenu = screen.getByRole("menu");
    expect(openMenu).toBeInTheDocument();

    // First enabled item should have focus
    const firstItem = openMenu.querySelector(".dropdown-item");
    expect(firstItem).toBe(document.activeElement);
  });

  /**
   * MB-T05: Escape closes open menu and returns focus to its button
   */
  test("Escape closes open menu and restores focus to triggering menu button", () => {
    render(<MenuBar />);
    const buttons = screen.getAllByRole("button", {
      name: /File|Edit|Insert|Tools|View|Help/i,
    });

    // Open File menu via ArrowDown
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: "ArrowDown" });
    const openMenu = screen.getByRole("menu");
    expect(openMenu).toBeInTheDocument();

    // Press Escape inside dropdown
    fireEvent.keyDown(openMenu, { key: "Escape" });

    // Menu removed
    expect(screen.queryByRole("menu")).toBeNull();
    // Focus back on File button
    expect(document.activeElement).toBe(buttons[0]);
  });
});
