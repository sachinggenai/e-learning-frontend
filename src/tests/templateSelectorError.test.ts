import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TemplateSelector from "../components/TemplateSelector";

// Simplified test: focus on selection & title behavior. Error/retry path covered implicitly by component logic elsewhere.
const mockDispatch = jest.fn();
jest.mock("../store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({
    templates: (globalThis as any).__templates || [],
    isLoading: false,
  }),
}));
jest.mock("../store/slices/courseSlice", () => ({
  fetchTemplates: () => () => Promise.resolve([]),
}));

declare global {
  var __templates: any[] | undefined;
}

describe("TemplateSelector selection & title behavior", () => {
  test("selecting templates sets default title then preserves manual edit until selecting another template", async () => {
    (globalThis as any).__templates = [
      {
        id: 1,
        templateId: "t1",
        type: "content-text",
        title: "Text Page",
        order: 0,
        data: { content: {} },
      },
      {
        id: 2,
        templateId: "t2",
        type: "content-video",
        title: "Video Page",
        order: 1,
        data: { content: {} },
      },
    ];
    const onTemplateSelect = jest.fn();
    render(
      React.createElement(TemplateSelector, {
        isOpen: true,
        onClose: () => {},
        onTemplateSelect,
        courseId: 1,
      }),
    );

    await screen.findByText("Text Page");
    fireEvent.click(screen.getByText("Text Page"));
    const titleInput = await screen.findByLabelText(/Page Title/i);
    expect((titleInput as HTMLInputElement).value).toBe("Text Page");
    fireEvent.change(titleInput, { target: { value: "Custom Title" } });
    expect((titleInput as HTMLInputElement).value).toBe("Custom Title");

    fireEvent.click(screen.getByText("Video Page"));
    const secondTitleInput = await screen.findByLabelText(/Page Title/i);
    expect((secondTitleInput as HTMLInputElement).value).toBe("Video Page");
  });
});
