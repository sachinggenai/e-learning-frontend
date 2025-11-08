/**
 * Custom Template Editor Tests
 */

import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

// Mock API service BEFORE importing components that use it
const mockCreateEnhancedTemplate = jest.fn();
const mockUpdateEnhancedTemplate = jest.fn();

jest.mock("../../services/api", () => ({
  apiService: {
    createEnhancedTemplate: (...args: any[]) =>
      mockCreateEnhancedTemplate(...args),
    updateEnhancedTemplate: (...args: any[]) =>
      mockUpdateEnhancedTemplate(...args),
  },
}));

import CustomTemplateEditor from "../CustomTemplateEditor";

const mockStore = configureStore({
  reducer: {
    course: () => ({
      currentCourse: { id: 1, courseId: "test-course" },
    }),
    editor: () => ({
      present: { currentPage: null },
    }),
  },
});

describe("CustomTemplateEditor", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={false} onClose={mockOnClose} />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render when isOpen is true", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );
    expect(screen.getByText("Create Custom Template")).toBeInTheDocument();
  });

  it("should display validation error when template name is missing", async () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const saveButton = screen.getByText("Create Template");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Template name is required")).toBeInTheDocument();
    });
  });

  it("should display validation error when no fields added", async () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const nameInput = screen.getByLabelText(/Template Name/i);
    fireEvent.change(nameInput, { target: { value: "Test Template" } });

    const saveButton = screen.getByText("Create Template");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("At least one field is required")
      ).toBeInTheDocument();
    });
  });

  it("should add a new field when Add Field button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const addFieldButton = screen.getByText("+ Add Field");
    fireEvent.click(addFieldButton);

    expect(screen.getByText("Field 1")).toBeInTheDocument();
  });

  it("should remove a field when remove button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Add a field
    const addFieldButton = screen.getByText("+ Add Field");
    fireEvent.click(addFieldButton);

    expect(screen.getByText("Field 1")).toBeInTheDocument();

    // Remove the field
    const removeButton = screen.getByLabelText("Remove field");
    fireEvent.click(removeButton);

    expect(screen.queryByText("Field 1")).not.toBeInTheDocument();
  });

  it("should call API and close on successful submit", async () => {
    mockCreateEnhancedTemplate.mockResolvedValue({ id: "custom_123" });

    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Fill in template name
    const nameInput = screen.getByLabelText(/Template Name/i);
    fireEvent.change(nameInput, { target: { value: "Test Template" } });

    // Add a field
    const addFieldButton = screen.getByText("+ Add Field");
    fireEvent.click(addFieldButton);

    // Fill in field details
    const fieldNameInput = screen.getByPlaceholderText(
      "e.g., question, answer"
    );
    fireEvent.change(fieldNameInput, { target: { value: "question" } });

    const fieldLabelInput = screen.getByPlaceholderText("e.g., Question Text");
    fireEvent.change(fieldLabelInput, { target: { value: "Question" } });

    // Submit
    const saveButton = screen.getByText("Create Template");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateEnhancedTemplate).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should display error message when API call fails", async () => {
    mockCreateEnhancedTemplate.mockRejectedValue(new Error("API Error"));

    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    // Fill in required fields
    const nameInput = screen.getByLabelText(/Template Name/i);
    fireEvent.change(nameInput, { target: { value: "Test Template" } });

    const addFieldButton = screen.getByText("+ Add Field");
    fireEvent.click(addFieldButton);

    const fieldNameInput = screen.getByPlaceholderText(
      "e.g., question, answer"
    );
    fireEvent.change(fieldNameInput, { target: { value: "question" } });

    const fieldLabelInput = screen.getByPlaceholderText("e.g., Question Text");
    fireEvent.change(fieldLabelInput, { target: { value: "Question" } });

    // Submit
    const saveButton = screen.getByText("Create Template");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to save template/i)).toBeInTheDocument();
    });
  });

  it("should change layout type when layout button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const twoColumnButton = screen.getByText("Two Column");
    fireEvent.click(twoColumnButton);

    expect(twoColumnButton.parentElement).toHaveClass("active");
  });

  it("should close when close button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should close when cancel button is clicked", () => {
    render(
      <Provider store={mockStore}>
        <CustomTemplateEditor isOpen={true} onClose={mockOnClose} />
      </Provider>
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
